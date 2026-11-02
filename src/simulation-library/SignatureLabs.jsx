import React, { useMemo, useRef, useState } from 'react';
import './signature-labs.css';

const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
const fmt = (n, digits = 2) => Number(n).toFixed(digits);
const titrationPH = (volume, acidC, baseC) => {
  const acidMoles = acidC * 0.025;
  const baseMoles = baseC * volume / 1000;
  const totalLitres = (25 + volume) / 1000;
  if (Math.abs(acidMoles - baseMoles) < 0.000001) return 7;
  if (acidMoles > baseMoles) return clamp(-Math.log10((acidMoles - baseMoles) / totalLitres), 0, 14);
  return clamp(14 + Math.log10((baseMoles - acidMoles) / totalLitres), 0, 14);
};

function LabShell({ spec, title, objective, badge, children }) {
  return <main className="lab-page signature-page" style={{ '--lab-accent': spec.color }}>
    <header className="lab-hero">
      <div className="lab-hero-top"><div className="lab-breadcrumb"><span>{spec.subjectName}</span><i />{spec.subjectCode}<i />{spec.period}<i />Chapter {spec.chapterCode}</div><button className="lab-back" onClick={() => { window.location.hash = '#/subject/' + spec.subjectId }}>Back <span>Subject library</span></button></div>
      <div className="lab-hero-main"><div><p className="lab-overline">CHAPTER {spec.chapterCode} <span>/</span> HANDS-ON LAB {String(spec.variant).padStart(2, '0')}</p><h1>{title}</h1><p className="lab-objective">{objective}</p></div><div className="lab-hero-stats"><span className="lab-count">{badge}</span><small>live model<br />state</small></div></div>
      <div className="lab-hero-foot"><span className="lab-subject-mark">{spec.subjectName}</span><span>{spec.chapter}</span><span className="lab-live-status"><i /> Interactive experiment</span></div>
    </header>
    {children}
  </main>;
}

export function ChemistryTitrationLab({ spec }) {
  const initial = [0.1, 0.2, 0.5, 0.25][(spec.variant - 1) % 4];
  const [acidC, setAcidC] = useState(initial);
  const [baseC, setBaseC] = useState([0.1, 0.25, 0.2, 0.5][(spec.variant - 1) % 4]);
  const [added, setAdded] = useState(0);
  const [trials, setTrials] = useState([]);
  const equivalence = acidC * 25 / baseC;
  const pH = titrationPH(added, acidC, baseC);
  const fillColor = pH < 8.2 ? '#83c9d8' : pH < 9.8 ? '#e4a7ce' : '#ee66a9';
  const buretteCapacity = equivalence * 1.5;
  const buretteLiquidTop = 29 + clamp(added / buretteCapacity, 0, 1) * 109;
  const curve = Array.from({ length: 80 }, (_, i) => {
    const volume = equivalence * 1.5 * i / 79;
    const x = 74 + i / 79 * 528;
    const y = 286 - titrationPH(volume, acidC, baseC) / 14 * 194;
    return `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');
  const markerX = 74 + clamp(added / (equivalence * 1.5), 0, 1) * 528;
  const addVolume = (amount) => setAdded((value) => Number((value + amount).toFixed(2)));
  const addToEndpoint = () => setAdded(Number(equivalence.toFixed(2)));
  const reset = () => { setAdded(0); setTrials([]); };
  const record = () => setTrials((previous) => [...previous, { volume: added, pH }]);
  return <LabShell spec={spec} title="Titration: add, observe, explain" badge={`${pH.toFixed(1)}`} objective="Operate the stopcock to add alkali to the acid. The indicator colour and pH curve respond to the actual volume delivered.">
    <div className="signature-grid">
      <section className="panel sig-play-panel">
        <div className="panel-head lab-section-head"><div><span className="section-index">PLAY AREA · RELEASE TITRANT</span><h2>Acid in flask · alkali in burette</h2><p>Each touch adds a measured volume. The steep section marks the equivalence region.</p></div><button className="text-button" onClick={reset}>Reset</button></div>
        <div className="titration-visual-row"><svg className="titration-canvas" viewBox="0 0 660 360" role="img" aria-label={`Titration apparatus. ${fmt(added)} millilitres added, pH ${fmt(pH, 1)}.`}>
          <defs><linearGradient id="flask-glass" x2="0" y2="1"><stop stopColor="#d9f3f6" stopOpacity=".18"/><stop offset="1" stopColor="#6cb8c4" stopOpacity=".04"/></linearGradient><clipPath id="flask-clip"><path d="M335 120H385V205L433 286Q435 298 420 298H300Q285 298 287 286L335 205Z"/></clipPath></defs>
          <path className="apparatus-glass" d="M335 20H385V210L434 286Q438 301 417 301H303Q282 301 286 286L335 210Z"/>
          <path d="M289 264H431L420 293H300Z" fill={fillColor} opacity=".72" clipPath="url(#flask-clip)" className="indicator-fluid"/>
          <path className="flask-outline" d="M335 20H385V210L434 286Q438 301 417 301H303Q282 301 286 286L335 210Z"/>
          <path className="burette-tube" d="M354 23H366V146H354Z"/><path className="burette-solution" d={`M357 ${buretteLiquidTop}H363V138H357Z`}/>
          {Array.from({ length: 8 }, (_, i) => <path key={i} className="burette-tick" d={`M367 ${36 + i * 13}h${i % 2 ? 6 : 10}`} />)}
          <path className="stopcock" d="M344 153H376M360 147V159M351 153l-8 9M369 153l8 9"/><circle className="titrant-drop" cx="360" cy="178" r={added ? 5 : 3} style={{ opacity: added ? .8 : .3 }} />
          <text x="402" y="69" className="sig-svg-label">BURETTE</text><text x="402" y="87" className="sig-svg-note">{fmt(added, 1)} cm³ added</text>
          <text x="360" y="280" textAnchor="middle" className="flask-label">{pH < 8.2 ? 'ACIDIC' : pH < 9.8 ? 'ENDPOINT RANGE' : 'ALKALINE'}</text>
          <text x="360" y="323" textAnchor="middle" className="sig-svg-note">Indicator colour changes across its transition range.</text>
        </svg><svg className="titration-graph" viewBox="0 0 660 360" role="img" aria-label={`pH curve. Current pH ${fmt(pH, 1)} at ${fmt(added, 1)} cubic centimetres added.`}>
          <rect x="74" y="62" width="528" height="224" rx="10" className="graph-panel"/>
          <path d="M74 286H602M74 92V286" className="graph-axes"/>
          {[0, 2, 4, 6, 8, 10, 12, 14].map((value) => <g key={value}><path d={`M74 ${286 - value / 14 * 194}H602`} className="graph-grid"/><text x="62" y={290 - value / 14 * 194} textAnchor="end" className="graph-axis-label">{value}</text></g>)}
          <path d={curve} className="ph-curve"/>
          <path d={`M${markerX} 80V286`} className="graph-cursor"/>
          <circle cx={markerX} cy={286 - pH / 14 * 194} r="6" className="graph-dot"/>
          <text x="74" y="315" className="graph-axis-label">0</text><text x="602" y="315" textAnchor="end" className="graph-axis-label">Volume of alkali added (cm³)</text>
          <text x="90" y="82" className="graph-axis-label">pH</text>
        </svg></div>
        <div className="sig-actions"><button className="button primary" onClick={() => addVolume(0.05)}>Add one drop · 0.05 cm³</button><button className="button secondary" onClick={() => addVolume(1)}>Add 1 cm³</button><button className="button secondary" onClick={addToEndpoint}>Go to equivalence · {fmt(equivalence, 1)} cm³</button><button className="button secondary" onClick={record}>Record reading</button></div>
        <p className="touch-instruction">On a touchscreen, tap the large volume buttons. On a keyboard, tab to a button and press Enter or Space.</p>
      </section>
      <aside className="sig-side-stack">
        <section className="panel sig-instrument"><span className="section-index">LIVE MEASUREMENTS</span><div className="sig-reading"><span>pH</span><b>{fmt(pH, 2)}</b></div><div className="sig-reading"><span>Volume delivered</span><b>{fmt(added, 1)} <small>cm³</small></b></div><div className="sig-reading"><span>Calculated equivalence</span><b>{fmt(equivalence, 2)} <small>cm³</small></b></div><div className="sig-progress"><i style={{ width: `${clamp(added / equivalence * 100, 0, 100)}%` }}/></div><small className="model-caveat">Strong acid–strong base, 1:1 stoichiometry; ideal solution model.</small></section>
        <section className="panel sig-instrument"><span className="section-index">SOLUTION SETUP · USE + / −</span><Stepper label="Acid concentration" unit="mol dm⁻³" value={acidC} min={0.05} max={1} step={0.05} setValue={(value) => { setAcidC(value); setAdded(0); }}/><Stepper label="Alkali concentration" unit="mol dm⁻³" value={baseC} min={0.05} max={1} step={0.05} setValue={(value) => { setBaseC(value); setAdded(0); }}/><div className="sig-reading"><span>Acid sample volume</span><b>25 <small>cm³</small></b></div></section>
        <section className="panel sig-instrument"><div className="panel-head lab-section-head"><div><span className="section-index">YOUR DATA · {trials.length} READINGS</span><h2>Observation log</h2></div></div>{trials.length ? <ol className="sig-observation-list">{trials.map((row, index) => <li key={index}><span>{index + 1}</span><b>{fmt(row.volume, 1)} cm³</b><em>pH {fmt(row.pH, 2)}</em></li>)}</ol> : <p className="sig-empty">Record readings on either side of the endpoint to see the rapid pH change.</p>}</section>
      </aside>
    </div>
  </LabShell>;
}

function Stepper({ label, unit, value, min, max, step, setValue }) {
  return <div className="sig-stepper"><span>{label}<small>{unit}</small></span><div><button aria-label={`Decrease ${label}`} onClick={() => setValue(Number(clamp(value - step, min, max).toFixed(2)))}>−</button><b>{fmt(value, 2)}</b><button aria-label={`Increase ${label}`} onClick={() => setValue(Number(clamp(value + step, min, max).toFixed(2)))}>+</button></div></div>;
}

export function CoordinatePlaneLab({ spec }) {
  const svg = useRef(null);
  const drag = useRef(null);
  const variant = spec.variant;
  const [points, setPoints] = useState({ a: { x: -5 + (variant % 4), y: 2 }, b: { x: 4, y: 5 - (variant % 3) } });
  const [snap, setSnap] = useState(true);
  const scale = 24;
  const cx = 340;
  const cy = 215;
  const toScreen = ({ x, y }) => ({ x: cx + x * scale, y: cy - y * scale });
  const toMath = (event) => {
    const matrix = svg.current?.getScreenCTM();
    if (!matrix) return null;
    const point = svg.current.createSVGPoint(); point.x = event.clientX; point.y = event.clientY;
    const local = point.matrixTransform(matrix.inverse());
    const x = (local.x - cx) / scale, y = (cy - local.y) / scale;
    return { x: clamp(snap ? Math.round(x * 2) / 2 : x, -10, 10), y: clamp(snap ? Math.round(y * 2) / 2 : y, -8, 8) };
  };
  const slope = (points.b.x - points.a.x) === 0 ? null : (points.b.y - points.a.y) / (points.b.x - points.a.x);
  const midpoint = { x: (points.a.x + points.b.x) / 2, y: (points.a.y + points.b.y) / 2 };
  const length = Math.hypot(points.b.x - points.a.x, points.b.y - points.a.y);
  const a = toScreen(points.a), b = toScreen(points.b), m = toScreen(midpoint);
  const movePoint = (key, value) => setPoints((previous) => ({ ...previous, [key]: value }));
  const pointerDown = (event) => {
    const key = event.target.closest('[data-point]')?.getAttribute('data-point');
    if (key) { drag.current = key; event.currentTarget.setPointerCapture(event.pointerId); event.preventDefault(); }
  };
  const pointerMove = (event) => { if (drag.current) { const point = toMath(event); if (point) movePoint(drag.current, point); } };
  const pointerEnd = (event) => { drag.current = null; if (event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); };
  const keyboardMove = (event, key) => { const step = event.shiftKey ? 1 : .5; const delta = { ArrowUp: [0, step], ArrowDown: [0, -step], ArrowLeft: [-step, 0], ArrowRight: [step, 0] }[event.key]; if (delta) { event.preventDefault(); movePoint(key, { x: clamp(points[key].x + delta[0], -10, 10), y: clamp(points[key].y + delta[1], -8, 8) }); } };
  const reset = () => setPoints({ a: { x: -5 + (variant % 4), y: 2 }, b: { x: 4, y: 5 - (variant % 3) } });
  return <LabShell spec={spec} title="Coordinate plane: move the points" badge={slope === null ? '∞' : fmt(slope, 2)} objective="Drag points A and B around the graph. Gradient, distance, midpoint and line equation update from their coordinates.">
    <div className="signature-grid coordinate-layout">
      <section className="panel sig-play-panel"><div className="panel-head lab-section-head"><div><span className="section-index">INTERACTIVE GRAPH · DRAG A OR B</span><h2>Two points define a line</h2><p>Move either point. Coordinates snap to half-units; switch off Snap for finer placement.</p></div><button className="text-button" onClick={reset}>Reset points</button></div>
        <svg ref={svg} className="coordinate-canvas" viewBox="0 0 680 430" onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerEnd} onPointerCancel={pointerEnd} aria-label="Coordinate graph with draggable points A and B">
          <rect x="42" y="23" width="596" height="384" rx="12" className="coordinate-plot"/>
          {Array.from({ length: 21 }, (_, i) => { const x = cx + (i - 10) * scale; return <path key={`vx${i}`} d={`M${x} 23V407`} className={i === 10 ? 'coordinate-axis' : 'coordinate-grid'}/>; })}
          {Array.from({ length: 17 }, (_, i) => { const y = cy - (i - 8) * scale; return <path key={`hy${i}`} d={`M42 ${y}H638`} className={i === 8 ? 'coordinate-axis' : 'coordinate-grid'}/>; })}
          {Array.from({ length: 11 }, (_, i) => <text key={`xlab${i}`} x={cx + (i - 5) * scale} y="235" textAnchor="middle" className="coordinate-label">{i - 5}</text>)}
          {Array.from({ length: 9 }, (_, i) => <text key={`ylab${i}`} x="327" y={cy - (i - 4) * scale + 3} textAnchor="end" className="coordinate-label">{i - 4}</text>)}
          <path d={`M${a.x} ${a.y}L${b.x} ${b.y}`} className="coordinate-line"/>
          <path d={`M${a.x} ${a.y}L${b.x} ${a.y}L${b.x} ${b.y}`} className="coordinate-triangle"/>
          <circle cx={m.x} cy={m.y} r="5" className="midpoint-point"/><text x={m.x + 9} y={m.y - 8} className="coordinate-mark-label">M</text>
          <g className="coordinate-handle" data-point="a" tabIndex="0" role="button" aria-label={`Point A at ${points.a.x}, ${points.a.y}. Use arrow keys to move.`} onKeyDown={(event) => keyboardMove(event, 'a')}><circle cx={a.x} cy={a.y} r="19" className="point-hit"/><circle cx={a.x} cy={a.y} r="9" className="point-a"/><text x={a.x + 12} y={a.y - 12} className="coordinate-point-label">A ({fmt(points.a.x, 1)}, {fmt(points.a.y, 1)})</text></g>
          <g className="coordinate-handle" data-point="b" tabIndex="0" role="button" aria-label={`Point B at ${points.b.x}, ${points.b.y}. Use arrow keys to move.`} onKeyDown={(event) => keyboardMove(event, 'b')}><circle cx={b.x} cy={b.y} r="19" className="point-hit"/><circle cx={b.x} cy={b.y} r="9" className="point-b"/><text x={b.x + 12} y={b.y - 12} className="coordinate-point-label">B ({fmt(points.b.x, 1)}, {fmt(points.b.y, 1)})</text></g>
        </svg>
        <div className="sig-actions"><button className={`button ${snap ? 'primary' : 'secondary'}`} aria-pressed={snap} onClick={() => setSnap((value) => !value)}>Snap to {snap ? '½' : 'off'}</button><span className="touch-instruction">Touch and drag a point; use arrow keys for precise movement.</span></div>
      </section>
      <aside className="sig-side-stack">
        <section className="panel sig-instrument"><span className="section-index">LIVE GEOMETRY</span><Metric label="Point A" value={`(${fmt(points.a.x, 1)}, ${fmt(points.a.y, 1)})`}/><Metric label="Point B" value={`(${fmt(points.b.x, 1)}, ${fmt(points.b.y, 1)})`}/><Metric label="Gradient" value={slope === null ? 'Undefined · vertical line' : fmt(slope, 3)}/><Metric label="Distance AB" value={fmt(length, 3)}/><Metric label="Midpoint" value={`(${fmt(midpoint.x, 2)}, ${fmt(midpoint.y, 2)})`}/><Metric label="Equation" value={slope === null ? `x = ${fmt(points.a.x, 2)}` : `y = ${fmt(slope, 2)}x + ${fmt(points.a.y - slope * points.a.x, 2)}`}/></section>
        <section className="panel sig-instrument"><span className="section-index">INVESTIGATE</span><h2 className="sig-small-heading">What stays invariant?</h2><p className="sig-copy">Move A and B together. Which changes when the line rotates? Which stays constant under a translation?</p><div className="formula-card">m = (y₂ − y₁) ÷ (x₂ − x₁)</div></section>
      </aside>
    </div>
  </LabShell>;
}

function Metric({ label, value }) { return <div className="sig-metric"><span>{label}</span><b>{value}</b></div>; }

export function BinaryWorkbenchLab({ spec }) {
  const widths = [4, 8, 12, 16];
  const [width, setWidth] = useState(widths[(spec.variant - 1) % widths.length]);
  const [value, setValue] = useState((42 + spec.variant * 7) % (2 ** widths[(spec.variant - 1) % widths.length]));
  const [signed, setSigned] = useState(false);
  const mask = 2 ** width - 1;
  const raw = value & mask;
  const bits = Array.from({ length: width }, (_, index) => (raw >> (width - index - 1)) & 1);
  const displayValue = signed && (raw & (2 ** (width - 1))) ? raw - 2 ** width : raw;
  const bitChange = (position) => setValue((previous) => (previous ^ (1 << position)) & mask);
  const setWidthSafe = (next) => { setWidth(next); setValue((previous) => previous & (2 ** next - 1)); };
  const reset = () => { setValue(0); setSigned(false); };
  return <LabShell spec={spec} title="Binary register: build a number" badge={String(displayValue)} objective="Tap each bit to switch it on or off. See the binary place values, denary total, and hexadecimal form update immediately.">
    <div className="binary-layout">
      <section className="panel binary-register-panel"><div className="panel-head lab-section-head"><div><span className="section-index">TOUCHABLE REGISTER · TAP A BIT</span><h2>{width}-bit register</h2><p>Each position has a value of 2ⁿ. Tap a cell to toggle its stored bit.</p></div><button className="text-button" onClick={reset}>Clear register</button></div>
        <div className="register-toolbar"><div className="width-switch" role="group" aria-label="Register bit width">{widths.map((n) => <button key={n} className={width === n ? 'selected' : ''} onClick={() => setWidthSafe(n)}>{n} bit</button>)}</div><button className={`signed-switch ${signed ? 'selected' : ''}`} aria-pressed={signed} onClick={() => setSigned((value) => !value)}>{signed ? 'Two’s complement' : 'Unsigned'}</button></div>
        <div className={`bit-register width-${width}`}>{bits.map((bit, index) => { const power = width - index - 1; return <button key={power} className={`bit-cell ${bit ? 'bit-on' : ''}`} aria-label={`Bit ${power}, value ${2 ** power}, currently ${bit}`} aria-pressed={Boolean(bit)} onClick={() => bitChange(power)}><span className="bit-power">2<sup>{power}</sup></span><b>{bit}</b><small>{2 ** power}</small></button>; })}</div>
        <div className="binary-output-grid"><div><span>DENARY</span><strong>{displayValue}</strong></div><div><span>RAW BITS</span><strong className="raw-bits">{raw.toString(2).padStart(width, '0')}</strong></div><div><span>HEXADECIMAL</span><strong>0x{raw.toString(16).toUpperCase().padStart(Math.ceil(width / 4), '0')}</strong></div></div>
        <div className="binary-place-value">{bits.map((bit, index) => <span key={index} className={bit ? 'place-on' : ''}>{bit ? `${2 ** (width - index - 1)} ` : ''}{bit ? '+' : ''}</span>)}</div>
        <p className="touch-instruction">Each bit is a real button: use touch, mouse, Space or Enter. The sign mode changes how the same bits are interpreted.</p>
      </section>
      <aside className="sig-side-stack"><section className="panel sig-instrument"><span className="section-index">REGISTER STATE</span><Metric label="Stored bit pattern" value={raw.toString(2).padStart(width, '0')}/><Metric label="Interpretation" value={signed ? 'Signed two’s complement' : 'Unsigned integer'}/><Metric label="Representable range" value={signed ? `−${2 ** (width - 1)} to ${2 ** (width - 1) - 1}` : `0 to ${mask}`}/><Metric label="Highest place value" value={`2^${width - 1} = ${2 ** (width - 1)}`}/></section><section className="panel sig-instrument"><span className="section-index">CHALLENGE</span><h2 className="sig-small-heading">Make a target</h2><p className="sig-copy">Build {18 + spec.variant} in binary. Which combination of place values produces the target with the fewest 1s?</p></section></aside>
    </div>
  </LabShell>;
}

export function InheritanceWorkbenchLab({ spec }) {
  const genotypes = ['AA', 'Aa', 'aa'];
  const [mother, setMother] = useState(genotypes[(spec.variant - 1) % 3]);
  const [father, setFather] = useState(genotypes[(spec.variant + 1) % 3]);
  const [samples, setSamples] = useState([]);
  const maternal = mother.split('');
  const paternal = father.split('');
  const offspring = paternal.flatMap((p, row) => maternal.map((m, col) => ({ row, col, genotype: [m, p].sort().join(''), phenotype: m === 'A' || p === 'A' ? 'Dominant phenotype' : 'Recessive phenotype' })));
  const count = samples.reduce((acc, value) => { acc[value] = (acc[value] || 0) + 1; return acc; }, {});
  const reset = () => setSamples([]);
  return <LabShell spec={spec} title="Inheritance: cross the alleles" badge={String(samples.length)} objective="Choose a genotype for each parent, then tap Punnett-square offspring to sample outcomes and compare the observed ratio with the prediction.">
    <div className="signature-grid inheritance-layout">
      <section className="panel inheritance-panel"><div className="panel-head lab-section-head"><div><span className="section-index">ALLELE CROSS · TAP AN OFFSPRING CELL</span><h2>Build the Punnett square</h2><p>Each square is one equally likely allele combination.</p></div><button className="text-button" onClick={reset}>Clear sample</button></div>
        <div className="parent-selectors"><GenotypePicker label="Parent 1" value={mother} onChange={setMother}/><span className="cross-symbol">×</span><GenotypePicker label="Parent 2" value={father} onChange={setFather}/></div>
        <div className="punnett-board"><div className="punnett-corner">Gametes</div>{maternal.map((allele, i) => <div key={`mh${i}`} className="gamete-heading allele-a">{allele}</div>)}{paternal.map((p, row) => <React.Fragment key={`row${row}`}><div className="gamete-heading allele-a">{p}</div>{maternal.map((m, col) => { const result = offspring[row * 2 + col]; return <button key={`${row}-${col}`} className={`punnett-outcome ${result.genotype.includes('A') ? 'dominant-outcome' : 'recessive-outcome'}`} onClick={() => setSamples((previous) => [...previous, result.genotype])} aria-label={`Sample offspring genotype ${result.genotype}, ${result.phenotype}`}><b>{result.genotype}</b><small>{result.phenotype === 'Dominant phenotype' ? 'dominant' : 'recessive'}</small></button>; })}</React.Fragment>)}</div>
        <div className="sig-actions"><button className="button primary" onClick={() => setSamples((previous) => [...previous, ...Array.from({ length: 4 }, () => offspring[Math.floor(Math.random() * offspring.length)].genotype)])}>Generate 4 random offspring</button><button className="button secondary" onClick={reset}>Start a new sample</button></div>
        <p className="touch-instruction">Tap a square to add one offspring to the sample. Parent genotype choices rebuild the square instantly.</p>
      </section>
      <aside className="sig-side-stack"><section className="panel sig-instrument"><span className="section-index">EXPECTED PROBABILITY</span>{offspring.map((item, i) => <div className="sig-reading" key={i}><span>Cell {i + 1} · {item.genotype}</span><b>25%</b></div>)}<div className="formula-card">Each cell has probability 1/4.</div></section><section className="panel sig-instrument"><span className="section-index">OBSERVED SAMPLE · {samples.length}</span><Metric label="Dominant phenotype" value={`${samples.filter((g) => g.includes('A')).length} / ${samples.length || '—'}`}/><Metric label="Recessive phenotype" value={`${samples.filter((g) => g === 'aa').length} / ${samples.length || '—'}`}/><div className="sample-genotypes">{samples.slice(-20).map((g, i) => <span key={`${i}-${g}`} className={g === 'aa' ? 'recessive-outcome' : 'dominant-outcome'}>{g}</span>)}</div></section></aside>
    </div>
  </LabShell>;
}

function GenotypePicker({ label, value, onChange }) { return <div className="genotype-picker"><span>{label}<b>{value}</b></span><div>{['AA', 'Aa', 'aa'].map((genotype) => <button key={genotype} className={value === genotype ? 'selected' : ''} onClick={() => onChange(genotype)}>{genotype}</button>)}</div></div>; }

export function WaterBalanceWorkbenchLab({ spec }) {
  const initialStore = 46 + (spec.variant * 7) % 35;
  const [storage, setStorage] = useState(initialStore);
  const [rain, setRain] = useState(0);
  const [abstraction, setAbstraction] = useState(0);
  const [recharge, setRecharge] = useState(0);
  const addRain = (amount) => { setRain((value) => value + amount); setStorage((value) => clamp(value + amount * 0.45, 0, 100)); };
  const pumpWater = (amount) => { setAbstraction((value) => value + amount); setStorage((value) => clamp(value - amount * 0.55, 0, 100)); };
  const rechargeStore = (amount) => { setRecharge((value) => value + amount); setStorage((value) => clamp(value + amount * 0.75, 0, 100)); };
  const reset = () => { setStorage(initialStore); setRain(0); setAbstraction(0); setRecharge(0); };
  const balance = storage - initialStore;
  return <LabShell spec={spec} title="Water resources: balance the basin" badge={`${Math.round(storage)}%`} objective="Add rainfall, recharge groundwater and abstract water from the basin. The reservoir level responds to each action so you can test sustainable use.">
    <div className="signature-grid water-layout">
      <section className="panel water-panel"><div className="panel-head lab-section-head"><div><span className="section-index">WATERSHED MODEL · USE THE WATER SYSTEM</span><h2>Catchment and reservoir</h2><p>Actions represent measured inputs and withdrawals over a model time step.</p></div><button className="text-button" onClick={reset}>Reset basin</button></div>
        <svg className="water-canvas" viewBox="0 0 700 400" role="img" aria-label={`Reservoir storage ${Math.round(storage)} percent capacity.`}>
          <defs><clipPath id="reservoir-shape"><path d="M210 257Q275 219 337 263Q408 308 485 261V356H210Z"/></clipPath></defs>
          <path d="M0 272Q100 250 185 205Q258 173 330 225Q408 273 494 218Q596 165 700 214V400H0Z" className="watershed-land"/>
          <path d="M0 300Q80 270 176 226Q260 194 327 248Q408 296 492 242Q598 193 700 237V400H0Z" className="watershed-ground"/>
          <rect x="210" y={356 - storage * .95} width="275" height={storage * .95} className="reservoir-fill" clipPath="url(#reservoir-shape)"/><path d="M210 257Q275 219 337 263Q408 308 485 261" className="reservoir-rim"/>
          <path d="M492 222V318H513V222M487 222H519" className="dam-wall"/><path d="M500 283V338" className="abstraction-pipe"/>
          <path d="M81 84Q80 64 102 66Q112 42 138 58Q159 54 163 78Q183 80 179 99H95Q81 98 81 84Z" className="rain-cloud"/>
          {Array.from({ length: Math.min(7, Math.ceil(rain / 10)) }, (_, i) => <path key={i} d={`M${103 + i * 11} ${110 + (i % 2) * 7}l-5 17`} className="rain-drop" style={{ animationDelay: `${i * .12}s` }}/>) }
          <path d="M123 132Q153 154 217 191" className="runoff-arrow" markerEnd="url(#water-arrow)"/>
          <path d="M374 332V296" className="recharge-arrow" markerEnd="url(#water-arrow)"/><text x="325" y="374" className="water-label">AQUIFER RECHARGE</text>
          <path d="M111 328H181M134 318l-15 10 15 10" className="abstraction-pipe"/><text x="65" y="356" className="water-label">ABSTRACTION</text>
          <path d="M0 365H700" className="ground-line"/><text x="349" y="70" textAnchor="middle" className="water-storage-label">RESERVOIR · {Math.round(storage)}%</text>
          <defs><marker id="water-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#78d9e6"/></marker></defs>
        </svg>
        <div className="water-actions"><button className="button primary" onClick={() => addRain(20)}>🌧 Add rainfall</button><button className="button secondary" onClick={() => rechargeStore(10)}>↗ Recharge aquifer</button><button className="button secondary" onClick={() => pumpWater(15)}>↓ Abstract water</button><button className="button secondary" onClick={() => pumpWater(5)}>Small withdrawal</button></div>
        <p className="touch-instruction">Use a tap for each event. Repeat actions to model a season; the reservoir cannot exceed capacity or fall below empty.</p>
      </section>
      <aside className="sig-side-stack"><section className="panel sig-instrument"><span className="section-index">CATCHMENT LEDGER</span><Metric label="Storage change from actions" value={`${balance >= 0 ? '+' : ''}${fmt(balance, 1)} units`}/><Metric label="Rainfall captured" value={`${fmt(rain * .45, 1)} units`}/><Metric label="Groundwater recharge" value={`${fmt(recharge * .75, 1)} units`}/><Metric label="Water abstracted" value={`${fmt(abstraction * .55, 1)} units`}/><div className="storage-gauge"><i style={{ height: `${storage}%` }}/></div></section><section className="panel sig-instrument"><span className="section-index">DECISION CHALLENGE</span><h2 className="sig-small-heading">Keep supply sustainable</h2><p className="sig-copy">Can recharge and rainfall replace the withdrawals? Try a repeated pattern of events. A simplified model treats each action as an equal time step.</p><div className="formula-card">Δ storage = captured rain + recharge − abstraction</div></section></aside>
    </div>
  </LabShell>;
}

export function CalculusWorkbenchLab({ spec }) {
  const variant = spec.variant;
  const [coefficients, setCoefficients] = useState({ a: variant % 2 ? 1 : -0.5, b: variant % 3 ? -2 : 1, c: variant % 2 ? 1 : -1, x: 1.5 });
  const [dragging, setDragging] = useState(false);
  const plotRef = useRef(null);
  const a = coefficients.a, b = coefficients.b, c = coefficients.c, x0 = coefficients.x;
  const f = (x) => a * x * x + b * x + c;
  const slope = 2 * a * x0 + b;
  const y0 = f(x0);
  const intercept = y0 - slope * x0;
  const areaPrimitive = (x) => a * x ** 3 / 3 + b * x ** 2 / 2 + c * x;
  const area = areaPrimitive(2) - areaPrimitive(-2);
  const sx = (x) => 80 + (x + 5) * 48;
  const criticalX = Math.abs(a) > 1e-8 ? -b / (2 * a) : null;
  const peak = Math.max(Math.abs(f(-5)), Math.abs(f(5)), ...(criticalX !== null && criticalX >= -5 && criticalX <= 5 ? [Math.abs(f(criticalX))] : []));
  const yLimit = Math.max(4, Math.ceil(peak / 4) * 4);
  const sy = (y) => 192 - y * (140 / yLimit);
  const path = useMemo(() => Array.from({ length: 121 }, (_, i) => { const x = -5 + i / 12; return `${i ? 'L' : 'M'}${sx(x).toFixed(1)} ${sy(f(x)).toFixed(1)}`; }).join(' '), [a, b, c]);
  const tangentPath = `M${sx(-5)} ${sy(slope * -5 + intercept)}L${sx(5)} ${sy(slope * 5 + intercept)}`;
  const setPointFromEvent = (event) => {
    const matrix = plotRef.current?.getScreenCTM(); if (!matrix) return;
    const point = plotRef.current.createSVGPoint(); point.x = event.clientX; point.y = event.clientY;
    const p = point.matrixTransform(matrix.inverse());
    setCoefficients((value) => ({ ...value, x: clamp(Number(((p.x - 80) / 48 - 5).toFixed(2)), -5, 5) }));
  };
  const changeCoefficient = (key, amount) => setCoefficients((previous) => ({ ...previous, [key]: Number(clamp(previous[key] + amount, key === 'a' ? -3 : -8, key === 'a' ? 3 : 8).toFixed(2)) }));
  const reset = () => setCoefficients({ a: variant % 2 ? 1 : -0.5, b: variant % 3 ? -2 : 1, c: variant % 2 ? 1 : -1, x: 1.5 });
  return <LabShell spec={spec} title="Calculus: move the tangent point" badge={fmt(slope, 2)} objective="Drag the point along the quadratic. The tangent line follows it, while the gradient and signed area are recalculated from the function.">
    <div className="signature-grid calculus-layout"><section className="panel calculus-panel"><div className="panel-head lab-section-head"><div><span className="section-index">DYNAMIC GRAPH · DRAG THE POINT</span><h2>f(x) = {fmt(a, 1)}x² + ({fmt(b, 1)})x + ({fmt(c, 1)})</h2><p>Blue curve is the function; gold line is the tangent at the movable point.</p></div><button className="text-button" onClick={reset}>Reset model</button></div>
      <svg ref={plotRef} className="calculus-canvas" viewBox="0 0 640 390" onPointerDown={(event) => { if (event.target.closest('[data-tangent-point]')) { setDragging(true); event.currentTarget.setPointerCapture(event.pointerId); setPointFromEvent(event); } }} onPointerMove={(event) => { if (dragging) setPointFromEvent(event); }} onPointerUp={(event) => { setDragging(false); if (event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); }} onPointerCancel={() => setDragging(false)} aria-label="Quadratic graph with a draggable point controlling the tangent line">
        <rect x="55" y="31" width="530" height="322" rx="12" className="calculus-plot-bg"/>
        {Array.from({ length: 11 }, (_, i) => <path key={`cgx${i}`} d={`M${sx(-5 + i)} 31V353`} className={i === 5 ? 'calculus-axis' : 'calculus-grid'}/>)}
        {Array.from({ length: 9 }, (_, i) => { const value = -yLimit + i * yLimit / 4; const y = sy(value); return <g key={`cgy${i}`}><path d={`M55 ${y}H585`} className={i === 4 ? 'calculus-axis' : 'calculus-grid'}/><text x="49" y={y + 4} textAnchor="end" className="calculus-tick">{fmt(value, 0)}</text></g>; })}
        <path d={path} className="calculus-function"/><path d={tangentPath} className="calculus-tangent"/>
        <path d={`M ${sx(-2)} ${sy(0)} L ${sx(-2)} ${sy(f(-2))} L ${sx(2)} ${sy(f(2))} L ${sx(2)} ${sy(0)} Z`} className="calculus-area"/>
        <g data-tangent-point="true" tabIndex="0" role="slider" aria-valuemin="-5" aria-valuemax="5" aria-valuenow={x0} aria-label="Tangent point x coordinate. Drag horizontally or use left and right arrow keys." onKeyDown={(event) => { if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); setCoefficients((old) => ({ ...old, x: clamp(old.x + (event.key === 'ArrowRight' ? .1 : -.1), -5, 5) })); } }}><circle cx={sx(x0)} cy={sy(y0)} r="20" className="calculus-hit"/><circle cx={sx(x0)} cy={sy(y0)} r="7" className="calculus-dot"/><text x={sx(x0) + 11} y={sy(y0) - 10} className="calculus-label">({fmt(x0, 1)}, {fmt(y0, 1)})</text></g>
        <text x="70" y="375" className="calculus-caption">Shaded area: signed integral from −2 to 2</text>
      </svg>
      <div className="touch-instruction">Touch and drag the point. The tangent gradient changes with x; coefficient buttons reshape the curve.</div>
    </section><aside className="sig-side-stack"><section className="panel sig-instrument"><span className="section-index">LIVE DERIVATIVE</span><Metric label="Tangent point x" value={fmt(x0, 2)}/><Metric label="Function value f(x)" value={fmt(y0, 3)}/><Metric label="Gradient f′(x)" value={fmt(slope, 3)}/><Metric label="Tangent intercept" value={fmt(intercept, 3)}/><Metric label="Signed area, −2 to 2" value={`${fmt(area, 3)} units²`}/><div className="formula-card">f′(x) = 2ax + b</div></section><section className="panel sig-instrument"><span className="section-index">RESHAPE THE FUNCTION · USE + / −</span>{[['a','Quadratic coefficient'],['b','Linear coefficient'],['c','Constant']].map(([key,label]) => <Stepper key={key} label={label} unit={`coefficient ${key}`} value={coefficients[key]} min={key === 'a' ? -3 : -8} max={key === 'a' ? 3 : 8} step={0.5} setValue={(value) => setCoefficients((old) => ({ ...old, [key]: value }))}/>)}<p className="sig-copy">The highlighted integral is signed: area below the x-axis contributes negatively.</p></section></aside></div>
  </LabShell>;
}
