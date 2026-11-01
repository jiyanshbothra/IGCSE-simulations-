import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  RotateCcw, 
  Award, 
  CheckCircle2, 
  Download, 
  Sliders, 
  Zap, 
  ToggleLeft, 
  ToggleRight 
} from 'lucide-react';
import { SIMULATIONS_REGISTRY } from '../../../data/simulationsRegistry';
import { SimulationLogEntry } from '../../../types/simulation';

interface LogicGatesSimulationProps {
  onBack: () => void;
}

type GateType = 'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR';

export const LogicGatesSimulation: React.FC<LogicGatesSimulationProps> = ({ onBack }) => {
  const metadata = SIMULATIONS_REGISTRY['cs-logic-gates'];

  // State parameters
  const [inputA, setInputA] = useState<0 | 1>(0);
  const [inputB, setInputB] = useState<0 | 1>(0);
  const [selectedGate, setSelectedGate] = useState<GateType>('AND');
  const [enableOutputInverter, setEnableOutputInverter] = useState<boolean>(false);
  const [activeMode, setActiveMode] = useState<'explore' | 'predict' | 'challenge' | 'log'>('explore');

  // Challenge & Logs
  const [challengeSuccess, setChallengeSuccess] = useState<boolean>(false);
  const [experimentLogs, setExperimentLogs] = useState<SimulationLogEntry[]>([]);
  const [predictionAnswer, setPredictionAnswer] = useState<string | null>(null);
  const [predictionFeedback, setPredictionFeedback] = useState<string | null>(null);

  // Logic calculation for Gate 1:
  const computeGateOutput = (a: 0 | 1, b: 0 | 1, gate: GateType): 0 | 1 => {
    switch (gate) {
      case 'AND': return (a === 1 && b === 1) ? 1 : 0;
      case 'OR': return (a === 1 || b === 1) ? 1 : 0;
      case 'NOT': return a === 0 ? 1 : 0;
      case 'NAND': return !(a === 1 && b === 1) ? 1 : 0;
      case 'NOR': return !(a === 1 || b === 1) ? 1 : 0;
      case 'XOR': return (a !== b) ? 1 : 0;
    }
  };

  const gate1Output = computeGateOutput(inputA, inputB, selectedGate);
  const finalOutputQ = enableOutputInverter ? (gate1Output === 0 ? 1 : 0) : gate1Output;

  // Boolean Expression string
  const getBooleanExpression = (): string => {
    let base = '';
    switch (selectedGate) {
      case 'AND': base = 'A · B'; break;
      case 'OR': base = 'A + B'; break;
      case 'NOT': base = 'NOT A'; break;
      case 'NAND': base = 'NOT(A · B)'; break;
      case 'NOR': base = 'NOT(A + B)'; break;
      case 'XOR': base = 'A ⊕ B'; break;
    }
    return enableOutputInverter ? `NOT(${base})` : base;
  };

  // Truth table generator
  const truthTableRows = [
    { a: 0 as const, b: 0 as const },
    { a: 0 as const, b: 1 as const },
    { a: 1 as const, b: 0 as const },
    { a: 1 as const, b: 1 as const },
  ].map((row) => {
    const g1 = computeGateOutput(row.a, row.b, selectedGate);
    const q = enableOutputInverter ? (g1 === 0 ? 1 : 0) : g1;
    const isCurrent = row.a === inputA && (selectedGate === 'NOT' || row.b === inputB);
    return { ...row, g1, q, isCurrent };
  });

  // Challenge evaluation: XOR logic
  useEffect(() => {
    if (activeMode === 'challenge') {
      const isXorBehavior = 
        computeGateOutput(0, 0, selectedGate) === 0 &&
        computeGateOutput(0, 1, selectedGate) === 1 &&
        computeGateOutput(1, 0, selectedGate) === 1 &&
        computeGateOutput(1, 1, selectedGate) === 0 &&
        !enableOutputInverter;

      if (isXorBehavior && finalOutputQ === 1) {
        setChallengeSuccess(true);
      } else {
        setChallengeSuccess(false);
      }
    }
  }, [selectedGate, enableOutputInverter, finalOutputQ, activeMode]);

  const handleLogData = () => {
    const newEntry: SimulationLogEntry = {
      id: `cs-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      parameters: {
        'Input A': inputA,
        'Input B': selectedGate === 'NOT' ? 'N/A' : inputB,
        'Gate Type': selectedGate,
      },
      measurements: {
        'Output Q': finalOutputQ,
        'Intermediate X': gate1Output,
        'Expression': getBooleanExpression(),
      },
      notes: `Inverter: ${enableOutputInverter ? 'Active' : 'Bypassed'}`
    };
    setExperimentLogs([newEntry, ...experimentLogs]);
  };

  const handleExportCSV = () => {
    if (experimentLogs.length === 0) return;
    const headers = ['Timestamp', 'Input A', 'Input B', 'Gate', 'Output Q', 'Expression', 'Notes'];
    const rows = experimentLogs.map(l => [
      l.timestamp,
      l.parameters['Input A'],
      l.parameters['Input B'],
      l.parameters['Gate Type'],
      l.measurements['Output Q'],
      l.measurements['Expression'],
      l.notes
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `IGCSE_Logic_Gates_Lab_${Date.now()}.csv`);
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
            <span className="font-mono text-xs text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-500/30">
              CAIE 0478.10.1.1
            </span>
            <h1 className="text-base sm:text-lg font-bold text-white">
              Interactive Logic Gate Breadboard & Truth Table Verifier
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Build and probe combinational logic circuits: AND, OR, NOT, NAND, NOR, and XOR.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 self-stretch sm:self-auto overflow-x-auto">
          <button
            onClick={() => setActiveMode('explore')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeMode === 'explore'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Explore Breadboard
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
            XOR Gate Challenge
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
        
        {/* Left Column: Virtual Circuit Breadboard Canvas (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          <div className="relative rounded-2xl bg-[#0c101c] border border-slate-800 p-6 shadow-2xl flex flex-col justify-between min-h-[460px]">
            
            {/* Top Bar Readout */}
            <div className="flex items-center justify-between mb-4 z-10 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-rose-300 bg-rose-950/60 px-3 py-1 rounded border border-rose-500/30">
                  Q = {getBooleanExpression()}
                </span>
              </div>

              <button
                onClick={() => {
                  setInputA(0);
                  setInputB(0);
                  setSelectedGate('AND');
                  setEnableOutputInverter(false);
                }}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                title="Reset Breadboard"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Virtual Breadboard Schematic Container */}
            <div className="relative w-full aspect-[16/10] bg-slate-950 rounded-xl border border-slate-800 p-8 flex items-center justify-between overflow-hidden">
              
              {/* Left Side: Binary Input Switches */}
              <div className="flex flex-col gap-10 z-10">
                
                {/* Switch A */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setInputA(inputA === 1 ? 0 : 1)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl font-mono text-xs font-bold border transition-all ${
                      inputA === 1
                        ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500 shadow-lg shadow-emerald-500/20'
                        : 'bg-slate-900 text-slate-500 border-slate-800'
                    }`}
                  >
                    <span>Switch A</span>
                    <span className="text-base">{inputA === 1 ? '1' : '0'}</span>
                  </button>
                  <div
                    className={`h-1.5 w-16 transition-colors duration-200 ${
                      inputA === 1 ? 'bg-emerald-400 shadow-[0_0_10px_#10b981]' : 'bg-slate-800'
                    }`}
                  />
                </div>

                {/* Switch B (Only if not single-input NOT gate) */}
                {selectedGate !== 'NOT' ? (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setInputB(inputB === 1 ? 0 : 1)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl font-mono text-xs font-bold border transition-all ${
                        inputB === 1
                          ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500 shadow-lg shadow-emerald-500/20'
                          : 'bg-slate-900 text-slate-500 border-slate-800'
                      }`}
                    >
                      <span>Switch B</span>
                      <span className="text-base">{inputB === 1 ? '1' : '0'}</span>
                    </button>
                    <div
                      className={`h-1.5 w-16 transition-colors duration-200 ${
                        inputB === 1 ? 'bg-emerald-400 shadow-[0_0_10px_#10b981]' : 'bg-slate-800'
                      }`}
                    />
                  </div>
                ) : (
                  <div className="h-10 text-[11px] text-slate-600 font-mono flex items-center">
                    [Single input gate]
                  </div>
                )}

              </div>

              {/* Center: Selected Logic Gate IC Component */}
              <div className="flex flex-col items-center z-10">
                <div className="w-36 h-28 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-rose-500/50 p-3 shadow-2xl flex flex-col items-center justify-center relative">
                  <span className="text-xl font-black font-mono tracking-widest text-white">
                    {selectedGate}
                  </span>
                  <span className="text-[10px] text-rose-400 font-semibold mt-1">
                    Standard CAIE Gate
                  </span>

                  {/* Optional Inverting bubble */}
                  {(selectedGate === 'NOT' || selectedGate === 'NAND' || selectedGate === 'NOR') && (
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-white bg-slate-900 absolute -right-4 top-1/2 -translate-y-1/2" />
                  )}
                </div>

                {/* Status Indicator */}
                <span className="text-[10px] font-mono text-slate-400 mt-2">
                  Intermediate: <strong className={gate1Output === 1 ? 'text-emerald-400' : 'text-slate-500'}>{gate1Output}</strong>
                </span>
              </div>

              {/* Trace wire between Gate 1 and Output */}
              <div
                className={`h-1.5 flex-1 transition-colors duration-200 mx-2 ${
                  gate1Output === 1 ? 'bg-emerald-400 shadow-[0_0_10px_#10b981]' : 'bg-slate-800'
                }`}
              />

              {/* Right Side: Output Digital Probe LED */}
              <div className="flex flex-col items-center gap-3 z-10">
                <div
                  className={`w-20 h-20 rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-300 ${
                    finalOutputQ === 1
                      ? 'bg-emerald-500/20 border-emerald-400 shadow-[0_0_35px_rgba(16,185,129,0.5)]'
                      : 'bg-slate-900 border-slate-800 shadow-inner'
                  }`}
                >
                  <Zap
                    className={`w-8 h-8 transition-colors ${
                      finalOutputQ === 1 ? 'text-emerald-300 fill-emerald-300' : 'text-slate-600'
                    }`}
                  />
                  <span className="text-xs font-mono font-bold text-white mt-1">
                    Q = {finalOutputQ}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 uppercase">
                  {finalOutputQ === 1 ? 'HIGH (True)' : 'LOW (False)'}
                </span>
              </div>

            </div>

            <p className="text-[11px] text-slate-400 text-center mt-3">
              💡 Toggle Switch A & B to trace current flow. The live truth table below updates automatically.
            </p>

          </div>

          {/* Dynamic Real-time Truth Table */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Automatic Dynamic Truth Table [{selectedGate}]
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                    <th className="py-2 px-3">Input A</th>
                    <th className="py-2 px-3">Input B</th>
                    <th className="py-2 px-3">Gate 1 ({selectedGate})</th>
                    <th className="py-2 px-3 text-white font-bold">Output Q</th>
                    <th className="py-2 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {truthTableRows.map((row, idx) => (
                    <tr
                      key={idx}
                      className={`transition-colors ${
                        row.isCurrent
                          ? 'bg-rose-950/40 text-rose-200 font-bold'
                          : 'text-slate-400 hover:bg-slate-800/40'
                      }`}
                    >
                      <td className="py-2 px-3">{row.a}</td>
                      <td className="py-2 px-3">{selectedGate === 'NOT' ? '—' : row.b}</td>
                      <td className="py-2 px-3">{row.g1}</td>
                      <td className="py-2 px-3 text-emerald-400 font-bold">{row.q}</td>
                      <td className="py-2 px-3 text-[11px]">
                        {row.isCurrent ? (
                          <span className="text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-500/30">
                            Active State
                          </span>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Column: Controls & Modes (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Mode 1: Gate Picker & Options */}
          {activeMode === 'explore' && (
            <div className="p-5 rounded-2xl bg-[#111726] border border-slate-800 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-rose-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                    Gate Breadboard Selector
                  </h3>
                </div>
                <button
                  onClick={handleLogData}
                  className="px-2.5 py-1 rounded-md bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white text-xs font-semibold border border-rose-500/30 transition-colors"
                >
                  + Record State
                </button>
              </div>

              {/* Logic Gate Type */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-300">Choose Logic Gate:</span>
                <div className="grid grid-cols-3 gap-2">
                  {(['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR'] as GateType[]).map((gate) => (
                    <button
                      key={gate}
                      onClick={() => setSelectedGate(gate)}
                      className={`p-2 rounded-lg text-xs font-mono font-bold border transition-all text-center ${
                        selectedGate === gate
                          ? 'bg-rose-600/30 text-rose-300 border-rose-500/50 shadow-md shadow-rose-500/10'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {gate}
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional NOT Inverter at output */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => setEnableOutputInverter(!enableOutputInverter)}
                  className={`w-full p-2.5 rounded-xl text-xs font-semibold border transition-all flex items-center justify-between ${
                    enableOutputInverter
                      ? 'bg-purple-950/60 text-purple-300 border-purple-500/40'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  <span>Connect Inverting NOT Gate to Output</span>
                  <span className="font-mono">{enableOutputInverter ? 'ON' : 'OFF'}</span>
                </button>
              </div>

              {/* Syllabus Rule Box */}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5 text-xs">
                <p className="font-semibold text-rose-400">Cambridge IGCSE Logic Gate Truths:</p>
                <ul className="text-slate-400 text-[11px] space-y-1">
                  <li>• <strong>AND</strong>: 1 only if BOTH inputs are 1.</li>
                  <li>• <strong>OR</strong>: 1 if ANY input is 1.</li>
                  <li>• <strong>XOR</strong>: 1 if inputs are DIFFERENT (0,1 or 1,0).</li>
                  <li>• <strong>NAND/NOR</strong>: Exact inversion of AND/OR.</li>
                </ul>
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
                  XOR Gate Logic Prediction
                </h3>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                If an XOR gate has Input A = 1 and Input B = 1, what will be the Output Q?
              </div>

              <div className="space-y-2">
                {[
                  { id: '0', label: 'Output 0 (LOW)' },
                  { id: '1', label: 'Output 1 (HIGH)' },
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
                  if (predictionAnswer === '0') {
                    setPredictionFeedback('Correct! An Exclusive-OR (XOR) gate gives 1 only when inputs are DIFFERENT. When both are 1 (or both are 0), the output is 0.');
                  } else {
                    setPredictionFeedback('Incorrect. Unlike an inclusive OR gate, XOR gives 0 when both inputs are 1. It requires one OR the other, but not both.');
                  }
                }}
                disabled={!predictionAnswer}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs shadow-lg transition-all"
              >
                Submit Answer
              </button>

              {predictionFeedback && (
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 space-y-1 animate-in fade-in">
                  <p className="font-semibold text-white">Logic Verification:</p>
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
                    Logic Gate Challenge
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                  Advanced
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white">
                  Configure XOR Gate with Output Q = 1
                </h4>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Select the XOR gate and set inputs so that Output Q is HIGH (1). Remember, XOR requires differing binary inputs.
                </p>
              </div>

              {challengeSuccess ? (
                <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/50 text-center space-y-2 animate-in zoom-in-95">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <p className="text-sm font-bold text-emerald-300">Boolean Challenge Solved!</p>
                  <p className="text-xs text-slate-300">
                    You configured differing binary inputs (A=1,B=0 or A=0,B=1) on an XOR gate, producing Output 1!
                  </p>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
                  <span className="text-slate-300 font-semibold">Current Gate:</span>{' '}
                  <span className="font-mono text-rose-400 font-bold">{selectedGate}</span> • Output: <span className="font-mono text-rose-400 font-bold">{finalOutputQ}</span>
                </div>
              )}
            </div>
          )}

          {/* Mode 4: Experiment Log */}
          {activeMode === 'log' && (
            <div className="p-5 rounded-2xl bg-[#111726] border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  Digital Logic Records ({experimentLogs.length})
                </h3>
                <button
                  onClick={handleExportCSV}
                  disabled={experimentLogs.length === 0}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-semibold border border-slate-700"
                >
                  <Download className="w-3.5 h-3.5 text-rose-400" />
                  <span>Export CSV</span>
                </button>
              </div>

              {experimentLogs.length > 0 ? (
                <div className="max-h-72 overflow-y-auto space-y-2">
                  {experimentLogs.map((log) => (
                    <div key={log.id} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] space-y-1 font-mono">
                      <div className="flex justify-between text-slate-400">
                        <span>{log.timestamp}</span>
                        <span className="text-emerald-400 font-bold">Q = {log.measurements['Output Q']}</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>Gate: {log.parameters['Gate Type']}</span>
                        <span>A={log.parameters['Input A']}, B={log.parameters['Input B']}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-6 text-xs text-slate-500">
                  No records yet. Probe logic states and click "+ Record State".
                </p>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
