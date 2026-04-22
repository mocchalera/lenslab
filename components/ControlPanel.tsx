import React, { useEffect } from 'react';
import { CameraBody, LensModel, Aperture, ExposureCompensation, LightingCondition, SceneContext, ClothingOption, PoseOption, OutputProfile, SimulationParams } from '../types';

interface ControlPanelProps {
  params: SimulationParams;
  setParams: React.Dispatch<React.SetStateAction<SimulationParams>>;
  isProcessing: boolean;
  onGenerate: () => void;
}

// Data: Valid Lenses for each Camera Body
const COMPATIBILITY_MAP: Record<CameraBody, LensModel[]> = {
  [CameraBody.PENTAX_K1]: [LensModel.FA_77],
  [CameraBody.LEICA_M11]: [LensModel.NOCTILUX_50],
  [CameraBody.FUJIFILM_GFX100]: [LensModel.GF_110],
  [CameraBody.SONY_A7RV]: [LensModel.GM_85],
  [CameraBody.SMARTPHONE]: [] // Not used in this logic
};

// Data: Maximum Aperture (Brightest) for each Lens
const LENS_SPECS: Record<LensModel, number> = {
  [LensModel.FA_77]: 1.8,
  [LensModel.NOCTILUX_50]: 0.95,
  [LensModel.GF_110]: 2.0,
  [LensModel.GM_85]: 1.4,
};

const ControlPanel: React.FC<ControlPanelProps> = ({ params, setParams, isProcessing, onGenerate }) => {
  
  const updateParam = <K extends keyof SimulationParams>(key: K, value: SimulationParams[K]) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

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
        <h2 className="text-xl font-bold tracking-tight text-white mb-1">Optical Engine</h2>
        <p className="text-xs text-zinc-500 uppercase tracking-wider">Portrait Simulator v2.1</p>
      </div>

      <div className="space-y-5 flex-grow">
        
        {/* Output Profile */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Output Profile</label>
          <select
            value={params.outputProfile}
            disabled={isProcessing}
            onChange={(e) => updateParam('outputProfile', e.target.value as OutputProfile)}
            className="w-full bg-zinc-800 text-zinc-200 text-xs rounded border-zinc-700 focus:ring-blue-500 focus:border-blue-500 p-2"
          >
            {Object.values(OutputProfile).map((val) => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
        </div>

        <hr className="border-zinc-800" />

        {/* Gear Section */}
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-zinc-500 uppercase">Camera System</label>
            <select
              value={params.camera}
              disabled={isProcessing}
              onChange={(e) => handleCameraChange(e.target.value as CameraBody)}
              className="w-full bg-zinc-800 text-zinc-200 text-xs rounded border-zinc-700 focus:ring-blue-500 focus:border-blue-500 p-2"
            >
              {Object.values(CameraBody)
                .filter(c => c !== CameraBody.SMARTPHONE) // Hide generic smartphone option for simulation target
                .map((val) => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-zinc-500 uppercase">Lens</label>
            <select
              value={params.lens}
              disabled={isProcessing}
              onChange={(e) => handleLensChange(e.target.value as LensModel)}
              className="w-full bg-zinc-800 text-zinc-200 text-xs rounded border-zinc-700 focus:ring-blue-500 focus:border-blue-500 p-2"
            >
              {availableLenses.map((val) => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between">
                <label className="text-[10px] font-semibold text-zinc-500 uppercase">Aperture</label>
                <span className="text-[10px] text-zinc-600">Max: f/{LENS_SPECS[params.lens]}</span>
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
                    {val.replace('f/', '')}
                  </button>
                );
              })}
            </div>
          </div>
          
           <div className="space-y-1">
            <label className="text-[10px] font-semibold text-zinc-500 uppercase">Exposure Compensation</label>
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
                  {val.replace(' EV', '').replace('POS_', '+').replace('NEG_', '-').replace('ZERO', '0')}
                </button>
              ))}
            </div>
          </div>

        </div>

        <hr className="border-zinc-800" />

        {/* Environment & Style */}
        <div className="space-y-4">
           <div className="space-y-1">
            <label className="text-[10px] font-semibold text-zinc-500 uppercase">Lighting</label>
            <select
              value={params.lighting}
              disabled={isProcessing}
              onChange={(e) => updateParam('lighting', e.target.value as LightingCondition)}
              className="w-full bg-zinc-800 text-zinc-200 text-xs rounded border-zinc-700 focus:ring-blue-500 focus:border-blue-500 p-2"
            >
              {Object.values(LightingCondition).map((val) => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-zinc-500 uppercase">Scene / Location</label>
            <select
              value={params.scene}
              disabled={isProcessing}
              onChange={(e) => updateParam('scene', e.target.value as SceneContext)}
              className="w-full bg-zinc-800 text-zinc-200 text-xs rounded border-zinc-700 focus:ring-blue-500 focus:border-blue-500 p-2"
            >
              {Object.values(SceneContext).map((val) => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
          </div>

           <div className="space-y-1">
            <label className="text-[10px] font-semibold text-zinc-500 uppercase">Subject Pose</label>
            <select
              value={params.pose}
              disabled={isProcessing}
              onChange={(e) => updateParam('pose', e.target.value as PoseOption)}
              className="w-full bg-zinc-800 text-zinc-200 text-xs rounded border-zinc-700 focus:ring-blue-500 focus:border-blue-500 p-2"
            >
              {Object.values(PoseOption).map((val) => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-zinc-500 uppercase">Clothing / Styling</label>
            <select
              value={params.clothing}
              disabled={isProcessing}
              onChange={(e) => updateParam('clothing', e.target.value as ClothingOption)}
              className="w-full bg-zinc-800 text-zinc-200 text-xs rounded border-zinc-700 focus:ring-blue-500 focus:border-blue-500 p-2"
            >
              {Object.values(ClothingOption).map((val) => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Fidelity Slider */}
        <div className="space-y-2 pt-2">
           <div className="flex justify-between items-center">
            <label className="text-[10px] font-semibold text-zinc-500 uppercase">Optical Fidelity</label>
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
          {isProcessing ? 'Developing...' : 'Simulate'}
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;