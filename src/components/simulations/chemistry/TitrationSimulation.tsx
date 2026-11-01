import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Pipette, 
  Activity, 
  Award, 
  Download, 
  CheckCircle2, 
  FlaskConical,
  Droplet,
  Sliders,
  TrendingUp
} from 'lucide-react';
import { SIMULATIONS_REGISTRY } from '../../../data/simulationsRegistry';
import { SimulationLogEntry } from '../../../types/simulation';

interface TitrationSimulationProps {
  onBack: () => void;
}

export const TitrationSimulation: React.FC<TitrationSimulationProps> = ({ onBack }) => {
  const metadata = SIMULATIONS_REGISTRY['chem-titration'];

  // State parameters
  const [acidConc, setAcidConc] = useState<number>(0.10); // mol/dm3 HCl
  const [flaskVolume, setFlaskVolume] = useState<number>(25.0); // cm3
  const [baseConc, setBaseConc] = useState<number>(0.10); // mol/dm3 NaOH
  const [dispensedBase, setDispensedBase] = useState<number>(0.0); // cm3
  const [indicatorType, setIndicatorType] = useState<number>(0); // 0=Phenolphthalein, 1=Methyl Orange, 2=Universal
  const [dispenseMode, setDispenseMode] = useState<'stop' | 'drop' | 'stream'>('stop');
  const [stirrerActive, setStirrerActive] = useState<boolean>(true);
  const [activeMode, setActiveMode] = useState<'explore' | 'predict' | 'challenge' | 'log'>('explore');

  // Challenge state
  const [challengeSuccess, setChallengeSuccess] = useState<boolean>(false);
  const [experimentLogs, setExperimentLogs] = useState<SimulationLogEntry[]>([]);
  const [predictionSelection, setPredictionSelection] = useState<string | null>(null);
  const [predictionFeedback, setPredictionFeedback] = useState<string | null>(null);

  // Titration Curve History
  const [titrationCurvePoints, setTitrationCurvePoints] = useState<{ volume: number; ph: number }[]>([
    { volume: 0, ph: 1.0 }
  ]);

  // Scientific Calculation of pH:
  // n(acid) = Ca * (Va / 1000)
  // n(base) = Cb * (Vb / 1000)
  // Total Vol = (Va + Vb) / 1000
  const na = acidConc * (flaskVolume / 1000);
  const nb = baseConc * (dispensedBase / 1000);
  const totalVolDm3 = (flaskVolume + dispensedBase) / 1000;
  
  let currentPh = 7.0;
  if (nb < na) {
    const excessAcid = (na - nb) / totalVolDm3;
    currentPh = Math.max(0.3, -Math.log10(excessAcid));
  } else if (nb > na) {
    const excessBase = (nb - na) / totalVolDm3;
    const pOH = -Math.log10(excessBase);
    currentPh = Math.min(13.8, 14.0 - pOH);
  } else {
    currentPh = 7.00;
  }
  const formattedPh = Number(currentPh.toFixed(2));

  // Equivalence point expected volume (cm3)
  const equivalenceVolume = Number(((acidConc * flaskVolume) / baseConc).toFixed(2));

  // Calculate Indicator Flask Color
  const getFlaskColor = () => {
    if (indicatorType === 0) {
      // Phenolphthalein: colorless < 8.2, pink 8.2-10, deep magenta > 10
      if (formattedPh < 8.2) return 'rgba(226, 232, 240, 0.2)'; // colorless/clear
      if (formattedPh < 9.5) return 'rgba(244, 114, 182, 0.55)'; // light pink
      return 'rgba(219, 39, 119, 0.85)'; // deep magenta
    } else if (indicatorType === 1) {
      // Methyl Orange: red < 3.1, orange 3.1-4.4, yellow > 4.4
      if (formattedPh < 3.1) return 'rgba(239, 68, 68, 0.8)';
      if (formattedPh < 4.4) return 'rgba(249, 115, 22, 0.8)';
      return 'rgba(234, 179, 8, 0.8)';
    } else {
      // Universal Indicator: 1-3 Red, 4-6 Orange/Yellow, 7 Green, 8-10 Blue, 11-14 Purple
      if (formattedPh < 3.5) return 'rgba(239, 68, 68, 0.8)';
      if (formattedPh < 6.5) return 'rgba(234, 179, 8, 0.8)';
      if (formattedPh < 7.5) return 'rgba(34, 197, 94, 0.8)'; // neutral green
      if (formattedPh < 10.5) return 'rgba(59, 130, 246, 0.8)';
      return 'rgba(168, 85, 247, 0.85)';
    }
  };

  // Dispensing Timer Loop
  useEffect(() => {
    if (dispenseMode === 'stop') return;

    const interval = setInterval(() => {
      setDispensedBase((prev) => {
        const increment = dispenseMode === 'drop' ? 0.05 : 0.4;
        const next = Math.min(50.0, Number((prev + increment).toFixed(2)));
        if (next >= 50.0) setDispenseMode('stop');
        return next;
      });
    }, dispenseMode === 'drop' ? 300 : 100);

    return () => clearInterval(interval);
  }, [dispenseMode]);

  // Update Titration Curve plot
  useEffect(() => {
    setTitrationCurvePoints((prev) => {
      const lastPoint = prev[prev.length - 1];
      if (!lastPoint || Math.abs(lastPoint.volume - dispensedBase) >= 0.2) {
        return [...prev, { volume: dispensedBase, ph: formattedPh }];
      }
      return prev;
    });
  }, [dispensedBase, formattedPh]);

  // Challenge check
  useEffect(() => {
    if (activeMode === 'challenge') {
      if (Math.abs(formattedPh - 7.0) <= 0.4 && dispensedBase > 10) {
        setChallengeSuccess(true);
      } else {
        setChallengeSuccess(false);
      }
    }
  }, [formattedPh, dispensedBase, activeMode]);

  // Log trial
  const handleLogData = () => {
    const newEntry: SimulationLogEntry = {
      id: `titr-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      parameters: {
        'Acid Conc (M)': acidConc,
        'Flask Vol (cm³)': flaskVolume,
        'Base Conc (M)': baseConc,
      },
      measurements: {
        'Titre Dispensed (cm³)': dispensedBase,
        'pH': formattedPh,
        'Equivalence Target (cm³)': equivalenceVolume,
      },
      notes: `Indicator: ${indicatorType === 0 ? 'Phenolphthalein' : indicatorType === 1 ? 'Methyl Orange' : 'Universal'}`
    };
    setExperimentLogs([newEntry, ...experimentLogs]);
  };

  const handleExportCSV = () => {
    if (experimentLogs.length === 0) return;
    const headers = ['Timestamp', 'Acid Conc (M)', 'Flask Vol (cm³)', 'Base Conc (M)', 'Titre (cm³)', 'pH', 'Expected Equivalence (cm³)', 'Indicator'];
    const rows = experimentLogs.map(l => [
      l.timestamp,
      l.parameters['Acid Conc (M)'],
      l.parameters['Flask Vol (cm³)'],
      l.parameters['Base Conc (M)'],
      l.measurements['Titre Dispensed (cm³)'],
      l.measurements['pH'],
      l.measurements['Equivalence Target (cm³)'],
      l.notes
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `IGCSE_Titration_Lab_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setDispensedBase(0.0);
    setDispenseMode('stop');
    setTitrationCurvePoints([{ volume: 0, ph: 1.0 }]);
    setChallengeSuccess(false);
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
            <span className="font-mono text-xs text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
              CAIE 0620.7.1.1
            </span>
            <h1 className="text-base sm:text-lg font-bold text-white">
              Volumetric Acid-Base Titration & pH Curve
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Standard sodium hydroxide titration against hydrochloric acid with volumetric burette and indicators.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 self-stretch sm:self-auto overflow-x-auto">
          <button
            onClick={() => setActiveMode('explore')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeMode === 'explore'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
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
            Neutralization Challenge
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
        
        {/* Left Column: Virtual Glassware Lab Bench (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          <div className="relative rounded-2xl bg-[#0c101c] border border-slate-800 p-6 shadow-2xl overflow-hidden min-h-[460px] flex flex-col justify-between">
            
            {/* Bench Header & Tap Controls */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDispenseMode(dispenseMode === 'stop' ? 'drop' : 'stop')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                    dispenseMode === 'drop'
                      ? 'bg-amber-600 text-white border-amber-500'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                  }`}
                >
                  <Droplet className="w-3.5 h-3.5" />
                  <span>{dispenseMode === 'drop' ? 'Stop Valve' : 'Single Drop (0.05 cm³)'}</span>
                </button>

                <button
                  onClick={() => setDispenseMode(dispenseMode === 'stream' ? 'stop' : 'stream')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                    dispenseMode === 'stream'
                      ? 'bg-red-600 text-white border-red-500'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                  }`}
                >
                  <span>{dispenseMode === 'stream' ? 'Stop Stream' : 'Fast Flow'}</span>
                </button>

                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
                  title="Refill Burette & Reset Flask"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Refill & Reset</span>
                </button>
              </div>

              {/* Magnetic Stirrer Switch */}
              <button
                onClick={() => setStirrerActive(!stirrerActive)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  stirrerActive
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                    : 'bg-slate-900 text-slate-500 border-slate-800'
                }`}
              >
                <Activity className={`w-3.5 h-3.5 ${stirrerActive ? 'animate-spin' : ''}`} />
                <span>Stirrer {stirrerActive ? 'ON' : 'OFF'}</span>
              </button>
            </div>

            {/* Central Visual Glassware Apparatus */}
            <div className="relative my-4 flex items-center justify-center">
              
              {/* Burette Assembly */}
              <div className="relative flex flex-col items-center">
                
                {/* Clamp Stand Rod */}
                <div className="absolute -left-12 top-0 bottom-0 w-2.5 bg-slate-600 rounded-full" />
                <div className="absolute -left-12 top-20 w-12 h-2 bg-slate-500" />
                <div className="absolute -left-12 bottom-6 w-24 h-4 bg-slate-700 rounded-md" />

                {/* 50cm3 Graduated Burette Tube */}
                <div className="w-8 h-64 bg-slate-900/60 border-2 border-slate-400 rounded-t-sm relative overflow-hidden backdrop-blur-sm">
                  {/* Graduated scale marks */}
                  <div className="absolute left-0 top-0 bottom-0 w-3 flex flex-col justify-between py-2 text-[8px] font-mono text-slate-400 select-none">
                    <span>0</span>
                    <span>10</span>
                    <span>20</span>
                    <span>30</span>
                    <span>40</span>
                    <span>50</span>
                  </div>

                  {/* Liquid inside burette */}
                  <div
                    className="absolute left-0 right-0 bottom-0 bg-sky-400/40 border-t-2 border-sky-300 transition-all duration-100"
                    style={{ height: `${Math.max(0, 100 - (dispensedBase / 50) * 100)}%` }}
                  />
                </div>

                {/* Burette Stopcock Tap */}
                <div className="w-12 h-6 bg-slate-700 border border-slate-500 rounded flex items-center justify-center my-0.5">
                  <div
                    className={`w-6 h-2 bg-amber-400 rounded transition-transform duration-200 ${
                      dispenseMode !== 'stop' ? 'rotate-90' : 'rotate-0'
                    }`}
                  />
                </div>

                {/* Burette Tip with Liquid Droplets */}
                <div className="w-2 h-8 bg-slate-400 relative">
                  {dispenseMode !== 'stop' && (
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 w-1.5 h-3 bg-sky-300 rounded-full animate-bounce" />
                  )}
                </div>

                {/* Conical Flask */}
                <div className="relative mt-2 w-32 h-36 flex flex-col items-center justify-end">
                  {/* Glass neck */}
                  <div className="w-8 h-10 border-x-2 border-t-2 border-slate-400 bg-slate-900/40 rounded-t-sm" />
                  
                  {/* Conical body */}
                  <div
                    className="w-32 h-26 rounded-b-3xl border-2 border-slate-400 bg-slate-900/50 relative overflow-hidden backdrop-blur flex items-end justify-center"
                    style={{
                      clipPath: 'polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)',
                    }}
                  >
                    {/* Liquid inside flask with colorimetric reaction */}
                    <div
                      className="w-full transition-colors duration-300 relative"
                      style={{
                        height: `${Math.min(95, 40 + (dispensedBase / 50) * 45)}%`,
                        backgroundColor: getFlaskColor(),
                      }}
                    >
                      {/* Stirrer flea vortex */}
                      {stirrerActive && (
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-5 h-1.5 bg-white rounded-full animate-spin shadow-md" />
                      )}
                    </div>
                  </div>

                  {/* White Ceramic Tile underneath */}
                  <div className="w-40 h-3 bg-slate-200 rounded-sm shadow-lg mt-1 border border-slate-400" />
                </div>

              </div>

              {/* Digital pH Meter Display on the right */}
              <div className="absolute right-4 top-10 bg-slate-900/95 border border-slate-700 p-4 rounded-xl shadow-2xl backdrop-blur-md space-y-3 w-52">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Digital pH Probe</span>
                  <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                
                <div>
                  <p className="text-3xl font-black font-mono text-emerald-400">
                    {formattedPh.toFixed(2)}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {formattedPh < 7 ? 'Acidic' : formattedPh === 7 ? 'Neutral' : 'Alkaline'} Solution
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-300 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Titre:</span>
                    <span className="text-white font-bold">{dispensedBase.toFixed(2)} cm³</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Equivalence:</span>
                    <span className="text-cyan-400 font-bold">{equivalenceVolume.toFixed(2)} cm³</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Insight Note */}
            <p className="text-[11px] text-slate-400 text-center">
              💡 As base is dispensed, H⁺ ions are neutralized into water. Notice how sharply the pH surges near equivalence ({equivalenceVolume} cm³).
            </p>

          </div>

          {/* Real-time Titration Curve Graph */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Titration Curve [pH vs Titre Volume cm³]
                </h4>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                Equivalence Jump at pH 7.0
              </span>
            </div>

            <div className="h-40 w-full bg-slate-950 rounded-xl border border-slate-800 p-3 relative overflow-hidden flex items-end">
              {/* Axes indicators */}
              <div className="absolute left-2 top-2 text-[10px] font-mono text-slate-600">pH 14</div>
              <div className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-600">pH 7 (Neutral)</div>
              <div className="absolute left-2 bottom-2 text-[10px] font-mono text-slate-600">pH 0</div>
              <div className="absolute right-2 bottom-2 text-[10px] font-mono text-slate-600">50 cm³ NaOH</div>

              {/* Equivalence line */}
              <div className="absolute left-0 right-0 top-1/2 border-b border-dashed border-slate-800" />

              {/* SVG Line Curve */}
              <svg className="w-full h-full absolute inset-0 pl-10 pr-4 py-2 overflow-visible">
                <polyline
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  points={titrationCurvePoints
                    .map((pt) => {
                      const x = (pt.volume / 50) * 100;
                      const y = 100 - (pt.ph / 14) * 100;
                      return `${x}%,${y}%`;
                    })
                    .join(' ')}
                />
              </svg>
            </div>
          </div>

        </div>

        {/* Right Column: Reagent Setup & Modes (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Mode 1: Reagents Control Dock */}
          {activeMode === 'explore' && (
            <div className="p-5 rounded-2xl bg-[#111726] border border-slate-800 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                    Reagents & Concentrations
                  </h3>
                </div>
                <button
                  onClick={handleLogData}
                  className="px-2.5 py-1 rounded-md bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white text-xs font-semibold border border-emerald-500/30 transition-colors"
                >
                  + Record Titre
                </button>
              </div>

              {/* Indicator Picker */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-300">Color Indicator:</span>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => setIndicatorType(0)}
                    className={`p-2 rounded-lg text-[11px] font-semibold border transition-all text-center ${
                      indicatorType === 0
                        ? 'bg-pink-950/60 text-pink-300 border-pink-500/50'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    Phenolphthalein
                  </button>
                  <button
                    onClick={() => setIndicatorType(1)}
                    className={`p-2 rounded-lg text-[11px] font-semibold border transition-all text-center ${
                      indicatorType === 1
                        ? 'bg-orange-950/60 text-orange-300 border-orange-500/50'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    Methyl Orange
                  </button>
                  <button
                    onClick={() => setIndicatorType(2)}
                    className={`p-2 rounded-lg text-[11px] font-semibold border transition-all text-center ${
                      indicatorType === 2
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/50'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    Universal
                  </button>
                </div>
              </div>

              {/* Acid Conc */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">HCl Acid Conc.</span>
                  <span className="font-mono text-emerald-400 font-bold">{acidConc.toFixed(2)} M</span>
                </div>
                <input
                  type="range"
                  min={0.05}
                  max={0.30}
                  step={0.05}
                  value={acidConc}
                  onChange={(e) => {
                    setAcidConc(Number(e.target.value));
                    handleReset();
                  }}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              {/* Base Conc */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">NaOH Base Conc.</span>
                  <span className="font-mono text-emerald-400 font-bold">{baseConc.toFixed(2)} M</span>
                </div>
                <input
                  type="range"
                  min={0.05}
                  max={0.30}
                  step={0.05}
                  value={baseConc}
                  onChange={(e) => {
                    setBaseConc(Number(e.target.value));
                    handleReset();
                  }}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              {/* Flask Acid Vol */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">Pipetted Acid Volume</span>
                  <span className="font-mono text-emerald-400 font-bold">{flaskVolume.toFixed(1)} cm³</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={40}
                  step={5}
                  value={flaskVolume}
                  onChange={(e) => {
                    setFlaskVolume(Number(e.target.value));
                    handleReset();
                  }}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              {/* Theoretical Equivalence Box */}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5 text-xs">
                <p className="font-semibold text-slate-200">Stoichiometric Formula:</p>
                <p className="font-mono text-emerald-400 text-xs">
                  C₁V₁ = C₂V₂ → V₂ = ({acidConc} × {flaskVolume}) / {baseConc}
                </p>
                <p className="text-slate-400 text-[11px]">
                  Theoretical neutralization volume = <strong className="text-white">{equivalenceVolume} cm³</strong>.
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
                  Indicator Transition Prediction
                </h3>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                When using Phenolphthalein indicator, what color change indicates you have reached the neutralization end point?
              </div>

              <div className="space-y-2">
                {[
                  { id: 'opt1', label: 'Colorless to persistent pale pink' },
                  { id: 'opt2', label: 'Red to yellow' },
                  { id: 'opt3', label: 'Deep blue to purple' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setPredictionSelection(opt.id)}
                    className={`w-full p-2.5 rounded-xl text-left text-xs font-semibold border transition-all ${
                      predictionSelection === opt.id
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
                  if (predictionSelection === 'opt1') {
                    setPredictionFeedback('Correct! In acid, phenolphthalein is completely colorless. The very first single drop of excess OH⁻ shifts pH past 8.2, producing a faint, permanent pale pink tint.');
                  } else {
                    setPredictionFeedback('Incorrect. Phenolphthalein is colorless in acid and turns pale pink at the neutralization end point (Red to yellow is Methyl Orange).');
                  }
                }}
                disabled={!predictionSelection}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs shadow-lg transition-all"
              >
                Submit Prediction
              </button>

              {predictionFeedback && (
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 space-y-1 animate-in fade-in">
                  <p className="font-semibold text-white">Cambridge Exam Insight:</p>
                  <p className="text-slate-400 leading-relaxed">{predictionFeedback}</p>
                </div>
              )}
            </div>
          )}

          {/* Mode 3: Neutralization Challenge */}
          {activeMode === 'challenge' && (
            <div className="p-5 rounded-2xl bg-[#111726] border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                    Neutralization Challenge
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                  Intermediate
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white">
                  Achieve Neutral pH 7.00 (± 0.40)
                </h4>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Carefully dispense base into 25.0 cm³ of acid. As you approach the equivalence volume ({equivalenceVolume} cm³), switch to Single Drop mode (0.05 cm³).
                </p>
              </div>

              {challengeSuccess ? (
                <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/50 text-center space-y-2 animate-in zoom-in-95">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <p className="text-sm font-bold text-emerald-300">Perfect Titration Technique!</p>
                  <p className="text-xs text-slate-300">
                    You hit the vertical equivalence inflection at exactly {dispensedBase.toFixed(2)} cm³!
                  </p>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
                  <span className="text-slate-300 font-semibold">Current pH:</span>{' '}
                  <span className="font-mono text-emerald-400 font-bold">{formattedPh}</span> (Target: 7.00)
                </div>
              )}
            </div>
          )}

          {/* Mode 4: Experiment Log */}
          {activeMode === 'log' && (
            <div className="p-5 rounded-2xl bg-[#111726] border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  Titration Trials ({experimentLogs.length})
                </h3>
                <button
                  onClick={handleExportCSV}
                  disabled={experimentLogs.length === 0}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-semibold border border-slate-700"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Export CSV</span>
                </button>
              </div>

              {experimentLogs.length > 0 ? (
                <div className="max-h-72 overflow-y-auto space-y-2">
                  {experimentLogs.map((log) => (
                    <div key={log.id} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] space-y-1 font-mono">
                      <div className="flex justify-between text-slate-400">
                        <span>{log.timestamp}</span>
                        <span className="text-emerald-400 font-bold">pH {log.measurements['pH']}</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>Titre = {log.measurements['Titre Dispensed (cm³)']} cm³</span>
                        <span>Target = {log.measurements['Equivalence Target (cm³)']} cm³</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-6 text-xs text-slate-500">
                  No trials recorded yet. Dispense base and click "+ Record Titre" to log measurements.
                </p>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
