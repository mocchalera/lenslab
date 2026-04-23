export enum CameraBody {
  SMARTPHONE = 'Smartphone (Source)',
  PENTAX_K1 = 'Pentax K-1 (Full Frame)',
  LEICA_M11 = 'Leica M11',
  LEICA_Q3 = 'Leica Q3',
  HASSELBLAD_X2D = 'Hasselblad X2D 100C',
  PHASE_ONE_IQ4 = 'Phase One IQ4 150MP',
  FUJIFILM_GFX100 = 'Fujifilm GFX 100S (Medium Format)',
  FUJIFILM_GFX100_II = 'Fujifilm GFX100 II',
  SONY_A7RV = 'Sony A7R V',
  NIKON_Z8 = 'Nikon Z8',
  CANON_R5_II = 'Canon EOS R5 Mark II',
  PENTAX_K1_II = 'Pentax K-1 Mark II'
}

export enum LensModel {
  FA_77 = 'smc PENTAX-FA 77mm F1.8 Limited',
  NOCTILUX_50 = 'Leica Noctilux-M 50mm f/0.95 ASPH',
  GF_110 = 'Fujinon GF 110mm f/2 R LM WR',
  GM_85 = 'Sony FE 85mm f/1.4 GM II',
  LEICA_SUMMILUX_35_1_4 = 'Leica Summilux-M 35mm f/1.4 ASPH',
  LEICA_SUMMICRON_50_2 = 'Leica Summicron-M 50mm f/2',
  LEICA_APO_SUMMICRON_50_2 = 'Leica APO-Summicron-M 50mm f/2 ASPH',
  ZEISS_OTUS_55_1_4 = 'Zeiss Otus 55mm f/1.4',
  ZEISS_PLANAR_50_1_4 = 'Zeiss Planar 50mm f/1.4',
  VOIGTLANDER_NOKTON_50_1 = 'Voigtlander Nokton 50mm f/1',
  CANON_50_1_2L = 'Canon RF 50mm f/1.2L USM',
  CANON_85_1_2L = 'Canon RF 85mm f/1.2L USM',
  NIKKOR_Z_58_0_95_NOCT = 'Nikon NIKKOR Z 58mm f/0.95 S Noct',
  NIKKOR_Z_50_1_2S = 'Nikon NIKKOR Z 50mm f/1.2 S',
  NIKKOR_105_1_4E = 'Nikon AF-S NIKKOR 105mm f/1.4E ED',
  SONY_FE_50_1_2_GM = 'Sony FE 50mm f/1.2 GM',
  SIGMA_35_1_2_ART = 'Sigma 35mm f/1.2 DG DN Art',
  PENTAX_FA_31_LIMITED = 'smc PENTAX-FA 31mm F1.8 Limited',
  PENTAX_FA_43_LIMITED = 'smc PENTAX-FA 43mm F1.9 Limited',
  PENTAX_DFA_50_1_4_STAR = 'HD PENTAX-D FA* 50mm F1.4 SDM AW',
  MINOLTA_ROKKOR_58_1_2 = 'Minolta MC Rokkor-PG 58mm f/1.2',
  HELIOS_44_2 = 'Helios 44-2 58mm f/2',
  FUJIFILM_GF_80_1_7 = 'Fujinon GF 80mm f/1.7 R WR',
  HASSELBLAD_XCD_90V_2_5 = 'Hasselblad XCD 90mm f/2.5 V',
  PHASE_ONE_BLUE_RING_80_2_8 = 'Phase One Blue Ring 80mm f/2.8'
}

export enum LensMount {
  LEICA_M = 'LEICA_M',
  SONY_E = 'SONY_E',
  NIKON_Z = 'NIKON_Z',
  CANON_RF = 'CANON_RF',
  PENTAX_K = 'PENTAX_K',
  FUJI_G = 'FUJI_G',
  HASSELBLAD_X = 'HASSELBLAD_X',
  PHASE_ONE = 'PHASE_ONE'
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
  GOLDEN_HOUR_SEMI_BACKLIGHT = 'Golden Hour Semi-Backlight',
  HIGH_NOON_SUMMER_SUN = 'High Noon Summer Sun',
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
  RAINY_WINDOW = 'Rainy Window (Glass Texture)',
  CUSTOM_MAP_LOCATION = 'Custom Map Location'
}

export enum ClothingOption {
  ORIGINAL = 'Keep Original Clothing',
  OUTDOOR_SHELL_TEAL = 'Outdoor Shell (Teal/Gore-tex)',
  FORMAL_SHIRT = 'White Linen Shirt (Relaxed)',
  TURTLENECK_WOOL = 'Black Turtleneck (Cashmere)',
  LEATHER_JACKET = 'Biker Leather Jacket (Vintage)',
  EVENING_GOWN_SILK = 'Evening Silk Dress/Suit (Formal)',
  CYBERPUNK_TECHWEAR = 'Techwear (Matte Black/Straps)',
  VINTAGE_DENIM = '90s Washed Denim Jacket',
  T_SHIRT_WHITE = 'White T-Shirt',
  OVERSIZED_HOODIE = 'Oversized Hoodie',
  DENIM_ON_DENIM = 'Denim on Denim',
  OXFORD_SHIRT = 'Oxford Shirt',
  SWEATSHIRT_VINTAGE = 'Vintage Sweatshirt',
  CARGO_PANTS_STYLE = 'Cargo Pants Full Style',
  BLACK_SUIT_THREE_PIECE = 'Black Three-Piece Suit',
  NAVY_SUIT_TAILORED = 'Navy Tailored Suit',
  CHANEL_TWEED = 'Chanel-Style Tweed Jacket',
  PEARL_NECKLACE_DRESS = 'Pearl Necklace and Dress',
  TUXEDO_BLACK_TIE = 'Black Tie Tuxedo',
  MOUNTAIN_PARKA_GORE = 'Gore-Tex Mountain Parka',
  FLEECE_PATAGONIA = 'Patagonia-Style Fleece',
  DOWN_JACKET_PUFFY = 'Puffy Down Jacket',
  HIKING_GEAR_FULL = 'Full Hiking Gear',
  FISHERMAN_SWEATER = 'Fisherman Sweater',
  YOHJI_BLACK_AVANT = 'Yohji Yamamoto-Style All Black',
  COMME_DES_GARCONS_DECONSTRUCTED = 'Comme des Garcons-Style Deconstructed',
  MONOCHROME_MINIMAL = 'Monochrome Minimal',
  ASYMMETRIC_ARCHITECTURAL = 'Asymmetric Architectural Design',
  STREETWEAR_SUPREME_STYLE = 'Supreme-Style Streetwear',
  OVERSIZED_GRAPHIC_TEE = 'Oversized Graphic Tee',
  SNEAKER_CULTURE_FULL = 'Full Sneaker Culture Fit',
  BOMBER_JACKET_90S = '90s Bomber Jacket',
  KIMONO_CASUAL = 'Casual Kimono',
  KIMONO_FORMAL = 'Formal Kimono',
  JINBEI_SUMMER = 'Summer Jinbei',
  YUKATA_FESTIVAL = 'Festival Yukata',
  TRENCH_COAT_BURBERRY = 'Burberry-Style Trench Coat',
  CASHMERE_COAT_CAMEL = 'Camel Cashmere Coat',
  SUMMER_LINEN_WHITE = 'White Summer Linen Set',
  KNITWEAR_OVERSIZED_CREAM = 'Oversized Cream Knitwear',
  DETECTIVE_NOIR = 'Noir Detective Outfit',
  ROCKSTAR_LEATHER_FULL = 'Full Rockstar Leather',
  VICTORIAN_GOTHIC = 'Victorian Gothic',
  SPACE_AGE_FUTURISTIC = 'Space Age Futuristic'
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

export enum ImageAspect {
  AUTO = 'auto',
  SQUARE = '1024x1024',
  LANDSCAPE = '1536x1024',
  PORTRAIT = '1024x1536'
}

export enum ImageQuality {
  AUTO = 'auto',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export const CAMERA_BODY_LABELS_JA: Record<CameraBody, string> = {
  [CameraBody.SMARTPHONE]: 'スマートフォン（入力画像）',
  [CameraBody.PENTAX_K1]: 'Pentax K-1（フルサイズ）',
  [CameraBody.LEICA_M11]: 'ライカ M11（60MP / ライカ色）',
  [CameraBody.LEICA_Q3]: 'ライカ Q3（自然で深いシャドウ）',
  [CameraBody.HASSELBLAD_X2D]: 'ハッセルブラッド X2D 100C（HNCS）',
  [CameraBody.PHASE_ONE_IQ4]: 'フェーズワン IQ4 150MP（商業広告）',
  [CameraBody.FUJIFILM_GFX100]: 'Fujifilm GFX 100S（中判）',
  [CameraBody.FUJIFILM_GFX100_II]: '富士フイルム GFX100 II（フィルム色）',
  [CameraBody.SONY_A7RV]: 'ソニー α7R V（精細 / ニュートラル）',
  [CameraBody.NIKON_Z8]: 'ニコン Z8（自然忠実）',
  [CameraBody.CANON_R5_II]: 'キヤノン R5 II（ピクチャースタイル）',
  [CameraBody.PENTAX_K1_II]: 'ペンタックス K-1 Mark II（自然忠実）'
};

export const LENS_MODEL_LABELS_JA: Record<LensModel, string> = {
  [LensModel.FA_77]: 'PENTAX FA 77mm F1.8 Limited（柔らかい描写）',
  [LensModel.NOCTILUX_50]: 'Leica Noctilux-M 50mm f/0.95（夢幻的）',
  [LensModel.GF_110]: 'Fujinon GF 110mm f/2（中判ポートレート）',
  [LensModel.GM_85]: 'Sony FE 85mm f/1.4 GM II（高解像）',
  [LensModel.LEICA_SUMMILUX_35_1_4]: 'ライカ ズミルックス M 35mm f/1.4 ASPH',
  [LensModel.LEICA_SUMMICRON_50_2]: 'ライカ ズミクロン M 50mm f/2',
  [LensModel.LEICA_APO_SUMMICRON_50_2]: 'ライカ アポ・ズミクロン M 50mm f/2 ASPH',
  [LensModel.ZEISS_OTUS_55_1_4]: 'ツァイス Otus 55mm f/1.4',
  [LensModel.ZEISS_PLANAR_50_1_4]: 'ツァイス Planar 50mm f/1.4',
  [LensModel.VOIGTLANDER_NOKTON_50_1]: 'フォクトレンダー Nokton 50mm f/1',
  [LensModel.CANON_50_1_2L]: 'キヤノン RF 50mm f/1.2L USM',
  [LensModel.CANON_85_1_2L]: 'キヤノン RF 85mm f/1.2L USM',
  [LensModel.NIKKOR_Z_58_0_95_NOCT]: 'ニコン NIKKOR Z 58mm f/0.95 S Noct',
  [LensModel.NIKKOR_Z_50_1_2S]: 'ニコン NIKKOR Z 50mm f/1.2 S',
  [LensModel.NIKKOR_105_1_4E]: 'ニコン AF-S 105mm f/1.4E ED',
  [LensModel.SONY_FE_50_1_2_GM]: 'ソニー FE 50mm f/1.2 GM',
  [LensModel.SIGMA_35_1_2_ART]: 'シグマ 35mm f/1.2 DG DN Art',
  [LensModel.PENTAX_FA_31_LIMITED]: 'ペンタックス FA 31mm f/1.8 Limited（ピュアリミテッド）',
  [LensModel.PENTAX_FA_43_LIMITED]: 'ペンタックス FA 43mm f/1.9 Limited（標準の名玉）',
  [LensModel.PENTAX_DFA_50_1_4_STAR]: 'ペンタックス DFA★ 50mm f/1.4',
  [LensModel.MINOLTA_ROKKOR_58_1_2]: 'ミノルタ MC Rokkor-PG 58mm f/1.2',
  [LensModel.HELIOS_44_2]: 'Helios 44-2 58mm f/2',
  [LensModel.FUJIFILM_GF_80_1_7]: '富士 GF 80mm f/1.7 R WR',
  [LensModel.HASSELBLAD_XCD_90V_2_5]: 'ハッセルブラッド XCD 90mm f/2.5 V',
  [LensModel.PHASE_ONE_BLUE_RING_80_2_8]: 'フェーズワン ブルーリング 80mm f/2.8'
};

export const LENS_MOUNT_LABELS_JA: Record<LensMount, string> = {
  [LensMount.LEICA_M]: 'ライカ M',
  [LensMount.SONY_E]: 'ソニー E',
  [LensMount.NIKON_Z]: 'ニコン Z',
  [LensMount.CANON_RF]: 'キヤノン RF',
  [LensMount.PENTAX_K]: 'ペンタックス K',
  [LensMount.FUJI_G]: '富士フイルム G',
  [LensMount.HASSELBLAD_X]: 'ハッセルブラッド X',
  [LensMount.PHASE_ONE]: 'フェーズワン'
};

export const CAMERA_MOUNT_MAP: Record<CameraBody, LensMount> = {
  [CameraBody.SMARTPHONE]: LensMount.SONY_E,
  [CameraBody.PENTAX_K1]: LensMount.PENTAX_K,
  [CameraBody.LEICA_M11]: LensMount.LEICA_M,
  [CameraBody.LEICA_Q3]: LensMount.LEICA_M,
  [CameraBody.HASSELBLAD_X2D]: LensMount.HASSELBLAD_X,
  [CameraBody.PHASE_ONE_IQ4]: LensMount.PHASE_ONE,
  [CameraBody.FUJIFILM_GFX100]: LensMount.FUJI_G,
  [CameraBody.FUJIFILM_GFX100_II]: LensMount.FUJI_G,
  [CameraBody.SONY_A7RV]: LensMount.SONY_E,
  [CameraBody.NIKON_Z8]: LensMount.NIKON_Z,
  [CameraBody.CANON_R5_II]: LensMount.CANON_RF,
  [CameraBody.PENTAX_K1_II]: LensMount.PENTAX_K
};

export const LENS_MOUNT_MAP: Record<LensModel, LensMount[]> = {
  [LensModel.FA_77]: [LensMount.PENTAX_K],
  [LensModel.NOCTILUX_50]: [LensMount.LEICA_M],
  [LensModel.GF_110]: [LensMount.FUJI_G],
  [LensModel.GM_85]: [LensMount.SONY_E],
  [LensModel.LEICA_SUMMILUX_35_1_4]: [LensMount.LEICA_M],
  [LensModel.LEICA_SUMMICRON_50_2]: [LensMount.LEICA_M],
  [LensModel.LEICA_APO_SUMMICRON_50_2]: [LensMount.LEICA_M],
  [LensModel.ZEISS_OTUS_55_1_4]: [LensMount.CANON_RF, LensMount.NIKON_Z],
  [LensModel.ZEISS_PLANAR_50_1_4]: [LensMount.LEICA_M, LensMount.SONY_E, LensMount.NIKON_Z, LensMount.CANON_RF],
  [LensModel.VOIGTLANDER_NOKTON_50_1]: [LensMount.LEICA_M, LensMount.SONY_E, LensMount.NIKON_Z],
  [LensModel.CANON_50_1_2L]: [LensMount.CANON_RF],
  [LensModel.CANON_85_1_2L]: [LensMount.CANON_RF],
  [LensModel.NIKKOR_Z_58_0_95_NOCT]: [LensMount.NIKON_Z],
  [LensModel.NIKKOR_Z_50_1_2S]: [LensMount.NIKON_Z],
  [LensModel.NIKKOR_105_1_4E]: [LensMount.NIKON_Z],
  [LensModel.SONY_FE_50_1_2_GM]: [LensMount.SONY_E],
  [LensModel.SIGMA_35_1_2_ART]: [LensMount.SONY_E],
  [LensModel.PENTAX_FA_31_LIMITED]: [LensMount.PENTAX_K],
  [LensModel.PENTAX_FA_43_LIMITED]: [LensMount.PENTAX_K],
  [LensModel.PENTAX_DFA_50_1_4_STAR]: [LensMount.PENTAX_K],
  [LensModel.MINOLTA_ROKKOR_58_1_2]: [LensMount.SONY_E, LensMount.NIKON_Z, LensMount.CANON_RF],
  [LensModel.HELIOS_44_2]: [
    LensMount.LEICA_M,
    LensMount.SONY_E,
    LensMount.NIKON_Z,
    LensMount.CANON_RF,
    LensMount.PENTAX_K,
    LensMount.FUJI_G
  ],
  [LensModel.FUJIFILM_GF_80_1_7]: [LensMount.FUJI_G],
  [LensModel.HASSELBLAD_XCD_90V_2_5]: [LensMount.HASSELBLAD_X],
  [LensModel.PHASE_ONE_BLUE_RING_80_2_8]: [LensMount.PHASE_ONE]
};

export const APERTURE_LABELS_JA: Record<Aperture, string> = {
  [Aperture.F0_95]: 'f/0.95',
  [Aperture.F1_4]: 'f/1.4',
  [Aperture.F1_8]: 'f/1.8',
  [Aperture.F2_0]: 'f/2.0',
  [Aperture.F2_8]: 'f/2.8',
  [Aperture.F4_0]: 'f/4.0',
  [Aperture.F8_0]: 'f/8.0'
};

export const EXPOSURE_COMPENSATION_LABELS_JA: Record<ExposureCompensation, string> = {
  [ExposureCompensation.NEG_1_0]: '-1.0 EV（暗め）',
  [ExposureCompensation.NEG_0_5]: '-0.5 EV（やや暗め）',
  [ExposureCompensation.ZERO]: '±0 EV（標準）',
  [ExposureCompensation.POS_0_5]: '+0.5 EV（やや明るめ）',
  [ExposureCompensation.POS_1_0]: '+1.0 EV（明るめ）'
};

export const LIGHTING_CONDITION_LABELS_JA: Record<LightingCondition, string> = {
  [LightingCondition.NATURAL_SOFT]: '自然光・柔らかい窓光',
  [LightingCondition.GOLDEN_HOUR_BACKLIGHT]: '秋の15時・逆光と木漏れ日',
  [LightingCondition.GOLDEN_HOUR_SEMI_BACKLIGHT]: 'ゴールデンアワー（半逆光）',
  [LightingCondition.HIGH_NOON_SUMMER_SUN]: '真夏の太陽',
  [LightingCondition.STUDIO_REMBRANDT]: 'スタジオ・レンブラント光',
  [LightingCondition.CITY_NIGHT_BOKEH]: '夜の街・ネオンと玉ボケ',
  [LightingCondition.CINEMATIC_TEAL_ORANGE]: 'シネマ調・ティール&オレンジ',
  [LightingCondition.FASHION_FLASH_HARD]: '90年代エディトリアル・直射フラッシュ',
  [LightingCondition.MOODY_OVERCAST]: '曇天・ブルーアワー',
  [LightingCondition.PRISM_FLARE]: 'プリズム・光漏れ'
};

export const SCENE_CONTEXT_LABELS_JA: Record<SceneContext, string> = {
  [SceneContext.NAGANO_OMACHI]: '長野・大町（自然 / 北アルプス）',
  [SceneContext.URBAN_STREET]: '都市の路地（東京 / 渋谷）',
  [SceneContext.MINIMAL_STUDIO]: 'ミニマルスタジオ',
  [SceneContext.VINTAGE_CAFE]: 'ヴィンテージカフェ',
  [SceneContext.LUXURY_HOTEL_BAR]: '高級ホテルバー',
  [SceneContext.ROOFTOP_DUSK]: '夕暮れのルーフトップ',
  [SceneContext.OLD_LIBRARY]: '古い図書館',
  [SceneContext.TROPICAL_BEACH]: 'トロピカルビーチ',
  [SceneContext.RAINY_WINDOW]: '雨の日の窓辺',
  [SceneContext.CUSTOM_MAP_LOCATION]: '地図で指定した場所'
};

export const CLOTHING_OPTION_LABELS_JA: Record<ClothingOption, string> = {
  [ClothingOption.ORIGINAL]: '元の服装を維持',
  [ClothingOption.OUTDOOR_SHELL_TEAL]: 'アウトドアシェル（ティール）',
  [ClothingOption.FORMAL_SHIRT]: '白いリネンシャツ',
  [ClothingOption.TURTLENECK_WOOL]: '黒のカシミヤタートルネック',
  [ClothingOption.LEATHER_JACKET]: 'ヴィンテージレザージャケット',
  [ClothingOption.EVENING_GOWN_SILK]: 'フォーマルなイブニングウェア',
  [ClothingOption.CYBERPUNK_TECHWEAR]: 'マットブラックのテックウェア',
  [ClothingOption.VINTAGE_DENIM]: '90年代ウォッシュデニム',
  [ClothingOption.T_SHIRT_WHITE]: '白Tシャツ',
  [ClothingOption.OVERSIZED_HOODIE]: 'オーバーサイズフーディ',
  [ClothingOption.DENIM_ON_DENIM]: 'デニム・オン・デニム',
  [ClothingOption.OXFORD_SHIRT]: 'オックスフォードシャツ',
  [ClothingOption.SWEATSHIRT_VINTAGE]: 'ヴィンテージスウェット',
  [ClothingOption.CARGO_PANTS_STYLE]: 'カーゴパンツ（上下セット）',
  [ClothingOption.BLACK_SUIT_THREE_PIECE]: 'ブラックスリーピーススーツ',
  [ClothingOption.NAVY_SUIT_TAILORED]: 'ネイビーテーラードスーツ',
  [ClothingOption.CHANEL_TWEED]: 'シャネル風ツイードジャケット',
  [ClothingOption.PEARL_NECKLACE_DRESS]: 'パールネックレス+ドレス',
  [ClothingOption.TUXEDO_BLACK_TIE]: 'タキシード（ブラックタイ）',
  [ClothingOption.MOUNTAIN_PARKA_GORE]: 'マウンテンパーカ（Gore-Tex）',
  [ClothingOption.FLEECE_PATAGONIA]: 'フリース（パタゴニア風）',
  [ClothingOption.DOWN_JACKET_PUFFY]: 'ダウンジャケット',
  [ClothingOption.HIKING_GEAR_FULL]: 'ハイキング装備フルセット',
  [ClothingOption.FISHERMAN_SWEATER]: 'フィッシャーマンセーター',
  [ClothingOption.YOHJI_BLACK_AVANT]: 'ヨウジヤマモト風オールブラック',
  [ClothingOption.COMME_DES_GARCONS_DECONSTRUCTED]: 'コム・デ・ギャルソン風デコンストラクト',
  [ClothingOption.MONOCHROME_MINIMAL]: '白×黒のミニマル',
  [ClothingOption.ASYMMETRIC_ARCHITECTURAL]: 'アシンメトリー建築的デザイン',
  [ClothingOption.STREETWEAR_SUPREME_STYLE]: 'ストリートウェア（Supreme系）',
  [ClothingOption.OVERSIZED_GRAPHIC_TEE]: 'オーバーサイズグラフィックT',
  [ClothingOption.SNEAKER_CULTURE_FULL]: 'スニーカーカルチャー全身',
  [ClothingOption.BOMBER_JACKET_90S]: '90年代ボンバージャケット',
  [ClothingOption.KIMONO_CASUAL]: 'カジュアル着物',
  [ClothingOption.KIMONO_FORMAL]: 'フォーマル着物',
  [ClothingOption.JINBEI_SUMMER]: '甚平',
  [ClothingOption.YUKATA_FESTIVAL]: '浴衣（夏祭り）',
  [ClothingOption.TRENCH_COAT_BURBERRY]: 'トレンチコート',
  [ClothingOption.CASHMERE_COAT_CAMEL]: 'キャメルカシミヤコート',
  [ClothingOption.SUMMER_LINEN_WHITE]: '夏のリネン白セット',
  [ClothingOption.KNITWEAR_OVERSIZED_CREAM]: 'オーバーサイズニット',
  [ClothingOption.DETECTIVE_NOIR]: '探偵ノワール（ハット+コート）',
  [ClothingOption.ROCKSTAR_LEATHER_FULL]: 'ロックスター全身レザー',
  [ClothingOption.VICTORIAN_GOTHIC]: 'ヴィクトリアン・ゴシック',
  [ClothingOption.SPACE_AGE_FUTURISTIC]: 'スペースエイジ'
};

export type ClothingThemeId =
  | 'original'
  | 'casual'
  | 'formal'
  | 'outdoor'
  | 'editorial'
  | 'street'
  | 'japanese'
  | 'seasonal'
  | 'dramatic';

export interface ClothingTheme {
  id: ClothingThemeId;
  label: string;
  items: ClothingOption[];
}

export const CLOTHING_OPTION_ICONS: Record<ClothingOption, string> = {
  [ClothingOption.ORIGINAL]: '◎',
  [ClothingOption.OUTDOOR_SHELL_TEAL]: '△',
  [ClothingOption.FORMAL_SHIRT]: '□',
  [ClothingOption.TURTLENECK_WOOL]: '●',
  [ClothingOption.LEATHER_JACKET]: '◆',
  [ClothingOption.EVENING_GOWN_SILK]: '◇',
  [ClothingOption.CYBERPUNK_TECHWEAR]: '✦',
  [ClothingOption.VINTAGE_DENIM]: '▣',
  [ClothingOption.T_SHIRT_WHITE]: 'T',
  [ClothingOption.OVERSIZED_HOODIE]: 'H',
  [ClothingOption.DENIM_ON_DENIM]: 'D',
  [ClothingOption.OXFORD_SHIRT]: 'O',
  [ClothingOption.SWEATSHIRT_VINTAGE]: 'S',
  [ClothingOption.CARGO_PANTS_STYLE]: 'C',
  [ClothingOption.BLACK_SUIT_THREE_PIECE]: '3',
  [ClothingOption.NAVY_SUIT_TAILORED]: 'N',
  [ClothingOption.CHANEL_TWEED]: 'C',
  [ClothingOption.PEARL_NECKLACE_DRESS]: 'P',
  [ClothingOption.TUXEDO_BLACK_TIE]: 'T',
  [ClothingOption.MOUNTAIN_PARKA_GORE]: 'M',
  [ClothingOption.FLEECE_PATAGONIA]: 'F',
  [ClothingOption.DOWN_JACKET_PUFFY]: 'D',
  [ClothingOption.HIKING_GEAR_FULL]: 'H',
  [ClothingOption.FISHERMAN_SWEATER]: 'K',
  [ClothingOption.YOHJI_BLACK_AVANT]: 'Y',
  [ClothingOption.COMME_DES_GARCONS_DECONSTRUCTED]: 'G',
  [ClothingOption.MONOCHROME_MINIMAL]: 'M',
  [ClothingOption.ASYMMETRIC_ARCHITECTURAL]: 'A',
  [ClothingOption.STREETWEAR_SUPREME_STYLE]: 'S',
  [ClothingOption.OVERSIZED_GRAPHIC_TEE]: 'G',
  [ClothingOption.SNEAKER_CULTURE_FULL]: 'SN',
  [ClothingOption.BOMBER_JACKET_90S]: 'B',
  [ClothingOption.KIMONO_CASUAL]: '和',
  [ClothingOption.KIMONO_FORMAL]: '礼',
  [ClothingOption.JINBEI_SUMMER]: '甚',
  [ClothingOption.YUKATA_FESTIVAL]: '浴',
  [ClothingOption.TRENCH_COAT_BURBERRY]: 'Tr',
  [ClothingOption.CASHMERE_COAT_CAMEL]: 'Ca',
  [ClothingOption.SUMMER_LINEN_WHITE]: 'Li',
  [ClothingOption.KNITWEAR_OVERSIZED_CREAM]: 'Kn',
  [ClothingOption.DETECTIVE_NOIR]: 'N',
  [ClothingOption.ROCKSTAR_LEATHER_FULL]: 'R',
  [ClothingOption.VICTORIAN_GOTHIC]: 'V',
  [ClothingOption.SPACE_AGE_FUTURISTIC]: 'F'
};

export const CLOTHING_THEMES: ClothingTheme[] = [
  {
    id: 'original',
    label: '原型維持',
    items: [ClothingOption.ORIGINAL]
  },
  {
    id: 'casual',
    label: 'カジュアル',
    items: [
      ClothingOption.T_SHIRT_WHITE,
      ClothingOption.OVERSIZED_HOODIE,
      ClothingOption.DENIM_ON_DENIM,
      ClothingOption.OXFORD_SHIRT,
      ClothingOption.SWEATSHIRT_VINTAGE,
      ClothingOption.CARGO_PANTS_STYLE,
      ClothingOption.VINTAGE_DENIM,
      ClothingOption.FORMAL_SHIRT
    ]
  },
  {
    id: 'formal',
    label: 'フォーマル・モード',
    items: [
      ClothingOption.BLACK_SUIT_THREE_PIECE,
      ClothingOption.NAVY_SUIT_TAILORED,
      ClothingOption.CHANEL_TWEED,
      ClothingOption.PEARL_NECKLACE_DRESS,
      ClothingOption.TUXEDO_BLACK_TIE,
      ClothingOption.EVENING_GOWN_SILK,
      ClothingOption.TURTLENECK_WOOL
    ]
  },
  {
    id: 'outdoor',
    label: 'アウトドア',
    items: [
      ClothingOption.MOUNTAIN_PARKA_GORE,
      ClothingOption.FLEECE_PATAGONIA,
      ClothingOption.DOWN_JACKET_PUFFY,
      ClothingOption.HIKING_GEAR_FULL,
      ClothingOption.FISHERMAN_SWEATER,
      ClothingOption.OUTDOOR_SHELL_TEAL
    ]
  },
  {
    id: 'editorial',
    label: 'エディトリアル',
    items: [
      ClothingOption.YOHJI_BLACK_AVANT,
      ClothingOption.COMME_DES_GARCONS_DECONSTRUCTED,
      ClothingOption.MONOCHROME_MINIMAL,
      ClothingOption.ASYMMETRIC_ARCHITECTURAL,
      ClothingOption.CYBERPUNK_TECHWEAR
    ]
  },
  {
    id: 'street',
    label: 'ストリート',
    items: [
      ClothingOption.STREETWEAR_SUPREME_STYLE,
      ClothingOption.OVERSIZED_GRAPHIC_TEE,
      ClothingOption.SNEAKER_CULTURE_FULL,
      ClothingOption.BOMBER_JACKET_90S,
      ClothingOption.LEATHER_JACKET
    ]
  },
  {
    id: 'japanese',
    label: '和',
    items: [
      ClothingOption.KIMONO_CASUAL,
      ClothingOption.KIMONO_FORMAL,
      ClothingOption.JINBEI_SUMMER,
      ClothingOption.YUKATA_FESTIVAL
    ]
  },
  {
    id: 'seasonal',
    label: '季節',
    items: [
      ClothingOption.TRENCH_COAT_BURBERRY,
      ClothingOption.CASHMERE_COAT_CAMEL,
      ClothingOption.SUMMER_LINEN_WHITE,
      ClothingOption.KNITWEAR_OVERSIZED_CREAM
    ]
  },
  {
    id: 'dramatic',
    label: 'ドラマチック',
    items: [
      ClothingOption.DETECTIVE_NOIR,
      ClothingOption.ROCKSTAR_LEATHER_FULL,
      ClothingOption.VICTORIAN_GOTHIC,
      ClothingOption.SPACE_AGE_FUTURISTIC
    ]
  }
];

export const POSE_OPTION_LABELS_JA: Record<PoseOption, string> = {
  [PoseOption.ORIGINAL]: '元のポーズを維持',
  [PoseOption.FRONTAL_HEADSHOT]: '正面ヘッドショット',
  [PoseOption.THREE_QUARTER]: '3/4クラシックポートレート',
  [PoseOption.PROFILE]: '横顔プロフィール',
  [PoseOption.LOOKING_OFF_CAMERA]: 'カメラ外を見る自然な表情',
  [PoseOption.HAND_ON_CHIN]: '顎に手を添える'
};

export const OUTPUT_PROFILE_LABELS_JA: Record<OutputProfile, string> = {
  [OutputProfile.LOG_FLAT]: 'Log / Flat（グレーディング向け）',
  [OutputProfile.STANDARD_FILM]: '標準フィルムシミュレーション',
  [OutputProfile.HIGH_CONTRAST]: '高コントラスト白黒'
};

export const IMAGE_ASPECT_LABELS_JA: Record<ImageAspect, string> = {
  [ImageAspect.AUTO]: '自動',
  [ImageAspect.SQUARE]: '正方形 (1:1)',
  [ImageAspect.LANDSCAPE]: '横長 (3:2)',
  [ImageAspect.PORTRAIT]: '縦長 (2:3)'
};

export const IMAGE_QUALITY_LABELS_JA: Record<ImageQuality, string> = {
  [ImageQuality.AUTO]: '自動',
  [ImageQuality.LOW]: 'Low (高速)',
  [ImageQuality.MEDIUM]: 'Medium (標準)',
  [ImageQuality.HIGH]: 'High (高精細・遅い)'
};

export const CAMERA_BODY_LABELS_EN: Record<CameraBody, string> = {
  [CameraBody.SMARTPHONE]: 'Smartphone (source image)',
  [CameraBody.PENTAX_K1]: 'Pentax K-1 (full frame)',
  [CameraBody.LEICA_M11]: 'Leica M11 (60MP / Leica color)',
  [CameraBody.LEICA_Q3]: 'Leica Q3 (natural deep shadows)',
  [CameraBody.HASSELBLAD_X2D]: 'Hasselblad X2D 100C (HNCS)',
  [CameraBody.PHASE_ONE_IQ4]: 'Phase One IQ4 150MP (commercial)',
  [CameraBody.FUJIFILM_GFX100]: 'Fujifilm GFX 100S (medium format)',
  [CameraBody.FUJIFILM_GFX100_II]: 'Fujifilm GFX100 II (film color)',
  [CameraBody.SONY_A7RV]: 'Sony a7R V (detailed / neutral)',
  [CameraBody.NIKON_Z8]: 'Nikon Z8 (natural fidelity)',
  [CameraBody.CANON_R5_II]: 'Canon R5 II (Picture Style)',
  [CameraBody.PENTAX_K1_II]: 'Pentax K-1 Mark II (natural fidelity)'
};

export const LENS_MODEL_LABELS_EN: Record<LensModel, string> = {
  [LensModel.FA_77]: 'PENTAX FA 77mm F1.8 Limited (soft rendering)',
  [LensModel.NOCTILUX_50]: 'Leica Noctilux-M 50mm f/0.95 (dreamlike)',
  [LensModel.GF_110]: 'Fujinon GF 110mm f/2 (medium-format portrait)',
  [LensModel.GM_85]: 'Sony FE 85mm f/1.4 GM II (high resolution)',
  [LensModel.LEICA_SUMMILUX_35_1_4]: 'Leica Summilux-M 35mm f/1.4 ASPH',
  [LensModel.LEICA_SUMMICRON_50_2]: 'Leica Summicron-M 50mm f/2',
  [LensModel.LEICA_APO_SUMMICRON_50_2]: 'Leica APO-Summicron-M 50mm f/2 ASPH',
  [LensModel.ZEISS_OTUS_55_1_4]: 'Zeiss Otus 55mm f/1.4',
  [LensModel.ZEISS_PLANAR_50_1_4]: 'Zeiss Planar 50mm f/1.4',
  [LensModel.VOIGTLANDER_NOKTON_50_1]: 'Voigtlander Nokton 50mm f/1',
  [LensModel.CANON_50_1_2L]: 'Canon RF 50mm f/1.2L USM',
  [LensModel.CANON_85_1_2L]: 'Canon RF 85mm f/1.2L USM',
  [LensModel.NIKKOR_Z_58_0_95_NOCT]: 'Nikon NIKKOR Z 58mm f/0.95 S Noct',
  [LensModel.NIKKOR_Z_50_1_2S]: 'Nikon NIKKOR Z 50mm f/1.2 S',
  [LensModel.NIKKOR_105_1_4E]: 'Nikon AF-S NIKKOR 105mm f/1.4E ED',
  [LensModel.SONY_FE_50_1_2_GM]: 'Sony FE 50mm f/1.2 GM',
  [LensModel.SIGMA_35_1_2_ART]: 'Sigma 35mm f/1.2 DG DN Art',
  [LensModel.PENTAX_FA_31_LIMITED]: 'PENTAX FA 31mm f/1.8 Limited (Pure Limited)',
  [LensModel.PENTAX_FA_43_LIMITED]: 'PENTAX FA 43mm f/1.9 Limited (classic normal)',
  [LensModel.PENTAX_DFA_50_1_4_STAR]: 'PENTAX DFA* 50mm f/1.4',
  [LensModel.MINOLTA_ROKKOR_58_1_2]: 'Minolta MC Rokkor-PG 58mm f/1.2',
  [LensModel.HELIOS_44_2]: 'Helios 44-2 58mm f/2',
  [LensModel.FUJIFILM_GF_80_1_7]: 'Fujinon GF 80mm f/1.7 R WR',
  [LensModel.HASSELBLAD_XCD_90V_2_5]: 'Hasselblad XCD 90mm f/2.5 V',
  [LensModel.PHASE_ONE_BLUE_RING_80_2_8]: 'Phase One Blue Ring 80mm f/2.8'
};

export const LENS_MOUNT_LABELS_EN: Record<LensMount, string> = {
  [LensMount.LEICA_M]: 'Leica M',
  [LensMount.SONY_E]: 'Sony E',
  [LensMount.NIKON_Z]: 'Nikon Z',
  [LensMount.CANON_RF]: 'Canon RF',
  [LensMount.PENTAX_K]: 'Pentax K',
  [LensMount.FUJI_G]: 'Fujifilm G',
  [LensMount.HASSELBLAD_X]: 'Hasselblad X',
  [LensMount.PHASE_ONE]: 'Phase One'
};

export const APERTURE_LABELS_EN: Record<Aperture, string> = {
  [Aperture.F0_95]: 'f/0.95',
  [Aperture.F1_4]: 'f/1.4',
  [Aperture.F1_8]: 'f/1.8',
  [Aperture.F2_0]: 'f/2.0',
  [Aperture.F2_8]: 'f/2.8',
  [Aperture.F4_0]: 'f/4.0',
  [Aperture.F8_0]: 'f/8.0'
};

export const EXPOSURE_COMPENSATION_LABELS_EN: Record<ExposureCompensation, string> = {
  [ExposureCompensation.NEG_1_0]: '-1.0 EV (darker)',
  [ExposureCompensation.NEG_0_5]: '-0.5 EV (slightly darker)',
  [ExposureCompensation.ZERO]: '±0 EV (standard)',
  [ExposureCompensation.POS_0_5]: '+0.5 EV (slightly brighter)',
  [ExposureCompensation.POS_1_0]: '+1.0 EV (brighter)'
};

export const LIGHTING_CONDITION_LABELS_EN: Record<LightingCondition, string> = {
  [LightingCondition.NATURAL_SOFT]: 'Natural soft window light',
  [LightingCondition.GOLDEN_HOUR_BACKLIGHT]: 'Autumn 3PM backlight and komorebi',
  [LightingCondition.GOLDEN_HOUR_SEMI_BACKLIGHT]: 'Golden hour semi-backlight',
  [LightingCondition.HIGH_NOON_SUMMER_SUN]: 'High noon summer sun',
  [LightingCondition.STUDIO_REMBRANDT]: 'Studio Rembrandt light',
  [LightingCondition.CITY_NIGHT_BOKEH]: 'City night neon and bokeh',
  [LightingCondition.CINEMATIC_TEAL_ORANGE]: 'Cinematic teal and orange',
  [LightingCondition.FASHION_FLASH_HARD]: '90s editorial direct flash',
  [LightingCondition.MOODY_OVERCAST]: 'Moody overcast blue hour',
  [LightingCondition.PRISM_FLARE]: 'Prism flare and light leaks'
};

export const SCENE_CONTEXT_LABELS_EN: Record<SceneContext, string> = {
  [SceneContext.NAGANO_OMACHI]: 'Nagano Omachi (nature / Northern Alps)',
  [SceneContext.URBAN_STREET]: 'Urban street (Tokyo / Shibuya)',
  [SceneContext.MINIMAL_STUDIO]: 'Minimal studio',
  [SceneContext.VINTAGE_CAFE]: 'Vintage cafe',
  [SceneContext.LUXURY_HOTEL_BAR]: 'Luxury hotel bar',
  [SceneContext.ROOFTOP_DUSK]: 'Rooftop at dusk',
  [SceneContext.OLD_LIBRARY]: 'Old library',
  [SceneContext.TROPICAL_BEACH]: 'Tropical beach',
  [SceneContext.RAINY_WINDOW]: 'Rainy window',
  [SceneContext.CUSTOM_MAP_LOCATION]: 'Map-selected location'
};

export const CLOTHING_OPTION_LABELS_EN: Record<ClothingOption, string> = {
  [ClothingOption.ORIGINAL]: 'Keep original clothing',
  [ClothingOption.OUTDOOR_SHELL_TEAL]: 'Outdoor shell (teal)',
  [ClothingOption.FORMAL_SHIRT]: 'White linen shirt',
  [ClothingOption.TURTLENECK_WOOL]: 'Black cashmere turtleneck',
  [ClothingOption.LEATHER_JACKET]: 'Vintage leather jacket',
  [ClothingOption.EVENING_GOWN_SILK]: 'Formal eveningwear',
  [ClothingOption.CYBERPUNK_TECHWEAR]: 'Matte black techwear',
  [ClothingOption.VINTAGE_DENIM]: '90s washed denim',
  [ClothingOption.T_SHIRT_WHITE]: 'White T-shirt',
  [ClothingOption.OVERSIZED_HOODIE]: 'Oversized hoodie',
  [ClothingOption.DENIM_ON_DENIM]: 'Denim on denim',
  [ClothingOption.OXFORD_SHIRT]: 'Oxford shirt',
  [ClothingOption.SWEATSHIRT_VINTAGE]: 'Vintage sweatshirt',
  [ClothingOption.CARGO_PANTS_STYLE]: 'Cargo pants full style',
  [ClothingOption.BLACK_SUIT_THREE_PIECE]: 'Black three-piece suit',
  [ClothingOption.NAVY_SUIT_TAILORED]: 'Navy tailored suit',
  [ClothingOption.CHANEL_TWEED]: 'Chanel-style tweed jacket',
  [ClothingOption.PEARL_NECKLACE_DRESS]: 'Pearl necklace + dress',
  [ClothingOption.TUXEDO_BLACK_TIE]: 'Black tie tuxedo',
  [ClothingOption.MOUNTAIN_PARKA_GORE]: 'Gore-Tex mountain parka',
  [ClothingOption.FLEECE_PATAGONIA]: 'Patagonia-style fleece',
  [ClothingOption.DOWN_JACKET_PUFFY]: 'Puffy down jacket',
  [ClothingOption.HIKING_GEAR_FULL]: 'Full hiking gear',
  [ClothingOption.FISHERMAN_SWEATER]: 'Fisherman sweater',
  [ClothingOption.YOHJI_BLACK_AVANT]: 'Yohji Yamamoto-style all black',
  [ClothingOption.COMME_DES_GARCONS_DECONSTRUCTED]: 'Comme des Garcons-style deconstructed',
  [ClothingOption.MONOCHROME_MINIMAL]: 'Black and white minimal',
  [ClothingOption.ASYMMETRIC_ARCHITECTURAL]: 'Asymmetric architectural design',
  [ClothingOption.STREETWEAR_SUPREME_STYLE]: 'Supreme-style streetwear',
  [ClothingOption.OVERSIZED_GRAPHIC_TEE]: 'Oversized graphic tee',
  [ClothingOption.SNEAKER_CULTURE_FULL]: 'Full sneaker culture fit',
  [ClothingOption.BOMBER_JACKET_90S]: '90s bomber jacket',
  [ClothingOption.KIMONO_CASUAL]: 'Casual kimono',
  [ClothingOption.KIMONO_FORMAL]: 'Formal kimono',
  [ClothingOption.JINBEI_SUMMER]: 'Summer jinbei',
  [ClothingOption.YUKATA_FESTIVAL]: 'Festival yukata',
  [ClothingOption.TRENCH_COAT_BURBERRY]: 'Trench coat',
  [ClothingOption.CASHMERE_COAT_CAMEL]: 'Camel cashmere coat',
  [ClothingOption.SUMMER_LINEN_WHITE]: 'White summer linen set',
  [ClothingOption.KNITWEAR_OVERSIZED_CREAM]: 'Oversized cream knitwear',
  [ClothingOption.DETECTIVE_NOIR]: 'Noir detective (hat + coat)',
  [ClothingOption.ROCKSTAR_LEATHER_FULL]: 'Full rockstar leather',
  [ClothingOption.VICTORIAN_GOTHIC]: 'Victorian gothic',
  [ClothingOption.SPACE_AGE_FUTURISTIC]: 'Space age futuristic'
};

export const CLOTHING_THEME_LABELS_JA: Record<ClothingThemeId, string> = {
  original: '原型維持',
  casual: 'カジュアル',
  formal: 'フォーマル・モード',
  outdoor: 'アウトドア',
  editorial: 'エディトリアル',
  street: 'ストリート',
  japanese: '和',
  seasonal: '季節',
  dramatic: 'ドラマチック'
};

export const CLOTHING_THEME_LABELS_EN: Record<ClothingThemeId, string> = {
  original: 'Original',
  casual: 'Casual',
  formal: 'Formal / Mode',
  outdoor: 'Outdoor',
  editorial: 'Editorial',
  street: 'Street',
  japanese: 'Japanese',
  seasonal: 'Seasonal',
  dramatic: 'Dramatic'
};

export const POSE_OPTION_LABELS_EN: Record<PoseOption, string> = {
  [PoseOption.ORIGINAL]: 'Keep original pose',
  [PoseOption.FRONTAL_HEADSHOT]: 'Frontal headshot',
  [PoseOption.THREE_QUARTER]: '3/4 classic portrait',
  [PoseOption.PROFILE]: 'Side profile',
  [PoseOption.LOOKING_OFF_CAMERA]: 'Looking off-camera candid',
  [PoseOption.HAND_ON_CHIN]: 'Hand on chin'
};

export const OUTPUT_PROFILE_LABELS_EN: Record<OutputProfile, string> = {
  [OutputProfile.LOG_FLAT]: 'Log / Flat (for grading)',
  [OutputProfile.STANDARD_FILM]: 'Standard film simulation',
  [OutputProfile.HIGH_CONTRAST]: 'High contrast black and white'
};

export const IMAGE_ASPECT_LABELS_EN: Record<ImageAspect, string> = {
  [ImageAspect.AUTO]: 'Auto',
  [ImageAspect.SQUARE]: 'Square (1:1)',
  [ImageAspect.LANDSCAPE]: 'Landscape (3:2)',
  [ImageAspect.PORTRAIT]: 'Portrait (2:3)'
};

export const IMAGE_QUALITY_LABELS_EN: Record<ImageQuality, string> = {
  [ImageQuality.AUTO]: 'Auto',
  [ImageQuality.LOW]: 'Low (fast)',
  [ImageQuality.MEDIUM]: 'Medium (standard)',
  [ImageQuality.HIGH]: 'High (detailed / slower)'
};

export const CAMERA_BODY_LABELS = CAMERA_BODY_LABELS_JA;
export const LENS_MODEL_LABELS = LENS_MODEL_LABELS_JA;
export const LENS_MOUNT_LABELS = LENS_MOUNT_LABELS_JA;
export const APERTURE_LABELS = APERTURE_LABELS_JA;
export const EXPOSURE_COMPENSATION_LABELS = EXPOSURE_COMPENSATION_LABELS_JA;
export const LIGHTING_CONDITION_LABELS = LIGHTING_CONDITION_LABELS_JA;
export const SCENE_CONTEXT_LABELS = SCENE_CONTEXT_LABELS_JA;
export const CLOTHING_OPTION_LABELS = CLOTHING_OPTION_LABELS_JA;
export const CLOTHING_THEME_LABELS = CLOTHING_THEME_LABELS_JA;
export const POSE_OPTION_LABELS = POSE_OPTION_LABELS_JA;
export const OUTPUT_PROFILE_LABELS = OUTPUT_PROFILE_LABELS_JA;
export const IMAGE_ASPECT_LABELS = IMAGE_ASPECT_LABELS_JA;
export const IMAGE_QUALITY_LABELS = IMAGE_QUALITY_LABELS_JA;

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
  aspect: ImageAspect;
  quality: ImageQuality;
  fidelity: number; // 0-100
  customLocation?: CustomLocation;
}

export interface CustomLocation {
  placeName: string;
  lat: number;
  lng: number;
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
  aspect?: ImageAspect;
  quality?: ImageQuality;
  debugPrompt?: string;
}
