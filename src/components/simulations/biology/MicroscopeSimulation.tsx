import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  RotateCcw, 
  Award, 
  CheckCircle2, 
  Download, 
  Sliders, 
  Crosshair, 
  Info,
  Dna
} from 'lucide-react';
import { SIMULATIONS_REGISTRY } from '../../../data/simulationsRegistry';
import { SimulationLogEntry } from '../../../types/simulation';

interface MicroscopeSimulationProps {
  onBack: () => void;
}

export const MicroscopeSimulation: React.FC<MicroscopeSimulationProps> = ({ onBack }) => {
  const metadata = SIMULATIONS_REGISTRY['bio-microscope'];

  // State parameters
  const [objectivePower, setObjectivePower] = useState<number>(10); // 4x, 10x, 40x
  const [focalZ, setFocalZ] = useState<number>(50); // 0 to 100
  const [illumination, setIllumination] = useState<number>(75); // %
  const [specimenType, setSpecimenType] = useState<'onion' | 'cheek'>('onion');
  const [showGraticule, setShowGraticule] = useState<boolean>(true);
  const [selectedOrganelle, setSelectedOrganelle] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState<'explore' | 'predict' | 'challenge' | 'log'>('explore');

  // Challenge & Logs
  const [challengeSuccess, setChallengeSuccess] = useState<boolean>(false);
  const [experimentLogs, setExperimentLogs] = useState<SimulationLogEntry[]>([]);
  const [predictionAnswer, setPredictionAnswer] = useState<string | null>(null);
  const [predictionFeedback, setPredictionFeedback] = useState<string | null>(null);

  // Calculations:
  // Eyepiece is fixed at 10x
  const totalMagnification = 10 * objectivePower;

  // Optical sharpness calculation based on objective depth of field:
  // For 4x: wide depth of field tolerance (tol = 25)
  // For 10x: moderate depth of field (tol = 10)
  // For 40x: micro depth of field (tol = 2.5), optimum at Z = 52.0
  const optimalZ = 52.0;
  const toleranceZ = objectivePower === 4 ? 24 : objectivePower === 10 ? 10 : 3;
  const deviation = Math.abs(focalZ - optimalZ);
  const blurAmount = Math.max(0, (deviation - toleranceZ * 0.2) * (objectivePower / 5));
  const sharpnessPct = Math.max(10, Math.min(100, Math.round(100 - blurAmount * 8)));

  // Field of view in micrometers:
  // At 40x: 4500 μm
  // At 100x: 1800 μm
  // At 400x: 450 μm
  const fovUm = Math.round(180000 / totalMagnification);

  // Challenge evaluation
  useEffect(() => {
    if (activeMode === 'challenge') {
      if (objectivePower === 40 && sharpnessPct >= 95) {
        setChallengeSuccess(true);
      } else {
        setChallengeSuccess(false);
      }
    }
  }, [objectivePower, sharpnessPct, activeMode]);

  const handleLogData = () => {
    const newEntry: SimulationLogEntry = {
      id: `bio-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      parameters: {
        'Objective Lens': `${objectivePower}x`,
        'Specimen': specimenType === 'onion' ? 'Plant Onion Epidermis' : 'Animal Cheek Epithelium',
      },
      measurements: {
        'Total Magnification': `${totalMagnification}x`,
        'Sharpness': `${sharpnessPct}%`,
        'Field of View (μm)': fovUm,
      },
      notes: `Focus Z = ${focalZ}`
    };
    setExperimentLogs([newEntry, ...experimentLogs]);
  };

  const handleExportCSV = () => {
    if (experimentLogs.length === 0) return;
    const headers = ['Timestamp', 'Objective', 'Specimen', 'Total Mag', 'Sharpness (%)', 'FOV (μm)', 'Focus Z'];
    const rows = experimentLogs.map(l => [
      l.timestamp,
      l.parameters['Objective Lens'],
      l.parameters['Specimen'],
      l.measurements['Total Magnification'],
      l.measurements['Sharpness'],
      l.measurements['Field of View (μm)'],
      l.notes
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `IGCSE_Microscopy_Lab_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Simulation Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="text-xs font-semibold text-slate-400 hover:text-white px-2.5 py-1 rounded bg-slate-800 border border-slate-700 transition-colors"
            >
              ← Units
            </button>
            <span className="font-mono text-xs text-lime-400 bg-lime-950/60 px-2 py-0.5 rounded border border-lime-500/30">
              CAIE 0610.2.1.1
            </span>
            <h1 className="text-base sm:text-lg font-bold text-white">
              Virtual Optical Microscope & Cell Cytology
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Compound lens optics, focal depth, graticule measurement, and plant vs animal cell comparison.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 self-stretch sm:self-auto overflow-x-auto">
          <button
            onClick={() => setActiveMode('explore')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeMode === 'explore'
                ? 'bg-lime-500 text-white shadow-md shadow-lime-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Explore Lab
          </button>
          <button
            onClick={() => setActiveMode('predict')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeMode === 'predict'
                ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Predict & Test
          </button>
          <button
            onClick={() => setActiveMode('challenge')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeMode === 'challenge'
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            High-Power Focus Challenge
          </button>
          <button
            onClick={() => setActiveMode('log')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeMode === 'log'
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Data Log ({experimentLogs.length})
          </button>
        </div>
      </div>

      {/* Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Virtual Eyepiece Field of View (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          <div className="relative rounded-2xl bg-[#0c101c] border border-slate-800 p-6 shadow-2xl flex flex-col items-center justify-center min-h-[480px]">
            
            {/* Top Eyepiece Controls & Readout */}
            <div className="w-full flex items-center justify-between mb-4 z-10 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-lime-400 bg-lime-950/60 px-2.5 py-1 rounded border border-lime-500/30">
                  {totalMagnification}x Total Power
                </span>
                <span className="text-slate-400">
                  Field of View: <strong className="text-white font-mono">{fovUm} μm</strong>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowGraticule(!showGraticule)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                    showGraticule
                      ? 'bg-lime-950/60 text-lime-300 border-lime-500/40'
                      : 'bg-slate-900 text-slate-500 border-slate-800'
                  }`}
                >
                  <Crosshair className="w-3.5 h-3.5" />
                  <span>Graticule Scale</span>
                </button>

                <button
                  onClick={() => {
                    setFocalZ(50);
                    setObjectivePower(10);
                  }}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                  title="Reset Stage & Focus"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Circular Microscope Lens Viewport */}
            <div className="relative w-80 sm:w-96 aspect-square rounded-full border-8 border-slate-800 bg-black shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden flex items-center justify-center">
              
              {/* Illuminated Light Field */}
              <div
                className="absolute inset-0 rounded-full transition-opacity duration-300"
                style={{
                  background: specimenType === 'onion' 
                    ? 'radial-gradient(circle, rgba(254, 243, 199, 0.9) 0%, rgba(217, 119, 6, 0.4) 100%)' // Iodine amber tint
                    : 'radial-gradient(circle, rgba(224, 242, 254, 0.9) 0%, rgba(14, 165, 233, 0.4) 100%)', // Methylene blue tint
                  opacity: illumination / 100,
                }}
              />

              {/* Specimen Cellular Layer (Filtered by Sharpness Blur) */}
              <div
                className="absolute inset-0 flex items-center justify-center transition-all duration-150"
                style={{
                  filter: `blur(${Math.max(0, blurAmount)}px)`,
                  transform: `scale(${objectivePower === 4 ? 0.6 : objectivePower === 10 ? 1.0 : 2.5})`,
                }}
              >
                {specimenType === 'onion' ? (
                  /* Plant Onion Epidermal Cells (Brick-like structure with cell walls & nuclei) */
                  <div className="grid grid-cols-3 gap-2 w-72 p-4 select-none">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div
                        key={i}
                        onClick={() => setSelectedOrganelle('Plant Cell (Onion Epidermis)')}
                        className="h-28 rounded border-2 border-amber-800/80 bg-amber-100/30 backdrop-blur-sm relative p-2 cursor-pointer hover:border-lime-500 transition-colors group"
                      >
                        {/* Cellulose Cell Wall */}
                        <div className="absolute inset-0.5 border border-amber-900/60 rounded-sm pointer-events-none" />
                        
                        {/* Large Central Vacuole */}
                        <div className="absolute inset-3 rounded bg-amber-50/20 border border-dashed border-amber-700/30 pointer-events-none" />

                        {/* Stained Nucleus */}
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrganelle('Nucleus (Contains genetic DNA, stained dark by iodine)');
                          }}
                          className="w-4 h-4 rounded-full bg-amber-900/90 absolute top-4 right-4 shadow-sm hover:scale-125 transition-transform"
                          title="Nucleus"
                        />

                        {/* Cytoplasm label point */}
                        <span className="text-[7px] text-amber-950 font-mono absolute bottom-1 left-1 opacity-0 group-hover:opacity-100">
                          Plant Cell #{i}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Animal Cheek Epithelial Cells (Irregular rounded cells with membranes) */
                  <div className="relative w-80 h-80 select-none">
                    {[
                      { top: '20%', left: '25%', w: 'w-24', h: 'h-20' },
                      { top: '50%', left: '55%', w: 'w-28', h: 'h-24' },
                      { top: '35%', left: '45%', w: 'w-22', h: 'h-18' },
                    ].map((cell, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedOrganelle('Cheek Epithelial Cell (Flexible membrane, no cell wall)')}
                        className={`absolute ${cell.w} ${cell.h} rounded-[40%_60%_70%_30%] border-2 border-sky-600/70 bg-sky-200/30 backdrop-blur-sm p-3 cursor-pointer hover:border-lime-400 transition-all group`}
                        style={{ top: cell.top, left: cell.left }}
                      >
                        {/* Nucleus */}
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrganelle('Nucleus (Stained deep blue with Methylene Blue)');
                          }}
                          className="w-4 h-4 rounded-full bg-sky-950 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition-transform"
                          title="Nucleus"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Eyepiece Graticule Ruler Overlay */}
              {showGraticule && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-full h-0.5 bg-slate-900/80 relative">
                    {Array.from({ length: 21 }).map((_, idx) => (
                      <div
                        key={idx}
                        className="absolute top-0 w-0.5 bg-slate-900/80"
                        style={{
                          left: `${idx * 5}%`,
                          height: idx % 5 === 0 ? '16px' : '8px',
                          transform: 'translateY(-50%)',
                        }}
                      />
                    ))}
                  </div>
                  <div className="h-full w-0.5 bg-slate-900/80 absolute" />
                </div>
              )}

              {/* Sharpness HUD badge */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-950/90 px-3 py-1 rounded-full border border-slate-700 text-[11px] font-mono text-slate-300">
                Clarity: <strong className={sharpnessPct > 80 ? 'text-lime-400' : 'text-amber-400'}>{sharpnessPct}%</strong>
              </div>

            </div>

            {/* Selected Organelle Callout */}
            {selectedOrganelle && (
              <div className="mt-4 p-3 rounded-xl bg-slate-900/90 border border-slate-700 text-xs text-slate-200 flex items-center justify-between gap-3 max-w-md w-full">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-lime-400 shrink-0" />
                  <span>{selectedOrganelle}</span>
                </div>
                <button
                  onClick={() => setSelectedOrganelle(null)}
                  className="text-slate-400 hover:text-white text-[11px] font-semibold"
                >
                  Dismiss
                </button>
              </div>
            )}

          </div>

        </div>

        {/* Right Column: Optics Controls Dock (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Mode 1: Microscope Knobs & Sliders */}
          {activeMode === 'explore' && (
            <div className="p-5 rounded-2xl bg-[#111726] border border-slate-800 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-lime-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                    Optics & Nosepiece
                  </h3>
                </div>
                <button
                  onClick={handleLogData}
                  className="px-2.5 py-1 rounded-md bg-lime-600/20 hover:bg-lime-600 text-lime-300 hover:text-white text-xs font-semibold border border-lime-500/30 transition-colors"
                >
                  + Record Field
                </button>
              </div>

              {/* Specimen Slide Selector */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-300">Specimen Slide:</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setSpecimenType('onion');
                      setSelectedOrganelle(null);
                    }}
                    className={`p-2 rounded-lg text-xs font-semibold border transition-all text-center ${
                      specimenType === 'onion'
                        ? 'bg-amber-950/60 text-amber-300 border-amber-500/50'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    Plant Onion Epidermis
                  </button>
                  <button
                    onClick={() => {
                      setSpecimenType('cheek');
                      setSelectedOrganelle(null);
                    }}
                    className={`p-2 rounded-lg text-xs font-semibold border transition-all text-center ${
                      specimenType === 'cheek'
                        ? 'bg-sky-950/60 text-sky-300 border-sky-500/50'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    Animal Cheek Epithelium
                  </button>
                </div>
              </div>

              {/* Objective Turret Power */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-300">Objective Lens (Nosepiece):</span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { power: 4, label: '4x Scanning (40x)' },
                    { power: 10, label: '10x Low (100x)' },
                    { power: 40, label: '40x High (400x)' },
                  ].map((lens) => (
                    <button
                      key={lens.power}
                      onClick={() => setObjectivePower(lens.power)}
                      className={`p-2 rounded-lg text-[11px] font-semibold border transition-all text-center ${
                        objectivePower === lens.power
                          ? 'bg-lime-600/30 text-lime-300 border-lime-500/50'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      {lens.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Focus Dial Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">Fine / Coarse Focus (Z)</span>
                  <span className="font-mono text-lime-400 font-bold">{focalZ} μm</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={focalZ}
                  onChange={(e) => setFocalZ(Number(e.target.value))}
                  className="w-full accent-lime-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>Lower Stage (Blur)</span>
                  <span>In Focus (52 μm)</span>
                  <span>Raise Stage (Blur)</span>
                </div>
              </div>

              {/* Illumination Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">Substage Iris Diaphragm</span>
                  <span className="font-mono text-lime-400 font-bold">{illumination}%</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={100}
                  step={5}
                  value={illumination}
                  onChange={(e) => setIllumination(Number(e.target.value))}
                  className="w-full accent-lime-500 cursor-pointer"
                />
              </div>

              {/* Magnification Formula Box */}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5 text-xs">
                <p className="font-semibold text-slate-200">Cambridge IGCSE Magnification Rule:</p>
                <p className="font-mono text-lime-400 text-xs">
                  I = A × M → Actual Size A = I / M
                </p>
                <p className="text-slate-400 text-[11px]">
                  Total power = Eyepiece (10x) × Objective ({objectivePower}x) = <strong className="text-white">{totalMagnification}x</strong>.
                </p>
              </div>
            </div>
          )}

          {/* Mode 2: Predict Mode */}
          {activeMode === 'predict' && (
            <div className="p-5 rounded-2xl bg-[#111726] border border-slate-800 space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                  Predict → Experiment → Explain
                </span>
                <h3 className="text-sm font-bold text-white mt-1">
                  Plant vs Animal Cell Cytology
                </h3>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                When inspecting animal cheek epithelial cells under 400x, which of these structures will NOT be present?
              </div>

              <div className="space-y-2">
                {[
                  { id: 'a', label: 'Cellulose Cell Wall & Chloroplasts' },
                  { id: 'b', label: 'Nucleus' },
                  { id: 'c', label: 'Cell Surface Membrane' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setPredictionAnswer(opt.id)}
                    className={`w-full p-2.5 rounded-xl text-left text-xs font-semibold border transition-all ${
                      predictionAnswer === opt.id
                        ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  if (predictionAnswer === 'a') {
                    setPredictionFeedback('Correct! Animal cells possess only a flexible cell membrane, cytoplasm, and nucleus. Cellulose cell walls, permanent large central vacuoles, and chloroplasts are exclusive to plant cells.');
                  } else {
                    setPredictionFeedback('Incorrect. Animal cells do have nuclei and cell surface membranes; they lack a cellulose cell wall and chloroplasts.');
                  }
                }}
                disabled={!predictionAnswer}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs shadow-lg transition-all"
              >
                Submit Answer
              </button>

              {predictionFeedback && (
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 space-y-1 animate-in fade-in">
                  <p className="font-semibold text-white">Syllabus Feedback:</p>
                  <p className="text-slate-400 leading-relaxed">{predictionFeedback}</p>
                </div>
              )}
            </div>
          )}

          {/* Mode 3: Challenge */}
          {activeMode === 'challenge' && (
            <div className="p-5 rounded-2xl bg-[#111726] border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                    Optics Focus Challenge
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                  Foundation
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white">
                  Achieve &gt;95% Clarity at 400x Power
                </h4>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Switch the objective turret to 40x (Total 400x). Adjust the fine focus dial with precision until image sharpness exceeds 95%.
                </p>
              </div>

              {challengeSuccess ? (
                <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/50 text-center space-y-2 animate-in zoom-in-95">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <p className="text-sm font-bold text-emerald-300">Optical Resolution Mastered!</p>
                  <p className="text-xs text-slate-300">
                    You dialed in the narrow high-power focal plane at 400x total magnification!
                  </p>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
                  <span className="text-slate-300 font-semibold">Current Power:</span>{' '}
                  <span className="font-mono text-lime-400 font-bold">{totalMagnification}x</span> • Clarity: <span className="font-mono text-lime-400 font-bold">{sharpnessPct}%</span>
                </div>
              )}
            </div>
          )}

          {/* Mode 4: Experiment Log */}
          {activeMode === 'log' && (
            <div className="p-5 rounded-2xl bg-[#111726] border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  Microscope Records ({experimentLogs.length})
                </h3>
                <button
                  onClick={handleExportCSV}
                  disabled={experimentLogs.length === 0}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-semibold border border-slate-700"
                >
                  <Download className="w-3.5 h-3.5 text-lime-400" />
                  <span>Export CSV</span>
                </button>
              </div>

              {experimentLogs.length > 0 ? (
                <div className="max-h-72 overflow-y-auto space-y-2">
                  {experimentLogs.map((log) => (
                    <div key={log.id} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] space-y-1 font-mono">
                      <div className="flex justify-between text-slate-400">
                        <span>{log.timestamp}</span>
                        <span className="text-lime-400 font-bold">{log.measurements['Total Magnification']}</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>{log.parameters['Specimen']}</span>
                        <span>FOV = {log.measurements['Field of View (μm)']} μm</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-6 text-xs text-slate-500">
                  No records yet. Adjust focus and click "+ Record Field" to log data.
                </p>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
