import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SimulationMetadata, SimulationParameter, LearningMode } from '../../types/simulation';
import { drawTopicDiagram } from './TopicDiagram';

interface GenericSimulationProps {
  metadata: SimulationMetadata;
  onBack: () => void;
}

// Color palettes per subject
const SUBJECT_COLORS: Record<string, { primary: string; accent: string; bg: string; border: string }> = {
  physics: { primary: '#0ea5e9', accent: '#38bdf8', bg: 'rgba(14,165,233,0.08)', border: 'rgba(14,165,233,0.3)' },
  chemistry: { primary: '#10b981', accent: '#34d399', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.3)' },
  biology: { primary: '#84cc16', accent: '#a3e635', bg: 'rgba(132,204,22,0.08)', border: 'rgba(132,204,22,0.3)' },
  environmental: { primary: '#14b8a6', accent: '#2dd4bf', bg: 'rgba(20,184,166,0.08)', border: 'rgba(20,184,166,0.3)' },
  mathematics: { primary: '#6366f1', accent: '#818cf8', bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.3)' },
  computerscience: { primary: '#f43f5e', accent: '#fb7185', bg: 'rgba(244,63,94,0.08)', border: 'rgba(244,63,94,0.3)' },
  geography: { primary: '#16a34a', accent: '#4ade80', bg: 'rgba(22,163,74,0.08)', border: 'rgba(22,163,74,0.3)' },
  business: { primary: '#d97706', accent: '#fbbf24', bg: 'rgba(217,119,6,0.08)', border: 'rgba(217,119,6,0.3)' },
};

// Subject-specific deterministic output models
function computePhysics(model: string, params: Record<string, number>): Record<string, number | string> {
  const values = Object.values(params);
  const [a = 0, b = 0, c = 0] = values;
  const aliases: Record<string, string> = {
    optics: 'waves', electromagnetism: 'circuits', radioactivity: 'nuclear', space: 'energy',
    particles: 'thermal', practical: 'mathematics', atoms: 'binary', stoichiometry: 'energy',
    electrochemistry: 'circuits', energetics: 'thermal', kinetics: 'thermal', acidbase: 'thermal',
    periodic: 'forces', organic: 'energy', cells: 'mathematics', transport: 'thermal', enzymes: 'thermal',
    photosynthesis: 'energy', humanbiology: 'population', respiration: 'energy', coordination: 'kinematics',
    genetics: 'binary', ecology: 'population', biotechnology: 'population', resources: 'energy', land: 'forces',
    water: 'thermal', atmosphere: 'thermal', ecosystems: 'population', hazards: 'forces', number: 'mathematics',
    algebra: 'mathematics', coordinate: 'mathematics', geometry: 'mathematics', mensuration: 'mathematics',
    trigonometry: 'mathematics', statistics: 'mathematics', probability: 'mathematics', programming: 'binary',
    database: 'mathematics', logic: 'binary', algorithms: 'mathematics', data: 'binary', hardware: 'binary',
    networks: 'binary', network: 'binary', transmission: 'binary', software: 'mathematics', automation: 'mathematics',
    vectors: 'mathematics', security: 'binary', systems: 'binary',
  };
  switch (aliases[model] ?? model) {
    case 'kinematics': return { finalSpeed: a + b * c, distance: a * c + 0.5 * b * c * c };
    case 'forces': return { acceleration: b / (a || 1), weight: a * 9.81 };
    case 'energy': return { potentialEnergy: a * 9.81 * b, kineticEnergy: 0.5 * a * c * c };
    case 'waves': return { waveSpeed: a * b, period: 1 / (a || 1) };
    case 'circuits': return { current: a / (b || 1), power: a * (a / (b || 1)) };
    case 'thermal': return { temperatureChange: a / ((b || 1) * (c || 1)), energyPerMass: a / (b || 1) };
    case 'nuclear': {
      const remaining = a * Math.pow(0.5, c / (b || 1));
      return { remainingNuclei: remaining, decayedFraction: 100 * (1 - remaining / (a || 1)) };
    }
    case 'population': return { naturalIncrease: a - b, populationNextYear: c * (1 + (a - b) / 1000) };
    case 'binary': return { binaryValue: Math.floor(a).toString(2).padStart(Math.floor(b), '0'), hexValue: Math.floor(a).toString(16).toUpperCase() };
    default: return { outputValue: a * b + c, gradient: a };
  }
}

export const GenericSimulation: React.FC<GenericSimulationProps> = ({ metadata, onBack }) => {
  const colors = SUBJECT_COLORS[metadata.subjectId] || SUBJECT_COLORS.physics;
  const [mode, setMode] = useState<LearningMode>(metadata.defaultMode || 'explore');
  const [paramValues, setParamValues] = useState<Record<string, number>>({});
  const [measurements, setMeasurements] = useState<Record<string, number | string>>({});
  const [dataLog, setDataLog] = useState<Array<Record<string, number | string>>>([]);
  const [showChallenge, setShowChallenge] = useState(false);
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [challengeResult, setChallengeResult] = useState<'none' | 'success' | 'fail'>('none');
  const [guidedStep, setGuidedStep] = useState(0);
  const [prediction, setPrediction] = useState('');
  const [predictionSubmitted, setPredictionSubmitted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [graphData, setGraphData] = useState<Array<{ x: number; y: number }>>([]);

  // Initialize parameter values
  useEffect(() => {
    const initial: Record<string, number> = {};
    metadata.parameters.forEach(p => { initial[p.id] = p.defaultValue; });
    setParamValues(initial);
  }, [metadata.id]);

  // Update measurements when params change
  useEffect(() => {
    const m = computePhysics(metadata.visualType ?? '', paramValues);
    setMeasurements(m);
  }, [paramValues, metadata.id]);

  // Canvas animation
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;

    // Clear
    ctx.fillStyle = '#0a0e17';
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 30) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 30) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    // Border glow
    ctx.strokeStyle = colors.border;
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, W - 2, H - 2);

    // Each syllabus model has its own apparatus, graph, or data representation.
    const plotX = 250, plotY = 72, plotW = Math.max(180, W - 285), plotH = Math.max(150, H - 115);
    drawTopicDiagram(ctx, metadata.subjectId, metadata.visualType ?? '', paramValues, plotX, plotY, plotW, plotH);

    // Draw measurement overlay
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(8, 8, 200, 30 + metadata.measurements.length * 22);
    ctx.fillStyle = colors.accent;
    ctx.font = 'bold 11px Inter, monospace';
    ctx.fillText('📊 LIVE MEASUREMENTS', 16, 26);
    ctx.font = '11px Inter, monospace';
    metadata.measurements.forEach((mDef, i) => {
      const val = measurements[mDef.id];
      const displayVal = typeof val === 'number' ? val.toFixed(mDef.precision) : (val || '—');
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`${mDef.label}:`, 16, 48 + i * 22);
      ctx.fillStyle = '#f1f5f9';
      ctx.fillText(`${displayVal} ${mDef.unit}`, 140, 48 + i * 22);
    });

    // Title overlay
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    const titleW = ctx.measureText(metadata.title).width + 24;
    ctx.fillRect(W - titleW - 8, 8, titleW, 28);
    ctx.fillStyle = colors.primary;
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.fillText(metadata.title, W - titleW + 4, 26);

    // Draw mini graph in bottom-right
    if (graphData.length > 1) {
      const gx = W - 180, gy = H - 120, gw = 165, gh = 105;
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillRect(gx, gy, gw, gh);
      ctx.strokeStyle = colors.border;
      ctx.lineWidth = 1;
      ctx.strokeRect(gx, gy, gw, gh);
      
      const minY = Math.min(...graphData.map(d => d.y));
      const maxY = Math.max(...graphData.map(d => d.y)) || 1;
      
      ctx.beginPath();
      ctx.strokeStyle = colors.accent;
      ctx.lineWidth = 2;
      graphData.forEach((d, i) => {
        const px = gx + 5 + (i / (graphData.length - 1)) * (gw - 10);
        const py = gy + gh - 5 - ((d.y - minY) / (maxY - minY + 0.001)) * (gh - 15);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      });
      ctx.stroke();
    }

    animRef.current = requestAnimationFrame(animate);
  }, [paramValues, measurements, metadata, colors, graphData]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [animate]);

  // Update graph data when primary param changes
  useEffect(() => {
    const paramKeys = Object.keys(paramValues);
    if (paramKeys.length >= 1) {
      const xVal = paramValues[paramKeys[0]];
      const firstMeasurement = metadata.measurements[0];
      const yVal = firstMeasurement ? (typeof measurements[firstMeasurement.id] === 'number' ? measurements[firstMeasurement.id] as number : 0) : xVal;
      setGraphData(prev => {
        const next = [...prev, { x: xVal, y: yVal }];
        return next.slice(-50);
      });
    }
  }, [paramValues]);

  const handleParamChange = (paramId: string, value: number) => {
    setParamValues(prev => ({ ...prev, [paramId]: value }));
  };

  const recordDataPoint = () => {
    const entry: Record<string, number | string> = { timestamp: new Date().toISOString() };
    Object.entries(paramValues).forEach(([k, v]) => { entry[k] = v; });
    Object.entries(measurements).forEach(([k, v]) => { entry[k] = v; });
    setDataLog(prev => [...prev, entry]);
  };

  const exportCSV = () => {
    if (dataLog.length === 0) return;
    const headers = Object.keys(dataLog[0]);
    const csv = [headers.join(','), ...dataLog.map(row => headers.map(h => row[h] ?? '').join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${metadata.id}-data.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const checkChallenge = () => {
    if (!metadata.challenges[challengeIdx]) return;
    const challenge = metadata.challenges[challengeIdx];
    const val = measurements[challenge.targetCriteria.property];
    if (typeof val === 'number') {
      const diff = Math.abs(val - challenge.targetCriteria.targetValue);
      setChallengeResult(diff <= challenge.targetCriteria.tolerance ? 'success' : 'fail');
    }
  };

  const modes: { id: LearningMode; label: string; icon: string }[] = [
    { id: 'explore', label: 'Explore', icon: '🔬' },
    { id: 'guided', label: 'Guided', icon: '📖' },
    { id: 'predict', label: 'Predict', icon: '🎯' },
    { id: 'challenge', label: 'Challenge', icon: '🏆' },
    { id: 'free_lab', label: 'Free Lab', icon: '🧪' },
  ];

  return (
    <div className="min-h-screen bg-[#080b11] text-white">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-[#0a0e17]/95 backdrop-blur border-b" style={{ borderColor: colors.border }}>
        <div className="max-w-[1600px] mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-slate-400 hover:text-white transition text-sm flex items-center gap-1">
              ← Back
            </button>
            <div className="w-px h-5 bg-slate-700" />
            <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ background: colors.bg, color: colors.primary }}>
              {metadata.syllabusCode}
            </span>
            <h1 className="text-sm font-semibold truncate max-w-[300px]" style={{ color: colors.accent }}>
              {metadata.title}
            </h1>
          </div>
          <div className="flex items-center gap-1">
            {modes.map(m => (
              <button
                key={m.id}
                onClick={() => { setMode(m.id); setChallengeResult('none'); }}
                className={`px-3 py-1.5 text-xs rounded-md transition font-medium ${
                  mode === m.id 
                    ? 'text-white shadow-lg' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
                style={mode === m.id ? { background: colors.primary, boxShadow: `0 0 12px ${colors.primary}40` } : {}}
              >
                {m.icon} {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 py-4">
        <div className="grid grid-cols-12 gap-4">
          
          {/* Left Panel: Parameters */}
          <div className="col-span-3 space-y-3">
            <div className="rounded-lg border p-3" style={{ background: colors.bg, borderColor: colors.border }}>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: colors.accent }}>
                ⚡ Parameters
              </h3>
              <div className="space-y-4">
                {metadata.parameters.map((param: SimulationParameter) => (
                  <div key={param.id}>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs text-slate-300">{param.name}</label>
                      <span className="text-xs font-mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(0,0,0,0.3)', color: colors.accent }}>
                        {paramValues[param.id]?.toFixed(param.step < 1 ? 2 : 0) ?? param.defaultValue} {param.unit}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={param.min}
                      max={param.max}
                      step={param.step}
                      value={paramValues[param.id] ?? param.defaultValue}
                      onChange={e => handleParamChange(param.id, parseFloat(e.target.value))}
                      className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                      style={{ 
                        background: `linear-gradient(to right, ${colors.primary}, ${colors.accent})`,
                        accentColor: colors.primary 
                      }}
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                      <span>{param.min}{param.unit}</span>
                      <span>{param.max}{param.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Measurements */}
            <div className="rounded-lg border p-3" style={{ background: 'rgba(0,0,0,0.3)', borderColor: colors.border }}>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: colors.accent }}>
                📊 Measurements
              </h3>
              <div className="space-y-2">
                {metadata.measurements.map(mDef => {
                  const val = measurements[mDef.id];
                  const display = typeof val === 'number' ? val.toFixed(mDef.precision) : (val || '—');
                  return (
                    <div key={mDef.id} className="flex justify-between items-center py-1 border-b border-slate-800">
                      <span className="text-[11px] text-slate-400">{mDef.label}</span>
                      <span className="text-xs font-mono font-semibold" style={{ color: colors.accent }}>
                        {display} {mDef.unit}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Data Log Controls */}
            <div className="flex gap-2">
              <button onClick={recordDataPoint}
                className="flex-1 text-xs py-2 rounded-md border transition hover:brightness-125"
                style={{ borderColor: colors.border, color: colors.primary }}>
                📝 Record
              </button>
              <button onClick={exportCSV}
                className="flex-1 text-xs py-2 rounded-md border transition hover:brightness-125"
                style={{ borderColor: colors.border, color: colors.primary }}>
                📤 Export CSV
              </button>
            </div>
            {dataLog.length > 0 && (
              <div className="text-[10px] text-slate-500 text-center">{dataLog.length} data point{dataLog.length !== 1 ? 's' : ''} recorded</div>
            )}
          </div>

          {/* Center: Canvas Simulation */}
          <div className="col-span-6">
            <div className="rounded-lg overflow-hidden border" style={{ borderColor: colors.border }}>
              <canvas
                ref={canvasRef}
                width={720}
                height={480}
                className="w-full"
                style={{ imageRendering: 'auto' }}
              />
            </div>

            {/* Subtitle */}
            <p className="text-xs text-slate-500 mt-2 text-center italic">{metadata.subtitle}</p>

            {/* Formulae bar */}
            {metadata.formulae.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2 justify-center">
                {metadata.formulae.slice(0, 4).map((f, i) => (
                  <span key={i} className="text-[10px] font-mono px-2 py-1 rounded border"
                    style={{ borderColor: colors.border, color: colors.accent, background: 'rgba(0,0,0,0.3)' }}>
                    {f.replace(/\\\\/g, '\\')}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Right Panel: Mode-specific content */}
          <div className="col-span-3 space-y-3">
            
            {/* Guided Mode */}
            {mode === 'guided' && metadata.guidedSteps.length > 0 && (
              <div className="rounded-lg border p-3" style={{ background: colors.bg, borderColor: colors.border }}>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: colors.accent }}>
                  📖 Guided Discovery
                </h3>
                <div className="text-xs text-slate-300 mb-2">
                  Step {guidedStep + 1} of {metadata.guidedSteps.length}
                </div>
                <div className="bg-black/30 rounded p-2 mb-2">
                  <p className="text-xs text-white font-medium mb-1">
                    {metadata.guidedSteps[guidedStep]?.instruction}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    ⚡ {metadata.guidedSteps[guidedStep]?.actionRequired}
                  </p>
                </div>
                <div className="bg-black/20 rounded p-2 border-l-2" style={{ borderColor: colors.accent }}>
                  <p className="text-[10px] text-slate-300 italic">
                    💡 {metadata.guidedSteps[guidedStep]?.scientificInsight}
                  </p>
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => setGuidedStep(Math.max(0, guidedStep - 1))}
                    disabled={guidedStep === 0}
                    className="flex-1 text-xs py-1.5 rounded border border-slate-700 text-slate-400 disabled:opacity-30">
                    ← Prev
                  </button>
                  <button onClick={() => setGuidedStep(Math.min(metadata.guidedSteps.length - 1, guidedStep + 1))}
                    disabled={guidedStep >= metadata.guidedSteps.length - 1}
                    className="flex-1 text-xs py-1.5 rounded text-white"
                    style={{ background: colors.primary }}>
                    Next →
                  </button>
                </div>
              </div>
            )}

            {/* Challenge Mode */}
            {mode === 'challenge' && metadata.challenges.length > 0 && (
              <div className="rounded-lg border p-3" style={{ background: colors.bg, borderColor: colors.border }}>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: colors.accent }}>
                  🏆 Challenge Mode
                </h3>
                <div className="bg-black/30 rounded p-2 mb-2">
                  <p className="text-xs font-semibold text-white mb-1">
                    {metadata.challenges[challengeIdx]?.title}
                  </p>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                    metadata.challenges[challengeIdx]?.difficulty === 'Foundation' ? 'bg-green-900/50 text-green-400' :
                    metadata.challenges[challengeIdx]?.difficulty === 'Intermediate' ? 'bg-yellow-900/50 text-yellow-400' :
                    'bg-red-900/50 text-red-400'
                  }`}>
                    {metadata.challenges[challengeIdx]?.difficulty}
                  </span>
                  <p className="text-[11px] text-slate-300 mt-2">
                    {metadata.challenges[challengeIdx]?.description}
                  </p>
                </div>
                <button onClick={checkChallenge}
                  className="w-full text-xs py-2 rounded font-semibold text-white mb-2"
                  style={{ background: colors.primary }}>
                  ✓ Check Answer
                </button>
                {challengeResult === 'success' && (
                  <div className="bg-green-900/30 border border-green-700 rounded p-2">
                    <p className="text-xs text-green-400 font-semibold">✅ Correct!</p>
                    <p className="text-[10px] text-green-300 mt-1">{metadata.challenges[challengeIdx]?.explanationOnSuccess}</p>
                  </div>
                )}
                {challengeResult === 'fail' && (
                  <div className="bg-red-900/30 border border-red-700 rounded p-2">
                    <p className="text-xs text-red-400 font-semibold">❌ Not quite right</p>
                    <p className="text-[10px] text-amber-300 mt-1">💡 Hint: {metadata.challenges[challengeIdx]?.hint}</p>
                  </div>
                )}
                {metadata.challenges.length > 1 && (
                  <div className="flex gap-1 mt-2">
                    {metadata.challenges.map((_, i) => (
                      <button key={i} onClick={() => { setChallengeIdx(i); setChallengeResult('none'); }}
                        className={`flex-1 text-[10px] py-1 rounded ${i === challengeIdx ? 'text-white' : 'text-slate-500 bg-black/20'}`}
                        style={i === challengeIdx ? { background: colors.primary } : {}}>
                        #{i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Predict Mode */}
            {mode === 'predict' && (
              <div className="rounded-lg border p-3" style={{ background: colors.bg, borderColor: colors.border }}>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: colors.accent }}>
                  🎯 Predict → Experiment → Explain
                </h3>
                {!predictionSubmitted ? (
                  <>
                    <p className="text-xs text-slate-300 mb-2">
                      What do you think will happen when you change the parameters?
                    </p>
                    <textarea
                      value={prediction}
                      onChange={e => setPrediction(e.target.value)}
                      placeholder="Type your prediction here..."
                      className="w-full bg-black/30 border border-slate-700 rounded p-2 text-xs text-white resize-none h-20 focus:outline-none focus:border-opacity-100"
                      style={{ borderColor: colors.border }}
                    />
                    <button onClick={() => setPredictionSubmitted(true)}
                      disabled={!prediction.trim()}
                      className="w-full mt-2 text-xs py-2 rounded font-semibold text-white disabled:opacity-30"
                      style={{ background: colors.primary }}>
                      Lock Prediction & Experiment
                    </button>
                  </>
                ) : (
                  <>
                    <div className="bg-black/30 rounded p-2 mb-2">
                      <p className="text-[10px] text-slate-500 uppercase">Your Prediction:</p>
                      <p className="text-xs text-white italic">"{prediction}"</p>
                    </div>
                    <p className="text-xs text-slate-300">
                      Now adjust the parameters and observe. Was your prediction correct?
                    </p>
                    <button onClick={() => { setPrediction(''); setPredictionSubmitted(false); }}
                      className="w-full mt-2 text-xs py-2 rounded border"
                      style={{ borderColor: colors.border, color: colors.primary }}>
                      🔄 New Prediction
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Explore / Free Lab info */}
            {(mode === 'explore' || mode === 'free_lab') && (
              <div className="rounded-lg border p-3" style={{ background: colors.bg, borderColor: colors.border }}>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: colors.accent }}>
                  {mode === 'explore' ? '🔬 Explore Mode' : '🧪 Free Lab Mode'}
                </h3>
                <div className="space-y-2">
                  {metadata.learningObjectives.slice(0, 3).map((obj, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <span className="text-[10px] mt-0.5" style={{ color: colors.accent }}>●</span>
                      <p className="text-[11px] text-slate-300">{obj}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Scientific Principles */}
            <div className="rounded-lg border p-3" style={{ background: 'rgba(0,0,0,0.3)', borderColor: 'rgba(255,255,255,0.08)' }}>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">
                🧬 Key Principles
              </h3>
              <div className="space-y-1.5">
                {metadata.scientificPrinciples.slice(0, 4).map((p, i) => (
                  <p key={i} className="text-[10px] text-slate-500 leading-relaxed">• {p}</p>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1">
              {metadata.tags.map((tag, i) => (
                <span key={i} className="text-[9px] px-2 py-0.5 rounded-full border"
                  style={{ borderColor: colors.border, color: colors.accent, background: 'rgba(0,0,0,0.2)' }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

