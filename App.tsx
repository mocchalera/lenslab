import React, { useState, useEffect } from 'react';
import JSZip from 'jszip';
import FileUpload from './components/FileUpload';
import ControlPanel from './components/ControlPanel';
import ComparisonSlider from './components/ComparisonSlider';
import PipelineViewer from './components/PipelineViewer';
import HistoryPanel from './components/HistoryPanel';
import { CameraBody, LensModel, Aperture, ExposureCompensation, LightingCondition, SceneContext, ClothingOption, PoseOption, OutputProfile, SimulationParams, ProcessingStep, HistoryItem } from './types';
import { generateSimulation } from './services/geminiService';

const DEFAULT_PARAMS: SimulationParams = {
  camera: CameraBody.PENTAX_K1,
  lens: LensModel.FA_77,
  aperture: Aperture.F2_0,
  exposure: ExposureCompensation.POS_0_5, // Slightly bright default for portraits
  lighting: LightingCondition.GOLDEN_HOUR_BACKLIGHT,
  scene: SceneContext.NAGANO_OMACHI,
  clothing: ClothingOption.OUTDOOR_SHELL_TEAL,
  pose: PoseOption.ORIGINAL,
  outputProfile: OutputProfile.LOG_FLAT,
  fidelity: 90
};

const INITIAL_STEPS: ProcessingStep[] = [
  { id: '1', label: 'Analyzing Structure & Depth Map', status: 'pending' },
  { id: '2', label: 'FaceID & Composition Lock', status: 'pending' },
  { id: '3', label: 'Applying Lens Optical Profile', status: 'pending' },
  { id: '4', label: 'Sensor Color Science & Development', status: 'pending' },
];

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [params, setParams] = useState<SimulationParams>(DEFAULT_PARAMS);
  const [isProcessing, setIsProcessing] = useState(false);
  const [steps, setSteps] = useState<ProcessingStep[]>(INITIAL_STEPS);
  const [error, setError] = useState<string | null>(null);
  
  // History State
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentHistoryId, setCurrentHistoryId] = useState<string | null>(null);

  // Handle file selection
  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setGeneratedImage(null);
    setError(null);
    // Clear history when new file is uploaded to start fresh context
    setHistory([]);
    setCurrentHistoryId(null);
    
    const objectUrl = URL.createObjectURL(selectedFile);
    setOriginalPreview(objectUrl);
  };

  // Clean up Object URL
  useEffect(() => {
    return () => {
      if (originalPreview) URL.revokeObjectURL(originalPreview);
    };
  }, [originalPreview]);

  // Orchestrate the simulation
  const handleGenerate = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    
    // Reset pipeline UI
    setSteps(INITIAL_STEPS.map(s => ({ ...s, status: 'pending' })));

    try {
      // Step 1: Analysis
      updateStepStatus('1', 'active');
      await new Promise(r => setTimeout(r, 800)); // UI pacing
      updateStepStatus('1', 'complete');

      // Step 2: Structure Lock
      updateStepStatus('2', 'active');
      await new Promise(r => setTimeout(r, 800)); // UI pacing
      updateStepStatus('2', 'complete');

      // Step 3: Lens Profile (Real API Call starts here visually)
      updateStepStatus('3', 'active');
      
      const resultBase64 = await generateSimulation(file, params);
      
      updateStepStatus('3', 'complete');
      
      // Step 4: Development
      updateStepStatus('4', 'active');
      await new Promise(r => setTimeout(r, 600)); // UI pacing
      updateStepStatus('4', 'complete');

      setGeneratedImage(resultBase64);
      
      // Add to History
      const newItem: HistoryItem = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        imageUrl: resultBase64,
        params: { ...params } // Snapshot current params
      };
      
      setHistory(prev => [newItem, ...prev]);
      setCurrentHistoryId(newItem.id);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Simulation failed. Please try again.");
      setSteps(prev => prev.map(s => s.status === 'active' ? { ...s, status: 'pending' } : s));
    } finally {
      setIsProcessing(false);
    }
  };

  const updateStepStatus = (id: string, status: ProcessingStep['status']) => {
    setSteps(prev => prev.map(step => step.id === id ? { ...step, status } : step));
  };

  const handleReset = () => {
    setFile(null);
    setOriginalPreview(null);
    setGeneratedImage(null);
    setError(null);
    setHistory([]);
    setCurrentHistoryId(null);
  };

  // --- History Handlers ---

  const handleSelectHistory = (item: HistoryItem) => {
    setGeneratedImage(item.imageUrl);
    setParams(item.params); // Restore parameters for visibility
    setCurrentHistoryId(item.id);
  };

  const handleDownloadOne = (item: HistoryItem) => {
    const link = document.createElement('a');
    link.href = item.imageUrl;
    const dateStr = new Date(item.timestamp).toISOString().replace(/[:.]/g, '-');
    link.download = `LensLab_${dateStr}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = async () => {
    if (history.length === 0) return;

    const zip = new JSZip();
    const folder = zip.folder("LensLab_Session");
    
    // 1. Add History Metadata
    const metadata = history.map(item => ({
      filename: `LensLab_${item.id}.png`,
      timestamp: new Date(item.timestamp).toISOString(),
      parameters: item.params
    }));
    
    if (folder) {
        folder.file("session_metadata.json", JSON.stringify(metadata, null, 2));

        // 2. Add Images
        history.forEach((item) => {
            // Remove data:image/png;base64, prefix
            const base64Data = item.imageUrl.split(',')[1];
            folder.file(`LensLab_${item.id}.png`, base64Data, { base64: true });
        });
    }

    // 3. Generate Zip
    const content = await zip.generateAsync({ type: "blob" });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = `LensLab_Archive_${Date.now()}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-white overflow-hidden">
      
      {/* Main Canvas Area */}
      <div className="flex-grow flex flex-col relative min-w-0">
        <header className="h-16 flex-shrink-0 flex items-center justify-between px-6 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h1 className="font-bold text-lg tracking-tight">LensLab <span className="text-zinc-500 font-normal">AI</span></h1>
          </div>
          
          {file && (
             <button 
               onClick={handleReset}
               className="text-xs font-medium text-zinc-400 hover:text-white transition-colors"
             >
               NEW PROJECT
             </button>
          )}
        </header>

        <main className="flex-grow relative flex flex-col bg-zinc-950 min-h-0">
          
          {/* Viewer Area */}
          <div className="flex-grow relative flex items-center justify-center p-6 min-h-0">
            {error && (
                <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-2 rounded-lg text-sm">
                {error}
                </div>
            )}

            {!file ? (
                <div className="w-full max-w-xl">
                <h2 className="text-2xl font-bold text-center mb-2">Import Source Image</h2>
                <p className="text-zinc-500 text-center mb-8">Upload a smartphone photo to simulate professional optics.</p>
                <FileUpload onFileSelect={handleFileSelect} />
                </div>
            ) : (
                <div className="relative w-full h-full max-h-full bg-zinc-900/50 rounded-lg border border-zinc-800 overflow-hidden shadow-2xl">
                {generatedImage && originalPreview ? (
                    <ComparisonSlider 
                    beforeImage={originalPreview} 
                    afterImage={generatedImage} 
                    />
                ) : (
                    originalPreview && (
                    <img 
                        src={originalPreview} 
                        alt="Original" 
                        className="w-full h-full object-contain"
                    />
                    )
                )}
                
                {/* Pipeline Overlay */}
                {isProcessing && <PipelineViewer steps={steps} />}
                </div>
            )}
          </div>
          
          {/* History Panel (Filmstrip) */}
          {file && history.length > 0 && (
            <HistoryPanel 
              items={history}
              currentId={currentHistoryId}
              onSelect={handleSelectHistory}
              onDownloadOne={handleDownloadOne}
              onDownloadAll={handleDownloadAll}
            />
          )}

        </main>
      </div>

      {/* Sidebar Controls */}
      <div className="w-80 flex-shrink-0 z-20 shadow-xl shadow-black/50 border-l border-zinc-800 bg-zinc-900">
        <ControlPanel 
          params={params} 
          setParams={setParams} 
          isProcessing={isProcessing}
          onGenerate={handleGenerate}
        />
      </div>
    </div>
  );
}

export default App;