import React from 'react';
import {
  APERTURE_LABELS,
  Aperture,
  CAMERA_BODY_LABELS,
  CLOTHING_OPTION_ICONS,
  CLOTHING_OPTION_LABELS,
  CLOTHING_THEMES,
  ClothingThemeId,
  CameraBody,
  ClothingOption,
  EXPOSURE_COMPENSATION_LABELS,
  ExposureCompensation,
  LENS_MODEL_LABELS,
  LensModel,
  LIGHTING_CONDITION_LABELS,
  LightingCondition,
  OUTPUT_PROFILE_LABELS,
  OutputProfile,
  POSE_OPTION_LABELS,
  PoseOption,
  SCENE_CONTEXT_LABELS,
  SceneContext,
  SimulationParams,
} from '../types';

interface ControlPanelProps {
  params: SimulationParams;
  setParams: React.Dispatch<React.SetStateAction<SimulationParams>>;
  isProcessing: boolean;
  onGenerate: () => void;
}

// Data: Maximum Aperture (Brightest) for each Lens
const LENS_SPECS: Record<LensModel, number> = {
  [LensModel.FA_77]: 1.8,
  [LensModel.NOCTILUX_50]: 0.95,
  [LensModel.GF_110]: 2.0,
  [LensModel.GM_85]: 1.4,
  [LensModel.LEICA_SUMMILUX_35_1_4]: 1.4,
  [LensModel.LEICA_SUMMICRON_50_2]: 2.0,
  [LensModel.LEICA_APO_SUMMICRON_50_2]: 2.0,
  [LensModel.ZEISS_OTUS_55_1_4]: 1.4,
  [LensModel.ZEISS_PLANAR_50_1_4]: 1.4,
  [LensModel.VOIGTLANDER_NOKTON_50_1]: 1.0,
  [LensModel.CANON_50_1_2L]: 1.2,
  [LensModel.CANON_85_1_2L]: 1.2,
  [LensModel.NIKKOR_Z_58_0_95_NOCT]: 0.95,
  [LensModel.NIKKOR_Z_50_1_2S]: 1.2,
  [LensModel.NIKKOR_105_1_4E]: 1.4,
  [LensModel.SONY_FE_50_1_2_GM]: 1.2,
  [LensModel.SIGMA_35_1_2_ART]: 1.2,
  [LensModel.PENTAX_FA_31_LIMITED]: 1.8,
  [LensModel.PENTAX_FA_43_LIMITED]: 1.9,
  [LensModel.PENTAX_DFA_50_1_4_STAR]: 1.4,
  [LensModel.MINOLTA_ROKKOR_58_1_2]: 1.2,
  [LensModel.HELIOS_44_2]: 2.0,
  [LensModel.FUJIFILM_GF_80_1_7]: 1.7,
};

const ALL_PRIME_LENSES = Object.values(LensModel);

// Data: Valid Lenses for each Camera Body
const COMPATIBILITY_MAP: Record<CameraBody, LensModel[]> = {
  [CameraBody.PENTAX_K1]: ALL_PRIME_LENSES,
  [CameraBody.LEICA_M11]: ALL_PRIME_LENSES,
  [CameraBody.LEICA_Q3]: ALL_PRIME_LENSES,
  [CameraBody.HASSELBLAD_X2D]: ALL_PRIME_LENSES,
  [CameraBody.PHASE_ONE_IQ4]: ALL_PRIME_LENSES,
  [CameraBody.FUJIFILM_GFX100]: ALL_PRIME_LENSES,
  [CameraBody.FUJIFILM_GFX100_II]: ALL_PRIME_LENSES,
  [CameraBody.SONY_A7RV]: ALL_PRIME_LENSES,
  [CameraBody.NIKON_Z8]: ALL_PRIME_LENSES,
  [CameraBody.CANON_R5_II]: ALL_PRIME_LENSES,
  [CameraBody.PENTAX_K1_II]: ALL_PRIME_LENSES,
  [CameraBody.SMARTPHONE]: [] // Not used in this logic
};

const ControlPanel: React.FC<ControlPanelProps> = ({ params, setParams, isProcessing, onGenerate }) => {
  const currentClothingTheme =
    CLOTHING_THEMES.find((theme) => theme.items.includes(params.clothing))?.id ?? 'original';
  const [activeClothingTheme, setActiveClothingTheme] = React.useState<ClothingThemeId>(currentClothingTheme);
  
  const updateParam = <K extends keyof SimulationParams>(key: K, value: SimulationParams[K]) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  React.useEffect(() => {
    setActiveClothingTheme(currentClothingTheme);
  }, [currentClothingTheme]);

  // Helper to parse aperture string to number "f/1.8" -> 1.8
  const getFNumber = (apertureEnum: Aperture): number => {
    return parseFloat(apertureEnum.replace('f/', ''));
  };

  // 1. Handle Camera Change -> Auto-select first compatible lens
  const handleCameraChange = (newCamera: CameraBody) => {
    const validLenses = COMPATIBILITY_MAP[newCamera];
    if (validLenses && validLenses.length > 0) {
      // Pick the first valid lens
      const defaultLens = validLenses[0];
      // Check if current aperture is valid for new lens, if not, reset to max aperture
      const maxApertureVal = LENS_SPECS[defaultLens];
      let newAperture = params.aperture;
      
      if (getFNumber(params.aperture) < maxApertureVal) {
         // Find the closest valid aperture or just set to max (e.g., F1_8 or F2_0)
         // For simplicity, let's find the enum that matches the max aperture or close to it
         const validAperture = Object.values(Aperture).find(a => getFNumber(a) >= maxApertureVal) || Aperture.F2_8;
         newAperture = validAperture;
      }

      setParams(prev => ({ 
        ...prev, 
        camera: newCamera, 
        lens: defaultLens,
        aperture: newAperture 
      }));
    } else {
      updateParam('camera', newCamera);
    }
  };

  // 2. Handle Lens Change -> Check Aperture Compatibility
  const handleLensChange = (newLens: LensModel) => {
    const maxApertureVal = LENS_SPECS[newLens];
    if (getFNumber(params.aperture) < maxApertureVal) {
         // Current aperture is too bright for this lens (e.g. f/1.4 on f/2.0 lens)
         // Reset to the lens's max aperture (approximate via enum)
         const validAperture = Object.values(Aperture).find(a => getFNumber(a) >= maxApertureVal) || Aperture.F2_8;
         setParams(prev => ({ ...prev, lens: newLens, aperture: validAperture }));
    } else {
      updateParam('lens', newLens);
    }
  };

  // Filter available lenses based on current camera
  const availableLenses = COMPATIBILITY_MAP[params.camera] || [];

  return (
    <div className="w-full h-full flex flex-col bg-zinc-900 border-l border-zinc-800 p-6 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-tight text-white mb-1">光学エンジン</h2>
        <p className="text-xs text-zinc-500 uppercase tracking-wider">ポートレートシミュレーター v2.1</p>
      </div>

      <div className="space-y-5 flex-grow">
        
        {/* Output Profile */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">出力プロファイル</label>
          <select
            value={params.outputProfile}
            disabled={isProcessing}
            onChange={(e) => updateParam('outputProfile', e.target.value as OutputProfile)}
            className="w-full bg-zinc-800 text-zinc-200 text-xs rounded border-zinc-700 focus:ring-blue-500 focus:border-blue-500 p-2"
          >
            {Object.values(OutputProfile).map((val) => (
              <option key={val} value={val}>{OUTPUT_PROFILE_LABELS[val]}</option>
            ))}
          </select>
        </div>

        <hr className="border-zinc-800" />

        {/* Gear Section */}
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-zinc-500 uppercase">カメラシステム</label>
            <select
              value={params.camera}
              disabled={isProcessing}
              onChange={(e) => handleCameraChange(e.target.value as CameraBody)}
              className="w-full bg-zinc-800 text-zinc-200 text-xs rounded border-zinc-700 focus:ring-blue-500 focus:border-blue-500 p-2"
            >
              {Object.values(CameraBody)
                .filter(c => c !== CameraBody.SMARTPHONE) // Hide generic smartphone option for simulation target
                .map((val) => (
                <option key={val} value={val}>{CAMERA_BODY_LABELS[val]}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-zinc-500 uppercase">レンズ</label>
            <select
              value={params.lens}
              disabled={isProcessing}
              onChange={(e) => handleLensChange(e.target.value as LensModel)}
              className="w-full bg-zinc-800 text-zinc-200 text-xs rounded border-zinc-700 focus:ring-blue-500 focus:border-blue-500 p-2"
            >
              {availableLenses.map((val) => (
                <option key={val} value={val}>{LENS_MODEL_LABELS[val]}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between">
                <label className="text-[10px] font-semibold text-zinc-500 uppercase">絞り</label>
                <span className="text-[10px] text-zinc-600">最大: f/{LENS_SPECS[params.lens]}</span>
            </div>
            
            <div className="grid grid-cols-4 gap-1">
              {Object.values(Aperture).map((val) => {
                const fVal = getFNumber(val);
                const maxF = LENS_SPECS[params.lens];
                const isDisabled = fVal < maxF; // Disable if aperture is wider than lens supports

                return (
                  <button
                    key={val}
                    disabled={isProcessing || isDisabled}
                    onClick={() => updateParam('aperture', val)}
                    className={`text-[10px] py-1.5 rounded transition-all ${
                      params.aperture === val
                        ? 'bg-zinc-200 text-black font-bold'
                        : isDisabled 
                            ? 'bg-zinc-900 text-zinc-700 cursor-not-allowed opacity-50'
                            : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                    }`}
                  >
                    {APERTURE_LABELS[val].replace('f/', '')}
                  </button>
                );
              })}
            </div>
          </div>
          
           <div className="space-y-1">
            <label className="text-[10px] font-semibold text-zinc-500 uppercase">露出補正</label>
            <div className="grid grid-cols-5 gap-1">
              {Object.values(ExposureCompensation).map((val) => (
                <button
                  key={val}
                  disabled={isProcessing}
                  onClick={() => updateParam('exposure', val)}
                  className={`text-[9px] py-1.5 rounded transition-all ${
                    params.exposure === val
                      ? 'bg-blue-900/50 text-blue-200 border border-blue-500/50 font-bold'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  }`}
                >
                  {EXPOSURE_COMPENSATION_LABELS[val].split('（')[0]}
                </button>
              ))}
            </div>
          </div>

        </div>

        <hr className="border-zinc-800" />

        {/* Environment & Style */}
        <div className="space-y-4">
           <div className="space-y-1">
            <label className="text-[10px] font-semibold text-zinc-500 uppercase">ライティング</label>
            <select
              value={params.lighting}
              disabled={isProcessing}
              onChange={(e) => updateParam('lighting', e.target.value as LightingCondition)}
              className="w-full bg-zinc-800 text-zinc-200 text-xs rounded border-zinc-700 focus:ring-blue-500 focus:border-blue-500 p-2"
            >
              {Object.values(LightingCondition).map((val) => (
                <option key={val} value={val}>{LIGHTING_CONDITION_LABELS[val]}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-zinc-500 uppercase">シーン / ロケーション</label>
            <select
              value={params.scene}
              disabled={isProcessing}
              onChange={(e) => updateParam('scene', e.target.value as SceneContext)}
              className="w-full bg-zinc-800 text-zinc-200 text-xs rounded border-zinc-700 focus:ring-blue-500 focus:border-blue-500 p-2"
            >
              {Object.values(SceneContext).map((val) => (
                <option key={val} value={val}>{SCENE_CONTEXT_LABELS[val]}</option>
              ))}
            </select>
          </div>

           <div className="space-y-1">
            <label className="text-[10px] font-semibold text-zinc-500 uppercase">被写体のポーズ</label>
            <select
              value={params.pose}
              disabled={isProcessing}
              onChange={(e) => updateParam('pose', e.target.value as PoseOption)}
              className="w-full bg-zinc-800 text-zinc-200 text-xs rounded border-zinc-700 focus:ring-blue-500 focus:border-blue-500 p-2"
            >
              {Object.values(PoseOption).map((val) => (
                <option key={val} value={val}>{POSE_OPTION_LABELS[val]}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-semibold text-zinc-500 uppercase">服装 / スタイリング</label>
              <span className="max-w-[150px] truncate text-[10px] text-blue-300">{CLOTHING_OPTION_LABELS[params.clothing]}</span>
            </div>

            <div className="overflow-x-auto pb-1">
              <div className="flex min-w-max gap-1" role="tablist" aria-label="服装テーマ">
                {CLOTHING_THEMES.map((theme) => {
                  const isActive = theme.id === activeClothingTheme;

                  return (
                    <button
                      key={theme.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      disabled={isProcessing}
                      onClick={() => setActiveClothingTheme(theme.id)}
                      className={`rounded border px-2 py-1 text-[10px] font-semibold transition-colors ${
                        isActive
                          ? 'border-blue-500/70 bg-blue-500/15 text-blue-200'
                          : 'border-zinc-800 bg-zinc-950 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
                      }`}
                    >
                      {theme.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3" role="radiogroup" aria-label="服装を選択">
              {(CLOTHING_THEMES.find((theme) => theme.id === activeClothingTheme)?.items ?? []).map((item) => {
                const isSelected = params.clothing === item;

                return (
                  <button
                    key={item}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    disabled={isProcessing}
                    onClick={() => updateParam('clothing', item)}
                    className={`min-h-20 rounded-lg border p-2 text-left transition-all ${
                      isSelected
                        ? 'border-blue-400 bg-blue-500/15 shadow-[0_0_0_1px_rgba(96,165,250,0.35)]'
                        : 'border-zinc-800 bg-zinc-950 hover:border-zinc-600 hover:bg-zinc-800/70'
                    }`}
                  >
                    <span className={`mb-2 flex h-7 w-7 items-center justify-center rounded text-[11px] font-bold ${
                      isSelected ? 'bg-blue-500 text-white' : 'bg-zinc-800 text-zinc-300'
                    }`}>
                      {CLOTHING_OPTION_ICONS[item]}
                    </span>
                    <span className={`block text-[10px] font-medium leading-snug ${
                      isSelected ? 'text-blue-100' : 'text-zinc-300'
                    }`}>
                      {CLOTHING_OPTION_LABELS[item]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Fidelity Slider */}
        <div className="space-y-2 pt-2">
           <div className="flex justify-between items-center">
            <label className="text-[10px] font-semibold text-zinc-500 uppercase">光学再現度</label>
            <span className="text-[10px] text-zinc-400 font-mono">{params.fidelity}%</span>
           </div>
           <input 
             type="range" 
             min="0" 
             max="100" 
             value={params.fidelity}
             disabled={isProcessing}
             onChange={(e) => updateParam('fidelity', parseInt(e.target.value))}
             className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
           />
        </div>
      </div>

      <div className="pt-6 mt-auto">
        <button
          onClick={onGenerate}
          disabled={isProcessing}
          className={`w-full py-4 text-sm font-bold uppercase tracking-widest rounded-lg shadow-lg transition-all duration-300 ${
            isProcessing
              ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-blue-900/20 hover:scale-[1.02]'
          }`}
        >
          {isProcessing ? '現像中...' : 'シミュレート'}
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;
