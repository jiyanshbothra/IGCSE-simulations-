import React, { useState } from 'react';
import { 
  Users, 
  RotateCcw, 
  Award, 
  CheckCircle2, 
  Download, 
  Sliders, 
  TrendingUp, 
  Globe,
  HeartPulse,
  GraduationCap
} from 'lucide-react';
import { SIMULATIONS_REGISTRY } from '../../../data/simulationsRegistry';
import { SimulationLogEntry } from '../../../types/simulation';

interface PopulationDynamicsProps {
  onBack: () => void;
}

export const PopulationDynamicsSimulation: React.FC<PopulationDynamicsProps> = ({ onBack }) => {
  const metadata = SIMULATIONS_REGISTRY['env-population-dynamics'];

  // State parameters
  const [cbr, setCbr] = useState<number>(38); // Crude Birth Rate (per 1000)
  const [cdr, setCdr] = useState<number>(14); // Crude Death Rate (per 1000)
  const [healthcare, setHealthcare] = useState<number>(45); // %
  const [femaleEdu, setFemaleEdu] = useState<number>(40); // %
  const [activeMode, setActiveMode] = useState<'explore' | 'predict' | 'challenge' | 'log'>('explore');

  // Challenge & Logs
  const [challengeSuccess, setChallengeSuccess] = useState<boolean>(false);
  const [experimentLogs, setExperimentLogs] = useState<SimulationLogEntry[]>([]);
  const [predictionAnswer, setPredictionAnswer] = useState<string | null>(null);
  const [predictionFeedback, setPredictionFeedback] = useState<string | null>(null);

  // Calculations:
  // Rate of Natural Increase RNI = (CBR - CDR) / 10
  const rni = Number(((cbr - cdr) / 10).toFixed(2));
  const doublingTimeYears = rni > 0 ? Math.round(70 / rni) : Infinity;

  // DTM Stage classification logic:
  let dtmStage = 1;
  let stageName = 'Stage 1: High Stationary';
  let stageDescription = 'High birth and death rates; very slow natural increase.';

  if (cdr > 25 && cbr > 35) {
    dtmStage = 1;
    stageName = 'Stage 1: High Stationary';
    stageDescription = 'High birth and death rates; fluctuating small population.';
  } else if (cdr <= 25 && cdr > 10 && cbr > 28) {
    dtmStage = 2;
    stageName = 'Stage 2: Early Expanding';
    stageDescription = 'Death rate falls rapidly due to clean water and medicine. Population explosion.';
  } else if (cdr <= 12 && cbr <= 28 && cbr > 15) {
    dtmStage = 3;
    stageName = 'Stage 3: Late Expanding';
    stageDescription = 'Birth rate falls as female literacy rises and family planning spreads.';
  } else if (cbr <= 15 && cdr <= 12 && cbr >= cdr) {
    dtmStage = 4;
    stageName = 'Stage 4: Low Stationary';
    stageDescription = 'Low birth and death rates; stable, large, developed population.';
  } else if (cbr < cdr) {
    dtmStage = 5;
    stageName = 'Stage 5: Natural Decrease / Declining';
    stageDescription = 'Birth rate drops below death rate; shrinking and aging workforce.';
  }

  // Age-sex pyramid cohort distribution (% of population)
  // Youth (0-14), Working (15-64), Elderly (65+)
  let youthPct = Math.min(50, Math.max(15, cbr * 0.95));
  let elderlyPct = Math.min(30, Math.max(4, (healthcare / 100) * 22 + (femaleEdu / 100) * 8));
  let workingPct = Math.max(40, 100 - (youthPct + elderlyPct));

  // Dependency Ratio = (Youth + Elderly) / Working * 100
  const dependencyRatio = Number((((youthPct + elderlyPct) / workingPct) * 100).toFixed(1));

  // Challenge check: Model Stage 4 (Natural Increase < 0.4% and CBR < 16)
  React.useEffect(() => {
    if (activeMode === 'challenge') {
      if (dtmStage === 4 && rni <= 0.4 && rni >= 0) {
        setChallengeSuccess(true);
      } else {
        setChallengeSuccess(false);
      }
    }
  }, [dtmStage, rni, activeMode]);

  const handleLogData = () => {
    const newEntry: SimulationLogEntry = {
      id: `env-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      parameters: {
        'CBR (per 1000)': cbr,
        'CDR (per 1000)': cdr,
        'Healthcare (%)': healthcare,
      },
      measurements: {
        'Natural Increase (%/yr)': `${rni}%`,
        'DTM Stage': stageName,
        'Dependency Ratio': `${dependencyRatio}%`,
      },
      notes: `Doubling Time: ${doublingTimeYears} yrs`
    };
    setExperimentLogs([newEntry, ...experimentLogs]);
  };

  const handleExportCSV = () => {
    if (experimentLogs.length === 0) return;
    const headers = ['Timestamp', 'CBR', 'CDR', 'RNI (%)', 'DTM Stage', 'Dependency Ratio (%)', 'Notes'];
    const rows = experimentLogs.map(l => [
      l.timestamp,
      l.parameters['CBR (per 1000)'],
      l.parameters['CDR (per 1000)'],
      l.measurements['Natural Increase (%/yr)'],
      l.measurements['DTM Stage'],
      l.measurements['Dependency Ratio'],
      l.notes
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `IGCSE_Demographics_Lab_${Date.now()}.csv`);
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
            <span className="font-mono text-xs text-teal-400 bg-teal-950/60 px-2 py-0.5 rounded border border-teal-500/30">
              CAIE 0680.8.1.1
            </span>
            <h1 className="text-base sm:text-lg font-bold text-white">
              Demographic Transition Model (DTM) & Population Simulator
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulate national demographic trajectories, age-sex population pyramids, and dependency burdens.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 self-stretch sm:self-auto overflow-x-auto">
          <button
            onClick={() => setActiveMode('explore')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeMode === 'explore'
                ? 'bg-teal-500 text-white shadow-md shadow-teal-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Explore Model
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
            Stage 4 Challenge
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
        
        {/* Left Column: Visual DTM Graph & Live Population Pyramid (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* DTM Classification Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-950/40 via-slate-900 to-slate-900 border border-teal-500/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
                Current Demographic Status
              </span>
              <h3 className="text-xl font-bold text-white mt-0.5">
                {stageName}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                {stageDescription}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400">Natural Increase:</span>
              <p className={`text-2xl font-black font-mono ${rni >= 0 ? 'text-teal-400' : 'text-rose-400'}`}>
                {rni > 0 ? `+${rni}%` : `${rni}%`}
              </p>
              <p className="text-[10px] text-slate-500 font-mono">per year</p>
            </div>
          </div>

          {/* Demographic Transition 5-Stage Diagram with Marker */}
          <div className="p-5 rounded-2xl bg-[#0c101c] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-teal-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Demographic Transition Model (5 Stages)
                </h4>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                Active: Stage {dtmStage}
              </span>
            </div>

            {/* Stages Grid representation */}
            <div className="grid grid-cols-5 gap-2 h-44 bg-slate-950 rounded-xl border border-slate-800 p-2 relative">
              {[
                { stage: 1, name: 'High Stat.', desc: 'High CBR & CDR' },
                { stage: 2, name: 'Early Exp.', desc: 'CDR drops fast' },
                { stage: 3, name: 'Late Exp.', desc: 'CBR falls' },
                { stage: 4, name: 'Low Stat.', desc: 'Low CBR & CDR' },
                { stage: 5, name: 'Declining', desc: 'CBR < CDR' },
              ].map((s) => (
                <div
                  key={s.stage}
                  className={`rounded-lg border p-2 flex flex-col justify-between transition-all ${
                    dtmStage === s.stage
                      ? 'bg-teal-950/60 border-teal-500 shadow-lg shadow-teal-500/20'
                      : 'bg-slate-900/40 border-slate-800/80'
                  }`}
                >
                  <div>
                    <span className={`text-[10px] font-bold font-mono ${dtmStage === s.stage ? 'text-teal-300' : 'text-slate-500'}`}>
                      Stage {s.stage}
                    </span>
                    <p className="text-xs font-bold text-white mt-0.5 line-clamp-1">{s.name}</p>
                    <p className="text-[9px] text-slate-400 mt-1">{s.desc}</p>
                  </div>
                  {dtmStage === s.stage && (
                    <span className="text-[9px] font-semibold text-teal-400 bg-teal-950 py-0.5 px-1 rounded text-center border border-teal-500/30">
                      CURRENT
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Age-Sex Population Pyramid Visualization */}
          <div className="p-5 rounded-2xl bg-[#0c101c] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Population Pyramid (Age-Sex Cohorts)
                </h4>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Dependency Ratio: <strong className="text-white">{dependencyRatio}%</strong>
              </span>
            </div>

            {/* Pyramid Cohort Bars */}
            <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800">
              
              {/* Cohort 3: Elderly (65+) */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>Elderly (65+ yrs)</span>
                  <span>{elderlyPct.toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-center gap-1 h-6">
                  <div
                    className="h-full bg-gradient-to-l from-indigo-500 to-indigo-700 rounded-l"
                    style={{ width: `${(elderlyPct / 2) * 2}%` }}
                  />
                  <div className="w-0.5 h-full bg-slate-700" />
                  <div
                    className="h-full bg-gradient-to-r from-rose-500 to-rose-700 rounded-r"
                    style={{ width: `${(elderlyPct / 2) * 2}%` }}
                  />
                </div>
              </div>

              {/* Cohort 2: Working Age (15-64) */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>Working Age (15–64 yrs)</span>
                  <span>{workingPct.toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-center gap-1 h-10">
                  <div
                    className="h-full bg-gradient-to-l from-indigo-500 to-indigo-700 rounded-l"
                    style={{ width: `${(workingPct / 2) * 1.5}%` }}
                  />
                  <div className="w-0.5 h-full bg-slate-700" />
                  <div
                    className="h-full bg-gradient-to-r from-rose-500 to-rose-700 rounded-r"
                    style={{ width: `${(workingPct / 2) * 1.5}%` }}
                  />
                </div>
              </div>

              {/* Cohort 1: Youth (0-14) */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>Youth (0–14 yrs)</span>
                  <span>{youthPct.toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-center gap-1 h-8">
                  <div
                    className="h-full bg-gradient-to-l from-indigo-500 to-indigo-700 rounded-l"
                    style={{ width: `${(youthPct / 2) * 1.8}%` }}
                  />
                  <div className="w-0.5 h-full bg-slate-700" />
                  <div
                    className="h-full bg-gradient-to-r from-rose-500 to-rose-700 rounded-r"
                    style={{ width: `${(youthPct / 2) * 1.8}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800">
                <span>◀ Male Population</span>
                <span>Female Population ▶</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Controls & Modes (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Mode 1: Sliders Dock */}
          {activeMode === 'explore' && (
            <div className="p-5 rounded-2xl bg-[#111726] border border-slate-800 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-teal-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                    Demographic Drivers
                  </h3>
                </div>
                <button
                  onClick={handleLogData}
                  className="px-2.5 py-1 rounded-md bg-teal-600/20 hover:bg-teal-600 text-teal-300 hover:text-white text-xs font-semibold border border-teal-500/30 transition-colors"
                >
                  + Record Trial
                </button>
              </div>

              {/* Crude Birth Rate */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">Crude Birth Rate (CBR)</span>
                  <span className="font-mono text-teal-400 font-bold">{cbr} / 1000</span>
                </div>
                <input
                  type="range"
                  min={8}
                  max={50}
                  step={1}
                  value={cbr}
                  onChange={(e) => setCbr(Number(e.target.value))}
                  className="w-full accent-teal-500 cursor-pointer"
                />
              </div>

              {/* Crude Death Rate */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">Crude Death Rate (CDR)</span>
                  <span className="font-mono text-teal-400 font-bold">{cdr} / 1000</span>
                </div>
                <input
                  type="range"
                  min={6}
                  max={45}
                  step={1}
                  value={cdr}
                  onChange={(e) => setCdr(Number(e.target.value))}
                  className="w-full accent-teal-500 cursor-pointer"
                />
              </div>

              {/* Healthcare & Clean Water */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <HeartPulse className="w-3.5 h-3.5 text-rose-400" /> Healthcare Access
                  </span>
                  <span className="font-mono text-teal-400 font-bold">{healthcare}%</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={100}
                  step={5}
                  value={healthcare}
                  onChange={(e) => setHealthcare(Number(e.target.value))}
                  className="w-full accent-teal-500 cursor-pointer"
                />
              </div>

              {/* Female Literacy */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-indigo-400" /> Female Literacy & Careers
                  </span>
                  <span className="font-mono text-teal-400 font-bold">{femaleEdu}%</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={100}
                  step={5}
                  value={femaleEdu}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setFemaleEdu(val);
                    // Automatic correlation: higher female education lowers birth rate
                    setCbr(Math.max(10, Math.round(50 - (val / 100) * 35)));
                  }}
                  className="w-full accent-teal-500 cursor-pointer"
                />
              </div>

              {/* Doubling time and dependency callout */}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5 text-xs">
                <p className="font-semibold text-slate-200">Rule of 70 (Doubling Time):</p>
                <p className="font-mono text-teal-400 text-xs">
                  T_d = 70 / RNI = 70 / {rni}% = <strong className="text-white">{doublingTimeYears} years</strong>
                </p>
                <p className="text-slate-400 text-[11px]">
                  At current growth rate, this population doubles every {doublingTimeYears} years.
                </p>
              </div>
            </div>
          )}

          {/* Mode 2: Predict */}
          {activeMode === 'predict' && (
            <div className="p-5 rounded-2xl bg-[#111726] border border-slate-800 space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                  Predict → Experiment → Explain
                </span>
                <h3 className="text-sm font-bold text-white mt-1">
                  Transition from Stage 2 to Stage 3
                </h3>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                What is the primary socioeconomic driver causing the birth rate (CBR) to drop sharply in Stage 3?
              </div>

              <div className="space-y-2">
                {[
                  { id: 'a', label: 'Female education, careers, and widespread family planning' },
                  { id: 'b', label: 'Sudden famine and disease epidemics' },
                  { id: 'c', label: 'Decline in medical hospitals' },
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
                    setPredictionFeedback('Correct! In Stage 3, urbanization, increased female literacy and employment opportunities lead to delayed marriages and smaller desired family sizes.');
                  } else {
                    setPredictionFeedback('Incorrect. Famine and disease increase death rates, not birth rate decline. Stage 3 birth rate drop is driven by female empowerment and family planning.');
                  }
                }}
                disabled={!predictionAnswer}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs shadow-lg transition-all"
              >
                Submit Prediction
              </button>

              {predictionFeedback && (
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 space-y-1 animate-in fade-in">
                  <p className="font-semibold text-white">Curriculum Explanation:</p>
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
                    Stage 4 Stabilization Challenge
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                  Intermediate
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white">
                  Model a Stable Stage 4 Developed Country
                </h4>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Adjust CBR, CDR, and female literacy to achieve Stage 4 with Natural Increase Rate between 0.0% and 0.4%/yr.
                </p>
              </div>

              {challengeSuccess ? (
                <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/50 text-center space-y-2 animate-in zoom-in-95">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <p className="text-sm font-bold text-emerald-300">Stage 4 Equilibrium Achieved!</p>
                  <p className="text-xs text-slate-300">
                    Low birth rate balanced with low death rate, creating a columnar beehive pyramid.
                  </p>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
                  <span className="text-slate-300 font-semibold">Current State:</span>{' '}
                  <span className="font-mono text-teal-400 font-bold">{stageName}</span> (Target: Stage 4)
                </div>
              )}
            </div>
          )}

          {/* Mode 4: Log Table */}
          {activeMode === 'log' && (
            <div className="p-5 rounded-2xl bg-[#111726] border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  Demographic Trials ({experimentLogs.length})
                </h3>
                <button
                  onClick={handleExportCSV}
                  disabled={experimentLogs.length === 0}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-semibold border border-slate-700"
                >
                  <Download className="w-3.5 h-3.5 text-teal-400" />
                  <span>Export CSV</span>
                </button>
              </div>

              {experimentLogs.length > 0 ? (
                <div className="max-h-72 overflow-y-auto space-y-2">
                  {experimentLogs.map((log) => (
                    <div key={log.id} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] space-y-1 font-mono">
                      <div className="flex justify-between text-slate-400">
                        <span>{log.timestamp}</span>
                        <span className="text-teal-400 font-bold">{log.measurements['Natural Increase (%/yr)']}</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>{log.measurements['DTM Stage']}</span>
                        <span>Dep = {log.measurements['Dependency Ratio']}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-6 text-xs text-slate-500">
                  No trials recorded yet. Adjust demographic drivers and click "+ Record Trial".
                </p>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
