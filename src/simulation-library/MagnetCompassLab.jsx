import React, { useMemo, useRef, useState } from 'react';
import './magnet-compass-lab.css';

const WIDTH = 760;
const HEIGHT = 420;
const scenarios = [
  {
    title: 'Map the field around a bar magnet',
    prompt: 'Drag the compass to different positions. The red end shows the direction a north test pole would move. Record several points to build your own field map.',
    focus: 'Field direction at different positions',
  },
  {
    title: 'Measure field strength with distance',
    prompt: 'Move the field probe closer to and farther from the magnet. Compare the live meter reading and watch how quickly the field weakens with distance.',
    focus: 'Field strength and distance',
  },
  {
    title: 'Compare a bar magnet and an electromagnet',
    prompt: 'Switch the field source. Change current and turns on the coil, then move the compass to compare field direction and relative strength.',
    focus: 'Permanent and current-produced fields',
  },
  {
    title: 'Test what happens when poles are reversed',
    prompt: 'Flip the magnet, then check the compass at the same location. Add Earth’s field to compare a local magnet with a uniform background field.',
    focus: 'Polarity and field superposition',
  },
  {
    title: 'Build a magnetic field map',
    prompt: 'Place the compass around the magnet and record each direction. The observations stay on the map so you can compare the complete pattern.',
    focus: 'Collecting and interpreting field evidence',
  },
];

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const degrees = (radians) => ((radians * 180 / Math.PI + 360) % 360);
const bearing = (radians) => ((degrees(radians) + 90) % 360);

function fieldAt(point, magnet, mode, current, turns, earthField) {
  const radians = magnet.angle * Math.PI / 180;
  const half = magnet.length / 2;
  const axis = { x: Math.cos(radians), y: Math.sin(radians) };
  const northSign = magnet.polarity;
  const north = { x: magnet.x + axis.x * half * northSign, y: magnet.y + axis.y * half * northSign };
  const south = { x: magnet.x - axis.x * half * northSign, y: magnet.y - axis.y * half * northSign };
  const poleStrength = mode === 'electromagnet' ? 1050 * current * turns / 10 : 18000;
  const n = { x: point.x - north.x, y: point.y - north.y };
  const s = { x: point.x - south.x, y: point.y - south.y };
  const nr = Math.max(17, Math.hypot(n.x, n.y));
  const sr = Math.max(17, Math.hypot(s.x, s.y));
  let x = poleStrength * (n.x / (nr ** 3) - s.x / (sr ** 3));
  let y = poleStrength * (n.y / (nr ** 3) - s.y / (sr ** 3));
  if (earthField) { x += 1.8; y -= 0.45; }
  return { x, y, strength: Math.hypot(x, y), angle: Math.atan2(y, x), north, south };
}

function traceFieldLine(seedAngle, magnet, mode, current, turns, earthField) {
  const radians = magnet.angle * Math.PI / 180;
  const axis = { x: Math.cos(radians), y: Math.sin(radians) };
  const half = magnet.length / 2;
  const northSign = magnet.polarity;
  const north = { x: magnet.x + axis.x * half * northSign, y: magnet.y + axis.y * half * northSign };
  const south = { x: magnet.x - axis.x * half * northSign, y: magnet.y - axis.y * half * northSign };
  const startAngle = radians + (northSign < 0 ? Math.PI : 0) + seedAngle;
  let point = { x: north.x + Math.cos(startAngle) * 5, y: north.y + Math.sin(startAngle) * 5 };
  const points = [point];
  for (let step = 0; step < 260; step += 1) {
    const vector = fieldAt(point, magnet, mode, current, turns, earthField);
    if (!vector.strength) break;
    point = { x: point.x + vector.x / vector.strength * 4, y: point.y + vector.y / vector.strength * 4 };
    if (point.x < 14 || point.x > WIDTH - 14 || point.y < 14 || point.y > HEIGHT - 14) break;
    points.push(point);
    if (distance(point, south) < 13) break;
  }
  return points.length > 9 ? `M${points.map(({ x, y }) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L')}` : '';
}

function pointerPoint(event, svg) {
  const matrix = svg.getScreenCTM();
  if (!matrix) return null;
  const point = svg.createSVGPoint();
  point.x = event.clientX;
  point.y = event.clientY;
  const converted = point.matrixTransform(matrix.inverse());
  return { x: converted.x, y: converted.y };
}

export function MagnetCompassLab({ spec }) {
  const scenarioIndex = (spec.variant - 1) % scenarios.length;
  const scenario = scenarios[scenarioIndex];
  const svgRef = useRef(null);
  const dragRef = useRef(null);
  const [magnet, setMagnet] = useState({ x: 365, y: 207, angle: 0, length: 150, polarity: 1 });
  const [compass, setCompass] = useState({ x: 535, y: 155 });
  const [fieldLines, setFieldLines] = useState(true);
  const [earthField, setEarthField] = useState(false);
  const [mode, setMode] = useState(scenarioIndex === 2 ? 'electromagnet' : 'bar');
  const [current, setCurrent] = useState(2);
  const [turns, setTurns] = useState(10);
  const [samples, setSamples] = useState([]);

  const measured = fieldAt(compass, magnet, mode, current, turns, earthField);
  const fieldLinesData = useMemo(() => Array.from({ length: 16 }, (_, index) => {
    const seed = -1.48 + index * (2.96 / 15);
    return traceFieldLine(seed, magnet, mode, current, turns, earthField);
  }).filter(Boolean), [magnet, mode, current, turns, earthField]);

  const moveCompass = (next) => setCompass({ x: clamp(next.x, 28, WIDTH - 28), y: clamp(next.y, 28, HEIGHT - 28) });
  const moveMagnet = (next) => setMagnet((previous) => ({ ...previous, x: clamp(next.x, 125, WIDTH - 125), y: clamp(next.y, 88, HEIGHT - 80) }));
  const reset = () => {
    dragRef.current = null;
    setMagnet({ x: 365, y: 207, angle: 0, length: 150, polarity: 1 });
    setCompass({ x: 535, y: 155 });
    setFieldLines(true);
    setEarthField(false);
    setMode(scenarioIndex === 2 ? 'electromagnet' : 'bar');
    setCurrent(2);
    setTurns(10);
    setSamples([]);
  };
  const addSample = () => setSamples((previous) => [...previous, { x: compass.x, y: compass.y, angle: measured.angle, strength: measured.strength }]);
  const placeCompass = (position) => {
    const positions = {
      north: { x: magnet.x + 112, y: magnet.y },
      equator: { x: magnet.x, y: magnet.y - 112 },
      south: { x: magnet.x - 112, y: magnet.y },
      far: { x: magnet.x + 230, y: magnet.y - 26 },
    };
    if (positions[position]) moveCompass(positions[position]);
  };
  const exportMap = () => {
    const rows = [['Reading', 'X position', 'Y position', 'Bearing clockwise from north (degrees)', 'Relative field strength', 'Source'], ...samples.map((sample, index) => [index + 1, sample.x.toFixed(1), sample.y.toFixed(1), bearing(sample.angle).toFixed(1), sample.strength.toFixed(4), sourceName])];
    const csv = rows.map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\r\n');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    link.download = `${spec.id}-field-map.csv`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  };
  const onPointerDown = (event) => {
    const point = pointerPoint(event, svgRef.current);
    if (!point) return;
    const dragTarget = event.target.closest('[data-drag]')?.getAttribute('data-drag');
    if (dragTarget === 'magnet') {
      dragRef.current = { type: 'magnet', offsetX: point.x - magnet.x, offsetY: point.y - magnet.y };
    } else if (dragTarget === 'rotate') {
      dragRef.current = { type: 'rotate' };
    } else if (dragTarget === 'compass') {
      dragRef.current = { type: 'compass', offsetX: point.x - compass.x, offsetY: point.y - compass.y };
    } else {
      moveCompass(point);
      dragRef.current = { type: 'compass', offsetX: 0, offsetY: 0 };
    }
    event.currentTarget.setPointerCapture?.(event.pointerId);
    event.preventDefault();
  };
  const onPointerMove = (event) => {
    if (!dragRef.current) return;
    const point = pointerPoint(event, svgRef.current);
    if (!point) return;
    const { type, offsetX = 0, offsetY = 0 } = dragRef.current;
    if (type === 'compass') moveCompass({ x: point.x - offsetX, y: point.y - offsetY });
    if (type === 'magnet') moveMagnet({ x: point.x - offsetX, y: point.y - offsetY });
    if (type === 'rotate') {
      setMagnet((previous) => ({ ...previous, angle: Math.atan2(point.y - previous.y, point.x - previous.x) * 180 / Math.PI }));
    }
  };
  const onKeyMove = (event, type) => {
    const step = event.shiftKey ? 20 : 8;
    const offsets = { ArrowUp: [0, -step], ArrowDown: [0, step], ArrowLeft: [-step, 0], ArrowRight: [step, 0] };
    if (type === 'magnet' && (event.key === 'r' || event.key === 'R')) {
      setMagnet((previous) => ({ ...previous, angle: previous.angle + 15 }));
      event.preventDefault();
      return;
    }
    const offset = offsets[event.key];
    if (!offset) return;
    event.preventDefault();
    if (type === 'compass') moveCompass({ x: compass.x + offset[0], y: compass.y + offset[1] });
    if (type === 'magnet') moveMagnet({ x: magnet.x + offset[0], y: magnet.y + offset[1] });
  };
  const clearDrag = (event) => {
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const showStrength = scenarioIndex === 1 || scenarioIndex === 2;
  const showElectromagnetControls = scenarioIndex === 2 || mode === 'electromagnet';
  const sourceName = mode === 'electromagnet' ? 'Electromagnet' : 'Bar magnet';

  return <main className="lab-page magnet-lab-page" style={{ '--lab-accent': '#52c8e8' }}>
    <header className="lab-hero">
      <div className="lab-hero-top">
        <div className="lab-breadcrumb"><span>{spec.subjectName}</span><i />{spec.subjectCode}<i />{spec.period}<i />Chapter {spec.chapterCode}</div>
        <button className="lab-back" onClick={() => { window.location.hash = '#/subject/' + spec.subjectId }}>Back <span>Subject library</span></button>
      </div>
      <div className="lab-hero-main">
        <div>
          <p className="lab-overline">CHAPTER {spec.chapterCode} <span>/</span> FIELD LAB {String(spec.variant).padStart(2, '0')}</p>
          <h1>{scenario.title}</h1>
          <p className="lab-objective">Move the magnet and compass directly in the model. See field direction and strength change at the position you choose.</p>
        </div>
        <div className="lab-hero-stats"><span className="lab-count">{samples.length.toString().padStart(2, '0')}</span><small>field readings<br />recorded</small></div>
      </div>
      <div className="lab-hero-foot"><span className="lab-subject-mark">Physics · Magnetism</span><span>{scenario.focus}</span><span className="lab-live-status"><i /> Live field model</span></div>
    </header>

    <div className="magnet-lab-grid">
      <section className="panel magnet-play-panel">
        <div className="panel-head lab-section-head"><div><span className="section-index">PLAY AREA · TOUCH AND DRAG</span><h2>{sourceName} and compass</h2><p>{scenario.prompt}</p></div><span className="live-pill"><i /> LIVE</span></div>
        <div className="magnet-toolbar">
          <button type="button" className={fieldLines ? 'is-on' : ''} aria-pressed={fieldLines} onClick={() => setFieldLines((value) => !value)}>Field lines <span>{fieldLines ? 'On' : 'Off'}</span></button>
          <button type="button" className={earthField ? 'is-on' : ''} aria-pressed={earthField} onClick={() => setEarthField((value) => !value)}>Earth field <span>{earthField ? 'On' : 'Off'}</span></button>
          <button type="button" onClick={() => setMagnet((previous) => ({ ...previous, polarity: -previous.polarity }))}>Flip polarity</button>
          <label className="probe-preset">Probe position<select aria-label="Set compass to a preset position" defaultValue="" onChange={(event) => placeCompass(event.target.value)}><option value="" disabled>Choose…</option><option value="north">Near north pole</option><option value="equator">Above magnet</option><option value="south">Near south pole</option><option value="far">Far field</option></select></label>
          <button type="button" onClick={addSample}>Record direction</button>
        </div>
        <div className="magnet-canvas-wrap">
          <svg ref={svgRef} className="magnet-canvas" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="application" aria-label="Interactive magnetic field map. Drag the compass or magnet. Tap anywhere to move the compass." onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={clearDrag} onPointerCancel={clearDrag}>
            <defs>
              <pattern id="magnet-grid" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M28 0H0V28" fill="none" stroke="#9ab1c5" strokeOpacity=".08" strokeWidth="1"/></pattern>
              <radialGradient id="magnet-glow"><stop stopColor="#62d4ef" stopOpacity=".16"/><stop offset="1" stopColor="#62d4ef" stopOpacity="0"/></radialGradient>
              <linearGradient id="north-pole" x1="0" x2="1"><stop stopColor="#f46d78"/><stop offset="1" stopColor="#c94861"/></linearGradient>
              <linearGradient id="south-pole" x1="0" x2="1"><stop stopColor="#5589e7"/><stop offset="1" stopColor="#3764b7"/></linearGradient>
              <marker id="field-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#55cee9"/></marker>
              <filter id="field-glow"><feGaussianBlur stdDeviation="2.4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            </defs>
            <rect width={WIDTH} height={HEIGHT} fill="url(#magnet-grid)"/>
            <ellipse cx={magnet.x} cy={magnet.y} rx="285" ry="220" fill="url(#magnet-glow)"/>
            {earthField && <g className="earth-vector"><path d="M58 56h72" markerEnd="url(#field-arrow)"/><text x="58" y="42">EARTH FIELD</text></g>}
            {fieldLines && <g className="field-lines" filter="url(#field-glow)">{fieldLinesData.map((line, index) => <path key={index} d={line} markerEnd="url(#field-arrow)"/>)}</g>}
            <g className="map-axis"><path d="M48 374H712M48 374V54"/><text x="58" y="398">Move the compass anywhere in the play area · use arrow keys for precise movement</text></g>
            {samples.map((sample, index) => <g key={`sample-${index}`} className="field-sample" transform={`translate(${sample.x} ${sample.y}) rotate(${bearing(sample.angle)})`}><circle r="13"/><path d="M0 -10L4 2L0 0L-4 2Z"/><text x="17" y="4">{index + 1}</text></g>)}
            <g className="magnet-object" data-drag="magnet" tabIndex="0" role="button" aria-label="Bar magnet. Drag or use arrow keys to move. Press R to rotate." onKeyDown={(event) => onKeyMove(event, 'magnet')} transform={`translate(${magnet.x} ${magnet.y}) rotate(${magnet.angle})`}>
              <rect className="magnet-hit-area" x={-magnet.length / 2 - 18} y="-37" width={magnet.length + 36} height="74" rx="12"/>
              <rect className="magnet-shell" x={-magnet.length / 2} y="-24" width={magnet.length} height="48" rx="9"/>
              <path className="magnet-pole" d={`M${-magnet.length / 2} -24h${magnet.length / 2}v48h${-magnet.length / 2}z`} fill={magnet.polarity > 0 ? 'url(#south-pole)' : 'url(#north-pole)'}/>
              <path className="magnet-pole" d={`M0 -24h${magnet.length / 2 - 9}q9 0 9 9v30q0 9-9 9H0z`} fill={magnet.polarity > 0 ? 'url(#north-pole)' : 'url(#south-pole)'}/>
              <text x={-magnet.length / 4} y="5">{magnet.polarity > 0 ? 'S' : 'N'}</text><text x={magnet.length / 4} y="5">{magnet.polarity > 0 ? 'N' : 'S'}</text>
              {mode === 'electromagnet' && <g className="coil-turns">{Array.from({ length: Math.min(turns, 10) }, (_, index) => <path key={index} d={`M${-magnet.length / 2 + 17 + index * 12} -29v58`}/>)}</g>}
              <text className="magnet-drag-label" x="0" y="-47">DRAG MAGNET</text>
              <circle className="rotate-handle" data-drag="rotate" cx={magnet.length / 2 + 15} cy="-34" r="8"/>
            </g>
            <g className="compass-object" data-drag="compass" tabIndex="0" role="button" aria-label={`Compass. Field bearing ${bearing(measured.angle).toFixed(0)} degrees clockwise from north. Drag or use arrow keys to move.`} onKeyDown={(event) => onKeyMove(event, 'compass')} transform={`translate(${compass.x} ${compass.y})`}>
              <circle className="compass-hit-area" r="39"/>
              <circle className="compass-bezel" r="28"/>
              <circle className="compass-face" r="23"/>
              <path className="compass-cardinal" d="M0 -19v4M19 0h-4M0 19v-4M-19 0h4"/>
              <g transform={`rotate(${bearing(measured.angle)})`}>
                <path className="compass-needle-north" d="M0 -19L5 2L0 0L-5 2Z"/>
                <path className="compass-needle-south" d="M0 19L5 -2L0 0L-5 -2Z"/>
                <circle className="compass-pivot" r="3"/>
              </g>
              <text className="compass-north-mark" x="0" y="-32">N</text>
              <text className="compass-drag-label" x="0" y="48">DRAG COMPASS</text>
            </g>
            <g className="probe-readout" transform={`translate(${clamp(compass.x + 39, 32, 630)} ${clamp(compass.y + 43, 32, 380)})`}>
              <rect width="115" height="37" rx="7"/><text x="10" y="15">B {measured.strength.toFixed(2)} rel.</text><text x="10" y="29">Bearing {bearing(measured.angle).toFixed(0)}°</text>
            </g>
          </svg>
        </div>
        <div className="magnet-gesture-hint"><span className="gesture-icon">↔</span><p><b>Direct manipulation</b> Drag the compass or magnet. Tap the field map to move the compass. On a keyboard, focus an object and use arrow keys; press R to rotate the magnet.</p></div>
      </section>

      <aside className="magnet-side-column">
        <section className="panel magnet-instrument-panel">
          <div className="panel-head lab-section-head"><div><span className="section-index">CONTROL AREA · LIVE READINGS</span><h2>Field probe</h2><p>Readings are calculated at the compass position.</p></div><button className="text-button" onClick={reset}>Reset</button></div>
          <div className="field-meter"><div className="meter-heading"><span>MAGNETIC FIELD</span><span className="meter-live"><i/>LIVE</span></div><strong>{measured.strength.toFixed(2)}<small> rel.</small></strong><div className="meter-direction"><span>Bearing · clockwise from north</span><b>{bearing(measured.angle).toFixed(1)}°</b></div><div className="meter-bar"><i style={{ width: `${clamp(measured.strength / 8 * 100, 4, 100)}%` }}/></div><small className="meter-note">Relative model field strength</small></div>
          {scenarioIndex === 2 && <div className="source-switch" role="group" aria-label="Magnetic field source"><button type="button" className={mode === 'bar' ? 'selected' : ''} onClick={() => setMode('bar')}>Bar magnet</button><button type="button" className={mode === 'electromagnet' ? 'selected' : ''} onClick={() => setMode('electromagnet')}>Electromagnet</button></div>}
          {showElectromagnetControls && <div className="coil-controls"><NumberStepper label="Current" value={current} unit="A" min={0.2} max={6} step={0.2} onChange={setCurrent}/><NumberStepper label="Coil turns" value={turns} unit="turns" min={2} max={20} step={2} onChange={setTurns}/></div>}
          <div className="magnet-readout-list"><div><span>Source</span><b>{sourceName}</b></div><div><span>Compass position</span><b>x {compass.x.toFixed(0)} · y {compass.y.toFixed(0)}</b></div><div><span>Magnet orientation</span><b>{degrees(magnet.angle).toFixed(0)}°</b></div><div><span>Earth field</span><b>{earthField ? 'Included' : 'Not included'}</b></div></div>
          {showStrength && <p className="model-limit-note">The field map uses a two-pole model for a finite bar magnet. Readings are relative teaching values, not laboratory calibration.</p>}
        </section>
        <section className="panel magnet-evidence-panel">
          <div className="panel-head lab-section-head"><div><span className="section-index">EVIDENCE · {samples.length} POINT{samples.length === 1 ? '' : 'S'}</span><h2>Mapped directions</h2><p>Record readings to leave compass traces on the model.</p></div></div>
          {samples.length ? <ol className="sample-list">{samples.map((sample, index) => <li key={`reading-${index}`}><span>{String(index + 1).padStart(2, '0')}</span><b>{bearing(sample.angle).toFixed(0)}°</b><small>x {sample.x.toFixed(0)}, y {sample.y.toFixed(0)}</small><em>{sample.strength.toFixed(2)} rel.</em></li>)}</ol> : <div className="empty-map"><span>⌖</span><b>No readings recorded</b><small>Move the compass, then choose “Record direction”.</small></div>}
          <div className="evidence-actions"><button type="button" className="button primary" onClick={addSample}>Record this position</button><button type="button" className="button secondary" disabled={!samples.length} onClick={exportMap}>Export CSV</button><button type="button" className="button secondary" disabled={!samples.length} onClick={() => setSamples([])}>Clear map</button></div>
        </section>
        <section className="panel magnet-challenge-panel"><span className="section-index">THINK LIKE A SCIENTIST</span><h2>{spec.lens}</h2><p>{scenarioIndex === 2 ? 'How does increasing current or turns change the field? Does switching off the current leave a field like the permanent magnet?' : scenarioIndex === 3 ? 'What reverses when the poles are flipped? Which features of the field pattern stay the same?' : 'What pattern do your compass directions make? Follow a field line: which pole does it leave and which pole does it enter?'}</p></section>
      </aside>
    </div>
  </main>;
}

function NumberStepper({ label, value, unit, min, max, step, onChange }) {
  const update = (direction) => onChange(Number(clamp(value + direction * step, min, max).toFixed(2)));
  return <div className="number-stepper"><span>{label}<small>{unit}</small></span><div><button type="button" aria-label={`Decrease ${label}`} onClick={() => update(-1)}>−</button><b>{value}</b><button type="button" aria-label={`Increase ${label}`} onClick={() => update(1)}>+</button></div></div>;
}
