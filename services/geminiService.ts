import { GoogleGenAI } from "@google/genai";
import { CameraBody, LensModel, Aperture, ExposureCompensation, LightingCondition, SceneContext, ClothingOption, PoseOption, OutputProfile, SimulationParams } from "../types";

const processEnvApiKey = process.env.API_KEY;

/**
 * Converts a File object to a Base64 string suitable for Gemini API.
 */
const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve({
        inlineData: {
          data: base64String,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Returns detailed optical characteristics for specific lenses.
 */
const getLensCharacteristics = (lens: LensModel): string => {
  switch (lens) {
    case LensModel.FA_77:
      return `
        - OPTICAL CHARACTER: "The Fairy Lens". High contrast but delicate rendering.
        - BOKEH: Creamy, smooth transitions. Not clinically sharp, retains a "classic" rendering feel.
        - COLOR: Slightly warm, rich tonal gradation typical of SMC Pentax coating.
        - ABERRATION: Slight spherical aberration at wide apertures creating a gentle glow.
      `;
    case LensModel.NOCTILUX_50:
      return `
        - OPTICAL CHARACTER: "The Dreamy Look". Extremely shallow depth of field.
        - BOKEH: Swirly bokeh towards the edges (optical vignetting/cat-eye effect). Center is sharp, edges dissolve rapidly.
        - VIGNETTING: Heavy vignetting at wide apertures adding to the mood.
        - GLOW: Leica glow (Mandler glow) on highlights.
      `;
    case LensModel.GF_110:
      return `
        - OPTICAL CHARACTER: "Medium Format Perfection". Incredible separation between subject and background due to sensor size.
        - RESOLUTION: Clinically sharp, resolving every eyelash.
        - BOKEH: Extremely smooth, compression effect of a medium telephoto on a large sensor. "3D Pop" is very strong.
        - FALLOFF: Very gradual focus falloff.
      `;
    case LensModel.GM_85:
      return `
        - OPTICAL CHARACTER: "Modern Masterpiece". High contrast, high resolution from corner to corner.
        - BOKEH: Clean, circular bokeh balls with no onion rings (XA element simulation). Neutral and faithful.
        - CLARITY: Hyper-realistic, almost surgical sharpness but pleasing for portraits.
      `;
    default:
      return "- OPTICAL CHARACTER: Standard professional prime lens rendering.";
  }
};

/**
 * Returns detailed lighting instructions.
 */
const getLightingDescription = (lighting: LightingCondition): string => {
  switch (lighting) {
    case LightingCondition.GOLDEN_HOUR_BACKLIGHT:
      return `
        - TYPE: Autumn 3PM Backlight / Komorebi.
        - DIRECTION: 45-degree rear.
        - QUALITY: Warm, golden, flared. Sunlight filtering through leaves creating dappled light in background.
        - SHADOWS: Lifted with a reflector, soft but retaining shape.
        - HIGHLIGHTS: Rim light on hair and shoulders (haloing effect).
      `;
    case LightingCondition.NATURAL_SOFT:
      return `
        - TYPE: Soft Window Light / Overcast Day.
        - DIRECTION: Side lighting (90 degrees) or large diffuse source.
        - QUALITY: Wrapping light, very soft shadow transitions. Low contrast scene.
        - SHADOWS: Open and soft. No harsh lines.
        - MOOD: Calm, intimate, airy.
      `;
    case LightingCondition.STUDIO_REMBRANDT:
      return `
        - TYPE: Classic Studio Lighting.
        - SETUP: Key light 45 degrees high and side. Fill light ratio 1:4.
        - QUALITY: Controlled, dramatic.
        - SHADOWS: Characteristic triangle of light on the shadowed cheek. Deep shadows but with detail.
        - BACKGROUND: Darker, falling off to black or dark grey.
      `;
    case LightingCondition.CITY_NIGHT_BOKEH:
      return `
        - TYPE: Available Light / Neon / Street.
        - COLORS: Mixed lighting (Blues, Teals, Oranges from street signs).
        - BOKEH: Background needs to be a sea of colorful bokeh balls (specular highlights).
        - SKIN TONES: Illuminated by shop windows or street lamps, slightly cool or mixed wb.
      `;
    case LightingCondition.CINEMATIC_TEAL_ORANGE:
      return `
        - TYPE: Hollywood Blockbuster Color Grade.
        - COLOR PALETTE: Complementary Colors. Shadows pushed towards Teal/Cyan. Skin tones and highlights pushed towards Orange/Amber.
        - CONTRAST: High but retained dynamic range.
        - MOOD: Cinematic, intense, narrative-driven.
      `;
    case LightingCondition.FASHION_FLASH_HARD:
      return `
        - TYPE: 90s Editorial / Paparazzi Style.
        - SOURCE: Direct, hard on-camera flash.
        - SHADOWS: Sharp, hard drop shadows directly behind the subject.
        - FALLOFF: Rapid light falloff to the background (vignetting).
        - SKIN: High specularity, glossy look.
      `;
    case LightingCondition.MOODY_OVERCAST:
      return `
        - TYPE: Blue Hour / Stormy Day.
        - COLOR TEMP: Cool (6500K-7500K).
        - QUALITY: Extremely diffuse, flat, shadowless light.
        - MOOD: Melancholic, serious, deep.
      `;
    case LightingCondition.PRISM_FLARE:
      return `
        - TYPE: Artistic / Experimental.
        - ARTIFACTS: Introduce rainbow light leaks or prism refractions in the corners or foreground.
        - QUALITY: Ethereal, dreamy, slightly soft focus.
        - FEEL: Music video or indie film aesthetic.
      `;
    default:
      return "- TYPE: Standard professional lighting.";
  }
};

/**
 * Returns exposure instructions
 */
const getExposureInstruction = (exposure: ExposureCompensation): string => {
  switch (exposure) {
    case ExposureCompensation.POS_0_5:
    case ExposureCompensation.POS_1_0:
      return `
        - EXPOSURE: ${exposure} (High Key). 
        - LOOK: Bright, airy, shadows lifted significantly. Highlights may slightly bloom (glow) but not clip unpleasantly.
        - SKIN: Luminous and pale.
      `;
    case ExposureCompensation.NEG_0_5:
    case ExposureCompensation.NEG_1_0:
      return `
        - EXPOSURE: ${exposure} (Low Key).
        - LOOK: Moody, dense colors, rich shadows.
        - HIGHLIGHTS: Perfectly preserved, no clipping.
        - SKIN: Deep tones, dramatic falloff.
      `;
    case ExposureCompensation.ZERO:
    default:
      return `
        - EXPOSURE: Correct (0 EV). Balanced histogram.
      `;
  }
};

/**
 * Returns pose instructions
 */
const getPoseInstruction = (pose: PoseOption): string => {
  switch (pose) {
    case PoseOption.FRONTAL_HEADSHOT:
      return `
        - POSE CHANGE: RECONSTRUCT subject in a Frontal Headshot.
        - ANGLE: Camera at eye level. Shoulders square or slightly angled.
        - HEAD: Facing straight forward.
        - EYES: Direct eye contact with the lens.
      `;
    case PoseOption.THREE_QUARTER:
      return `
        - POSE CHANGE: RECONSTRUCT subject in a 3/4 Portrait Angle.
        - BODY: Turned 45 degrees away from camera.
        - HEAD: Turned back towards camera.
        - EYES: Direct eye contact.
      `;
    case PoseOption.PROFILE:
      return `
        - POSE CHANGE: RECONSTRUCT subject in a Side Profile.
        - ANGLE: 90 degrees to camera.
        - LOOK: Dramatic, highlighting the jawline and nose silhouette.
      `;
    case PoseOption.LOOKING_OFF_CAMERA:
      return `
        - POSE CHANGE: Candid / Looking Away.
        - HEAD: Slightly turned away from lens.
        - EYES: Looking at a distant point, not at the camera.
        - MOOD: Pensive, natural.
      `;
    case PoseOption.HAND_ON_CHIN:
      return `
        - POSE CHANGE: Hand on Chin.
        - ACTION: Subject is resting chin on hand/fingers.
        - MOOD: Thinking, intellectual, focused.
      `;
    case PoseOption.ORIGINAL:
    default:
      return `
        - POSE: KEEP EXACT SOURCE POSE. Do not rotate head or body.
        - ANGLE: Maintain source camera angle.
      `;
  }
};

export const generateSimulation = async (
  imageFile: File,
  params: SimulationParams
): Promise<string> => {
  if (!processEnvApiKey) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey: processEnvApiKey });
  const model = 'gemini-2.5-flash-image'; 
  const imagePart = await fileToGenerativePart(imageFile);

  // Define location details
  let locationPrompt = "";
  switch (params.scene) {
    case SceneContext.NAGANO_OMACHI:
      locationPrompt = `
        - LOCATION: Nagano Prefecture, Omachi City.
        - FOREGROUND: Wildflowers blurred in the bottom-left (bokeh), slightly backlit, bright and soft highlights.
        - MIDGROUND: Autumn trees with muted tones.
        - BACKGROUND: Northern Alps mountains, visible but very soft bokeh, blending into the atmosphere.
        - COMPOSITION: Knee-shot, subject slightly to the right. Face near the golden ratio intersection.
      `;
      break;
    case SceneContext.URBAN_STREET:
      locationPrompt = `
        - LOCATION: Busy Tokyo Street (Shibuya/Shinjuku back alley).
        - BACKGROUND: Concrete textures, metal railings, blurred passersby, depth created by city lights and signs.
        - ATMOSPHERE: Modern, slightly gritty but polished.
      `;
      break;
    case SceneContext.MINIMAL_STUDIO:
      locationPrompt = `
        - LOCATION: Infinite Cyclorama Studio.
        - BACKGROUND: Solid color (Soft Grey or White), smooth gradient. No distractions.
        - FOCUS: Purely on the subject's form and expression.
      `;
      break;
    case SceneContext.VINTAGE_CAFE:
      locationPrompt = `
        - LOCATION: Independent Coffee Roaster (Brooklyn Style).
        - INTERIOR: Brick walls, warm wood textures, espresso machine in background.
        - LIGHTING: Practical tungsten lamps creating warm bokeh balls. Natural window light mix.
        - ATMOSPHERE: Cozy, aromatic, intellectual.
      `;
      break;
    case SceneContext.LUXURY_HOTEL_BAR:
      locationPrompt = `
        - LOCATION: High-end Hotel Bar (Night).
        - BACKGROUND: Shelves of amber liquor bottles (bokeh), brass fixtures, velvet curtains.
        - LIGHTING: Low-key, moody, rim lighting from bar lights.
        - COLOR: Deep golds, blacks, and mahogany.
      `;
      break;
    case SceneContext.ROOFTOP_DUSK:
      locationPrompt = `
        - LOCATION: City Rooftop at Dusk.
        - BACKGROUND: City skyline silhouette against a twilight blue/purple sky.
        - DETAILS: Concrete parapet, distant city lights beginning to twinkle (bokeh).
        - WIND: Subtle wind effect on hair.
      `;
      break;
    case SceneContext.OLD_LIBRARY:
      locationPrompt = `
        - LOCATION: Historic University Library.
        - BACKGROUND: Rows of old books, dark wood ladders, dust motes dancing in shafts of light.
        - ATMOSPHERE: Quiet, academic, "Dark Academia" aesthetic.
        - COLOR: Rich browns, greens, and gold.
      `;
      break;
    case SceneContext.TROPICAL_BEACH:
      locationPrompt = `
        - LOCATION: Secluded Tropical Beach (High Noon).
        - BACKGROUND: White sand (high key), turquoise water gradient, clear blue sky.
        - LIGHTING: Bright, harsh sun softened slightly by humidity.
        - FEEL: Vacation, airy, fresh.
      `;
      break;
    case SceneContext.RAINY_WINDOW:
      locationPrompt = `
        - LOCATION: Inside looking out a window on a rainy day.
        - FOREGROUND: Glass pane with raindrops in focus (or slightly out depending on aperture).
        - BACKGROUND: Blurry city lights or garden through the rain.
        - MOOD: Melancholic, reflective, cozy.
      `;
      break;
  }

  // Define clothing details
  let clothingPrompt = "";
  switch (params.clothing) {
    case ClothingOption.OUTDOOR_SHELL_TEAL:
      clothingPrompt = `
        - CLOTHING CHANGE: Replace outfit with an Outdoor Shell Jacket.
        - COLOR: Muted Teal / Spruce Green.
        - MATERIAL: High-quality matte technical fabric (Gore-tex style).
        - BRANDING: Subtle, premium outdoor brand aesthetic (like "Mocchalera").
      `;
      break;
    case ClothingOption.FORMAL_SHIRT:
      clothingPrompt = `
        - CLOTHING CHANGE: White Linen Shirt.
        - FIT: Relaxed but tailored.
        - TEXTURE: Visible linen weave texture.
        - STYLE: Clean, organic, timeless. Top button unbuttoned.
      `;
      break;
    case ClothingOption.TURTLENECK_WOOL:
      clothingPrompt = `
        - CLOTHING CHANGE: Black Turtleneck Sweater.
        - MATERIAL: High-quality Cashmere or Merino Wool. Visible soft fuzz texture.
        - STYLE: Steve Jobs / Architect aesthetic. Sophisticated and minimal.
        - FIT: Form-fitting but comfortable.
      `;
      break;
    case ClothingOption.LEATHER_JACKET:
      clothingPrompt = `
        - CLOTHING CHANGE: Black Leather Biker Jacket.
        - MATERIAL: Genuine leather with grain texture. Specular highlights on the leather folds.
        - DETAILS: Silver zippers, snap buttons. Worn-in vintage look.
        - STYLE: Edgy, cool, rebellious.
      `;
      break;
    case ClothingOption.EVENING_GOWN_SILK:
      clothingPrompt = `
        - CLOTHING CHANGE: Elegant Evening Attire.
        - IF FEMALE: Silk slip dress or velvet gown. Dark jewel tones (Emerald or Ruby).
        - IF MALE: Velvet tuxedo jacket or high-end suit.
        - TEXTURE: Shimmering silk or light-absorbing velvet.
        - STYLE: Red carpet, gala, luxury.
      `;
      break;
    case ClothingOption.CYBERPUNK_TECHWEAR:
      clothingPrompt = `
        - CLOTHING CHANGE: Futuristic Techwear.
        - COLOR: Matte Black with neon accents.
        - DETAILS: Straps, buckles, utility pockets, synthetic fabrics.
        - STYLE: Cyberpunk, urban ninja, functional fashion.
      `;
      break;
    case ClothingOption.VINTAGE_DENIM:
      clothingPrompt = `
        - CLOTHING CHANGE: Vintage 90s Denim Jacket.
        - WASH: Light blue acid wash or stone wash.
        - UNDERLAYER: Basic white cotton t-shirt.
        - STYLE: Retro, casual, grunge aesthetic.
      `;
      break;
    case ClothingOption.ORIGINAL:
      clothingPrompt = `
        - CLOTHING: KEEP EXACT ORIGINAL CLOTHING. Do not change color or texture.
      `;
      break;
  }

  // Define Output Profile
  let outputStylePrompt = "";
  if (params.outputProfile === OutputProfile.LOG_FLAT) {
    outputStylePrompt = `
      - OUTPUT STYLE: DIGITAL NEGATIVE (Log/Flat Profile).
      - DYNAMIC RANGE: Maximum. Do not crush blacks. Do not clip highlights.
      - CONTRAST: Low linear contrast.
      - SATURATION: Desaturated (-20%).
      - COLOR SCIENCE: Neutral, accurate to the camera sensor (${params.camera}).
      - INTENT: Provide an image ready for professional color grading.
    `;
  } else if (params.outputProfile === OutputProfile.HIGH_CONTRAST) {
    outputStylePrompt = `
      - OUTPUT STYLE: High Contrast Black & White (Acros / Tri-X style).
      - TONALITY: Deep blacks, silvery whites.
      - GRAIN: Pronounced, organic film grain.
      - MOOD: Gritty, impactful, fine art.
    `;
  } else {
    outputStylePrompt = `
      - OUTPUT STYLE: Standard Film Simulation (Portra 400 / Astia).
      - CONTRAST: Medium-High.
      - SKIN TONES: Flattering, slightly warm.
      - LOOK: Finished, polished professional photograph.
    `;
  }

  // Get rich descriptions
  const lensDetails = getLensCharacteristics(params.lens);
  const lightingDetails = getLightingDescription(params.lighting);
  const exposureDetails = getExposureInstruction(params.exposure);
  const poseDetails = getPoseInstruction(params.pose);

  const prompt = `
    Act as a high-end Optical Simulation Engine.
    
    TASK: Transform the input image into a specific photograph defined by the optical formula below.

    --- OPTICAL FORMULA ---
    
    1. GEAR & PHYSICS (The most important part):
       - CAMERA BODY: ${params.camera} (Simulate sensor size and color science).
       - LENS MODEL: ${params.lens}.
       ${lensDetails}
       - APERTURE: ${params.aperture}.
       - DEPTH OF FIELD: Calculate the exact depth of field for a ${params.camera} sensor at ${params.aperture}. 
         * If f/0.95 or f/1.4: Eyes are sharp, ears may start to blur. Background is obliterated.
         * If f/8.0: Deep depth of field, background is recognizable.

    2. EXPOSURE & LIGHTING:
       ${exposureDetails}
       ${lightingDetails}
       ${locationPrompt}

    3. SUBJECT & FIDELITY (Strict Constraints):
       - IDENTITY: The face MUST remain exactly the same person. Bone structure, nose, lips, eyes must match the source image.
       - POSE: Follow the instruction below.
       ${poseDetails}
       - EXPRESSION: Keep source expression but relax it slightly for a natural look.
       ${clothingPrompt}

    4. OUTPUT RENDERING:
       ${outputStylePrompt}
       - NOISE/GRAIN: Add realistic sensor noise appropriate for ISO 400.
       - ARTIFACTS: Avoid AI plastic skin. Skin must have texture (pores).

    Generate the image with these exact specifications.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [imagePart, { text: prompt }],
      },
    });

    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
        const parts = candidates[0].content.parts;
        for (const part of parts) {
            if (part.inlineData) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
    }
    
    throw new Error("No image generated by the simulation engine.");

  } catch (error) {
    console.error("Simulation failed:", error);
    throw error;
  }
};