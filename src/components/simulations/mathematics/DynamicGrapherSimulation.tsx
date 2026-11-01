import React, { useState, useEffect, useRef } from 'react';
import { 
  Sigma, 
  RotateCcw, 
  Award, 
  CheckCircle2, 
  Download, 
  Sliders, 
  TrendingUp, 
  Move
} from 'lucide-react';
import { SIMULATIONS_REGISTRY } from '../../../data/simulationsRegistry';
import { SimulationLogEntry } from '../../../types/simulation';

interface DynamicGrapherProps {
  onBack: () => void;
}

export const DynamicGrapherSimulation: React.FC<DynamicGrapherProps> = ({ onBack }) => {
  const metadata = SIMULATIONS_REGISTRY['math-dynamic-grapher'];

  // State parameters
  const [funcType, setFuncType] = useState<'linear' | 'quadratic' | 'reciprocal'>('quadratic');
  const [coeffA, setCoeffA] = useState<number>(1.0); // a
  const [coeffB, setCoeffB] = useState<number>(-2.0); // b
  const [coeffC, setCoeffC] = useState<number>(-3.0); // c
  const [tangentX, setTangentX] = useState<number>(1.0); // x_0
  const [showTangent, setShowTangent] = useState<boolean>(true);
  const [showRoots, setShowRoots] = useState<boolean>(true);
  const [activeMode, setActiveMode] = useState<'explore' | 'predict' | 'challenge' | 'log'>('explore');

  // Challenge & Logs
  const [challengeSuccess, setChallengeSuccess] = useState<boolean>(false);
  const [experimentLogs, setExperimentLogs] = useState<SimulationLogEntry[]>([]);
  const [predictionAnswer, setPredictionAnswer] = useState<string | null>(null);
  const [predictionFeedback, setPredictionFeedback] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Function evaluation: f(x)
  const evalFunc = (x: number): number => {
    if (funcType === 'linear') {
      return coeffA * x + coeffC;
    } else if (funcType === 'quadratic') {
      return coeffA * x * x + coeffB * x + coeffC;
    } else {
      return x !== 0 ? coeffA / x : NaN;
    }
  };

  // Tangent slope evaluation: f'(x)
  const evalGradient = (x: number): number => {
    if (funcType === 'linear') {
      return coeffA;
    } else if (funcType === 'quadratic') {
      return 2 * coeffA * x + coeffB;
    } else {
      return -coeffA / (x * x);
    }
  };

  const pointY = evalFunc(tangentX);
  const tangentSlope = evalGradient(tangentX);

  // Quadratic vertex: x = -b / (2a)
  const vertexX = funcType === 'quadratic' && coeffA !== 0 ? -coeffB / (2 * coeffA) : null;
  const vertexY = vertexX !== null ? evalFunc(vertexX) : null;

  // Roots: Discriminant Δ = b^2 - 4ac
  const discriminant = coeffB * coeffB - 4 * coeffA * coeffC;
  let root1: number | null = null;
  let root2: number | null = null;
  if (funcType === 'quadratic' && coeffA !== 0 && discriminant >= 0) {
    root1 = (-coeffB + Math.sqrt(discriminant)) / (2 * coeffA);
    root2 = (-coeffB - Math.sqrt(discriminant)) / (2 * coeffA);
  }

  // Challenge evaluation: Gradient close to 0.00
  useEffect(() => {
    if (activeMode === 'challenge') {
      if (Math.abs(tangentSlope) <= 0.08) {
        setChallengeSuccess(true);
      } else {
        setChallengeSuccess(false);
      }
    }
  }, [tangentSlope, activeMode]);

  // Canvas Coordinate Plotting Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Coordinate domain: x in [-10, 10], y in [-10, 10]
    const xMin = -10;
    const xMax = 10;
    const yMin = -10;
    const yMax = 10;

    const toCanvasX = (x: number) => ((x - xMin) / (xMax - xMin)) * width;
    const toCanvasY = (y: number) => height - ((y - yMin) / (yMax - yMin)) * height;

    ctx.clearRect(0, 0, width, height);

    // Draw Background Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;

    for (let x = xMin; x <= xMax; x += 1) {
      const cx = toCanvasX(x);
      ctx.beginPath();
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, height);
      ctx.stroke();
    }
    for (let y = yMin; y <= yMax; y += 1) {
      const cy = toCanvasY(y);
      ctx.beginPath();
      ctx.moveTo(0, cy);
      ctx.lineTo(width, cy);
      ctx.stroke();
    }

    // Draw Major Coordinate Axes (X & Y)
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;

    // X Axis (y = 0)
    const cyZero = toCanvasY(0);
    ctx.beginPath();
    ctx.moveTo(0, cyZero);
    ctx.lineTo(width, cyZero);
    ctx.stroke();

    // Y Axis (x = 0)
    const cxZero = toCanvasX(0);
    ctx.beginPath();
    ctx.moveTo(cxZero, 0);
    ctx.lineTo(cxZero, height);
    ctx.stroke();

    // Axis Labels numbers
    ctx.fillStyle = '#64748b';
    ctx.font = '10px monospace';
    for (let x = -8; x <= 8; x += 2) {
      if (x !== 0) ctx.fillText(String(x), toCanvasX(x) - 6, cyZero + 14);
    }
    for (let y = -8; y <= 8; y += 2) {
      if (y !== 0) ctx.fillText(String(y), cxZero + 6, toCanvasY(y) + 3);
    }
    ctx.fillText('0', cxZero - 12, cyZero + 14);

    // Plot Curve f(x)
    ctx.strokeStyle = '#818cf8'; // Indigo curve
    ctx.lineWidth = 3;
    ctx.beginPath();
    let isFirst = true;

    for (let px = 0; px <= width; px += 2) {
      const x = xMin + (px / width) * (xMax - xMin);
      const y = evalFunc(x);

      if (isNaN(y) || y < yMin - 10 || y > yMax + 10) {
        isFirst = true;
        continue;
      }

      const cy = toCanvasY(y);
      if (isFirst) {
        ctx.moveTo(px, cy);
        isFirst = false;
      } else {
        ctx.lineTo(px, cy);
      }
    }
    ctx.stroke();

    // Plot Roots (x-intercepts)
    if (showRoots && funcType === 'quadratic') {
      [root1, root2].forEach((r) => {
        if (r !== null && r >= xMin && r <= xMax) {
          const rx = toCanvasX(r);
          const ry = toCanvasY(0);
          ctx.fillStyle = '#34d399'; // Emerald
          ctx.beginPath();
          ctx.arc(rx, ry, 5, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    }

    // Plot Vertex (Turning point)
    if (vertexX !== null && vertexY !== null) {
      const vx = toCanvasX(vertexX);
      const vy = toCanvasY(vertexY);
      ctx.fillStyle = '#f59e0b'; // Amber
      ctx.beginPath();
      ctx.arc(vx, vy, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    // Plot Tangent Line & Point
    if (showTangent && !isNaN(pointY)) {
      const tx = toCanvasX(tangentX);
      const ty = toCanvasY(pointY);

      // Tangent line equation: y = m(x - x0) + y0
      const xLineMin = tangentX - 4;
      const xLineMax = tangentX + 4;
      const yLine1 = tangentSlope * (xLineMin - tangentX) + pointY;
      const yLine2 = tangentSlope * (xLineMax - tangentX) + pointY;

      ctx.strokeStyle = '#f43f5e'; // Rose tangent line
      ctx.lineWidth = 2.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(toCanvasX(xLineMin), toCanvasY(yLine1));
      ctx.lineTo(toCanvasX(xLineMax), toCanvasY(yLine2));
      ctx.stroke();
      ctx.setLineDash([]);

      // Tangent point marker
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(tx, ty, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }, [funcType, coeffA, coeffB, coeffC, tangentX, showTangent, showRoots, pointY, tangentSlope]);

  const handleLogData = () => {
    const newEntry: SimulationLogEntry = {
      id: `math-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      parameters: {
        'Curve': `${coeffA}x² + ${coeffB}x + ${coeffC}`,
        'Tangent Point (x_0)': tangentX,
      },
      measurements: {
        'Tangent Gradient (m)': tangentSlope.toFixed(2),
        'Coordinates (x, y)': `(${tangentX}, ${pointY.toFixed(2)})`,
        'Vertex': vertexX !== null ? `(${vertexX.toFixed(2)}, ${vertexY?.toFixed(2)})` : 'None',
      },
      notes: `Slope: ${tangentSlope > 0 ? 'Positive' : tangentSlope < 0 ? 'Negative' : 'Zero'}`
    };
    setExperimentLogs([newEntry, ...experimentLogs]);
  };

  const handleExportCSV = () => {
    if (experimentLogs.length === 0) return;
    const headers = ['Timestamp', 'Curve', 'x_0', 'Tangent Slope (m)', 'Coordinates', 'Vertex', 'Notes'];
    const rows = experimentLogs.map(l => [
      l.timestamp,
      l.parameters['Curve'],
      l.parameters['Tangent Point (x_0)'],
      l.measurements['Tangent Gradient (m)'],
      l.measurements['Coordinates (x, y)'],
      l.measurements['Vertex'],
      l.notes
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `IGCSE_Math_Grapher_Lab_${Date.now()}.csv`);
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
            <span className="font-mono text-xs text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/30">
              CAIE 0580.2.3.1
            </span>
            <h1 className="text-base sm:text-lg font-bold text-white">
              Dynamic Function Grapher & Tangent Slopes
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Dynamic algebraic graphing, roots, turning points, and instantaneous tangent gradients.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 self-stretch sm:self-auto overflow-x-auto">
          <button
            onClick={() => setActiveMode('explore')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeMode === 'explore'
                ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Explore Grapher
          </button>
          <button
            onClick={() => setActiveMode('predict')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeMode === 'predict'
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
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
            Zero-Gradient Challenge
          </button>
          <button
            onClick={() => setActiveMode('log')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeMode === 'log'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Data Log ({experimentLogs.length})
          </button>
        </div>
      </div>

      {/* Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: 2D Cartesian Coordinate Graph (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          <div className="relative rounded-2xl bg-[#0c101c] border border-slate-800 p-6 shadow-2xl flex flex-col justify-between">
            
            {/* Top Toolbar */}
            <div className="flex items-center justify-between mb-4 z-10 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-indigo-300 bg-indigo-950/60 px-3 py-1 rounded border border-indigo-500/30">
                  {funcType === 'quadratic' 
                    ? `y = ${coeffA}x² ${coeffB >= 0 ? `+ ${coeffB}x` : `- ${Math.abs(coeffB)}x`} ${coeffC >= 0 ? `+ ${coeffC}` : `- ${Math.abs(coeffC)}`}`
                    : funcType === 'linear'
                    ? `y = ${coeffA}x ${coeffC >= 0 ? `+ ${coeffC}` : `- ${Math.abs(coeffC)}`}`
                    : `y = ${coeffA} / x`}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowTangent(!showTangent)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                    showTangent
                      ? 'bg-rose-950/60 text-rose-300 border-rose-500/40'
                      : 'bg-slate-900 text-slate-500 border-slate-800'
                  }`}
                >
                  Tangent Line
                </button>
                <button
                  onClick={() => setShowRoots(!showRoots)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                    showRoots
                      ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-900 text-slate-500 border-slate-800'
                  }`}
                >
                  Roots (x=0)
                </button>
                <button
                  onClick={() => {
                    setCoeffA(1);
                    setCoeffB(-2);
                    setCoeffC(-3);
                    setTangentX(1.0);
                  }}
                  className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700"
                  title="Reset Equation"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Coordinate Plane Canvas */}
            <div className="relative w-full aspect-[16/10] bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center">
              <canvas
                ref={canvasRef}
                width={700}
                height={420}
                className="w-full h-full block"
              />

              {/* Tangent Slope HUD badge */}
              <div className="absolute top-3 right-3 bg-slate-900/90 border border-slate-700 backdrop-blur rounded-xl p-3 shadow-xl">
                <p className="text-[10px] font-mono text-slate-400 uppercase">Instantaneous Tangent Gradient</p>
                <p className="text-2xl font-black font-mono text-rose-400">
                  m = {tangentSlope.toFixed(2)}
                </p>
                <p className="text-[11px] font-mono text-slate-300 mt-0.5">
                  Point ({tangentX.toFixed(1)}, {pointY.toFixed(1)})
                </p>
              </div>
            </div>

            {/* Legend & Callouts */}
            <div className="mt-3 flex flex-wrap items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-1 bg-indigo-400 rounded-full" /> Curve f(x)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-rose-400 rounded-full border border-dashed" /> Tangent
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-amber-400 rounded-full" /> Vertex Turning Point
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full" /> Roots (y=0)
                </span>
              </div>
            </div>

          </div>

          {/* Mathematical Insights Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] uppercase font-semibold text-slate-400">Y-Intercept</span>
              <p className="text-base font-bold font-mono text-indigo-400 mt-0.5">(0, {coeffC})</p>
              <p className="text-[10px] text-slate-500 mt-0.5">When x = 0</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] uppercase font-semibold text-slate-400">Turning Point</span>
              <p className="text-base font-bold font-mono text-amber-400 mt-0.5">
                {vertexX !== null ? `(${vertexX.toFixed(1)}, ${vertexY?.toFixed(1)})` : 'N/A'}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">x = -b / (2a)</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] uppercase font-semibold text-slate-400">Discriminant (b² - 4ac)</span>
              <p className="text-base font-bold font-mono text-cyan-400 mt-0.5">{discriminant.toFixed(1)}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                {discriminant > 0 ? '2 Real Roots' : discriminant === 0 ? '1 Repeated Root' : 'No Real Roots'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] uppercase font-semibold text-slate-400">Tangent Gradient</span>
              <p className="text-base font-bold font-mono text-rose-400 mt-0.5">{tangentSlope.toFixed(2)}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">dy/dx = 2ax + b</p>
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
                  <Sliders className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                    Function Parameters
                  </h3>
                </div>
                <button
                  onClick={handleLogData}
                  className="px-2.5 py-1 rounded-md bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-semibold border border-indigo-500/30 transition-colors"
                >
                  + Record Point
                </button>
              </div>

              {/* Function Family Type */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-300">Curve Family:</span>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => setFuncType('quadratic')}
                    className={`p-2 rounded-lg text-xs font-semibold border transition-all text-center ${
                      funcType === 'quadratic'
                        ? 'bg-indigo-950/60 text-indigo-300 border-indigo-500/50'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    Quadratic (ax²+bx+c)
                  </button>
                  <button
                    onClick={() => setFuncType('linear')}
                    className={`p-2 rounded-lg text-xs font-semibold border transition-all text-center ${
                      funcType === 'linear'
                        ? 'bg-indigo-950/60 text-indigo-300 border-indigo-500/50'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    Linear (mx+c)
                  </button>
                  <button
                    onClick={() => setFuncType('reciprocal')}
                    className={`p-2 rounded-lg text-xs font-semibold border transition-all text-center ${
                      funcType === 'reciprocal'
                        ? 'bg-indigo-950/60 text-indigo-300 border-indigo-500/50'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    Reciprocal (k/x)
                  </button>
                </div>
              </div>

              {/* Slider 1: Tangent Position Slider */}
              <div className="space-y-2 p-3 bg-rose-950/20 rounded-xl border border-rose-500/20">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-rose-300 flex items-center gap-1.5">
                    <Move className="w-3.5 h-3.5" /> Tangent Position (x_0)
                  </span>
                  <span className="font-mono text-rose-400 font-bold">{tangentX.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min={-6}
                  max={6}
                  step={0.2}
                  value={tangentX}
                  onChange={(e) => setTangentX(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>-6.0</span>
                  <span>0.0</span>
                  <span>+6.0</span>
                </div>
              </div>

              {/* Slider 2: Coeff A */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">Coefficient a (Curvature)</span>
                  <span className="font-mono text-indigo-400 font-bold">{coeffA}</span>
                </div>
                <input
                  type="range"
                  min={-3}
                  max={3}
                  step={0.5}
                  value={coeffA}
                  onChange={(e) => setCoeffA(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              {/* Slider 3: Coeff B */}
              {funcType === 'quadratic' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300">Coefficient b (Shift)</span>
                    <span className="font-mono text-indigo-400 font-bold">{coeffB}</span>
                  </div>
                  <input
                    type="range"
                    min={-6}
                    max={6}
                    step={0.5}
                    value={coeffB}
                    onChange={(e) => setCoeffB(Number(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>
              )}

              {/* Slider 4: Coeff C (y-intercept) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">Constant c (y-intercept)</span>
                  <span className="font-mono text-indigo-400 font-bold">{coeffC}</span>
                </div>
                <input
                  type="range"
                  min={-8}
                  max={8}
                  step={0.5}
                  value={coeffC}
                  onChange={(e) => setCoeffC(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              {/* Cambridge Tip */}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5 text-xs">
                <p className="font-semibold text-indigo-400">Cambridge IGCSE Exam Technique:</p>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  To estimate the gradient of a curve at point P: draw a straight line touching the curve at P without crossing it, form a right-angled triangle, and compute Δy / Δx.
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
                  Gradient at a Turning Point
                </h3>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                What is the exact gradient of the tangent line at the vertex (turning point) of any quadratic parabola?
              </div>

              <div className="space-y-2">
                {[
                  { id: 'a', label: 'Exactly 0 (Horizontal line)' },
                  { id: 'b', label: 'Equal to coefficient a' },
                  { id: 'c', label: 'Infinite (Vertical line)' },
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
                    setPredictionFeedback('Correct! At a maximum or minimum turning point, the curve momentarily stops rising or falling; hence the instantaneous rate of change and tangent gradient is exactly zero (m = 0).');
                  } else {
                    setPredictionFeedback('Incorrect. The tangent at a turning point is completely flat (horizontal), meaning its gradient is 0.');
                  }
                }}
                disabled={!predictionAnswer}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs shadow-lg transition-all"
              >
                Submit Answer
              </button>

              {predictionFeedback && (
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 space-y-1 animate-in fade-in">
                  <p className="font-semibold text-white">Mathematical Explanation:</p>
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
                    Stationary Point Challenge
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                  Intermediate
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white">
                  Locate the Stationary Point (Gradient m = 0.00)
                </h4>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  For the curve y = x² - 2x - 3, slide the tangent position x_0 until the tangent slope m is 0.00 (± 0.08).
                </p>
              </div>

              {challengeSuccess ? (
                <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/50 text-center space-y-2 animate-in zoom-in-95">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <p className="text-sm font-bold text-emerald-300">Stationary Point Found!</p>
                  <p className="text-xs text-slate-300">
                    At x = 1.0, dy/dx = 2(1) - 2 = 0. The parabola reaches its minimum turning point!
                  </p>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
                  <span className="text-slate-300 font-semibold">Current Gradient:</span>{' '}
                  <span className="font-mono text-rose-400 font-bold">{tangentSlope.toFixed(2)}</span> (Target: 0.00)
                </div>
              )}
            </div>
          )}

          {/* Mode 4: Experiment Log */}
          {activeMode === 'log' && (
            <div className="p-5 rounded-2xl bg-[#111726] border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  Coordinate Records ({experimentLogs.length})
                </h3>
                <button
                  onClick={handleExportCSV}
                  disabled={experimentLogs.length === 0}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-semibold border border-slate-700"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Export CSV</span>
                </button>
              </div>

              {experimentLogs.length > 0 ? (
                <div className="max-h-72 overflow-y-auto space-y-2">
                  {experimentLogs.map((log) => (
                    <div key={log.id} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] space-y-1 font-mono">
                      <div className="flex justify-between text-slate-400">
                        <span>{log.timestamp}</span>
                        <span className="text-rose-400 font-bold">m = {log.measurements['Tangent Gradient (m)']}</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>{log.measurements['Coordinates (x, y)']}</span>
                        <span>{log.parameters['Curve']}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-6 text-xs text-slate-500">
                  No records yet. Move the tangent and click "+ Record Point".
                </p>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

