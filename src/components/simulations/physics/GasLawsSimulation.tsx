import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Flame, 
  Snowflake, 
  Maximize2, 
  Activity, 
  Award, 
  Download, 
  HelpCircle,
  TrendingUp,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { SIMULATIONS_REGISTRY } from '../../../data/simulationsRegistry';
import { SimulationLogEntry } from '../../../types/simulation';

interface GasLawsSimulationProps {
  onBack: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  mass: number;
  color: string;
}

export const GasLawsSimulation: React.FC<GasLawsSimulationProps> = ({ onBack }) => {
  const metadata = SIMULATIONS_REGISTRY['phys-gas-laws'];
  
  // State parameters
  const [temperature, setTemperature] = useState<number>(300); // Kelvin
  const [volumeLiters, setVolumeLiters] = useState<number>(6.0); // 2 to 12 L
  const [particleCount, setParticleCount] = useState<number>(60);
  const [molecularMass, setMolecularMass] = useState<number>(4); // Helium (4) vs Oxygen (32)
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [activeMode, setActiveMode] = useState<'explore' | 'predict' | 'challenge' | 'log'>('explore');

  // Prediction state
  const [predictionHypothesis, setPredictionHypothesis] = useState<string>('');
  const [predictedDirection, setPredictedDirection] = useState<'increase' | 'decrease' | 'constant' | null>(null);
  const [predictionFeedback, setPredictionFeedback] = useState<string | null>(null);

  // Challenge state
  const [activeChallengeIdx, setActiveChallengeIdx] = useState<number>(0);
  const [challengeSuccess, setChallengeSuccess] = useState<boolean>(false);

  // Experiment Data Logging
  const [experimentLogs, setExperimentLogs] = useState<SimulationLogEntry[]>([]);

  // Canvas & Physics Loop Ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const wallCollisionsCounter = useRef<number>(0);
  const lastCollisionRateCalc = useRef<number>(Date.now());
  const [collisionRate, setCollisionRate] = useState<number>(120);

  // Live Graph History
  const [graphHistory, setGraphHistory] = useState<{ time: number; pressure: number; temp: number; volume: number }[]>([]);

  // Scientific calculation: Ideal Gas Law p = (N * k_B * T) / V
  // Scaling constant chosen for realistic IGCSE textbook numbers: at 300K, 6.0L, N=60 -> p ~ 150 kPa
  const pressureKPa = Number(((particleCount * 0.05 * temperature) / volumeLiters).toFixed(1));
  const rmsSpeed = Math.round(Math.sqrt((3 * 8.314 * temperature) / (molecularMass * 0.001)));

  // Check challenge criteria
  useEffect(() => {
    const currentChal = metadata.challenges[activeChallengeIdx];
    if (currentChal && activeMode === 'challenge') {
      const prop = currentChal.targetCriteria.property;
      const target = currentChal.targetCriteria.targetValue;
      const tol = currentChal.targetCriteria.tolerance;
      
      let val = prop === 'pressure' ? pressureKPa : volumeLiters;
      if (Math.abs(val - target) <= tol) {
        setChallengeSuccess(true);
      } else {
        setChallengeSuccess(false);
      }
    }
  }, [pressureKPa, volumeLiters, activeMode, activeChallengeIdx]);

  // Record graph history
  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying) {
        setGraphHistory((prev) => {
          const next = [...prev, { time: Date.now(), pressure: pressureKPa, temp: temperature, volume: volumeLiters }];
          return next.slice(-40); // keep last 40 data points
        });
      }
    }, 400);
    return () => clearInterval(interval);
  }, [isPlaying, pressureKPa, temperature, volumeLiters]);

  // Initialize Particles
  useEffect(() => {
    const particles: Particle[] = [];
    const baseSpeed = Math.sqrt(temperature / 300) * 2.5;

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (0.5 + Math.random()) * baseSpeed;
      particles.push({
        x: 40 + Math.random() * 200,
        y: 40 + Math.random() * 200,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: molecularMass === 4 ? 4 : 6,
        mass: molecularMass,
        color: molecularMass === 4 ? '#38bdf8' : '#a855f7'
      });
    }
    particlesRef.current = particles;
  }, [particleCount, molecularMass]);

  // Adjust particle speeds when temperature changes
  useEffect(() => {
    const targetSpeedFactor = Math.sqrt(temperature / 300) * 2.5;
    particlesRef.current.forEach((p) => {
      const currentSpeed = Math.hypot(p.vx, p.vy);
      if (currentSpeed > 0.001) {
        const factor = targetSpeedFactor / currentSpeed;
        p.vx = (p.vx / currentSpeed) * targetSpeedFactor * (0.8 + Math.random() * 0.4);
        p.vy = (p.vy / currentSpeed) * targetSpeedFactor * (0.8 + Math.random() * 0.4);
      }
    });
  }, [temperature]);

  // Animation & Physics Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localCollisions = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Piston right boundary scaled by volume (2 L to 12 L mapped to canvas width)
      // Container bounds:
      const leftBound = 40;
      const topBound = 30;
      const bottomBound = height - 40;
      const minX = 140;
      const maxX = width - 40;
      const rightPistonX = minX + ((volumeLiters - 2) / (12 - 2)) * (maxX - minX);

      ctx.clearRect(0, 0, width, height);

      // Draw Container Walls (Chamber)
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 6;
      ctx.strokeRect(leftBound, topBound, rightPistonX - leftBound, bottomBound - topBound);

      // Chamber background
      ctx.fillStyle = 'rgba(15, 23, 42, 0.65)';
      ctx.fillRect(leftBound, topBound, rightPistonX - leftBound, bottomBound - topBound);

      // Draw Grid inside chamber
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      for (let x = leftBound; x < rightPistonX; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, topBound);
        ctx.lineTo(x, bottomBound);
        ctx.stroke();
      }
      for (let y = topBound; y < bottomBound; y += 30) {
        ctx.beginPath();
        ctx.moveTo(leftBound, y);
        ctx.lineTo(rightPistonX, y);
        ctx.stroke();
      }

      // Draw Movable Piston Head
      ctx.fillStyle = '#475569';
      ctx.fillRect(rightPistonX - 8, topBound, 16, bottomBound - topBound);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(rightPistonX - 4, topBound + 10, 8, bottomBound - topBound - 20);

      // Piston Shaft
      ctx.fillStyle = '#64748b';
      ctx.fillRect(rightPistonX + 8, height / 2 - 10, width - rightPistonX, 20);

      // Piston Grip / Handle
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.roundRect(rightPistonX + 4, topBound + (bottomBound - topBound) / 2 - 30, 12, 60, 4);
      ctx.fill();

      // Update & Render Particles
      if (isPlaying) {
        const particles = particlesRef.current;
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;

          // Wall Collisions (Left & Right)
          if (p.x - p.radius < leftBound) {
            p.x = leftBound + p.radius;
            p.vx = -p.vx;
            localCollisions++;
          } else if (p.x + p.radius > rightPistonX - 8) {
            p.x = rightPistonX - 8 - p.radius;
            p.vx = -p.vx;
            localCollisions++;
          }

          // Wall Collisions (Top & Bottom)
          if (p.y - p.radius < topBound) {
            p.y = topBound + p.radius;
            p.vy = -p.vy;
            localCollisions++;
          } else if (p.y + p.radius > bottomBound) {
            p.y = bottomBound - p.radius;
            p.vy = -p.vy;
            localCollisions++;
          }

          // Particle-Particle Elastic Collisions
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p2.x - p.x;
            const dy = p2.y - p.y;
            const dist = Math.hypot(dx, dy);
            if (dist < p.radius + p2.radius) {
              // Elastic normal collision exchange
              const nx = dx / (dist || 1);
              const ny = dy / (dist || 1);
              const kx = p.vx - p2.vx;
              const ky = p.vy - p2.vy;
              const p_val = 2 * (nx * kx + ny * ky) / (p.mass + p2.mass);
              p.vx -= p_val * p2.mass * nx;
              p.vy -= p_val * p2.mass * ny;
              p2.vx += p_val * p.mass * nx;
              p2.vy += p_val * p.mass * ny;
            }
          }

          // Render Particle
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Velocity Vector indicator
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.vx * 3, p.y + p.vy * 3);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      } else {
        // Paused state rendering
        particlesRef.current.forEach((p) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
        });
      }

      // Collision rate tracking
      const now = Date.now();
      if (now - lastCollisionRateCalc.current >= 1000) {
        setCollisionRate(localCollisions);
        localCollisions = 0;
        lastCollisionRateCalc.current = now;
      }

      // Burner / Heat Source visualization below chamber
      const chamberMidX = leftBound + (rightPistonX - leftBound) / 2;
      if (temperature > 320) {
        const flameHeight = Math.min(30, (temperature - 300) / 15);
        ctx.fillStyle = 'rgba(249, 115, 22, 0.7)';
        ctx.beginPath();
        ctx.moveTo(chamberMidX - 25, bottomBound + 8);
        ctx.quadraticCurveTo(chamberMidX, bottomBound + 8 + flameHeight, chamberMidX + 25, bottomBound + 8);
        ctx.fill();
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [volumeLiters, isPlaying, temperature]);

  // Log trial handler
  const handleLogData = () => {
    const newEntry: SimulationLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      parameters: {
        'Temperature (K)': temperature,
        'Volume (L)': volumeLiters,
        'Particle Count': particleCount,
      },
      measurements: {
        'Pressure (kPa)': pressureKPa,
        'RMS Speed (m/s)': rmsSpeed,
        'Collisions/sec': collisionRate
      },
      notes: `T = ${temperature}K, V = ${volumeLiters}L`
    };
    setExperimentLogs([newEntry, ...experimentLogs]);
  };

  // CSV Export
  const handleExportCSV = () => {
    if (experimentLogs.length === 0) return;
    const headers = ['Timestamp', 'Temperature (K)', 'Volume (L)', 'Particles', 'Pressure (kPa)', 'RMS Speed (m/s)', 'Notes'];
    const rows = experimentLogs.map(l => [
      l.timestamp,
      l.parameters['Temperature (K)'],
      l.parameters['Volume (L)'],
      l.parameters['Particle Count'],
      l.measurements['Pressure (kPa)'],
      l.measurements['RMS Speed (m/s)'],
      l.notes || ''
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `IGCSE_Gas_Laws_Experiment_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Submit Prediction
  const handleSubmitPrediction = () => {
    if (!predictedDirection) return;
    if (predictedDirection === 'increase') {
      setPredictionFeedback(
        'Correct! As temperature increases, average molecular kinetic energy rises (v_rms increases). Particles hit container walls harder and more frequently, causing pressure to increase at constant volume.'
      );
    } else {
      setPredictionFeedback(
        'Incorrect. According to kinetic theory, heating a gas increases particle velocity, which increases the momentum change per collision and the rate of collisions, increasing the pressure (p ∝ T).'
      );
    }
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
            <span className="font-mono text-xs text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
              CAIE 0625.2.1.3
            </span>
            <h1 className="text-base sm:text-lg font-bold text-white">
              Kinetic Particle Model & Ideal Gas Laws
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Investigate particle velocity, wall collision pressure, Boyle’s Law and Charles’s Law.
          </p>
        </div>

        {/* Learning Mode Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 self-stretch sm:self-auto overflow-x-auto">
          <button
            onClick={() => setActiveMode('explore')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeMode === 'explore'
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
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
            Challenges
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

      {/* Main Workspace Layout (Canvas + Controls + Meters) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Canvas & Digital Sensor Gauges (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Canvas Box */}
          <div className="relative rounded-2xl bg-[#0c101c] border border-slate-800 p-4 shadow-2xl overflow-hidden">
            
            {/* Simulation Canvas Controls (Play/Pause, Reset, Heat Shortcuts) */}
            <div className="flex items-center justify-between mb-3 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors border border-slate-700"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400 fill-current" />}
                  <span>{isPlaying ? 'Pause' : 'Resume'}</span>
                </button>

                <button
                  onClick={() => {
                    setTemperature(300);
                    setVolumeLiters(6.0);
                    setParticleCount(60);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors border border-slate-700"
                  title="Reset Lab to 300K, 6.0L"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Quick Heat / Cool Presets */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTemperature((prev) => Math.min(800, prev + 50))}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-orange-950/60 hover:bg-orange-900/80 text-orange-300 border border-orange-500/30 font-medium"
                >
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  <span>Heat (+50K)</span>
                </button>
                <button
                  onClick={() => setTemperature((prev) => Math.max(100, prev - 50))}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-sky-950/60 hover:bg-sky-900/80 text-sky-300 border border-sky-500/30 font-medium"
                >
                  <Snowflake className="w-3.5 h-3.5 text-sky-400" />
                  <span>Cool (-50K)</span>
                </button>
              </div>
            </div>

            {/* Interactive Physics Canvas */}
            <div className="relative w-full aspect-[16/10] bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
              <canvas
                ref={canvasRef}
                width={700}
                height={400}
                className="w-full h-full block"
              />

              {/* Live Overlay Pressure Gauge & Piston Drag Marker */}
              <div className="absolute top-3 left-3 bg-slate-900/90 border border-slate-700/80 backdrop-blur rounded-xl p-3 shadow-xl">
                <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Gas Pressure</p>
                <p className="text-2xl font-black font-mono text-cyan-400">
                  {pressureKPa} <span className="text-sm font-sans text-slate-400">kPa</span>
                </p>
              </div>

              <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-slate-700/80 backdrop-blur rounded-xl px-3 py-1.5 text-[11px] font-mono text-slate-300">
                <span>V = {volumeLiters.toFixed(1)} L</span> • <span>T = {temperature} K ({(temperature - 273.15).toFixed(0)}°C)</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 text-center mt-2">
              💡 Notice how particles collide elastically with the walls and transfer momentum. Speed increases with temperature.
            </p>
          </div>

          {/* Sensor Readouts Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] uppercase font-semibold text-slate-400">Pressure (p)</span>
              <p className="text-lg font-bold font-mono text-cyan-400 mt-0.5">{pressureKPa} kPa</p>
              <p className="text-[10px] text-slate-400 mt-1">p = nRT / V</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] uppercase font-semibold text-slate-400">RMS Speed (v_rms)</span>
              <p className="text-lg font-bold font-mono text-emerald-400 mt-0.5">{rmsSpeed} m/s</p>
              <p className="text-[10px] text-slate-400 mt-1">v ∝ √(T/m)</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] uppercase font-semibold text-slate-400">Wall Collisions</span>
              <p className="text-lg font-bold font-mono text-indigo-400 mt-0.5">~{collisionRate} /s</p>
              <p className="text-[10px] text-slate-400 mt-1">Collision frequency</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] uppercase font-semibold text-slate-400">p × V Product</span>
              <p className="text-lg font-bold font-mono text-amber-400 mt-0.5">{(pressureKPa * volumeLiters).toFixed(0)}</p>
              <p className="text-[10px] text-slate-400 mt-1">Constant if T fixed</p>
            </div>
          </div>

          {/* Synchronized Live Real-Time Graphs */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Real-Time Pressure Curve [p vs t]
                </h4>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                Synchronized with live collisions
              </span>
            </div>

            <div className="h-32 w-full bg-slate-950 rounded-xl border border-slate-800 p-2 flex items-end gap-1 overflow-hidden relative">
              {/* Baseline axes */}
              <div className="absolute left-2 top-2 text-[10px] font-mono text-slate-600">350 kPa</div>
              <div className="absolute left-2 bottom-2 text-[10px] font-mono text-slate-600">0 kPa</div>

              {graphHistory.map((point, idx) => {
                const heightPct = Math.min(100, (point.pressure / 350) * 100);
                return (
                  <div
                    key={idx}
                    className="flex-1 bg-gradient-to-t from-cyan-600/40 to-cyan-400 rounded-t transition-all duration-200"
                    style={{ height: `${heightPct}%` }}
                    title={`${point.pressure} kPa at V=${point.volume}L, T=${point.temp}K`}
                  />
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Precision Control Dock & Active Mode Panel (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Mode 1: Explore Controls Dock */}
          {activeMode === 'explore' && (
            <div className="p-5 rounded-2xl bg-[#111726] border border-slate-800 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                    Apparatus Controls
                  </h3>
                </div>
                <button
                  onClick={handleLogData}
                  className="px-2.5 py-1 rounded-md bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white text-xs font-semibold border border-cyan-500/30 transition-colors"
                >
                  + Record Trial
                </button>
              </div>

              {/* Slider 1: Temperature */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">Temperature (T)</span>
                  <span className="font-mono text-cyan-400 font-bold">{temperature} K ({(temperature - 273.15).toFixed(0)}°C)</span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={800}
                  step={10}
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>100 K (-173°C)</span>
                  <span>300 K (Room)</span>
                  <span>800 K (Hot)</span>
                </div>
              </div>

              {/* Slider 2: Volume */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">Piston Volume (V)</span>
                  <span className="font-mono text-cyan-400 font-bold">{volumeLiters.toFixed(1)} L</span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={12}
                  step={0.5}
                  value={volumeLiters}
                  onChange={(e) => setVolumeLiters(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>2.0 L (Compressed)</span>
                  <span>6.0 L (Standard)</span>
                  <span>12.0 L (Expanded)</span>
                </div>
              </div>

              {/* Slider 3: Particle Count */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">Quantity of Gas (N)</span>
                  <span className="font-mono text-cyan-400 font-bold">{particleCount} molecules</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={120}
                  step={10}
                  value={particleCount}
                  onChange={(e) => setParticleCount(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              {/* Molecular Mass Selector */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-xs font-semibold text-slate-300">Gas Specie:</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setMolecularMass(4)}
                    className={`p-2 rounded-lg text-xs font-semibold border transition-all ${
                      molecularMass === 4
                        ? 'bg-cyan-600/30 text-cyan-300 border-cyan-500/50'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    Helium (4 u)
                  </button>
                  <button
                    onClick={() => setMolecularMass(32)}
                    className={`p-2 rounded-lg text-xs font-semibold border transition-all ${
                      molecularMass === 32
                        ? 'bg-purple-600/30 text-purple-300 border-purple-500/50'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    Oxygen (32 u)
                  </button>
                </div>
              </div>

              {/* Scientific Insight Box */}
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                <p className="font-semibold text-cyan-400">IGCSE Exam Tip (Paper 4 / 6):</p>
                <p className="text-slate-400 leading-relaxed">
                  When explaining gas pressure, state: (1) Particles are in random motion, (2) Particles collide with walls, (3) Collisions exert a force per unit area (p = F/A).
                </p>
              </div>
            </div>
          )}

          {/* Mode 2: Predict -> Experiment -> Explain */}
          {activeMode === 'predict' && (
            <div className="p-5 rounded-2xl bg-[#111726] border border-slate-800 space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                  Predict → Experiment → Explain
                </span>
                <h3 className="text-sm font-bold text-white mt-1">
                  Hypothesis Testing Challenge
                </h3>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                <strong className="text-white">Investigation:</strong> You increase the temperature of the gas from 300 K to 600 K while keeping volume locked at 6.0 L.
                <p className="mt-2 text-cyan-300 font-semibold">What will happen to the gas pressure?</p>
              </div>

              <div className="space-y-2">
                {[
                  { id: 'increase', label: 'Pressure will increase (Directly proportional to T)' },
                  { id: 'decrease', label: 'Pressure will decrease' },
                  { id: 'constant', label: 'Pressure will remain constant' },
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setPredictedDirection(option.id as any)}
                    className={`w-full p-2.5 rounded-xl text-left text-xs font-semibold border transition-all ${
                      predictedDirection === option.id
                        ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <button
                onClick={handleSubmitPrediction}
                disabled={!predictedDirection}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs shadow-lg shadow-indigo-600/25 transition-all"
              >
                Submit Prediction & Explain
              </button>

              {predictionFeedback && (
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 space-y-2 animate-in fade-in">
                  <p className="font-semibold text-white">Scientific Explanation:</p>
                  <p className="text-slate-400 leading-relaxed">{predictionFeedback}</p>
                </div>
              )}
            </div>
          )}

          {/* Mode 3: Challenge Mode */}
          {activeMode === 'challenge' && (
            <div className="p-5 rounded-2xl bg-[#111726] border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                    Challenge {activeChallengeIdx + 1} of {metadata.challenges.length}
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                  {metadata.challenges[activeChallengeIdx].difficulty}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white">
                  {metadata.challenges[activeChallengeIdx].title}
                </h4>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {metadata.challenges[activeChallengeIdx].description}
                </p>
                <p className="text-[11px] text-amber-300/90 mt-2 bg-amber-950/40 p-2 rounded-lg border border-amber-500/20">
                  💡 Hint: {metadata.challenges[activeChallengeIdx].hint}
                </p>
              </div>

              {challengeSuccess ? (
                <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/50 text-center space-y-2 animate-in zoom-in-95">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <p className="text-sm font-bold text-emerald-300">Challenge Mastered!</p>
                  <p className="text-xs text-slate-300">
                    {metadata.challenges[activeChallengeIdx].explanationOnSuccess}
                  </p>
                  {activeChallengeIdx < metadata.challenges.length - 1 && (
                    <button
                      onClick={() => {
                        setActiveChallengeIdx(activeChallengeIdx + 1);
                        setChallengeSuccess(false);
                      }}
                      className="mt-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                    >
                      Next Challenge →
                    </button>
                  )}
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
                  <span className="text-slate-300 font-semibold">Current Pressure:</span>{' '}
                  <span className="font-mono text-cyan-400 font-bold">{pressureKPa} kPa</span>{' '}
                  (Target: {metadata.challenges[activeChallengeIdx].targetCriteria.targetValue} kPa)
                </div>
              )}
            </div>
          )}

          {/* Mode 4: Experiment Data Log Table */}
          {activeMode === 'log' && (
            <div className="p-5 rounded-2xl bg-[#111726] border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  Experiment Log ({experimentLogs.length} Trials)
                </h3>
                <button
                  onClick={handleExportCSV}
                  disabled={experimentLogs.length === 0}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-semibold border border-slate-700"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Export CSV</span>
                </button>
              </div>

              {experimentLogs.length > 0 ? (
                <div className="max-h-72 overflow-y-auto space-y-2">
                  {experimentLogs.map((log) => (
                    <div key={log.id} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] space-y-1 font-mono">
                      <div className="flex justify-between text-slate-400">
                        <span>{log.timestamp}</span>
                        <span className="text-cyan-400 font-bold">{log.measurements['Pressure (kPa)']} kPa</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>T = {log.parameters['Temperature (K)']} K</span>
                        <span>V = {log.parameters['Volume (L)']} L</span>
                        <span>v = {log.measurements['RMS Speed (m/s)']} m/s</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-6 text-xs text-slate-500">
                  No trials recorded yet. Switch to Explore Lab and click "+ Record Trial" to log measurements.
                </p>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
