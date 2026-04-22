export enum CameraBody {
  SMARTPHONE = 'Smartphone (Source)',
  PENTAX_K1 = 'Pentax K-1 (Full Frame)',
  LEICA_M11 = 'Leica M11',
  FUJIFILM_GFX100 = 'Fujifilm GFX 100S (Medium Format)',
  SONY_A7RV = 'Sony A7R V'
}

export enum LensModel {
  FA_77 = 'smc PENTAX-FA 77mm F1.8 Limited',
  NOCTILUX_50 = 'Leica Noctilux-M 50mm f/0.95 ASPH',
  GF_110 = 'Fujinon GF 110mm f/2 R LM WR',
  GM_85 = 'Sony FE 85mm f/1.4 GM II'
}

export enum Aperture {
  F0_95 = 'f/0.95',
  F1_4 = 'f/1.4',
  F1_8 = 'f/1.8',
  F2_0 = 'f/2.0',
  F2_8 = 'f/2.8',
  F4_0 = 'f/4.0',
  F8_0 = 'f/8.0'
}

export enum ExposureCompensation {
  NEG_1_0 = '-1.0 EV',
  NEG_0_5 = '-0.5 EV',
  ZERO = '±0 EV',
  POS_0_5 = '+0.5 EV',
  POS_1_0 = '+1.0 EV'
}

export enum LightingCondition {
  NATURAL_SOFT = 'Natural Soft Light (Window)',
  GOLDEN_HOUR_BACKLIGHT = 'Autumn 3PM (Backlit/Komorebi)',
  STUDIO_REMBRANDT = 'Studio Rembrandt (Dramatic)',
  CITY_NIGHT_BOKEH = 'City Night (Neon/Street)',
  CINEMATIC_TEAL_ORANGE = 'Cinematic (Teal & Orange)',
  FASHION_FLASH_HARD = '90s Editorial (Direct Flash)',
  MOODY_OVERCAST = 'Moody Overcast (Blue Hour)',
  PRISM_FLARE = 'Artistic Prism & Light Leaks'
}

export enum SceneContext {
  NAGANO_OMACHI = 'Nagano Omachi (Nature/Alps)',
  URBAN_STREET = 'Urban Street (Tokyo/Shibuya)',
  MINIMAL_STUDIO = 'Minimal Studio (Cyclorama)',
  VINTAGE_CAFE = 'Vintage Cafe (Brooklyn Style)',
  LUXURY_HOTEL_BAR = 'Luxury Hotel Bar (Dim)',
  ROOFTOP_DUSK = 'City Rooftop (Dusk)',
  OLD_LIBRARY = 'Old Library (Dark Academia)',
  TROPICAL_BEACH = 'Tropical Beach (High Key)',
  RAINY_WINDOW = 'Rainy Window (Glass Texture)'
}

export enum ClothingOption {
  ORIGINAL = 'Keep Original Clothing',
  OUTDOOR_SHELL_TEAL = 'Outdoor Shell (Teal/Gore-tex)',
  FORMAL_SHIRT = 'White Linen Shirt (Relaxed)',
  TURTLENECK_WOOL = 'Black Turtleneck (Cashmere)',
  LEATHER_JACKET = 'Biker Leather Jacket (Vintage)',
  EVENING_GOWN_SILK = 'Evening Silk Dress/Suit (Formal)',
  CYBERPUNK_TECHWEAR = 'Techwear (Matte Black/Straps)',
  VINTAGE_DENIM = '90s Washed Denim Jacket'
}

export enum PoseOption {
  ORIGINAL = 'Keep Original Pose',
  FRONTAL_HEADSHOT = 'Frontal Headshot',
  THREE_QUARTER = '3/4 Classic Portrait',
  PROFILE = 'Side Profile',
  LOOKING_OFF_CAMERA = 'Looking Off-Camera (Candid)',
  HAND_ON_CHIN = 'Hand on Chin (Pensive)'
}

export enum OutputProfile {
  LOG_FLAT = 'Log/Flat (Low Contrast/For Grading)',
  STANDARD_FILM = 'Standard Film Simulation',
  HIGH_CONTRAST = 'High Contrast B&W'
}

export interface SimulationParams {
  camera: CameraBody;
  lens: LensModel;
  aperture: Aperture;
  exposure: ExposureCompensation;
  lighting: LightingCondition;
  scene: SceneContext;
  clothing: ClothingOption;
  pose: PoseOption;
  outputProfile: OutputProfile;
  fidelity: number; // 0-100
}

export interface ProcessingStep {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'complete';
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  imageUrl: string; // Base64
  params: SimulationParams;
  provider?: 'gemini' | 'openai';
  model?: string;
  latencyMs?: number;
  debugPrompt?: string;
}
