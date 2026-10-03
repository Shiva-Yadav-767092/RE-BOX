import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, Camera, Sparkles, Check, ArrowRight, ArrowLeft, Clock, 
  AlertTriangle, Wrench, ChevronRight, CheckCircle2, Bookmark, 
  RotateCcw, ShieldAlert, Layers, ExternalLink, HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import CameraModal from '../components/CameraModal';
import { SAMPLE_OBJECTS } from '../data/sampleObjects';
import { analyzeObjectAPI, generateBlueprintAPI, saveProjectAPI } from '../services/api';

export default function WorkspacePage({ preselectedSampleId, onProjectSaved, setActivePage, initialCameraMode = false }) {
  // Stepper state: 1 (Capture), 2 (Understand), 3 (Ideas), 4 (Visualize), 5 (Make), 6 (Save Project)
  const [currentStep, setCurrentStep] = useState(1);
  const [captureMode, setCaptureMode] = useState(initialCameraMode ? 'camera' : 'upload');
  
  // Step 1: Capture state
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageFileName, setImageFileName] = useState('');
  const [objectDescription, setObjectDescription] = useState('');
  const [isCameraOpen, setIsCameraOpen] = useState(initialCameraMode);
  const [dragActive, setDragActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

  // Step 2 & 3: Understand & Ideas state
  const [identifiedObject, setIdentifiedObject] = useState(null);
  const [generatedIdeas, setGeneratedIdeas] = useState([]);
  const [selectedIdea, setSelectedIdea] = useState(null);

  // Step 4 & 5: Visualize & Make Blueprint state
  const [blueprint, setBlueprint] = useState(null);
  const [isLoadingBlueprint, setIsLoadingBlueprint] = useState(false);
  const [materialsChecked, setMaterialsChecked] = useState({});
  const [stepsCompleted, setStepsCompleted] = useState({});

  // Step 6: Save Project state
  const [projectNotes, setProjectNotes] = useState('');
  const [projectStatus, setProjectStatus] = useState('In Progress');
  const [isSaving, setIsSaving] = useState(false);
  const [savedProjectData, setSavedProjectData] = useState(null);

  // Preload sample object if passed from homepage or explore page
  useEffect(() => {
    if (preselectedSampleId) {
      const sample = SAMPLE_OBJECTS.find(s => s.id === preselectedSampleId) || SAMPLE_OBJECTS[0];
      handlePickSample(sample);
    }
  }, [preselectedSampleId]);

  // Handle Drag & Drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    setErrorMessage('');
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload an image file (JPEG, PNG, or WEBP).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('Image size exceeds 10MB. Please use a smaller photo.');
      return;
    }

    setImageFileName(file.name);
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setUploadedImage(uploadEvent.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handlePickSample = (sample) => {
    setUploadedImage(sample.image);
    setImageFileName(`${sample.name}.jpg`);
    setObjectDescription(sample.description);
    setErrorMessage('');
  };

  const handleCameraCapture = (dataUrl) => {
    setUploadedImage(dataUrl);
    setImageFileName('camera_snapshot.jpg');
    setErrorMessage('');
  };

  // Run AI analysis (Step 1 -> Step 2 & 3)
  const handleFindPossibilities = async () => {
    if (!uploadedImage && (!objectDescription || objectDescription.trim().length === 0)) {
      setErrorMessage("Please upload an image or provide a short description of your object.");
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage('');

    try {
      const response = await analyzeObjectAPI({
        imageBase64: uploadedImage,
        description: objectDescription,
        fileName: imageFileName
      });

      if (!response || !response.identifiedObject) {
        throw new Error("We couldn't understand this object. Try uploading a clearer photo.");
      }

      setIdentifiedObject(response.identifiedObject);
      setGeneratedIdeas(response.ideas || []);
      
      // Auto-select first idea as default for smooth continuity
      if (response.ideas && response.ideas.length > 0) {
        setSelectedIdea(response.ideas[0]);
      }

      // Advance to Step 2
      setCurrentStep(2);
    } catch (err) {
      console.error('Analysis error:', err);
      setErrorMessage(err.message || "We couldn't understand this object. Try uploading a clearer photo.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Advance from Step 2 (Understand) to Step 3 (Ideas)
  const handleProceedToIdeas = () => {
    setCurrentStep(3);
  };

  // Select idea & advance to Step 4 (Visualize)
  const handleSelectIdeaToVisualize = (idea) => {
    setSelectedIdea(idea);
    setCurrentStep(4);
  };

  // Advance from Step 4 (Visualize) to Step 5 (Make)
  const handleChooseThisDesign = async () => {
    if (!selectedIdea) return;
    setIsLoadingBlueprint(true);
    try {
      const blueprintData = await generateBlueprintAPI({
        ideaId: selectedIdea.id,
        objectName: identifiedObject?.name || selectedIdea.name,
        material: identifiedObject?.material
      });

      setBlueprint(blueprintData);
      
      // Initialize checklist state
      const initialMat = {};
      (blueprintData.materialsNeeded || []).forEach((_, idx) => {
        initialMat[idx] = false;
      });
      setMaterialsChecked(initialMat);

      const initialSteps = {};
      (blueprintData.steps || []).forEach((s, idx) => {
        initialSteps[idx] = s.completed || false;
      });
      setStepsCompleted(initialSteps);

      setCurrentStep(5);
    } catch (err) {
      console.error('Error fetching blueprint:', err);
      alert('Unable to load project guide. Please try again.');
    } finally {
      setIsLoadingBlueprint(false);
    }
  };

  // Toggle step completion in Step 5
  const toggleStepCompleted = (idx) => {
    const updated = { ...stepsCompleted, [idx]: !stepsCompleted[idx] };
    setStepsCompleted(updated);

    // If all steps completed, automatically celebrate!
    const total = blueprint?.steps?.length || 0;
    const completedCount = Object.values(updated).filter(Boolean).length;
    if (completedCount === total && total > 0) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      setProjectStatus('Completed');
    }
  };

  // Toggle material checked
  const toggleMaterialChecked = (idx) => {
    setMaterialsChecked(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Step 6: Save Project
  const handleSaveProject = async () => {
    if (!blueprint || !selectedIdea) return;
    setIsSaving(true);
    try {
      const totalSteps = blueprint.steps?.length || 0;
      const completedStepsArr = blueprint.steps.map((s, idx) => ({
        ...s,
        completed: Boolean(stepsCompleted[idx])
      }));
      const completedCount = completedStepsArr.filter(s => s.completed).length;

      const projectPayload = {
        originalObject: identifiedObject?.name || "Household Object",
        material: identifiedObject?.material || "Reusable Material",
        condition: identifiedObject?.condition || "Reusable",
        newProduct: selectedIdea.name,
        tagline: selectedIdea.tagline,
        difficulty: selectedIdea.difficulty,
        estimatedTime: selectedIdea.estimatedTime,
        status: completedCount === totalSteps && totalSteps > 0 ? 'Completed' : projectStatus,
        imageBefore: uploadedImage,
        imageAfter: selectedIdea.image,
        materialsNeeded: blueprint.materialsNeeded || selectedIdea.materials || [],
        safetyNotes: blueprint.safetyNotes || selectedIdea.safetyNotes || [],
        steps: completedStepsArr,
        completedStepsCount: completedCount,
        totalStepsCount: totalSteps,
        userNotes: projectNotes.trim()
      };

      const saved = await saveProjectAPI(projectPayload);
      setSavedProjectData(saved);
      if (onProjectSaved) onProjectSaved(saved);

      // Trigger celebratory confetti
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });

      setCurrentStep(6);
    } catch (err) {
      console.error('Error saving project:', err);
      alert('Could not save project. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Reset workspace to start over with a fresh object
  const handleStartFresh = () => {
    setCurrentStep(1);
    setUploadedImage(null);
    setImageFileName('');
    setObjectDescription('');
    setIdentifiedObject(null);
    setGeneratedIdeas([]);
    setSelectedIdea(null);
    setBlueprint(null);
    setMaterialsChecked({});
    setStepsCompleted({});
    setProjectNotes('');
    setProjectStatus('In Progress');
    setSavedProjectData(null);
  };

  // Stepper Header navigation items
  const stepLabels = [
    { num: 1, label: "Capture" },
    { num: 2, label: "Understand" },
    { num: 3, label: "Ideas" },
    { num: 4, label: "Visualize" },
    { num: 5, label: "Make" },
    { num: 6, label: "Save Project" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      
      {/* WORKSPACE STEPPER PROGRESS BAR */}
      <div className="bg-background-surface border border-charcoal-border rounded-xl p-3.5 shadow-subtle">
        <div className="flex items-center justify-between overflow-x-auto scrollbar-none py-1">
          {stepLabels.map((s, idx) => {
            const isCompleted = currentStep > s.num;
            const isCurrent = currentStep === s.num;
            return (
              <React.Fragment key={s.num}>
                <button
                  type="button"
                  disabled={s.num > currentStep}
                  onClick={() => s.num < currentStep && setCurrentStep(s.num)}
                  className={`flex items-center gap-1.5 whitespace-nowrap text-xs font-medium px-2 py-1 rounded transition-colors ${
                    isCurrent
                      ? 'bg-charcoal text-white font-semibold'
                      : isCompleted
                      ? 'text-accent hover:bg-background-warm cursor-pointer'
                      : 'text-charcoal-subtle opacity-50 cursor-not-allowed'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono ${
                    isCurrent ? 'bg-white text-charcoal' : isCompleted ? 'bg-accent text-white' : 'bg-charcoal-border text-charcoal-muted'
                  }`}>
                    {isCompleted ? <Check className="w-2.5 h-2.5" /> : s.num}
                  </span>
                  <span>{s.label}</span>
                </button>
                {idx < stepLabels.length - 1 && (
                  <ChevronRight className="w-3.5 h-3.5 text-charcoal-border flex-shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ============================================================== */}
      {/* STEP 1 — CAPTURE                                              */}
      {/* ============================================================== */}
      {currentStep === 1 && (
        <div className="bg-background-surface border border-charcoal-border rounded-xl p-6 sm:p-8 shadow-card space-y-6">
          
          <div className="space-y-1">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-accent">
              Step 1 of 6
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-charcoal tracking-tight">
              What are you giving a second life?
            </h2>
            <p className="text-sm text-charcoal-muted">
              Upload a clear photo of your unwanted item, drag and drop, or select a demo sample below.
            </p>
          </div>

          {/* Error Message if present */}
          {errorMessage && (
            <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-semibold">Notice:</span>
                <span> {errorMessage}</span>
              </div>
            </div>
          )}

          {/* Capture Method Tabs (Camera, Upload, Samples) */}
          <div className="flex items-center gap-2 p-1.5 bg-background-warm rounded-lg border border-charcoal-border">
            <button
              type="button"
              onClick={() => {
                setCaptureMode('camera');
                setIsCameraOpen(true);
              }}
              className={`flex-1 py-2 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                captureMode === 'camera'
                  ? 'bg-accent text-white shadow-subtle'
                  : 'text-charcoal hover:bg-white'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>📸 Use Device Camera</span>
            </button>

            <button
              type="button"
              onClick={() => setCaptureMode('upload')}
              className={`flex-1 py-2 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                captureMode === 'upload'
                  ? 'bg-charcoal text-white shadow-subtle'
                  : 'text-charcoal hover:bg-white'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>📁 Upload / Drop Photo</span>
            </button>

            <button
              type="button"
              onClick={() => setCaptureMode('samples')}
              className={`flex-1 py-2 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                captureMode === 'samples'
                  ? 'bg-charcoal text-white shadow-subtle'
                  : 'text-charcoal hover:bg-white'
              }`}
            >
              <Sparkles className="w-4 h-4 text-accent" />
              <span>✨ 1-Click Samples</span>
            </button>
          </div>

          {/* Dedicated Camera Trigger Banner if Camera Mode Selected */}
          {captureMode === 'camera' && !uploadedImage && (
            <div className="p-6 bg-accent-light/60 border-2 border-accent border-dashed rounded-xl text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center mx-auto shadow-subtle">
                <Camera className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-charcoal">Live Camera Access Ready</h3>
                <p className="text-xs text-charcoal-muted">
                  Use your phone camera or webcam to take a live snapshot of any unwanted object.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCameraOpen(true)}
                className="px-5 py-2.5 bg-accent hover:bg-accent-hover text-white text-xs font-semibold rounded-md shadow-card inline-flex items-center gap-2 active:scale-95 transition-all"
              >
                <Camera className="w-4 h-4" />
                <span>Open Camera Viewfinder & Snap</span>
              </button>
            </div>
          )}

          {/* Upload Dropzone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center transition-all ${
              dragActive 
                ? 'border-accent bg-accent-light/50' 
                : uploadedImage 
                ? 'border-charcoal-border bg-background-warm/30' 
                : 'border-charcoal-border hover:border-charcoal-subtle bg-background-warm/50'
            }`}
          >
            {uploadedImage ? (
              <div className="space-y-4">
                <div className="relative max-w-xs mx-auto aspect-square rounded-lg overflow-hidden border border-charcoal-border bg-charcoal-deep shadow-subtle">
                  <img
                    src={uploadedImage}
                    alt="Uploaded item"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 right-2 bg-charcoal/80 backdrop-blur-sm text-white px-2 py-1 rounded text-[11px] truncate">
                    {imageFileName || 'Selected Object'}
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 border border-charcoal-border bg-white rounded-md text-xs font-medium text-charcoal hover:bg-background-warm"
                  >
                    Change Photo
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUploadedImage(null);
                      setImageFileName('');
                    }}
                    className="px-3 py-1.5 text-xs text-charcoal-muted hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-background-surface border border-charcoal-border flex items-center justify-center mx-auto text-charcoal-muted">
                  <Upload className="w-6 h-6 text-accent" />
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-charcoal">
                    Drag and drop your photo here, or browse
                  </p>
                  <p className="text-xs text-charcoal-muted">
                    Supports JPG, PNG, WEBP up to 10MB
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-charcoal hover:bg-charcoal-deep text-white text-xs font-medium rounded-md shadow-subtle"
                  >
                    Choose Photo File
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCameraOpen(true)}
                    className="px-4 py-2 border border-charcoal-border bg-white hover:bg-background-warm text-charcoal text-xs font-medium rounded-md shadow-subtle flex items-center gap-1.5"
                  >
                    <Camera className="w-3.5 h-3.5 text-accent" />
                    <span>Take a Photo</span>
                  </button>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Optional Object Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-charcoal">
              Optional Object Description
            </label>
            <input
              type="text"
              value={objectDescription}
              onChange={(e) => setObjectDescription(e.target.value)}
              placeholder="e.g., An empty 1 litre plastic bottle"
              className="w-full px-3.5 py-2.5 rounded-md border border-charcoal-border bg-background-warm/40 text-charcoal placeholder:text-charcoal-subtle text-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
            />
            <p className="text-[11px] text-charcoal-muted">
              Add details like size, bottle neck diameter, or brand if you'd like more tailored suggestions.
            </p>
          </div>

          {/* Quick 1-Click Demo Objects */}
          <div className="pt-2 border-t border-charcoal-borderLight space-y-2">
            <span className="text-[11px] font-semibold text-charcoal-subtle uppercase tracking-wider block">
              Or Try with an Everyday Sample Object:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SAMPLE_OBJECTS.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => handlePickSample(sample)}
                  className={`p-2.5 rounded-lg border text-left flex items-center gap-2.5 transition-all ${
                    imageFileName.includes(sample.name)
                      ? 'border-accent bg-accent-light'
                      : 'border-charcoal-border bg-white hover:border-charcoal-subtle'
                  }`}
                >
                  <img
                    src={sample.image}
                    alt={sample.name}
                    className="w-9 h-9 rounded object-cover flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-charcoal truncate">
                      {sample.name}
                    </p>
                    <p className="text-[10px] text-charcoal-muted truncate">
                      {sample.material}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* CTA: Find Possibilities */}
          <div className="pt-4 flex justify-end">
            <button
              type="button"
              disabled={isAnalyzing || (!uploadedImage && !objectDescription.trim())}
              onClick={handleFindPossibilities}
              className="w-full sm:w-auto px-6 py-3 bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-md shadow-subtle transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Analyzing Object Potential...</span>
                </>
              ) : (
                <>
                  <span>Find Possibilities</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* STEP 2 — UNDERSTAND                                           */}
      {/* ============================================================== */}
      {currentStep === 2 && identifiedObject && (
        <div className="bg-background-surface border border-charcoal-border rounded-xl p-6 sm:p-8 shadow-card space-y-6">
          
          <div className="space-y-1">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-accent">
              Step 2 of 6
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-charcoal tracking-tight">
              Object Recognized
            </h2>
            <p className="text-sm text-charcoal-muted">
              Here is what RE:BOX understood about your uploaded item.
            </p>
          </div>

          {/* Object Analysis Card */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-5 rounded-xl bg-background-warm border border-charcoal-border">
            
            {/* Left: Uploaded Photo */}
            <div className="md:col-span-5">
              <div className="aspect-square rounded-lg overflow-hidden border border-charcoal-border bg-charcoal shadow-subtle">
                <img
                  src={uploadedImage}
                  alt={identifiedObject.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right: Detected Specs */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <span className="text-[11px] font-mono uppercase text-charcoal-subtle font-semibold tracking-wider">
                  Identified Item
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-charcoal mt-0.5">
                  {identifiedObject.name}
                </h3>
              </div>

              <div className="space-y-2 border-t border-b border-charcoal-borderLight py-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-charcoal-muted">Material:</span>
                  <span className="font-semibold text-charcoal">{identifiedObject.material}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-charcoal-muted">Condition:</span>
                  <span className="font-semibold text-accent-dark bg-accent-light px-2 py-0.5 rounded">
                    {identifiedObject.condition}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-charcoal-muted">CO₂ Avoidance Potential:</span>
                  <span className="font-mono font-medium text-charcoal">
                    {identifiedObject.co2SavingsPotential || '0.8 kg CO₂'}
                  </span>
                </div>
              </div>

              {/* Structural Properties */}
              {identifiedObject.properties && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-charcoal-muted uppercase tracking-wider block">
                    Structural Characteristics:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {identifiedObject.properties.map((prop, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 rounded bg-white border border-charcoal-border text-[11px] text-charcoal font-medium"
                      >
                        {prop}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 text-xs text-charcoal-muted italic">
                “Here are some things this object could become.”
              </div>
            </div>

          </div>

          {/* Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2 border border-charcoal-border bg-white hover:bg-background-warm text-charcoal text-xs font-medium rounded-md"
            >
              Back to Capture
            </button>
            <button
              type="button"
              onClick={handleProceedToIdeas}
              className="px-6 py-2.5 bg-accent hover:bg-accent-hover text-white text-xs font-semibold rounded-md shadow-subtle flex items-center gap-1.5"
            >
              <span>Explore Reuse Ideas</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* STEP 3 — IDEAS                                                */}
      {/* ============================================================== */}
      {currentStep === 3 && (
        <div className="bg-background-surface border border-charcoal-border rounded-xl p-6 sm:p-8 shadow-card space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-charcoal-borderLight pb-4">
            <div>
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-accent">
                Step 3 of 6
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-charcoal tracking-tight">
                Practical Reuse Ideas
              </h2>
              <p className="text-sm text-charcoal-muted mt-0.5">
                Calculated for: <strong className="text-charcoal">{identifiedObject?.name}</strong> ({identifiedObject?.material})
              </p>
            </div>
            
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="text-xs text-charcoal-muted hover:text-charcoal self-start sm:self-auto flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to specs</span>
            </button>
          </div>

          {/* Ideas Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {generatedIdeas.map((idea, idx) => {
              const isSelected = selectedIdea?.id === idea.id;
              return (
                <div
                  key={idea.id || idx}
                  className={`rounded-xl border transition-all flex flex-col justify-between overflow-hidden shadow-subtle ${
                    isSelected
                      ? 'border-accent ring-2 ring-accent/30 bg-background-surface'
                      : 'border-charcoal-border bg-background-surface hover:border-charcoal-subtle'
                  }`}
                >
                  <div>
                    {/* Concept Image */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-charcoal-deep">
                      <img
                        src={idea.image}
                        alt={idea.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-charcoal/80 backdrop-blur-sm text-white">
                          {idea.difficulty}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 space-y-2.5">
                      <div className="space-y-0.5">
                        <h4 className="font-bold text-base text-charcoal tracking-tight">
                          {idea.name}
                        </h4>
                        <p className="text-xs text-accent font-medium">
                          {idea.tagline}
                        </p>
                      </div>

                      <p className="text-xs text-charcoal-muted leading-relaxed line-clamp-3">
                        {idea.description}
                      </p>

                      <div className="pt-2 border-t border-charcoal-borderLight space-y-1.5 text-[11px] text-charcoal-muted">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-charcoal-subtle" />
                            Estimated Time:
                          </span>
                          <span className="font-medium text-charcoal">{idea.estimatedTime}</span>
                        </div>

                        <div>
                          <span className="font-semibold text-charcoal block mb-1">
                            Required Materials:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {(idea.materials || []).slice(0, 3).map((mat, mIdx) => (
                              <span
                                key={mIdx}
                                className="px-1.5 py-0.5 rounded bg-background-warm text-[10px] text-charcoal border border-charcoal-borderLight"
                              >
                                {mat}
                              </span>
                            ))}
                            {(idea.materials || []).length > 3 && (
                              <span className="px-1 py-0.5 text-[10px] text-charcoal-subtle">
                                +{(idea.materials || []).length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Action */}
                  <div className="p-4 pt-0">
                    <button
                      type="button"
                      onClick={() => handleSelectIdeaToVisualize(idea)}
                      className={`w-full py-2 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                        isSelected
                          ? 'bg-accent text-white hover:bg-accent-hover'
                          : 'bg-background-warm hover:bg-charcoal hover:text-white text-charcoal border border-charcoal-border'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Visualize</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* STEP 4 — VISUALIZE                                            */}
      {/* ============================================================== */}
      {currentStep === 4 && selectedIdea && (
        <div className="bg-background-surface border border-charcoal-border rounded-xl p-6 sm:p-8 shadow-card space-y-6">
          
          <div className="space-y-1">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-accent">
              Step 4 of 6
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-charcoal tracking-tight">
              See What Your Object Could Become
            </h2>
            <p className="text-sm text-charcoal-muted">
              Inspect the transformation from your original item to its new identity.
            </p>
          </div>

          {/* Transformation Stage Visualizer */}
          <div className="p-5 rounded-xl bg-background-warm border border-charcoal-border space-y-6">
            
            {/* Header Titles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-white rounded-lg border border-charcoal-borderLight shadow-subtle">
                <span className="text-[11px] font-mono uppercase text-charcoal-subtle font-semibold tracking-wider">
                  ORIGINAL OBJECT
                </span>
                <p className="text-base font-bold text-charcoal mt-0.5">
                  {identifiedObject?.name || "Original Household Item"}
                </p>
                <p className="text-xs text-charcoal-muted">
                  Material: {identifiedObject?.material || "Recyclable Item"}
                </p>
              </div>

              <div className="p-3 bg-white rounded-lg border border-accent/40 shadow-subtle">
                <span className="text-[11px] font-mono uppercase text-accent font-semibold tracking-wider">
                  NEW IDENTITY
                </span>
                <p className="text-base font-bold text-charcoal mt-0.5">
                  {selectedIdea.name}
                </p>
                <p className="text-xs text-accent-dark font-medium">
                  {selectedIdea.tagline}
                </p>
              </div>
            </div>

            {/* Interactive Before/After Split Slider */}
            <div>
              <BeforeAfterSlider
                beforeImage={uploadedImage}
                afterImage={selectedIdea.image}
                beforeLabel={`Original: ${identifiedObject?.name || "Item"}`}
                afterLabel={`Identity: ${selectedIdea.name}`}
                beforeSub="Everyday Unwanted Object"
                afterSub="Ready-to-Build Design"
                aspectRatio="aspect-[16/10]"
              />
            </div>

            {/* Design Notes */}
            <div className="bg-white p-4 rounded-lg border border-charcoal-borderLight space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-charcoal">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                <span>Transformation Rationale & Method:</span>
              </div>
              <p className="text-charcoal-muted leading-relaxed">
                {selectedIdea.description}
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2 text-[11px] text-charcoal-subtle border-t border-charcoal-borderLight">
                <span><strong>Difficulty:</strong> {selectedIdea.difficulty}</span>
                <span>•</span>
                <span><strong>Build Time:</strong> {selectedIdea.estimatedTime}</span>
                <span>•</span>
                <span><strong>Integrity:</strong> High structural durability</span>
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="w-full sm:w-auto px-4 py-2.5 border border-charcoal-border bg-white hover:bg-background-warm text-charcoal text-xs font-semibold rounded-md"
            >
              Try Another Idea
            </button>

            <button
              type="button"
              disabled={isLoadingBlueprint}
              onClick={handleChooseThisDesign}
              className="w-full sm:w-auto px-6 py-2.5 bg-accent hover:bg-accent-hover text-white text-xs font-semibold rounded-md shadow-subtle flex items-center justify-center gap-2 active:scale-95"
            >
              {isLoadingBlueprint ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Generating Step-by-Step Blueprint...</span>
                </>
              ) : (
                <>
                  <span>Choose This Design & Make</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* STEP 5 — MAKE                                                 */}
      {/* ============================================================== */}
      {currentStep === 5 && blueprint && (
        <div className="bg-background-surface border border-charcoal-border rounded-xl p-6 sm:p-8 shadow-card space-y-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-charcoal-borderLight pb-4">
            <div>
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-accent">
                Step 5 of 6 — Project Blueprint
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-charcoal tracking-tight uppercase">
                MAKE YOUR {blueprint.name}
              </h2>
              <p className="text-sm text-charcoal-muted mt-0.5">
                Upcycling from <span className="font-semibold text-charcoal">{blueprint.originalObject}</span> ({blueprint.material})
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs px-2.5 py-1 rounded bg-background-warm border border-charcoal-border font-medium text-charcoal flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-accent" />
                {blueprint.estimatedTime}
              </span>
              <span className="text-xs px-2.5 py-1 rounded bg-accent-light border border-accent-border font-semibold text-accent-dark">
                {blueprint.difficulty}
              </span>
            </div>
          </div>

          {/* What You'll Need (Checklist) */}
          <div className="bg-background-warm rounded-xl p-5 border border-charcoal-border space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-charcoal uppercase tracking-wider flex items-center gap-2">
                <Wrench className="w-4 h-4 text-accent" />
                <span>What you'll need:</span>
              </h3>
              <span className="text-[11px] text-charcoal-muted">
                Check items as you gather them
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(blueprint.materialsNeeded || []).map((mat, idx) => {
                const isChecked = Boolean(materialsChecked[idx]);
                return (
                  <label
                    key={idx}
                    className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                      isChecked
                        ? 'bg-accent-light/40 border-accent/40 text-charcoal line-through opacity-75'
                        : 'bg-white border-charcoal-borderLight text-charcoal hover:border-charcoal-subtle'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleMaterialChecked(idx)}
                      className="rounded border-charcoal-border text-accent focus:ring-accent w-4 h-4"
                    />
                    <span className="select-none font-medium">{mat}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Safety Notes Alert */}
          {blueprint.safetyNotes && blueprint.safetyNotes.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px] text-amber-950">
                <ShieldAlert className="w-4 h-4 text-amber-700" />
                <span>Safety Notes & Precautions</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-amber-900">
                {blueprint.safetyNotes.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Step-by-Step Instructions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-charcoal-borderLight pb-2">
              <h3 className="text-base font-bold text-charcoal tracking-tight">
                Step-by-Step Instructions
              </h3>
              <span className="text-xs text-charcoal-muted font-mono">
                {Object.values(stepsCompleted).filter(Boolean).length} of {blueprint.steps?.length || 0} completed
              </span>
            </div>

            <div className="space-y-3">
              {(blueprint.steps || []).map((s, idx) => {
                const isDone = Boolean(stepsCompleted[idx]);
                return (
                  <div
                    key={idx}
                    onClick={() => toggleStepCompleted(idx)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isDone
                        ? 'bg-accent-light/30 border-accent/40 text-charcoal'
                        : 'bg-white border-charcoal-border hover:border-charcoal-subtle shadow-subtle'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-mono font-bold transition-colors ${
                        isDone ? 'bg-accent text-white' : 'bg-charcoal text-white'
                      }`}>
                        {isDone ? <Check className="w-4 h-4" /> : s.step}
                      </div>

                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-sm font-bold ${isDone ? 'text-accent-dark line-through' : 'text-charcoal'}`}>
                            {s.title}
                          </h4>
                          <span className={`text-[11px] font-medium ${isDone ? 'text-accent' : 'text-charcoal-subtle'}`}>
                            {isDone ? 'Done' : 'Click to complete'}
                          </span>
                        </div>
                        <p className={`text-xs leading-relaxed ${isDone ? 'text-charcoal-muted line-through' : 'text-charcoal-muted'}`}>
                          {s.text}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Save / Proceed Controls */}
          <div className="pt-4 border-t border-charcoal-borderLight flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="w-full sm:w-auto px-4 py-2 border border-charcoal-border bg-white hover:bg-background-warm text-charcoal text-xs font-semibold rounded-md"
            >
              Back to Visualizer
            </button>

            <button
              type="button"
              onClick={handleSaveProject}
              className="w-full sm:w-auto px-6 py-2.5 bg-accent hover:bg-accent-hover text-white text-xs font-semibold rounded-md shadow-subtle flex items-center justify-center gap-2"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Save to My Projects</span>
            </button>
          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* STEP 6 — SAVE PROJECT & CONFIRMATION                          */}
      {/* ============================================================== */}
      {currentStep === 6 && (
        <div className="bg-background-surface border border-charcoal-border rounded-xl p-6 sm:p-8 shadow-card space-y-6">
          
          <div className="text-center space-y-2 py-4">
            <div className="w-12 h-12 rounded-full bg-accent-light text-accent flex items-center justify-center mx-auto shadow-subtle">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-accent">
              Step 6 of 6 — Complete
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-charcoal tracking-tight">
              Project Saved to Your Portfolio
            </h2>
            <p className="text-sm text-charcoal-muted max-w-md mx-auto">
              Your creative reuse blueprint is preserved. Track its build status, update notes, or start another object anytime.
            </p>
          </div>

          {/* Project Summary Card */}
          <div className="bg-background-warm border border-charcoal-border rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-charcoal-borderLight pb-3">
              <div>
                <span className="text-[11px] font-mono uppercase text-charcoal-subtle font-semibold">
                  Saved Transformation
                </span>
                <h3 className="text-lg font-bold text-charcoal">
                  {identifiedObject?.name} → {selectedIdea?.name}
                </h3>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-charcoal-muted">Status:</span>
                <select
                  value={projectStatus}
                  onChange={(e) => setProjectStatus(e.target.value)}
                  className="px-2.5 py-1 text-xs font-semibold rounded border border-charcoal-border bg-white text-charcoal focus:outline-none focus:ring-1 focus:ring-accent"
                >
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Side-by-Side Thumbnails */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-semibold text-charcoal-subtle">Original</span>
                <div className="aspect-[4/3] rounded-lg overflow-hidden border border-charcoal-border bg-charcoal">
                  <img src={uploadedImage} alt="Original" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-semibold text-accent">New Identity</span>
                <div className="aspect-[4/3] rounded-lg overflow-hidden border border-charcoal-border bg-charcoal">
                  <img src={selectedIdea?.image} alt="New product" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            {/* Custom Notes */}
            <div className="space-y-1.5 pt-2">
              <label className="block text-xs font-semibold text-charcoal">
                Project Notes or Reflections:
              </label>
              <textarea
                rows={2}
                value={projectNotes}
                onChange={(e) => setProjectNotes(e.target.value)}
                placeholder="Where did you place it? Any tweaks you made to the instructions?"
                className="w-full px-3 py-2 text-xs rounded-md border border-charcoal-border bg-white text-charcoal placeholder:text-charcoal-subtle focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setActivePage('projects')}
              className="w-full sm:w-auto px-5 py-2.5 bg-charcoal hover:bg-charcoal-deep text-white text-xs font-semibold rounded-md shadow-subtle flex items-center justify-center gap-1.5"
            >
              <span>View in My Projects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={handleStartFresh}
              className="w-full sm:w-auto px-5 py-2.5 border border-charcoal-border bg-white hover:bg-background-warm text-charcoal text-xs font-semibold rounded-md flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5 text-accent" />
              <span>Give Another Object New Life</span>
            </button>
          </div>

        </div>
      )}

      {/* Live Camera Modal */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
      />

    </div>
  );
}
