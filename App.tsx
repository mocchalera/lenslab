import React, { useState, useEffect, useMemo } from 'react';
import JSZip from 'jszip';
import FileUpload from './components/FileUpload';
import ControlPanel from './components/ControlPanel';
import ComparisonSlider from './components/ComparisonSlider';
import PipelineViewer from './components/PipelineViewer';
import HistoryPanel from './components/HistoryPanel';
import { CameraBody, LensModel, Aperture, ExposureCompensation, LightingCondition, SceneContext, ClothingOption, PoseOption, OutputProfile, ImageAspect, ImageQuality, SimulationParams, ProcessingStep, HistoryItem } from './types';
import { generateSimulationWithProvider, ImageProviderError, ImageProviderId } from './services/imageProvider';
import { buildSimulationPrompt } from './services/simulationPrompt';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import type { Language, StringKey } from './i18n/strings';

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
  aspect: ImageAspect.AUTO,
  quality: ImageQuality.MEDIUM,
  fidelity: 90
};

const STEP_LABEL_KEYS: Array<{ id: string; labelKey: StringKey }> = [
  { id: '1', labelKey: 'pipelineAnalyze' },
  { id: '2', labelKey: 'pipelineLock' },
  { id: '3', labelKey: 'pipelineLens' },
  { id: '4', labelKey: 'pipelineDevelop' },
];

const makeInitialSteps = (t: (key: StringKey) => string): ProcessingStep[] => (
  STEP_LABEL_KEYS.map((step) => ({
    id: step.id,
    label: t(step.labelKey),
    status: 'pending',
  }))
);

const getLocalizedErrorMessage = (error: unknown, t: (key: StringKey) => string, language: Language): string => {
  if (error instanceof ImageProviderError) {
    const suffix = language === 'ja' ? `（${error.code}）` : ` (${error.code})`;
    switch (error.code) {
      case 'missing_api_key':
        return `${t('errorMissingApiKey')}${suffix}`;
      case 'bad_request':
        return `${t('errorBadRequest')}${suffix}`;
      case 'auth':
        return `${t('errorAuth')}${suffix}`;
      case 'rate_limited':
        return `${t('errorRateLimited')}${suffix}`;
      case 'moderation':
        return `${t('errorModeration')}${suffix}`;
      case 'no_image':
        return `${t('errorNoImage')}${suffix}`;
      case 'network':
        return `${t('errorNetwork')}${suffix}`;
      case 'method_not_allowed':
        return `${t('errorMethodNotAllowed')}${suffix}`;
      case 'upstream':
        return `${t('errorUpstream')}${suffix}`;
      default:
        return `${t('errorGeneric')}${suffix}`;
    }
  }

  return t('errorFallback');
};

function AppContent() {
  const { language, setLanguage, t } = useLanguage();
  const initialSteps = useMemo(() => makeInitialSteps(t), [t]);
  const [file, setFile] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [params, setParams] = useState<SimulationParams>(DEFAULT_PARAMS);
  const [providerId, setProviderId] = useState<ImageProviderId>('openai');
  const [isProcessing, setIsProcessing] = useState(false);
  const [steps, setSteps] = useState<ProcessingStep[]>(initialSteps);
  const [error, setError] = useState<string | null>(null);
  const [promptCopied, setPromptCopied] = useState(false);
  
  // History State
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentHistoryId, setCurrentHistoryId] = useState<string | null>(null);
  const currentPrompt = useMemo(() => buildSimulationPrompt(params), [params]);

  useEffect(() => {
    setSteps(prev => initialSteps.map((step, index) => ({
      ...step,
      status: prev[index]?.status ?? step.status,
    })));
  }, [initialSteps]);

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

    if (params.scene === SceneContext.CUSTOM_MAP_LOCATION && !params.customLocation) {
      setError(t('errorLocationRequired'));
      return;
    }

    setIsProcessing(true);
    setError(null);
    setPromptCopied(false);
    
    // Reset pipeline UI
    setSteps(initialSteps.map(s => ({ ...s, status: 'pending' })));

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
      
      const result = await generateSimulationWithProvider(providerId, file, params);
      const resultBase64 = result.dataUrl;
      
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
        params: { ...params }, // Snapshot current params
        provider: result.provider || providerId,
        model: result.model,
        latencyMs: result.latencyMs,
        aspect: params.aspect,
        quality: params.quality,
        debugPrompt: result.debugPrompt,
      };
      
      setHistory(prev => [newItem, ...prev]);
      setCurrentHistoryId(newItem.id);

    } catch (err: any) {
      console.error(err);
      setError(getLocalizedErrorMessage(err, t, language));
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
      aspect: item.aspect,
      quality: item.quality,
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

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(currentPrompt);
      setPromptCopied(true);
      window.setTimeout(() => setPromptCopied(false), 1500);
    } catch (copyError) {
      console.error(t('promptCopyFailed'), copyError);
      setPromptCopied(false);
    }
  };

  const nextLanguage = language === 'ja' ? 'en' : 'ja';

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
          
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
              {t('provider')}
              <select
                value={providerId}
                disabled={isProcessing}
                onChange={(event) => setProviderId(event.target.value as ImageProviderId)}
                className="bg-zinc-800 text-zinc-200 text-xs rounded border border-zinc-700 focus:ring-blue-500 focus:border-blue-500 px-2 py-1.5 normal-case tracking-normal"
              >
                <option value="openai">OpenAI (gpt-image-2)</option>
                <option value="gemini">Gemini (nano-banana 2)</option>
              </select>
            </label>

            <button
              type="button"
              onClick={() => setLanguage(nextLanguage)}
              className="rounded border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-200 transition-colors hover:bg-zinc-700"
              aria-label={t('language')}
            >
              {language === 'ja' ? t('languageSwitchToEnglish') : t('languageSwitchToJapanese')}
            </button>

            {file && (
               <button 
                 onClick={handleReset}
                 className="text-xs font-medium text-zinc-400 hover:text-white transition-colors"
               >
                 {t('newProject')}
               </button>
            )}
          </div>
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
                <h2 className="text-2xl font-bold text-center mb-2">{t('uploadTitle')}</h2>
                <p className="text-zinc-500 text-center mb-8">{t('uploadSubtitle')}</p>
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
                        alt={t('sourceImageAlt')}
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

          <div className="flex-shrink-0 border-t border-zinc-800 bg-zinc-900/80 px-6 py-3">
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-xs font-semibold uppercase tracking-wider text-zinc-400 transition-colors hover:text-zinc-200">
                <span>{t('promptSummary')}</span>
                <span className="text-zinc-600 transition-transform group-open:rotate-180">⌄</span>
              </summary>
              <div className="mt-3 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-zinc-500">
                    {t('promptDescription')}
                  </p>
                  <button
                    type="button"
                    onClick={handleCopyPrompt}
                    className="rounded border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-200 transition-colors hover:bg-zinc-700"
                  >
                    {promptCopied ? t('promptCopied') : t('promptCopy')}
                  </button>
                </div>
                <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded border border-zinc-800 bg-zinc-950 p-4 text-xs leading-relaxed text-zinc-300">
                  {currentPrompt}
                </pre>
              </div>
            </details>
          </div>

        </main>
      </div>

      {/* Sidebar Controls */}
      <div className="w-80 flex-shrink-0 z-20 shadow-xl shadow-black/50 border-l border-zinc-800 bg-zinc-900">
        <ControlPanel 
          params={params} 
          setParams={setParams} 
          providerId={providerId}
          isProcessing={isProcessing}
          onGenerate={handleGenerate}
        />
      </div>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
