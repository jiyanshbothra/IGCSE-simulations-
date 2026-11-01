import React, { useMemo, useState } from 'react';
import { ArrowLeft, Download, Eye, EyeOff, Ruler, Save } from 'lucide-react';

type Instrument = 'vernier' | 'micrometer';

interface PrecisionMeasurementSimulationProps {
  onBack: () => void;
}

interface ReadingRecord {
  instrument: string;
  actualLength: number;
  observedReading: number;
  zeroError: number;
  correctedReading: number;
}

const roundTo = (value: number, places: number) => Number(value.toFixed(places));

export const PrecisionMeasurementSimulation: React.FC<PrecisionMeasurementSimulationProps> = ({ onBack }) => {
  const [instrument, setInstrument] = useState<Instrument>('vernier');
  const [actualLength, setActualLength] = useState(12.36);
  const [zeroError, setZeroError] = useState(0);
  const [showActual, setShowActual] = useState(false);
  const [records, setRecords] = useState<ReadingRecord[]>([]);

  const leastCount = instrument === 'vernier' ? 0.1 : 0.01;
  const places = instrument === 'vernier' ? 1 : 2;
  const observedReading = roundTo(Math.round(actualLength / leastCount) * leastCount + zeroError, 2);
  const correctedReading = roundTo(observedReading - zeroError, 2);
  const mainScaleReading = instrument === 'vernier'
    ? Math.floor(correctedReading + 1e-8)
    : Math.floor(correctedReading * 2 + 1e-8) / 2;
  const subdivisionIndex = Math.max(0, Math.round((correctedReading - mainScaleReading) / leastCount));
  const readingDifference = roundTo(correctedReading - actualLength, 2);
  const scaleWidth = 600;
  const scaleMaximum = 30;
  const objectX = 96 + (actualLength / scaleMaximum) * scaleWidth;

  const scaleTicks = useMemo(() => Array.from({ length: 61 }, (_, index) => index), []);
  const vernierTicks = useMemo(() => Array.from({ length: 11 }, (_, index) => index), []);
  const thimbleTicks = useMemo(() => Array.from({ length: 50 }, (_, index) => index), []);

  const recordReading = () => {
    setRecords((current) => [
      ...current,
      {
        instrument: instrument === 'vernier' ? 'Vernier caliper' : 'Micrometer screw gauge',
        actualLength: roundTo(actualLength, 2),
        observedReading,
        zeroError: roundTo(zeroError, 2),
        correctedReading,
      },
    ]);
  };

  const exportCSV = () => {
    if (records.length === 0) return;
    const headers = ['instrument', 'actualLength_mm', 'observedReading_mm', 'zeroError_mm', 'correctedReading_mm'];
    const rows = records.map((record) => [
      record.instrument,
      record.actualLength,
      record.observedReading,
      record.zeroError,
      record.correctedReading,
    ].join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'precision-measurements.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#080b11] text-slate-100">
      <header className="sticky top-0 z-20 border-b border-sky-500/20 bg-[#0a0e17]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
          <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <div className="h-5 w-px bg-slate-700" />
          <Ruler className="h-4 w-4 text-sky-400" />
          <div>
            <p className="text-[10px] font-mono text-sky-300">0625.1.1.1</p>
            <h1 className="text-sm font-semibold text-white">Vernier Caliper & Micrometer Gauging</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-300">Precision measurement laboratory</p>
            <p className="mt-1 max-w-2xl text-sm text-slate-400">
              Read the main scale and the aligned subdivision, then correct the observed value for zero error.
            </p>
          </div>
          <div className="flex rounded-lg border border-slate-700 bg-slate-900 p-1">
            {(['vernier', 'micrometer'] as const).map((choice) => (
              <button
                key={choice}
                onClick={() => { setInstrument(choice); setZeroError(0); }}
                className={`rounded-md px-3 py-2 text-xs font-medium transition ${instrument === choice ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                {choice === 'vernier' ? 'Vernier caliper' : 'Micrometer'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.8fr)]">
          <section className="overflow-hidden rounded-2xl border border-sky-500/20 bg-slate-900/50">
            <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
              <h2 className="text-sm font-semibold text-white">Instrument scale</h2>
              <span className="rounded-full border border-sky-500/30 bg-sky-950/40 px-2.5 py-1 text-[11px] font-mono text-sky-300">
                Least count {leastCount.toFixed(places)} mm
              </span>
            </div>

            <div className="overflow-x-auto p-3 sm:p-5">
              <svg viewBox="0 0 820 265" role="img" aria-label={`${instrument === 'vernier' ? 'Vernier caliper' : 'Micrometer'} scale showing a ${actualLength.toFixed(2)} millimetre object`} className="min-w-[680px] w-full">
                <defs>
                  <linearGradient id="objectFill" x1="0" x2="1">
                    <stop offset="0" stopColor="#38bdf8" stopOpacity="0.25" />
                    <stop offset="1" stopColor="#38bdf8" stopOpacity="0.55" />
                  </linearGradient>
                </defs>

                <rect x="55" y="45" width="710" height="175" rx="12" fill="#080d16" stroke="#1e293b" />
                <text x="75" y="72" fill="#94a3b8" fontSize="12" fontFamily="monospace">
                  {instrument === 'vernier' ? 'MAIN SCALE · 1 mm divisions' : 'SLEEVE SCALE · 0.5 mm divisions'}
                </text>

                <rect x="96" y="100" width={Math.max(10, objectX - 96)} height="34" rx="4" fill="url(#objectFill)" stroke="#38bdf8" />
                <path d={`M96 88v58 M${objectX} 88v58`} stroke="#7dd3fc" strokeWidth="4" />
                <path d={`M96 143h22v24 M${objectX} 143h-18v24`} fill="none" stroke="#38bdf8" strokeWidth="4" strokeLinejoin="round" />
                <text x="105" y="123" fill="#e0f2fe" fontSize="12" fontFamily="monospace">OBJECT</text>

                <line x1="96" y1="175" x2={96 + scaleWidth} y2="175" stroke="#64748b" strokeWidth="2" />
                {scaleTicks.map((index) => {
                  const mm = index * 0.5;
                  const x = 96 + (mm / scaleMaximum) * scaleWidth;
                  const isWholeMillimetre = index % 2 === 0;
                  const label = isWholeMillimetre && index % 10 === 0;
                  const active = Math.abs(mm - mainScaleReading) < 0.001;
                  return (
                    <g key={`main-${index}`}>
                      <line x1={x} y1="175" x2={x} y2={isWholeMillimetre ? 151 : 162} stroke={active ? '#38bdf8' : '#94a3b8'} strokeWidth={active ? 2.5 : 1.2} />
                      {label && <text x={x} y="194" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">{mm}</text>}
                    </g>
                  );
                })}

                {instrument === 'vernier' ? (
                  <g>
                    <text x="75" y="221" fill="#94a3b8" fontSize="11" fontFamily="monospace">VERNIER · 10 divisions</text>
                    {vernierTicks.map((index) => {
                      const x = objectX + index * (0.9 / scaleMaximum) * scaleWidth;
                      const active = index === subdivisionIndex;
                      return (
                        <g key={`vernier-${index}`}>
                          <line x1={x} y1="203" x2={x} y2="230" stroke={active ? '#a3e635' : '#64748b'} strokeWidth={active ? 2.5 : 1} />
                          {(index === 0 || index === 5 || index === 10) && <text x={x} y="246" textAnchor="middle" fill={active ? '#bef264' : '#64748b'} fontSize="9" fontFamily="monospace">{index}</text>}
                        </g>
                      );
                    })}
                  </g>
                ) : (
                  <g>
                    <text x="75" y="221" fill="#94a3b8" fontSize="11" fontFamily="monospace">THIMBLE · 50 divisions · 0.01 mm each</text>
                    {thimbleTicks.map((index) => {
                      const x = 96 + (index / 49) * scaleWidth;
                      const active = index === subdivisionIndex;
                      const isQuarter = index % 10 === 0;
                      return (
                        <g key={`thimble-${index}`}>
                          <line x1={x} y1="228" x2={x} y2={isQuarter ? 241 : 235} stroke={active ? '#a3e635' : '#64748b'} strokeWidth={active ? 2.5 : 0.8} />
                          {isQuarter && <text x={x} y="256" textAnchor="middle" fill={active ? '#bef264' : '#64748b'} fontSize="8" fontFamily="monospace">{index}</text>}
                        </g>
                      );
                    })}
                  </g>
                )}
              </svg>
            </div>

            <div className="grid gap-3 border-t border-slate-800 bg-black/20 p-4 sm:grid-cols-3">
              <div><p className="text-[10px] uppercase tracking-wide text-slate-500">Main scale</p><p className="mt-1 font-mono text-sm text-white">{mainScaleReading.toFixed(instrument === 'vernier' ? 0 : 1)} mm</p></div>
              <div><p className="text-[10px] uppercase tracking-wide text-slate-500">Aligned division</p><p className="mt-1 font-mono text-sm text-white">{subdivisionIndex} × {leastCount.toFixed(places)} mm</p></div>
              <div><p className="text-[10px] uppercase tracking-wide text-slate-500">Reading equation</p><p className="mt-1 font-mono text-sm text-sky-300">MSR + subdivision</p></div>
            </div>
          </section>

          <aside className="space-y-4">
            <section className="rounded-2xl border border-sky-500/20 bg-slate-900/50 p-4">
              <h2 className="text-sm font-semibold text-white">Set up the measurement</h2>
              <label className="mt-5 block text-xs text-slate-300" htmlFor="object-length">
                Object length <span className="float-right font-mono text-sky-300">{actualLength.toFixed(2)} mm</span>
              </label>
              <input
                id="object-length"
                type="range"
                min="1"
                max="19.99"
                step="0.01"
                value={actualLength}
                onChange={(event) => setActualLength(Number(event.target.value))}
                className="mt-3 w-full accent-sky-400"
              />
              <div className="mt-1 flex justify-between text-[10px] text-slate-500"><span>1 mm</span><span>20 mm</span></div>

              <label className="mt-6 block text-xs text-slate-300" htmlFor="zero-error">
                Instrument zero error <span className="float-right font-mono text-amber-300">{zeroError >= 0 ? '+' : ''}{zeroError.toFixed(2)} mm</span>
              </label>
              <input
                id="zero-error"
                type="range"
                min={-2 * leastCount}
                max={2 * leastCount}
                step={leastCount}
                value={zeroError}
                onChange={(event) => setZeroError(Number(event.target.value))}
                className="mt-3 w-full accent-amber-400"
              />
              <p className="mt-2 text-[10px] leading-relaxed text-slate-500">Corrected reading = observed reading − zero error.</p>

              <button onClick={() => setShowActual((visible) => !visible)} className="mt-4 inline-flex items-center gap-2 text-xs text-slate-400 transition hover:text-white">
                {showActual ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                {showActual ? 'Hide actual length' : 'Reveal actual length'}
                {showActual && <span className="font-mono text-lime-300">{actualLength.toFixed(2)} mm</span>}
              </button>
            </section>

            <section className="rounded-2xl border border-emerald-500/25 bg-emerald-950/20 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-emerald-300">Live measurement</p>
              <div className="mt-3 flex items-end justify-between gap-3">
                <div>
                  <p className="text-xs text-slate-400">Observed reading</p>
                  <p className="font-mono text-2xl font-semibold text-white">{observedReading.toFixed(places)} <span className="text-sm text-slate-400">mm</span></p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Corrected value</p>
                  <p className="font-mono text-lg font-semibold text-emerald-300">{correctedReading.toFixed(places)} mm</p>
                </div>
              </div>
              <div className="mt-4 space-y-1 rounded-lg border border-slate-800 bg-black/20 p-3 text-xs text-slate-300">
                <p>Scale value: {mainScaleReading.toFixed(instrument === 'vernier' ? 0 : 1)} mm + {subdivisionIndex} × {leastCount.toFixed(places)} mm = {correctedReading.toFixed(places)} mm</p>
                <p className="text-slate-500">Correction: {observedReading.toFixed(places)} mm − ({zeroError >= 0 ? '+' : ''}{zeroError.toFixed(2)} mm zero error) = {correctedReading.toFixed(places)} mm</p>
              </div>
              {showActual && (
                <p className={`mt-3 text-xs ${Math.abs(readingDifference) < leastCount / 2 ? 'text-emerald-300' : 'text-amber-300'}`}>
                  Difference from actual length: {readingDifference >= 0 ? '+' : ''}{readingDifference.toFixed(2)} mm
                </p>
              )}
              <div className="mt-4 flex gap-2">
                <button onClick={recordReading} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600/80 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-500">
                  <Save className="h-3.5 w-3.5" /> Record reading
                </button>
                <button onClick={exportCSV} disabled={records.length === 0} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-300 transition hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-40">
                  <Download className="h-3.5 w-3.5" /> CSV
                </button>
              </div>
              {records.length > 0 && <p className="mt-2 text-center text-[10px] text-slate-500">{records.length} reading{records.length === 1 ? '' : 's'} recorded</p>}
            </section>
          </aside>
        </div>

        <section className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-300">How to read the scale</h2>
          <ol className="mt-3 grid gap-3 text-xs leading-relaxed text-slate-400 sm:grid-cols-3">
            <li><span className="font-mono text-sky-300">01</span> Read the main scale mark immediately before the instrument zero.</li>
            <li><span className="font-mono text-lime-300">02</span> Find the subdivision that aligns with a main scale mark.</li>
            <li><span className="font-mono text-amber-300">03</span> Add the subdivision value, then subtract any zero error.</li>
          </ol>
        </section>
      </main>
    </div>
  );
};
