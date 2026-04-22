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

export const CAMERA_BODY_LABELS: Record<CameraBody, string> = {
  [CameraBody.SMARTPHONE]: 'スマートフォン（入力画像）',
  [CameraBody.PENTAX_K1]: 'Pentax K-1（フルサイズ）',
  [CameraBody.LEICA_M11]: 'Leica M11',
  [CameraBody.FUJIFILM_GFX100]: 'Fujifilm GFX 100S（中判）',
  [CameraBody.SONY_A7RV]: 'Sony A7R V'
};

export const LENS_MODEL_LABELS: Record<LensModel, string> = {
  [LensModel.FA_77]: 'PENTAX FA 77mm F1.8 Limited（柔らかい描写）',
  [LensModel.NOCTILUX_50]: 'Leica Noctilux-M 50mm f/0.95（夢幻的）',
  [LensModel.GF_110]: 'Fujinon GF 110mm f/2（中判ポートレート）',
  [LensModel.GM_85]: 'Sony FE 85mm f/1.4 GM II（高解像）'
};

export const APERTURE_LABELS: Record<Aperture, string> = {
  [Aperture.F0_95]: 'f/0.95',
  [Aperture.F1_4]: 'f/1.4',
  [Aperture.F1_8]: 'f/1.8',
  [Aperture.F2_0]: 'f/2.0',
  [Aperture.F2_8]: 'f/2.8',
  [Aperture.F4_0]: 'f/4.0',
  [Aperture.F8_0]: 'f/8.0'
};

export const EXPOSURE_COMPENSATION_LABELS: Record<ExposureCompensation, string> = {
  [ExposureCompensation.NEG_1_0]: '-1.0 EV（暗め）',
  [ExposureCompensation.NEG_0_5]: '-0.5 EV（やや暗め）',
  [ExposureCompensation.ZERO]: '±0 EV（標準）',
  [ExposureCompensation.POS_0_5]: '+0.5 EV（やや明るめ）',
  [ExposureCompensation.POS_1_0]: '+1.0 EV（明るめ）'
};

export const LIGHTING_CONDITION_LABELS: Record<LightingCondition, string> = {
  [LightingCondition.NATURAL_SOFT]: '自然光・柔らかい窓光',
  [LightingCondition.GOLDEN_HOUR_BACKLIGHT]: '秋の15時・逆光と木漏れ日',
  [LightingCondition.STUDIO_REMBRANDT]: 'スタジオ・レンブラント光',
  [LightingCondition.CITY_NIGHT_BOKEH]: '夜の街・ネオンと玉ボケ',
  [LightingCondition.CINEMATIC_TEAL_ORANGE]: 'シネマ調・ティール&オレンジ',
  [LightingCondition.FASHION_FLASH_HARD]: '90年代エディトリアル・直射フラッシュ',
  [LightingCondition.MOODY_OVERCAST]: '曇天・ブルーアワー',
  [LightingCondition.PRISM_FLARE]: 'プリズム・光漏れ'
};

export const SCENE_CONTEXT_LABELS: Record<SceneContext, string> = {
  [SceneContext.NAGANO_OMACHI]: '長野・大町（自然 / 北アルプス）',
  [SceneContext.URBAN_STREET]: '都市の路地（東京 / 渋谷）',
  [SceneContext.MINIMAL_STUDIO]: 'ミニマルスタジオ',
  [SceneContext.VINTAGE_CAFE]: 'ヴィンテージカフェ',
  [SceneContext.LUXURY_HOTEL_BAR]: '高級ホテルバー',
  [SceneContext.ROOFTOP_DUSK]: '夕暮れのルーフトップ',
  [SceneContext.OLD_LIBRARY]: '古い図書館',
  [SceneContext.TROPICAL_BEACH]: 'トロピカルビーチ',
  [SceneContext.RAINY_WINDOW]: '雨の日の窓辺'
};

export const CLOTHING_OPTION_LABELS: Record<ClothingOption, string> = {
  [ClothingOption.ORIGINAL]: '元の服装を維持',
  [ClothingOption.OUTDOOR_SHELL_TEAL]: 'アウトドアシェル（ティール）',
  [ClothingOption.FORMAL_SHIRT]: '白いリネンシャツ',
  [ClothingOption.TURTLENECK_WOOL]: '黒のカシミヤタートルネック',
  [ClothingOption.LEATHER_JACKET]: 'ヴィンテージレザージャケット',
  [ClothingOption.EVENING_GOWN_SILK]: 'フォーマルなイブニングウェア',
  [ClothingOption.CYBERPUNK_TECHWEAR]: 'マットブラックのテックウェア',
  [ClothingOption.VINTAGE_DENIM]: '90年代ウォッシュデニム'
};

export const POSE_OPTION_LABELS: Record<PoseOption, string> = {
  [PoseOption.ORIGINAL]: '元のポーズを維持',
  [PoseOption.FRONTAL_HEADSHOT]: '正面ヘッドショット',
  [PoseOption.THREE_QUARTER]: '3/4クラシックポートレート',
  [PoseOption.PROFILE]: '横顔プロフィール',
  [PoseOption.LOOKING_OFF_CAMERA]: 'カメラ外を見る自然な表情',
  [PoseOption.HAND_ON_CHIN]: '顎に手を添える'
};

export const OUTPUT_PROFILE_LABELS: Record<OutputProfile, string> = {
  [OutputProfile.LOG_FLAT]: 'Log / Flat（グレーディング向け）',
  [OutputProfile.STANDARD_FILM]: '標準フィルムシミュレーション',
  [OutputProfile.HIGH_CONTRAST]: '高コントラスト白黒'
};

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
