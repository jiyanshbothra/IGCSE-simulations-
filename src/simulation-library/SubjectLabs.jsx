import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createModelProfile, evaluateModel } from './models';
import './subject-workbench.css';

const clamp = (value, min, max) => Math.min(max, Math.max(min, Number(value) || 0));
const fmt = (value, digits = 3) => Number(value).toPrecision(digits).replace(/(?:\.0+|(?:(\.\d*?)0+))$/, '$1');

function SubjectLabHeader({ spec, title, objective }) {
  return <header className="lab-hero subject-lab-hero" style={{ '--lab-accent': spec.color }}>
    <div className="single-lab-top"><div className="lab-breadcrumb"><span>{spec.subjectName}</span><i />{spec.subjectCode}<i />Chapter {spec.chapterCode}</div><button className="lab-back" onClick={() => { window.location.hash = `#/subject/${spec.subjectId}` }}>Back to subject</button></div>
    <div className="subject-lab-title"><div><p className="lab-overline">{spec.chapter} · INVESTIGATION {String(spec.variant).padStart(2, '0')}</p><h1>{spec.title || title}</h1><p className="lab-objective">{objective}</p>{spec.inquiry && <p className="lab-inquiry"><b>Question</b>{spec.inquiry}</p>}</div><span className="subject-live-tag"><i /> LIVE MODEL</span></div>
  </header>;
}

export function ElectricityWorkbenchLab({ spec }) {
  const operation = spec.operation;
  const isCircuit = operation === 'circuit';
  const isCharge = operation === 'charge';
  const profile = useMemo(() => createModelProfile(operation, spec.variant), [operation, spec.variant]);
  const initialValues = () => Object.fromEntries(profile.controls.map((control) => [control.id, control.initial]));
  const [values, setValues] = useState(initialValues);
  const [switchClosed, setSwitchClosed] = useState(true);
  const [chargeRunning, setChargeRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [fuseBlown, setFuseBlown] = useState(false);
  const svgRef = useRef(null);
  const dragRef = useRef(null);
  const updateValue = (id, next) => {
    const control = profile.controls.find((item) => item.id === id);
    if (!control) return;
    const quantized = control.min + Math.round((clamp(next, control.min, control.max) - control.min) / control.step) * control.step;
    setValues((previous) => ({ ...previous, [id]: Number(quantized.toPrecision(10)) }));
  };
  const trippedNow = operation === 'electricalPower' && values.current > values.fuseRating;
  useEffect(() => { if (trippedNow) setFuseBlown(true); }, [trippedNow]);
  useEffect(() => {
    if (!isCharge || !chargeRunning) return undefined;
    const timer = window.setInterval(() => setElapsed((time) => Math.min(600, Math.round((time + .1) * 10) / 10)), 100);
    return () => window.clearInterval(timer);
  }, [isCharge, chargeRunning]);
  useEffect(() => { if (isCharge && elapsed >= 600) setChargeRunning(false); }, [isCharge, elapsed]);

  const resistance = (Number(values.resistance1) || 0) + (Number(values.resistance2) || 0);
  const circuitCurrent = switchClosed && resistance > 0 ? values.voltage / resistance : 0;
  const setCurrent = isCircuit ? circuitCurrent : Number(values.current) || 0;
  const brokenFuse = operation === 'electricalPower' && (fuseBlown || trippedNow);
  const activeCurrent = !switchClosed || brokenFuse || (isCharge && !chargeRunning) ? 0 : setCurrent;
  const effectiveValues = isCircuit
    ? { ...values, voltage: switchClosed ? values.voltage : 0 }
    : isCharge
      ? { ...values, current: activeCurrent, time: elapsed }
      : { ...values, current: brokenFuse ? 0 : values.current };
  const modelResults = useMemo(() => evaluateModel(profile, effectiveValues), [profile, effectiveValues]);
  const supplyPower = isCircuit ? values.voltage * circuitCurrent : isCharge ? values.voltage * activeCurrent : values.voltage * activeCurrent;
  const totalR = resistance;
  const duration = clamp(4 / Math.sqrt(Math.max(.05, activeCurrent)), .8, 5);
  const handleX = isCircuit
    ? 520 + Math.log(Math.max(1, values.resistance1) / 1) / Math.log(1000) * 150
    : isCharge
      ? 520 + clamp(values.current / 10, 0, 1) * 150
      : 520 + clamp((values.fuseRating - 1) / 19, 0, 1) * 150;

  const svgPoint = (event) => {
    const svg = svgRef.current;
    const matrix = svg?.getScreenCTM?.();
    if (!svg || !matrix) return null;
    const point = svg.createSVGPoint(); point.x = event.clientX; point.y = event.clientY;
    return point.matrixTransform(matrix.inverse());
  };
  const applyDrag = (event) => {
    if (!dragRef.current || dragRef.current.pointerId !== event.pointerId) return;
    const point = svgPoint(event); if (!point) return;
    const fraction = clamp((point.x - 520) / 150, 0, 1);
    if (isCircuit) updateValue('resistance1', Math.exp(fraction * Math.log(1000)));
    else if (isCharge) updateValue('current', fraction * 10);
    else updateValue('fuseRating', 1 + fraction * 19);
  };
  const beginDrag = (event) => {
    if (!event.target.closest('[data-electric-wiper]')) return;
    dragRef.current = { pointerId: event.pointerId };
    event.currentTarget.setPointerCapture(event.pointerId);
    applyDrag(event); event.preventDefault();
  };
  const endDrag = (event) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };
  const reset = () => { setValues(initialValues()); setSwitchClosed(true); setChargeRunning(false); setElapsed(0); setFuseBlown(false); };
  const title = isCircuit ? 'Series circuit: follow the electron flow' : isCharge ? 'Charge transfer: run current through a circuit' : 'Electrical power: test the fuse and load';
  const objective = isCircuit
    ? 'Close the switch, drag the rheostat wiper, and watch the electrons circulate. Current, total resistance, voltage and power update from the circuit.'
    : isCharge
      ? 'Start the supply to send electrons around the circuit. Pause to inspect charge transferred, then change current or voltage and run another interval.'
      : 'Adjust the current and fuse rating. An overloaded fuse opens the circuit and stops the electron stream; reduce the load before replacing it.';
  return <main className="lab-page subject-workbench-page">
    <SubjectLabHeader spec={spec} title={title} objective={objective}/>
    <section className="subject-workbench-frame electricity-frame">
      <div className="subject-scene-head"><span>{isCircuit ? 'SERIES CIRCUIT' : isCharge ? 'CHARGE AND ENERGY TRANSFER' : 'APPLIANCE AND FUSE'}</span><span>POINTER-DRIVEN CIRCUIT</span></div>
      <svg ref={svgRef} className="electricity-scene" viewBox="0 0 1100 520" role="img" aria-label="Interactive circuit. Drag the rheostat wiper, operate the switch, and observe electron motion." onPointerDown={beginDrag} onPointerMove={applyDrag} onPointerUp={endDrag} onPointerCancel={endDrag}>
        <defs>
          <pattern id="electric-grid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="#23384a" strokeWidth="1"/></pattern>
          <radialGradient id="lamp-glow"><stop offset="0" stopColor="#ffd56a" stopOpacity={clamp(activeCurrent / 3, 0, .95)}/><stop offset="1" stopColor="#ffd56a" stopOpacity="0"/></radialGradient>
          <marker id="electron-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#3dd5f2"/></marker>
          <marker id="current-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#f5b84b"/></marker>
        </defs>
        <rect width="1100" height="520" fill="#08111c"/><rect width="1100" height="520" fill="url(#electric-grid)" opacity=".7"/>
        <text x="56" y="52" className="electric-kicker">REAL-TIME DC CIRCUIT · {switchClosed ? 'SWITCH CLOSED' : 'SWITCH OPEN'}</text>
        <path className={`electric-wire${activeCurrent > 0 ? ' is-live' : ''}`} d="M214 230V145H350M430 145H485M650 145H685M825 145H858M942 145H1000V390H710M520 390H214V314"/>
        <path className="electric-electron-direction" d="M920 145H760" markerEnd="url(#electron-arrow)"/>
        <path className="electric-current-direction" d="M250 145H330" markerEnd="url(#current-arrow)"/>
        <text x="748" y="116" className="electric-flow-label electron-label">ELECTRONS  − → +</text>
        <text x="246" y="116" className="electric-flow-label current-label">CONVENTIONAL CURRENT  + → −</text>
        <g className="electric-cell"><path d="M214 230V252M214 289V314"/><path d="M181 252H247M194 289H234"/><text x="164" y="248">+</text><text x="180" y="308">−</text><text x="112" y="278">DC CELL</text><text x="108" y="299">{fmt(values.voltage, 3)} V</text></g>
        <g className={`electric-switch${switchClosed ? ' closed' : ' open'}`} role="button" tabIndex="0" aria-label={`Switch ${switchClosed ? 'closed' : 'open'}. Press Enter or Space to toggle.`} aria-pressed={switchClosed} onClick={() => setSwitchClosed((closed) => !closed)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSwitchClosed((closed) => !closed); } }}>
          <circle cx="350" cy="145" r="8"/><circle cx="430" cy="145" r="8"/><path d={switchClosed ? 'M350 145H430' : 'M350 145L416 105'}/><rect x="338" y="94" width="104" height="74" rx="12" className="electric-hit"/><text x="358" y="88">SWITCH · {switchClosed ? 'ON' : 'OFF'}</text>
        </g>
        {isCircuit && <g className="electric-resistor"><path d="M485 145l12 -15 18 30 18 -30 18 30 18 -30 18 30 18 -15"/><text x="510" y="96">R₁ · {fmt(values.resistance1, 3)} Ω</text><path d="M685 145l12 -15 18 30 18 -30 18 30 18 -30 18 30 18 -15"/><text x="700" y="96">R₂ · {fmt(values.resistance2, 3)} Ω</text></g>}
        {isCircuit && <g className="electric-rheostat-control"><path d="M515 215H655"/><path d={`M${handleX} 206V178L${handleX-10} 165`}/><circle data-electric-wiper="true" cx={handleX} cy="215" r="15"/><text x="517" y="250">DRAG WIPER · R₁</text></g>}
        {isCharge && <g className="electric-rheostat-control"><path d="M515 215H655"/><path d={`M${handleX} 206V178L${handleX-10} 165`}/><circle data-electric-wiper="true" cx={handleX} cy="215" r="15"/><text x="517" y="250">DRAG CURRENT SETTING</text></g>}
        {operation === 'electricalPower' && <g className={`electric-fuse${brokenFuse ? ' blown' : ''}`}><rect x="490" y="116" width="174" height="58" rx="11"/><path d="M508 145H538M620 145H646"/><path d={brokenFuse ? 'M538 145l20 -12 16 24 18 -12' : 'M538 145H620'}/><text x="515" y="100">FUSE · {fmt(values.fuseRating, 3)} A</text><path d="M515 215H665" className="fuse-track"/><circle data-electric-wiper="true" cx={handleX} cy="215" r="15" className="fuse-wiper"/><text x="520" y="250">DRAG TO SET FUSE RATING</text></g>}
        {isCharge && <g className="electric-charge-meter"><circle cx="760" cy="285" r="48"/><path d="M730 293A31 31 0 0 1 790 293"/><path d={`M760 285l${clamp(activeCurrent / 10,0,1)*23-11} -${16+clamp(activeCurrent / 10,0,1)*7}`}/><text x="760" y="348">A</text><text x="760" y="380">{fmt(values.current, 3)} A</text></g>}
        <g className={`electric-lamp${activeCurrent > 0 ? ' lit' : ''}`} transform="translate(900 145)"><circle r="64" fill="url(#lamp-glow)"/><circle r="28"/><path d="M-10 -7L-4 7 3 -7 10 7"/><path d="M-14 31H14M-10 38H10"/><text x="0" y="66">{isCharge ? 'LOAD' : isCircuit ? 'LIVE LOAD' : 'APPLIANCE'}</text></g>
        <g className="electric-ammeter"><circle cx="615" cy="390" r="37"/><path d="M591 399A25 25 0 0 1 639 399"/><path d={`M615 390l${clamp(activeCurrent / 10,0,1)*20-10} -${16+clamp(activeCurrent / 10,0,1)*6}`}/><text x="615" y="424">A</text><text x="615" y="464">{fmt(activeCurrent, 3)} A</text></g>
        <text x="74" y="440" className="electric-state-label">{activeCurrent > 0 ? 'CHARGE CARRIERS MOVING' : brokenFuse ? 'FUSE OPEN · FLOW STOPPED' : isCharge && !chargeRunning ? 'PAUSED · START TO RUN' : 'NO CURRENT · OPEN CIRCUIT'}</text>
        {activeCurrent > 0 && Array.from({ length: 9 }, (_, index) => <circle key={index} className="electron-particle"><animateMotion path="M214 314V390H1000V145H214V230" dur={`${duration}s`} begin={`${(duration / 9) * index}s`} repeatCount="indefinite"/></circle>)}
      </svg>
      <div className="electricity-instrument-strip">
        <div className="electric-readout"><small>SUPPLY</small><b>{fmt(values.voltage, 3)} <i>V</i></b></div>
        <div className="electric-readout"><small>CURRENT</small><b>{fmt(activeCurrent, 3)} <i>A</i></b></div>
        <div className="electric-readout"><small>{isCharge ? 'CHARGE PASSED' : isCircuit ? 'TOTAL RESISTANCE' : 'POWER TO LOAD'}</small><b>{isCharge ? `${fmt(modelResults.find((item) => item.label === 'Charge transferred')?.value ?? 0, 3)} C` : isCircuit ? `${fmt(totalR, 3)} Ω` : `${fmt(supplyPower, 3)} W`}</b></div>
        <div className="electric-readout"><small>{isCharge ? 'ELAPSED TIME' : isCircuit ? 'SUPPLY POWER' : 'FUSE STATE'}</small><b>{isCharge ? `${fmt(elapsed, 3)} s` : isCircuit ? `${fmt(supplyPower, 3)} W` : brokenFuse ? 'OPEN' : 'INTACT'}</b></div>
      </div>
      <div className="electricity-control-dock">
        <div className="electricity-actions"><button type="button" className={switchClosed ? 'is-selected' : ''} onClick={() => setSwitchClosed((closed) => !closed)}>{switchClosed ? 'Open switch' : 'Close switch'}</button>{isCharge && <button type="button" className="electric-run" onClick={() => setChargeRunning((running) => !running)}>{chargeRunning ? 'Pause current' : 'Start current'}</button>}{brokenFuse && values.current <= values.fuseRating && <button type="button" onClick={() => setFuseBlown(false)}>Replace fuse</button>}<button type="button" onClick={reset}>Reset lab</button></div>
        <div className="electricity-controls">{profile.controls.filter((control) => !(isCharge && control.id === 'time')).map((control) => <NumericControl key={control.id} control={control} value={values[control.id]} onChange={(value) => updateValue(control.id, value)}/>)}</div>
        <div className="electricity-footer"><b>{isCharge ? 'Q = It · E = QV' : isCircuit ? 'V = IR · Rₛ = R₁ + R₂' : 'P = IV · a fuse opens above its rated current'}</b><span>Electron flow is shown from the negative terminal toward the positive terminal. Conventional current is opposite.</span></div>
      </div>
    </section>
  </main>;
}

function NumericControl({ control, value, onChange }) {
  const step = control.step;
  const set = (next) => onChange(control.min + Math.round((clamp(next, control.min, control.max) - control.min) / step) * step);
  return <label className="workbench-number"><span>{control.label}<small>{control.unit}</small></span><div><button type="button" aria-label={`Decrease ${control.label}`} disabled={value <= control.min} onClick={() => set(value - step)}>−</button><input type="number" min={control.min} max={control.max} step={step} value={value} onChange={(event) => { if (Number.isFinite(event.target.valueAsNumber)) set(event.target.valueAsNumber); }}/><button type="button" aria-label={`Increase ${control.label}`} disabled={value >= control.max} onClick={() => set(value + step)}>+</button></div></label>;
}

export function TrigonometryWorkbenchLab({ spec }) {
  const profile = useMemo(() => createModelProfile('trigonometry', spec.variant), [spec.variant]);
  const defaults = Object.fromEntries(profile.controls.map((control) => [control.id, control.initial]));
  const angle = clamp(20 + ((spec.variant * 11) % 52), 15, 75);
  const hypotenuse = 78 + ((spec.variant * 7) % 23);
  const modeByOperation = { trigPythagoras: 'pythagoras', trigExact: 'exact', trigSineGraph: 'sine', trigCosineGraph: 'cosine', trigTangentGraph: 'tangent', trigNonRight: 'nonRight', trigThreeD: 'threeD', trigBearings: 'bearings', trigElevation: 'elevation' };
  const [mode, setMode] = useState(() => modeByOperation[spec.operation] || 'triangle');
  const [values, setValues] = useState({ ...defaults, angle: modeByOperation[spec.operation] ? 30 : angle, hypotenuse });
  const [legs, setLegs] = useState({ a: 60, b: 80 });
  const [nonRight, setNonRight] = useState({ method: 'SSA', a: 75, b: 90, c: 80, angle: 40 });
  const [dimensions, setDimensions] = useState({ length: 50, width: 40, height: 30 });
  const [bearingValues, setBearingValues] = useState({ bearing: 60, distance: 130 });
  const [sightline, setSightline] = useState({ kind: 'elevation', distance: 120, height: 80 });
  const [target, setTarget] = useState(() => spec.operation === 'trigTangentGraph' ? 1 : .5);
  const svgRef = useRef(null);
  const dragRef = useRef(null);
  const graphMode = ['sine', 'cosine', 'tangent'].includes(mode);
  const theta = mode === 'triangle' ? clamp(values.angle, 1, 89) : mode === 'exact' ? clamp(values.angle, 0, 90) : clamp(values.angle, 0, 360);
  const radians = theta * Math.PI / 180;
  const origin = { x: 125, y: 475 };
  const drawingScale = Math.min(500 / Math.cos(radians), 390 / Math.sin(radians));
  const radius = (values.hypotenuse / 100) * drawingScale;
  const foot = { x: origin.x + radius * Math.cos(radians), y: origin.y };
  const tip = { x: foot.x, y: origin.y - radius * Math.sin(radians) };
  const opposite = values.hypotenuse * Math.sin(radians);
  const adjacent = values.hypotenuse * Math.cos(radians);
  const plot = { left: 130, right: graphMode ? 2470 : 1690, top: 70, bottom: 455 };
  const plotWidth = plot.right - plot.left;
  const plotHeight = plot.bottom - plot.top;
  const yMin = mode === 'tangent' ? -4 : -1.25;
  const yMax = mode === 'tangent' ? 4 : 1.25;
  const graphY = (value) => plot.top + ((yMax - value) / (yMax - yMin)) * plotHeight;
  const graphX = (degree) => plot.left + degree / 360 * plotWidth;
  const graphValue = (degree) => mode === 'sine' ? Math.sin(degree * Math.PI / 180) : mode === 'cosine' ? Math.cos(degree * Math.PI / 180) : Math.abs(Math.cos(degree * Math.PI / 180)) < 1e-10 ? Number.NaN : Math.tan(degree * Math.PI / 180);
  const graphPaths = [];
  if (graphMode) {
    let segment = [];
    for (let degree = 0; degree <= 360; degree += 1) {
      const y = graphValue(degree);
      if (!Number.isFinite(y) || Math.abs(y) > 4.15) {
        if (segment.length > 1) graphPaths.push(segment.join(' '));
        segment = [];
      } else {
        segment.push(`${segment.length ? 'L' : 'M'}${graphX(degree).toFixed(2)} ${graphY(y).toFixed(2)}`);
      }
    }
    if (segment.length > 1) graphPaths.push(segment.join(' '));
  }
  const graphResult = graphMode ? graphValue(theta) : 0;
  const graphTarget = mode === 'tangent' ? clamp(target, -4, 4) : clamp(target, -1, 1);
  const solutionAngles = graphMode ? getTrigSolutions(mode, graphTarget) : [];
  const exactAngles = [0, 30, 45, 60, 90];
  const triangleScale = Math.min(470 / legs.a, 390 / legs.b);
  const pythagoreanFoot = { x: origin.x + legs.a * triangleScale, y: origin.y };
  const pythagoreanTip = { x: pythagoreanFoot.x, y: origin.y - legs.b * triangleScale };
  const hypotenuseFromLegs = Math.hypot(legs.a, legs.b);
  const nonRightAngle = clamp(nonRight.angle, 10, 170) * Math.PI / 180;
  const nonRightScale = Math.min(4.2, 470 / Math.max(nonRight.a, nonRight.b, nonRight.c), 320 / Math.max(10, nonRight.b * Math.sin(nonRightAngle)));
  const nonRightOrigin = { x: 205, y: 455 };
  const nonRightSideA = nonRight.method === 'SSA' ? nonRight.a : Math.sqrt(Math.max(0, nonRight.b ** 2 + nonRight.c ** 2 - 2 * nonRight.b * nonRight.c * Math.cos(nonRightAngle)));
  const nonRightBangle = nonRight.method === 'SSA'
    ? Math.asin(clamp(nonRight.b * Math.sin(nonRightAngle) / Math.max(.01, nonRight.a), -1, 1))
    : Math.acos(clamp((nonRightSideA ** 2 + nonRight.c ** 2 - nonRight.b ** 2) / Math.max(.01, 2 * nonRightSideA * nonRight.c), -1, 1));
  const nonRightBangle2 = Math.PI - nonRightBangle;
  const ssaReachable = nonRight.method === 'SSA' && nonRight.b * Math.sin(nonRightAngle) <= nonRight.a;
  const nonRightCangle = Math.PI - nonRightAngle - nonRightBangle;
  const nonRightCangle2 = Math.PI - nonRightAngle - nonRightBangle2;
  const ssaHasTwo = ssaReachable && nonRightCangle2 > 0 && nonRightAngle + nonRightBangle2 < Math.PI;
  const ssaDelta = ssaReachable ? nonRightScale * Math.sqrt(Math.max(0, nonRight.a ** 2 - (nonRight.b * Math.sin(nonRightAngle)) ** 2)) : 0;
  const nonRightC = nonRight.method === 'SSA' ? Math.hypot(nonRight.b * Math.cos(nonRightAngle) + (ssaHasTwo ? ssaDelta / nonRightScale : -ssaDelta / nonRightScale), nonRight.b * Math.sin(nonRightAngle)) : nonRight.c;
  const nonRightB = { x: nonRightOrigin.x + nonRightC * nonRightScale, y: nonRightOrigin.y };
  const nonRightTop = { x: nonRightOrigin.x + nonRight.b * Math.cos(nonRightAngle) * nonRightScale, y: nonRightOrigin.y - nonRight.b * Math.sin(nonRightAngle) * nonRightScale };
  const nonRightAltB = { x: nonRightTop.x - ssaDelta, y: nonRightOrigin.y };
  const nonRightArea = nonRight.method === 'SSA' ? .5 * nonRight.b * nonRightC * Math.sin(nonRightAngle) : .5 * nonRight.b * nonRight.c * Math.sin(nonRightAngle);
  const boxOrigin = { x: 220, y: 430 };
  const boxScale = { length: 4, widthX: 2.1, widthY: 1.35, height: 4 };
  const boxPoints = {
    o: boxOrigin,
    x: { x: boxOrigin.x + dimensions.length * boxScale.length, y: boxOrigin.y },
    y: { x: boxOrigin.x + dimensions.width * boxScale.widthX, y: boxOrigin.y - dimensions.width * boxScale.widthY },
    xy: { x: boxOrigin.x + dimensions.length * boxScale.length + dimensions.width * boxScale.widthX, y: boxOrigin.y - dimensions.width * boxScale.widthY },
    z: { x: boxOrigin.x, y: boxOrigin.y - dimensions.height * boxScale.height },
    xz: { x: boxOrigin.x + dimensions.length * boxScale.length, y: boxOrigin.y - dimensions.height * boxScale.height },
    yz: { x: boxOrigin.x + dimensions.width * boxScale.widthX, y: boxOrigin.y - dimensions.width * boxScale.widthY - dimensions.height * boxScale.height },
    xyz: { x: boxOrigin.x + dimensions.length * boxScale.length + dimensions.width * boxScale.widthX, y: boxOrigin.y - dimensions.width * boxScale.widthY - dimensions.height * boxScale.height },
  };
  const faceDiagonal3D = Math.hypot(dimensions.length, dimensions.width);
  const spaceDiagonal3D = Math.hypot(dimensions.length, dimensions.width, dimensions.height);
  const linePlaneAngle = Math.atan2(dimensions.height, faceDiagonal3D) * 180 / Math.PI;
  const bearingRadians = bearingValues.bearing * Math.PI / 180;
  const compass = { x: 590, y: 292, r: 205 };
  const compassPoint = { x: compass.x + bearingValues.distance * Math.sin(bearingRadians), y: compass.y - bearingValues.distance * Math.cos(bearingRadians) };
  const eastComponent = bearingValues.distance * Math.sin(bearingRadians);
  const northComponent = bearingValues.distance * Math.cos(bearingRadians);
  const reciprocalBearing = (bearingValues.bearing + 180) % 360;
  const sightScale = 2.6;
  const sightGroundY = 455;
  const sightObserver = { x: 250, y: sightGroundY - (sightline.kind === 'elevation' ? 15 : sightline.height) * sightScale };
  const sightTarget = { x: sightObserver.x + sightline.distance * 2.8, y: sightGroundY - (sightline.kind === 'elevation' ? sightline.height + 15 : 0) * sightScale };
  const sightLevel = { x: sightTarget.x, y: sightObserver.y };
  const sightHeightHandle = sightline.kind === 'elevation' ? sightTarget : sightObserver;
  const sightAngle = Math.atan2(sightObserver.y - sightTarget.y, sightTarget.x - sightObserver.x) * 180 / Math.PI;
  const sightLength = Math.hypot(sightline.distance, sightline.height);
  const circle = { x: 1260, y: 280, r: 158 };
  const circlePoint = { x: circle.x + circle.r * Math.cos(radians), y: circle.y - circle.r * Math.sin(radians) };
  const modeTitle = { triangle: 'Trigonometry: right-angled triangle', pythagoras: 'Pythagoras: discover the hypotenuse', exact: 'Exact trigonometric values', sine: 'Sine graph: y = sin x', cosine: 'Cosine graph: y = cos x', tangent: 'Tangent graph: y = tan x', nonRight: 'Non-right triangles: sine and cosine rules', threeD: 'Three-dimensional trigonometry', bearings: 'Bearings: navigate from north', elevation: 'Angles of elevation and depression' }[mode];
  const objective = graphMode
    ? `Drag the point along the ${mode} curve or set x below. Move the horizontal level k to solve ${mode === 'sine' ? 'sin' : mode === 'cosine' ? 'cos' : 'tan'} x = k over 0° to 360°.`
    : mode === 'pythagoras'
      ? 'Change either perpendicular side. The diagram and c² = a² + b² update together, so you can see why the longest side is the hypotenuse.'
    : mode === 'exact'
        ? 'Explore the exact sine, cosine and tangent values at the standard angles. Select a column to link the table to the unit circle.'
        : mode === 'nonRight'
          ? `Switch between SAS and SSA. Change the known sides and included angle to compare the cosine rule, sine rule, triangle area${ssaHasTwo ? ' and both possible SSA triangles' : ''}.`
          : mode === 'threeD'
            ? 'Adjust the cuboid dimensions. Follow the face diagonal into the space diagonal, then measure the angle between the diagonal and the base plane.'
            : mode === 'bearings'
              ? 'Drag the destination around the compass. The bearing is measured clockwise from north; distance, northing, easting, and the reciprocal bearing update together.'
              : mode === 'elevation'
                ? `Drag the sightline point or horizontal distance marker. Compare the ${sightline.kind} angle with the vertical height difference and horizontal distance.`
        : 'Change θ or the hypotenuse. The right triangle, unit-circle coordinates and SOH–CAH–TOA ratios update from the same angle.';
  const update = (id, next) => {
    const control = profile.controls.find((item) => item.id === id);
    const bounded = clamp(next, control.min, control.max);
    const quantized = control.min + Math.round((bounded - control.min) / control.step) * control.step;
    setValues((previous) => ({ ...previous, [id]: Number(quantized.toPrecision(10)) }));
  };
  const updateAngle = (next) => setValues((previous) => ({ ...previous, angle: Math.round(clamp(next, graphMode || mode === 'exact' ? 0 : 1, graphMode ? 360 : mode === 'exact' ? 90 : 89)) }));
  const pointFromEvent = (event) => {
    const svg = svgRef.current; const matrix = svg?.getScreenCTM?.();
    if (!svg || !matrix) return null;
    const point = svg.createSVGPoint(); point.x = event.clientX; point.y = event.clientY;
    return point.matrixTransform(matrix.inverse());
  };
  const beginDrag = (event) => {
    const handle = event.target.closest('[data-trig-handle]')?.getAttribute('data-trig-handle');
    const inPlot = graphMode && event.target.closest('[data-graph-plot]');
    if (!handle && !inPlot) return;
    const activeHandle = handle || 'graph';
    dragRef.current = { handle: activeHandle, pointerId: event.pointerId };
    event.currentTarget.setPointerCapture(event.pointerId);
    applyDrag(event);
    event.preventDefault();
  };
  const applyDrag = (event) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    const point = pointFromEvent(event); if (!point) return;
    if (dragRef.current.handle === 'graph') updateAngle((point.x - plot.left) / plotWidth * 360);
    if (dragRef.current.handle === 'target') setTarget(clamp(yMax - (point.y - plot.top) / plotHeight * (yMax - yMin), mode === 'tangent' ? -4 : -1, mode === 'tangent' ? 4 : 1));
    if (dragRef.current.handle === 'angle' || dragRef.current.handle === 'unitAngle') {
      const center = dragRef.current.handle === 'unitAngle' ? circle : origin;
      const degrees = Math.atan2(center.y - point.y, point.x - center.x) * 180 / Math.PI;
      updateAngle(degrees);
    }
    if (dragRef.current.handle === 'length') {
      const dx = point.x - origin.x, dy = origin.y - point.y;
      update('hypotenuse', Math.hypot(dx, dy) / (drawingScale * .72) * 100);
    }
    if (dragRef.current.handle === 'legA') setLegs((previous) => ({ ...previous, a: Math.round(clamp((point.x - origin.x) / triangleScale, 10, 100)) }));
    if (dragRef.current.handle === 'legB') setLegs((previous) => ({ ...previous, b: Math.round(clamp((origin.y - point.y) / triangleScale, 10, 100)) }));
    if (dragRef.current.handle === 'boxLength') setDimensions((previous) => ({ ...previous, length: Math.round(clamp((point.x - boxOrigin.x) / boxScale.length, 10, 60)) }));
    if (dragRef.current.handle === 'boxWidth') setDimensions((previous) => ({ ...previous, width: Math.round(clamp(((point.x - boxOrigin.x) * boxScale.widthX + (point.y - boxOrigin.y) * -boxScale.widthY) / (boxScale.widthX ** 2 + boxScale.widthY ** 2), 10, 60)) }));
    if (dragRef.current.handle === 'boxHeight') setDimensions((previous) => ({ ...previous, height: Math.round(clamp((boxOrigin.y - point.y) / boxScale.height, 10, 60)) }));
    if (dragRef.current.handle === 'nonRightAngle') {
      const next = Math.atan2(nonRightOrigin.y - point.y, point.x - nonRightOrigin.x) * 180 / Math.PI;
      setNonRight((previous) => ({ ...previous, angle: Math.round(clamp(next, 10, 170)) }));
    }
    if (dragRef.current.handle === 'nonRightBase') {
      const side = nonRight.method === 'SSA'
        ? Math.hypot(point.x - nonRightTop.x, point.y - nonRightTop.y) / nonRightScale
        : Math.hypot(point.x - nonRightOrigin.x, point.y - nonRightOrigin.y) / nonRightScale;
      setNonRight((previous) => nonRight.method === 'SSA'
        ? { ...previous, a: Math.round(clamp(side, 20, 120)) }
        : { ...previous, c: Math.round(clamp(side, 20, 120)) });
    }
    if (dragRef.current.handle === 'compassPoint') {
      const dx = point.x - compass.x, dy = compass.y - point.y;
      const nextBearing = (Math.atan2(dx, dy) * 180 / Math.PI + 360) % 360;
      setBearingValues({ bearing: Math.round(nextBearing) % 360, distance: Math.round(clamp(Math.hypot(dx, dy), 10, compass.r)) });
    }
    if (dragRef.current.handle === 'sightDistance') {
      setSightline((previous) => ({ ...previous, distance: Math.round(clamp((point.x - sightObserver.x) / 2.8, 40, 180)) }));
    }
    if (dragRef.current.handle === 'sightHeight') {
      const height = sightline.kind === 'elevation'
        ? (sightObserver.y - point.y) / sightScale
        : (sightGroundY - point.y) / sightScale;
      setSightline((previous) => ({ ...previous, height: Math.round(clamp(height, 10, 120)) }));
    }
  };
  const finishDrag = (event) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };
  const setModeAndAngle = (nextMode) => {
    setMode(nextMode);
    const graph = ['sine', 'cosine', 'tangent'].includes(nextMode);
    const nextAngle = nextMode === 'exact'
      ? exactAngles.reduce((nearest, value) => Math.abs(value - theta) < Math.abs(nearest - theta) ? value : nearest, exactAngles[0])
      : Math.round(clamp(theta, graph ? 0 : 1, graph ? 360 : 89));
    setValues((previous) => ({ ...previous, angle: nextAngle }));
    if (nextMode === 'tangent') setTarget(1);
    else if (nextMode === 'sine' || nextMode === 'cosine') setTarget(.5);
  };
  const reset = () => { setValues({ ...defaults, angle: mode === 'exact' || graphMode ? 30 : angle, hypotenuse }); setLegs({ a: 60, b: 80 }); setNonRight({ method: 'SSA', a: 75, b: 90, c: 80, angle: 40 }); setDimensions({ length: 50, width: 40, height: 30 }); setBearingValues({ bearing: 60, distance: 130 }); setSightline({ kind: 'elevation', distance: 120, height: 80 }); setTarget(mode === 'tangent' ? 1 : .5); };
  const angleControl = { ...profile.controls[0], min: graphMode ? 0 : 1, max: graphMode ? 360 : 89, step: 1 };
  const shownTitle = modeTitle || spec.title;
  const isTriangle = mode === 'triangle';
  const isPythagoras = mode === 'pythagoras';
  const isExact = mode === 'exact';
  const isNonRight = mode === 'nonRight';
  const isThreeD = mode === 'threeD';
  const isBearing = mode === 'bearings';
  const isElevation = mode === 'elevation';
  const curveColor = mode === 'sine' ? '#57d5e8' : mode === 'cosine' ? '#f1bd61' : '#b9a0ff';
  const yTicks = mode === 'tangent' ? [-3, -2, -1, 0, 1, 2, 3] : [-1, -.5, 0, .5, 1];
  const graphExpression = mode === 'sine' ? 'sin' : mode === 'cosine' ? 'cos' : 'tan';
  const currentTargetText = Math.abs(graphTarget) < 1e-8 ? '0' : Number(graphTarget.toFixed(3)).toString();
  const shownGraphY = Number.isFinite(graphResult) ? graphResult : 0;
  const displayedGraphY = mode === 'tangent' ? clamp(shownGraphY, yMin, yMax) : shownGraphY;
  const graphXNow = graphX(theta);
  const graphYNow = graphY(displayedGraphY);
  const targetSolutions = solutionAngles.length ? solutionAngles.map((value) => `${Number(value.toFixed(1))}°`).join('  ·  ') : 'No real intersection in 0°–360°';

  const graphReadouts = [
    { label: 'Input angle x', value: `${theta}°` },
    { label: `Function value ${graphExpression} x`, value: Number.isFinite(graphResult) ? fmt(graphResult, 4) : 'undefined' },
    { label: 'Equation level k', value: currentTargetText },
    { label: `Solutions to ${graphExpression} x = k`, value: targetSolutions },
  ];
  const triangleReadouts = [
    { label: 'Opposite side', value: `${fmt(opposite, 4)} cm` },
    { label: 'Adjacent side', value: `${fmt(adjacent, 4)} cm` },
    { label: 'Hypotenuse', value: `${fmt(values.hypotenuse, 4)} cm` },
    { label: 'sin θ · cos θ · tan θ', value: `${fmt(Math.sin(radians), 3)} · ${fmt(Math.cos(radians), 3)} · ${fmt(Math.tan(radians), 3)}` },
  ];
  const pythagorasReadouts = [
    { label: 'Side a', value: `${legs.a} cm` },
    { label: 'Side b', value: `${legs.b} cm` },
    { label: 'Hypotenuse c', value: `${fmt(hypotenuseFromLegs, 4)} cm` },
    { label: 'Area', value: `${fmt(legs.a * legs.b / 2, 4)} cm²` },
  ];
  const exactReadouts = [
    { label: `Angle θ`, value: `${theta}°` },
    { label: 'sin θ', value: fmt(Math.sin(radians), 5) },
    { label: 'cos θ', value: fmt(Math.cos(radians), 5) },
    { label: 'tan θ', value: Math.abs(Math.cos(radians)) < 1e-8 ? 'undefined' : fmt(Math.tan(radians), 5) },
  ];
  const nonRightReadouts = [
    { label: 'Side a', value: `${fmt(nonRightSideA, 3)} cm` },
    { label: 'Angle B', value: `${fmt(nonRightBangle * 180 / Math.PI, 2)}°${ssaHasTwo ? ` / ${fmt(nonRightBangle2 * 180 / Math.PI, 2)}°` : ''}` },
    { label: 'Triangle area', value: `${fmt(nonRightArea, 3)} cm²` },
    { label: 'SSA solutions', value: nonRight.method !== 'SSA' ? 'SAS: one triangle' : !ssaReachable ? 'No triangle' : ssaHasTwo ? 'Two possible triangles' : 'One possible triangle' },
  ];
  const threeDReadouts = [
    { label: 'Face diagonal', value: `${fmt(faceDiagonal3D, 3)} cm` },
    { label: 'Space diagonal', value: `${fmt(spaceDiagonal3D, 3)} cm` },
    { label: 'Angle to base plane', value: `${fmt(linePlaneAngle, 2)}°` },
    { label: 'Space diagonal²', value: `${fmt(spaceDiagonal3D ** 2, 3)} cm²` },
  ];
  const bearingReadouts = [
    { label: 'Bearing from north', value: `${String(bearingValues.bearing).padStart(3, '0')}°` },
    { label: 'Distance', value: `${bearingValues.distance} km` },
    { label: 'Easting · northing', value: `${fmt(eastComponent, 2)} km · ${fmt(northComponent, 2)} km` },
    { label: 'Reciprocal bearing', value: `${String(reciprocalBearing).padStart(3, '0')}°` },
  ];
  const sightlineReadouts = [
    { label: `Angle of ${sightline.kind}`, value: `${fmt(Math.abs(sightAngle), 3)}°` },
    { label: 'Horizontal distance', value: `${sightline.distance} m` },
    { label: 'Vertical height difference', value: `${sightline.height} m` },
    { label: 'Line of sight', value: `${fmt(sightLength, 3)} m` },
  ];
  const readouts = graphMode ? graphReadouts : isPythagoras ? pythagorasReadouts : isExact ? exactReadouts : isNonRight ? nonRightReadouts : isThreeD ? threeDReadouts : isBearing ? bearingReadouts : isElevation ? sightlineReadouts : triangleReadouts;
  const modeButtons = [
    ['pythagoras', 'Pythagoras'], ['triangle', 'Right triangle'], ['exact', 'Exact values'],
    ['sine', 'Sine graph'], ['cosine', 'Cosine graph'], ['tangent', 'Tangent graph'],
    ['nonRight', 'Sine / cosine rules'], ['threeD', '3D trigonometry'], ['bearings', 'Bearings'], ['elevation', 'Elevation / depression'],
  ];
  const setExactAngle = (value) => updateAngle(value);
  const resetDefaults = () => reset();

  return <main className="lab-page subject-workbench-page">
    <SubjectLabHeader spec={spec} title={shownTitle} objective={objective}/>
    <section className={`subject-workbench-frame trig-frame${graphMode ? ' trig-graph-frame' : ''}`}>
      <div className="subject-scene-head trig-scene-head">
        <div className="trig-mode-tabs" role="tablist" aria-label="Trigonometry lab mode">
          {modeButtons.map(([id, label]) => <button key={id} type="button" role="tab" aria-selected={mode === id} className={mode === id ? 'is-active' : ''} onClick={() => setModeAndAngle(id)}>{label}</button>)}
        </div>
        <button type="button" onClick={resetDefaults}>Reset lab</button>
      </div>
      <div className="trig-canvas-shell">
      <svg ref={svgRef} className={`trig-scene${graphMode ? ' trig-plot-scene' : ''}`} viewBox={graphMode ? '0 0 2600 560' : '0 0 1800 560'} role="application" aria-label={graphMode ? `Interactive ${mode} graph from zero to 360 degrees. Drag in the plot to move x and drag the dashed horizontal line to change k.` : 'Interactive trigonometry diagram. Drag the highlighted point or change the controls below.'} onPointerDown={beginDrag} onPointerMove={applyDrag} onPointerUp={finishDrag} onPointerCancel={finishDrag}>
        <defs>
          <pattern id="trig-grid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="#203447" strokeWidth="1"/></pattern>
          <pattern id="trig-graph-grid" width="65" height="48" patternUnits="userSpaceOnUse"><path d="M65 0H0V48" fill="none" stroke="#23394b" strokeWidth="1"/></pattern>
          <marker id="trig-north-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#8bd9e8"/></marker>
          <clipPath id="trig-plot-clip"><rect x={plot.left} y={plot.top} width={plotWidth} height={plotHeight}/></clipPath>
        </defs>
        <rect width={graphMode ? 2600 : 1800} height="560" fill="#08111c"/><rect width={graphMode ? 2600 : 1800} height="560" fill="url(#trig-grid)" opacity=".48"/>
        {graphMode && <g className="trig-graph">
          <text x={plot.left} y="39" className="trig-graph-kicker">FUNCTION PLOT · DEGREES · 0° TO 360°</text>
          <text x={plot.right} y="39" textAnchor="end" className="trig-graph-kicker">DRAG THE CURVE POINT OR DASHED k LINE</text>
          <rect data-graph-plot="true" x={plot.left} y={plot.top} width={plotWidth} height={plotHeight} fill="url(#trig-graph-grid)" stroke="#3a5265" strokeWidth="1.5"/>
          {Array.from({ length: 13 }, (_, index) => {
            const degree = index * 30;
            const x = graphX(degree);
            return <g key={`xtick-${degree}`}><line x1={x} y1={plot.top} x2={x} y2={plot.bottom} className={degree % 90 === 0 ? 'trig-major-grid' : 'trig-minor-grid'}/>{degree % 90 === 0 && <text x={x} y={plot.bottom + 34} textAnchor="middle" className="trig-axis-label">{degree}°</text>}</g>;
          })}
          {yTicks.map((tick) => <g key={`ytick-${tick}`}><line x1={plot.left} y1={graphY(tick)} x2={plot.right} y2={graphY(tick)} className={tick === 0 ? 'trig-axis-line' : 'trig-major-grid'}/><text x={plot.left - 20} y={graphY(tick) + 5} textAnchor="end" className="trig-axis-label">{tick}</text></g>)}
          {mode === 'tangent' && [90, 270].map((degree) => <g key={`asymptote-${degree}`}><line x1={graphX(degree)} y1={plot.top} x2={graphX(degree)} y2={plot.bottom} className="trig-asymptote"/><text x={graphX(degree) + 8} y={plot.top + 21} className="trig-asymptote-label">x = {degree}° · asymptote</text></g>)}
          <text x={plot.left - 68} y={plot.top + 8} className="trig-axis-name">y</text><text x={plot.right} y={plot.bottom + 53} textAnchor="end" className="trig-axis-name">x (degrees)</text>
          {mode !== 'tangent' && <g className="trig-key-points">{[0, 90, 180, 270, 360].map((degree) => {
            const value = graphValue(degree);
            return <circle key={`key-${degree}`} cx={graphX(degree)} cy={graphY(value)} r="5"/>;
          })}</g>}
          <g clipPath="url(#trig-plot-clip)">
            {graphPaths.map((path, index) => <path key={`curve-${index}`} d={path} className="trig-curve" style={{ stroke: curveColor }}/>) }
            <line x1={plot.left} y1={graphY(graphTarget)} x2={plot.right} y2={graphY(graphTarget)} className="trig-target-line" data-trig-handle="target"/>
            {solutionAngles.map((degree) => <circle key={`solution-${degree}`} cx={graphX(degree)} cy={graphY(graphTarget)} r="8" className="trig-solution-point"/>)}
            <line x1={graphXNow} y1={plot.top} x2={graphXNow} y2={plot.bottom} className="trig-cursor-line"/>
            <circle cx={graphXNow} cy={graphYNow} r="12" className="trig-current-point" style={{ fill: curveColor, visibility: Number.isFinite(graphResult) ? 'visible' : 'hidden' }} data-trig-handle="graph"/>
          </g>
          <g data-trig-handle="target" role="slider" tabIndex="0" aria-label="Equation level k. Drag the dashed line or use the control below." aria-valuemin={mode === 'tangent' ? -4 : -1} aria-valuemax={mode === 'tangent' ? 4 : 1} aria-valuenow={graphTarget} onKeyDown={(event) => { if (event.key === 'ArrowUp' || event.key === 'ArrowRight') setTarget((previous) => clamp(previous + .05, mode === 'tangent' ? -4 : -1, mode === 'tangent' ? 4 : 1)); if (event.key === 'ArrowDown' || event.key === 'ArrowLeft') setTarget((previous) => clamp(previous - .05, mode === 'tangent' ? -4 : -1, mode === 'tangent' ? 4 : 1)); }}>
            <circle cx={plot.right - 18} cy={graphY(graphTarget)} r="20" className="trig-target-handle"/><text x={plot.right - 18} y={graphY(graphTarget) + 5} textAnchor="middle" className="trig-target-handle-text">k</text>
          </g>
          <g data-trig-handle="graph" role="slider" tabIndex="0" aria-label={`Graph input angle x equals ${theta} degrees. Drag the point or use the control below.`} aria-valuemin="0" aria-valuemax="360" aria-valuenow={theta} onKeyDown={(event) => { if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') updateAngle(theta - 1); if (event.key === 'ArrowRight' || event.key === 'ArrowUp') updateAngle(theta + 1); }}>
            {Number.isFinite(graphResult) ? <circle cx={graphXNow} cy={graphYNow} r="25" className="trig-point-hit"/> : <text x={Math.min(graphXNow + 18, plot.right - 170)} y={plot.top + 28} className="trig-point-label">undefined at asymptote</text>}<text x={Math.min(graphXNow + 17, plot.right - 80)} y={Math.max(plot.top + 24, graphYNow - 18)} className="trig-point-label">x = {theta}°</text>
          </g>
          <g className="trig-graph-legend"><line x1="0" y1="0" x2="35" y2="0" style={{ stroke: curveColor }}/><text x="45" y="5">y = {graphExpression} x</text><line x1="175" y1="0" x2="210" y2="0" className="trig-target-line"/><text x="220" y="5">y = k = {currentTargetText}</text></g>
          <text x={plot.left} y="535" className="trig-graph-note">{mode === 'sine' ? 'Amplitude 1 · period 360° · zeros at 0°, 180°, 360°' : mode === 'cosine' ? 'Amplitude 1 · period 360° · zeros at 90°, 270°' : 'Period 180° · vertical asymptotes at 90° and 270° · range: all real numbers'}</text>
        </g>}
        {isTriangle && <g className="trig-diagram">
          <text x="80" y="48" className="trig-scene-kicker">RIGHT TRIANGLE AND UNIT CIRCLE · SAME θ</text>
          <path className="trig-fill" d={`M${origin.x} ${origin.y}L${foot.x} ${foot.y}L${tip.x} ${tip.y}Z`}/>
          <path className="trig-adjacent" d={`M${origin.x} ${origin.y}H${foot.x}`}/><path className="trig-opposite" d={`M${foot.x} ${foot.y}V${tip.y}`}/><path className="trig-hypotenuse" d={`M${origin.x} ${origin.y}L${tip.x} ${tip.y}`}/>
          <path className="trig-right-angle" d={`M${foot.x-28} ${foot.y}V${foot.y-28}H${foot.x}`}/>
          <path className="trig-angle-arc" d={`M${origin.x+70} ${origin.y}A70 70 0 0 0 ${origin.x+70*Math.cos(radians)} ${origin.y-70*Math.sin(radians)}`}/>
          <text x={origin.x+83} y={origin.y-19} className="trig-angle-label">θ = {theta}°</text>
          <text x={(origin.x+foot.x)/2} y={origin.y+42} textAnchor="middle" className="trig-side-label adjacent-label">ADJACENT · {fmt(adjacent, 3)} cm</text>
          <text x={foot.x+27} y={(foot.y+tip.y)/2-5} className="trig-side-label opposite-label">OPPOSITE</text><text x={foot.x+27} y={(foot.y+tip.y)/2+20} className="trig-side-value">{fmt(opposite, 3)} cm</text>
          <text x={(origin.x+tip.x)/2-12*Math.sin(radians)} y={(origin.y+tip.y)/2-20*Math.cos(radians)} textAnchor="middle" className="trig-side-label hypotenuse-label">HYPOTENUSE · {fmt(values.hypotenuse, 3)} cm</text>
          <g data-trig-handle="angle" tabIndex="0" role="slider" aria-label="Triangle angle. Drag the point around the arc." aria-valuemin="1" aria-valuemax="89" aria-valuenow={theta} onKeyDown={(event) => { if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') updateAngle(theta - 1); if (event.key === 'ArrowRight' || event.key === 'ArrowUp') updateAngle(theta + 1); }}><circle cx={tip.x} cy={tip.y} r="26" className="trig-hit"/><circle cx={tip.x} cy={tip.y} r="12" className="trig-angle-handle"/><text x={tip.x+18} y={tip.y+26} className="trig-handle-tag">DRAG θ</text></g>
          <g data-trig-handle="length" tabIndex="0" role="slider" aria-label="Hypotenuse length. Drag the cyan point or use the control below." aria-valuemin="0.1" aria-valuemax="100" aria-valuenow={values.hypotenuse} onKeyDown={(event) => { if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') update('hypotenuse', values.hypotenuse - .1); if (event.key === 'ArrowRight' || event.key === 'ArrowUp') update('hypotenuse', values.hypotenuse + .1); }}><circle cx={origin.x+radius*.72*Math.cos(radians)} cy={origin.y-radius*.72*Math.sin(radians)} r="24" className="trig-hit"/><circle cx={origin.x+radius*.72*Math.cos(radians)} cy={origin.y-radius*.72*Math.sin(radians)} r="10" className="trig-length-handle"/><text x={origin.x+radius*.72*Math.cos(radians)-22} y={origin.y-radius*.72*Math.sin(radians)-20} className="trig-handle-tag">DRAG LENGTH</text></g>
          <g className="trig-ratio-panel"><text x="700" y="124" className="trig-panel-kicker">SOH · CAH · TOA</text><text x="700" y="173" className="trig-ratio-line">sin θ = opposite / hypotenuse = {fmt(opposite, 2)} / {fmt(values.hypotenuse, 2)} = {fmt(Math.sin(radians), 4)}</text><text x="700" y="223" className="trig-ratio-line">cos θ = adjacent / hypotenuse = {fmt(adjacent, 2)} / {fmt(values.hypotenuse, 2)} = {fmt(Math.cos(radians), 4)}</text><text x="700" y="273" className="trig-ratio-line">tan θ = opposite / adjacent = {fmt(opposite, 2)} / {fmt(adjacent, 2)} = {fmt(Math.tan(radians), 4)}</text><text x="700" y="353" className="trig-ratio-note">In the unit circle, x = cos θ and y = sin θ.</text><text x="700" y="385" className="trig-ratio-note">The tangent ratio is the gradient of the radius.</text></g>
          <g className="trig-unit-circle"><text x={circle.x} y="48" textAnchor="middle" className="trig-scene-kicker">UNIT CIRCLE · r = 1</text><line x1={circle.x-circle.r-24} y1={circle.y} x2={circle.x+circle.r+40} y2={circle.y} className="trig-circle-axis"/><line x1={circle.x} y1={circle.y+circle.r+24} x2={circle.x} y2={circle.y-circle.r-34} className="trig-circle-axis"/><circle cx={circle.x} cy={circle.y} r={circle.r} className="trig-circle-outline"/><line x1={circle.x} y1={circle.y} x2={circlePoint.x} y2={circlePoint.y} className="trig-circle-radius"/><line x1={circlePoint.x} y1={circle.y} x2={circlePoint.x} y2={circlePoint.y} className="trig-circle-sine"/><line x1={circle.x} y1={circle.y} x2={circlePoint.x} y2={circle.y} className="trig-circle-cosine"/><path d={`M${circle.x+42} ${circle.y}A42 42 0 0 0 ${circle.x+42*Math.cos(radians)} ${circle.y-42*Math.sin(radians)}`} className="trig-angle-arc"/><text x={circle.x+circle.r+15} y={circle.y+23} className="trig-axis-label">1</text><text x={circle.x+10} y={circle.y-circle.r-12} className="trig-axis-label">1</text><text x={circlePoint.x+15} y={circlePoint.y-9} className="trig-circle-coordinate">({fmt(Math.cos(radians), 3)}, {fmt(Math.sin(radians), 3)})</text><circle data-trig-handle="unitAngle" cx={circlePoint.x} cy={circlePoint.y} r="25" className="trig-unit-hit"/><circle cx={circlePoint.x} cy={circlePoint.y} r="11" className="trig-angle-handle"/><text x={circle.x} y={circle.y+circle.r+62} textAnchor="middle" className="trig-angle-label">θ = {theta}°</text></g>
        </g>}
        {isPythagoras && <g className="trig-diagram">
          <text x="80" y="48" className="trig-scene-kicker">ADJUST THE LEGS · CHECK THE SQUARES</text>
          <path className="trig-fill" d={`M${origin.x} ${origin.y}L${pythagoreanFoot.x} ${pythagoreanFoot.y}L${pythagoreanTip.x} ${pythagoreanTip.y}Z`}/><path className="trig-adjacent" d={`M${origin.x} ${origin.y}H${pythagoreanFoot.x}`}/><path className="trig-opposite" d={`M${pythagoreanFoot.x} ${pythagoreanFoot.y}V${pythagoreanTip.y}`}/><path className="trig-hypotenuse" d={`M${origin.x} ${origin.y}L${pythagoreanTip.x} ${pythagoreanTip.y}`}/><path className="trig-right-angle" d={`M${pythagoreanFoot.x-27} ${pythagoreanFoot.y}V${pythagoreanFoot.y-27}H${pythagoreanFoot.x}`}/>
          <text x={(origin.x+pythagoreanFoot.x)/2} y={origin.y+40} textAnchor="middle" className="trig-side-label adjacent-label">a = {legs.a} cm</text><text x={pythagoreanFoot.x+25} y={(origin.y+pythagoreanTip.y)/2} className="trig-side-label opposite-label">b = {legs.b} cm</text><text x={(origin.x+pythagoreanTip.x)/2-22} y={(origin.y+pythagoreanTip.y)/2-17} className="trig-side-label hypotenuse-label">c = {fmt(hypotenuseFromLegs, 3)} cm</text>
          <g data-trig-handle="legA" tabIndex="0" role="slider" aria-label={`Base leg a, ${legs.a} centimetres. Drag to change.`} aria-valuemin="10" aria-valuemax="100" aria-valuenow={legs.a}><circle cx={pythagoreanFoot.x} cy={origin.y} r="25" className="trig-hit"/><circle cx={pythagoreanFoot.x} cy={origin.y} r="10" className="trig-length-handle"/></g><g data-trig-handle="legB" tabIndex="0" role="slider" aria-label={`Vertical leg b, ${legs.b} centimetres. Drag to change.`} aria-valuemin="10" aria-valuemax="100" aria-valuenow={legs.b}><circle cx={pythagoreanFoot.x} cy={pythagoreanTip.y} r="25" className="trig-hit"/><circle cx={pythagoreanFoot.x} cy={pythagoreanTip.y} r="10" className="trig-length-handle"/></g>
          <g className="trig-pythagoras-panel"><text x="760" y="150" className="trig-panel-kicker">THE PYTHAGOREAN RELATIONSHIP</text><text x="760" y="225" className="trig-pythagoras-equation">a² + b² = c²</text><text x="760" y="286" className="trig-ratio-line">{legs.a}² + {legs.b}² = c²</text><text x="760" y="334" className="trig-ratio-line">{legs.a * legs.a} + {legs.b * legs.b} = {fmt(hypotenuseFromLegs * hypotenuseFromLegs, 3)}</text><text x="760" y="393" className="trig-pythagoras-equation">c = {fmt(hypotenuseFromLegs, 3)} cm</text><text x="760" y="442" className="trig-ratio-note">Drag either cyan point or enter the side lengths below.</text></g>
          <g className="trig-square-tiles"><rect x="1300" y="145" width="170" height="170" rx="15"/><text x="1385" y="222" textAnchor="middle">a²</text><text x="1385" y="258" textAnchor="middle">{legs.a * legs.a}</text><rect x="1490" y="145" width="170" height="170" rx="15"/><text x="1575" y="222" textAnchor="middle">b²</text><text x="1575" y="258" textAnchor="middle">{legs.b * legs.b}</text><text x="1480" y="372" textAnchor="middle" className="trig-square-plus">Add square areas</text><text x="1480" y="423" textAnchor="middle" className="trig-square-result">c² = {fmt(hypotenuseFromLegs * hypotenuseFromLegs, 3)}</text></g>
        </g>}
        {isExact && <g className="trig-exact-panel"><text x="95" y="56" className="trig-scene-kicker">SPECIAL ANGLES · EXACT RATIOS · DEGREE MEASURE</text><text x="95" y="133" className="trig-exact-heading">Choose an angle to see how each exact value is built.</text><g transform="translate(95 183)"><rect width="1600" height="260" rx="16" className="trig-exact-table"/>{['Ratio', ...exactAngles.map((value) => `${value}°`)].map((label, index) => <text key={label} x={index === 0 ? 40 : 225 + (index - 1) * 265} y="52" className="trig-table-head">{label}</text>)}{[
          ['sin θ', ['0', '1/2', '√2/2', '√3/2', '1']], ['cos θ', ['1', '√3/2', '√2/2', '1/2', '0']], ['tan θ', ['0', '√3/3', '1', '√3', 'undefined']],
        ].map(([name, row], rowIndex) => <g key={name}><line x1="28" y1={82 + rowIndex * 58} x2="1570" y2={82 + rowIndex * 58} className="trig-table-line"/><text x="40" y={123 + rowIndex * 58} className="trig-table-ratio">{name}</text>{row.map((value, index) => <text key={`${name}-${index}`} x={225 + index * 265} y={123 + rowIndex * 58} textAnchor="middle" className={`trig-table-value${theta === exactAngles[index] ? ' is-selected' : ''}`}>{value}</text>)}</g>)}<rect x={120 + exactAngles.indexOf(theta) * 265} y="20" width="210" height="220" rx="10" className="trig-table-highlight"/></g><text x="95" y="497" className="trig-exact-note">At 90°, tan θ is undefined because cos θ = 0.</text><text x="1690" y="497" textAnchor="end" className="trig-exact-note">Current angle: {theta}°</text></g>}
        {isNonRight && <g className="trig-diagram trig-nonright-diagram">
          <text x="80" y="48" className="trig-scene-kicker">{nonRight.method === 'SSA' ? 'SSA AMBIGUOUS CASE · ONE OR TWO TRIANGLES' : 'SAS TRIANGLE · COSINE RULE AND AREA'}</text>
          {!ssaReachable && nonRight.method === 'SSA' && <g><rect x="170" y="180" width="620" height="150" rx="16" className="trig-warning-box"/><text x="480" y="245" textAnchor="middle" className="trig-warning-title">No triangle for these measurements</text><text x="480" y="286" textAnchor="middle" className="trig-ratio-note">b sin A is greater than a, so the side cannot reach the base.</text></g>}
          {(nonRight.method === 'SAS' || ssaReachable) && <>
            {nonRight.method === 'SSA' && ssaHasTwo && <path d={`M${nonRightOrigin.x} ${nonRightOrigin.y}L${nonRightAltB.x} ${nonRightAltB.y}L${nonRightTop.x} ${nonRightTop.y}Z`} className="trig-second-solution"/>}
            <path d={`M${nonRightOrigin.x} ${nonRightOrigin.y}L${nonRightB.x} ${nonRightB.y}L${nonRightTop.x} ${nonRightTop.y}Z`} className="trig-nonright-fill"/>
            <path d={`M${nonRightOrigin.x} ${nonRightOrigin.y}L${nonRightB.x} ${nonRightB.y}M${nonRightOrigin.x} ${nonRightOrigin.y}L${nonRightTop.x} ${nonRightTop.y}M${nonRightB.x} ${nonRightB.y}L${nonRightTop.x} ${nonRightTop.y}`} className="trig-nonright-edge"/>
            {nonRight.method === 'SSA' && ssaHasTwo && <path d={`M${nonRightOrigin.x} ${nonRightOrigin.y}L${nonRightAltB.x} ${nonRightAltB.y}M${nonRightAltB.x} ${nonRightAltB.y}L${nonRightTop.x} ${nonRightTop.y}`} className="trig-nonright-edge trig-alt-edge"/>}
            <text x={nonRightOrigin.x-20} y={nonRightOrigin.y+24} className="trig-side-label">A</text><text x={nonRightTop.x-8} y={nonRightTop.y-18} className="trig-side-label">C</text><text x={nonRightB.x+8} y={nonRightB.y+23} className="trig-side-label">B</text>
            <text x={(nonRightOrigin.x+nonRightTop.x)/2-25} y={(nonRightOrigin.y+nonRightTop.y)/2} className="trig-side-label hypotenuse-label">b = {nonRight.b}</text>
            <text x={(nonRightOrigin.x+nonRightB.x)/2} y={nonRightOrigin.y+38} textAnchor="middle" className="trig-side-label adjacent-label">c = {fmt(nonRightC, 2)}</text>
            <text x={(nonRightTop.x+nonRightB.x)/2+16} y={(nonRightTop.y+nonRightB.y)/2} className="trig-side-label opposite-label">a = {fmt(nonRightSideA, 2)}</text>
            <g data-trig-handle="nonRightAngle" role="slider" tabIndex="0" aria-label={`Angle A, ${nonRight.angle} degrees. Drag the cyan point to change it.`} aria-valuemin="10" aria-valuemax="170" aria-valuenow={nonRight.angle}><circle cx={nonRightTop.x} cy={nonRightTop.y} r="26" className="trig-hit"/><circle cx={nonRightTop.x} cy={nonRightTop.y} r="10" className="trig-length-handle"/></g>
            <g data-trig-handle="nonRightBase" role="slider" tabIndex="0" aria-label={`Triangle side ${nonRight.method === 'SSA' ? 'a' : 'c'}. Drag the amber point to change it.`} aria-valuemin="20" aria-valuemax="120"><circle cx={nonRightB.x} cy={nonRightB.y} r="25" className="trig-hit"/><circle cx={nonRightB.x} cy={nonRightB.y} r="10" className="trig-angle-handle"/></g>
            {nonRight.method === 'SSA' && ssaHasTwo && <><text x={(nonRightOrigin.x+nonRightB.x)/2} y={nonRightOrigin.y-28} textAnchor="middle" className="trig-solution-caption">SOLUTION 1</text><text x={(nonRightOrigin.x+nonRightAltB.x)/2} y={nonRightOrigin.y-28} textAnchor="middle" className="trig-solution-caption trig-alt-caption">SOLUTION 2</text></>}
          </>}
          <g className="trig-nonright-panel"><text x="875" y="125" className="trig-panel-kicker">{nonRight.method === 'SSA' ? 'SINE RULE · AMBIGUOUS CASE' : 'COSINE RULE · INCLUDED ANGLE'}</text>
            {nonRight.method === 'SSA' ? <><text x="875" y="190" className="trig-pythagoras-equation">sin B = b sin A / a</text><text x="875" y="245" className="trig-ratio-line">= {nonRight.b} sin {nonRight.angle}° / {nonRight.a}</text><text x="875" y="300" className="trig-ratio-line">B = {fmt(nonRightBangle * 180 / Math.PI, 2)}°{ssaHasTwo ? ` or ${fmt(nonRightBangle2 * 180 / Math.PI, 2)}°` : ''}</text><text x="875" y="355" className="trig-ratio-line">{ssaHasTwo ? 'Both angles make a valid triangle.' : ssaReachable ? 'Only one angle makes a valid triangle.' : 'No valid angle: no triangle exists.'}</text></> : <><text x="875" y="190" className="trig-pythagoras-equation">a² = b² + c² − 2bc cos A</text><text x="875" y="245" className="trig-ratio-line">a = {fmt(nonRightSideA, 3)} cm</text><text x="875" y="300" className="trig-ratio-line">sin B / b = sin A / a</text><text x="875" y="355" className="trig-ratio-line">Area = ½bc sin A = {fmt(nonRightArea, 3)} cm²</text></>}
            <text x="875" y="425" className="trig-ratio-note">{nonRight.method === 'SSA' ? 'The second angle is valid only when A + B is below 180°.' : 'Use the sine rule to determine the remaining angles and sides.'}</text>
            <text x="875" y="485" className="trig-solution-caption">ANGLE A = {nonRight.angle}° · AREA = {fmt(nonRightArea, 2)} cm²</text>
          </g>
        </g>}
        {isThreeD && <g className="trig-diagram trig-3d-diagram">
          <text x="80" y="48" className="trig-scene-kicker">CUBOID · FACE DIAGONAL · SPACE DIAGONAL</text>
          <path d={`M${boxPoints.o.x} ${boxPoints.o.y}L${boxPoints.x.x} ${boxPoints.x.y}L${boxPoints.xy.x} ${boxPoints.xy.y}L${boxPoints.y.x} ${boxPoints.y.y}Z M${boxPoints.z.x} ${boxPoints.z.y}L${boxPoints.xz.x} ${boxPoints.xz.y}L${boxPoints.xyz.x} ${boxPoints.xyz.y}L${boxPoints.yz.x} ${boxPoints.yz.y}Z M${boxPoints.o.x} ${boxPoints.o.y}L${boxPoints.z.x} ${boxPoints.z.y} M${boxPoints.x.x} ${boxPoints.x.y}L${boxPoints.xz.x} ${boxPoints.xz.y} M${boxPoints.y.x} ${boxPoints.y.y}L${boxPoints.yz.x} ${boxPoints.yz.y} M${boxPoints.xy.x} ${boxPoints.xy.y}L${boxPoints.xyz.x} ${boxPoints.xyz.y}`} className="trig-box-wire"/>
          <path d={`M${boxPoints.o.x} ${boxPoints.o.y}L${boxPoints.xy.x} ${boxPoints.xy.y}`} className="trig-face-diagonal"/><path d={`M${boxPoints.o.x} ${boxPoints.o.y}L${boxPoints.xyz.x} ${boxPoints.xyz.y}`} className="trig-space-diagonal"/><line x1={boxPoints.xyz.x} y1={boxPoints.xyz.y} x2={boxPoints.xy.x} y2={boxPoints.xy.y} className="trig-height-projection"/>
          <text x={(boxPoints.o.x+boxPoints.x.x)/2} y={boxPoints.o.y+26} className="trig-side-label adjacent-label">length {dimensions.length} cm</text><text x={(boxPoints.x.x+boxPoints.xy.x)/2+8} y={(boxPoints.x.y+boxPoints.xy.y)/2-12} className="trig-side-label hypotenuse-label">width {dimensions.width} cm</text><text x={boxPoints.z.x-58} y={(boxPoints.o.y+boxPoints.z.y)/2} className="trig-side-label opposite-label">height {dimensions.height} cm</text>
          <g data-trig-handle="boxLength" tabIndex="0" role="slider" aria-label={`Cuboid length ${dimensions.length} centimetres. Drag to change.`} aria-valuemin="10" aria-valuemax="60" aria-valuenow={dimensions.length}><circle cx={boxPoints.x.x} cy={boxPoints.x.y} r="26" className="trig-hit"/><circle cx={boxPoints.x.x} cy={boxPoints.x.y} r="10" className="trig-length-handle"/></g>
          <g data-trig-handle="boxWidth" tabIndex="0" role="slider" aria-label={`Cuboid width ${dimensions.width} centimetres. Drag to change.`} aria-valuemin="10" aria-valuemax="60" aria-valuenow={dimensions.width}><circle cx={boxPoints.y.x} cy={boxPoints.y.y} r="26" className="trig-hit"/><circle cx={boxPoints.y.x} cy={boxPoints.y.y} r="10" className="trig-length-handle"/></g>
          <g data-trig-handle="boxHeight" tabIndex="0" role="slider" aria-label={`Cuboid height ${dimensions.height} centimetres. Drag to change.`} aria-valuemin="10" aria-valuemax="60" aria-valuenow={dimensions.height}><circle cx={boxPoints.z.x} cy={boxPoints.z.y} r="26" className="trig-hit"/><circle cx={boxPoints.z.x} cy={boxPoints.z.y} r="10" className="trig-angle-handle"/></g>
          <g className="trig-3d-panel"><text x="800" y="125" className="trig-panel-kicker">FROM 2D FACE TO 3D SPACE</text><text x="800" y="190" className="trig-pythagoras-equation">face² = l² + w²</text><text x="800" y="235" className="trig-ratio-line">= {dimensions.length}² + {dimensions.width}² = {fmt(faceDiagonal3D ** 2, 2)}</text><text x="800" y="300" className="trig-pythagoras-equation">space² = face² + h²</text><text x="800" y="345" className="trig-ratio-line">= {fmt(faceDiagonal3D ** 2, 2)} + {dimensions.height}² = {fmt(spaceDiagonal3D ** 2, 2)}</text><text x="800" y="410" className="trig-pythagoras-equation">angle to plane = {fmt(linePlaneAngle, 2)}°</text><text x="800" y="458" className="trig-ratio-note">tan θ = height / face diagonal</text></g>
        </g>}
        {isBearing && <g className="trig-diagram trig-bearing-diagram">
          <text x="90" y="48" className="trig-scene-kicker">TRUE BEARINGS - CLOCKWISE FROM NORTH</text>
          <circle cx={compass.x} cy={compass.y} r={compass.r} className="trig-compass-ring"/>
          <circle cx={compass.x} cy={compass.y} r={compass.r * .66} className="trig-compass-inner-ring"/>
          {Array.from({ length: 36 }, (_, index) => {
            const degrees = index * 10;
            const angle = degrees * Math.PI / 180;
            const outer = compass.r - 2;
            const inner = compass.r - (degrees % 30 === 0 ? 23 : 12);
            return <line key={`compass-tick-${degrees}`} x1={compass.x + Math.sin(angle) * inner} y1={compass.y - Math.cos(angle) * inner} x2={compass.x + Math.sin(angle) * outer} y2={compass.y - Math.cos(angle) * outer} className={degrees % 30 === 0 ? 'trig-compass-major-tick' : 'trig-compass-tick'}/>;
          })}
          <line x1={compass.x} y1={compass.y - compass.r + 28} x2={compass.x} y2={compass.y + compass.r - 28} className="trig-compass-axis"/>
          <line x1={compass.x - compass.r + 28} y1={compass.y} x2={compass.x + compass.r - 28} y2={compass.y} className="trig-compass-axis"/>
          <text x={compass.x} y={compass.y - compass.r - 16} textAnchor="middle" className="trig-compass-cardinal">N</text>
          <text x={compass.x + compass.r + 24} y={compass.y + 5} textAnchor="middle" className="trig-compass-cardinal">E</text>
          <text x={compass.x} y={compass.y + compass.r + 31} textAnchor="middle" className="trig-compass-cardinal">S</text>
          <text x={compass.x - compass.r - 24} y={compass.y + 5} textAnchor="middle" className="trig-compass-cardinal">W</text>
          <path d={`M${compass.x} ${compass.y - 70}A70 70 0 ${bearingValues.bearing > 180 ? 1 : 0} 1 ${compass.x + 70 * Math.sin(bearingRadians)} ${compass.y - 70 * Math.cos(bearingRadians)}`} className="trig-bearing-arc"/>
          <text x={compass.x + 78} y={compass.y - 80} className="trig-bearing-label">{String(bearingValues.bearing).padStart(3, '0')}°</text>
          <line x1={compass.x} y1={compass.y} x2={compass.x} y2={compass.y - compass.r + 36} className="trig-north-reference"/>
          <line x1={compass.x} y1={compass.y} x2={compassPoint.x} y2={compassPoint.y} className="trig-bearing-route"/>
          <line x1={compassPoint.x} y1={compassPoint.y} x2={compassPoint.x} y2={compass.y} className="trig-bearing-easting"/>
          <line x1={compass.x} y1={compass.y} x2={compassPoint.x} y2={compass.y} className="trig-bearing-northing"/>
          <circle cx={compass.x} cy={compass.y} r="7" className="trig-compass-origin"/>
          <g data-trig-handle="compassPoint" role="slider" tabIndex="0" aria-label={`Destination at bearing ${bearingValues.bearing} degrees and distance ${bearingValues.distance} kilometres. Drag around the compass.`} aria-valuemin="0" aria-valuemax="359" aria-valuenow={bearingValues.bearing}>
            <circle cx={compassPoint.x} cy={compassPoint.y} r="27" className="trig-hit"/>
            <circle cx={compassPoint.x} cy={compassPoint.y} r="13" className="trig-destination-point"/>
            <text x={compassPoint.x + 16} y={compassPoint.y - 16} className="trig-destination-label">DESTINATION</text>
          </g>
          <g className="trig-bearing-panel">
            <text x="970" y="140" className="trig-panel-kicker">COMPONENTS OF THE JOURNEY</text>
            <text x="970" y="210" className="trig-pythagoras-equation">E = d sin θ</text>
            <text x="970" y="253" className="trig-ratio-line">= {fmt(bearingValues.distance, 3)} sin {bearingValues.bearing}° = {fmt(eastComponent, 3)} km</text>
            <text x="970" y="322" className="trig-pythagoras-equation">N = d cos θ</text>
            <text x="970" y="365" className="trig-ratio-line">= {fmt(bearingValues.distance, 3)} cos {bearingValues.bearing}° = {fmt(northComponent, 3)} km</text>
            <text x="970" y="430" className="trig-ratio-note">The bearing is measured clockwise from north.</text>
            <text x="970" y="466" className="trig-ratio-note">Drag the destination or enter a bearing and distance.</text>
          </g>
        </g>}
        {isElevation && <g className="trig-diagram trig-sightline-diagram">
          <text x="90" y="48" className="trig-scene-kicker">APPLIED RIGHT-TRIANGLE MODEL - {sightline.kind.toUpperCase()}</text>
          <line x1="95" y1={sightGroundY} x2="1050" y2={sightGroundY} className="trig-sight-ground"/>
          <line x1={sightObserver.x} y1={sightObserver.y} x2={sightObserver.x} y2={sightGroundY} className="trig-sight-support"/>
          <line x1={sightTarget.x} y1={sightTarget.y} x2={sightTarget.x} y2={sightGroundY} className="trig-sight-target-support"/>
          <line x1={sightObserver.x} y1={sightObserver.y} x2={sightLevel.x} y2={sightLevel.y} className="trig-sight-horizontal"/>
          <line x1={sightHeightHandle.x} y1={sightline.kind === 'elevation' ? sightTarget.y : sightObserver.y} x2={sightHeightHandle.x} y2={sightline.kind === 'elevation' ? sightObserver.y : sightTarget.y} className="trig-sight-vertical"/>
          <line x1={sightObserver.x} y1={sightObserver.y} x2={sightTarget.x} y2={sightTarget.y} className="trig-sight-ray"/>
          <path d={sightline.kind === 'elevation' ? `M${sightTarget.x - 24} ${sightObserver.y}V${sightObserver.y - 24}H${sightTarget.x}` : `M${sightObserver.x + 24} ${sightObserver.y}V${sightObserver.y + 24}H${sightObserver.x}`} className="trig-right-angle"/>
          <path d={`M${sightObserver.x + 74} ${sightObserver.y}A74 74 0 ${Math.abs(sightAngle) > 180 ? 1 : 0} ${sightAngle < 0 ? 1 : 0} ${sightObserver.x + 74 * Math.cos(sightAngle * Math.PI / 180)} ${sightObserver.y - 74 * Math.sin(sightAngle * Math.PI / 180)}`} className="trig-sight-angle-arc"/>
          <text x={sightObserver.x + 88} y={sightObserver.y - 20} className="trig-angle-label">{fmt(Math.abs(sightAngle), 2)}°</text>
          <text x={(sightObserver.x + sightTarget.x) / 2} y={sightObserver.y + 31} textAnchor="middle" className="trig-side-label adjacent-label">HORIZONTAL DISTANCE = {sightline.distance} m</text>
          <text x={sightHeightHandle.x + 20} y={(sightObserver.y + sightTarget.y) / 2} className="trig-side-label opposite-label">HEIGHT DIFFERENCE</text>
          <text x={sightHeightHandle.x + 20} y={(sightObserver.y + sightTarget.y) / 2 + 23} className="trig-side-value">{sightline.height} m</text>
          <text x={(sightObserver.x + sightTarget.x) / 2 - 10} y={(sightObserver.y + sightTarget.y) / 2 - 20} textAnchor="middle" className="trig-side-label hypotenuse-label">LINE OF SIGHT = {fmt(sightLength, 2)} m</text>
          <circle cx={sightObserver.x} cy={sightObserver.y} r="13" className="trig-sight-observer"/>
          <circle cx={sightTarget.x} cy={sightTarget.y} r="13" className="trig-destination-point"/>
          <g data-trig-handle="sightHeight" role="slider" tabIndex="0" aria-label={`${sightline.kind} height difference ${sightline.height} metres. Drag the cyan point to change.`} aria-valuemin="10" aria-valuemax="120" aria-valuenow={sightline.height}>
            <circle cx={sightHeightHandle.x} cy={sightHeightHandle.y} r="28" className="trig-hit"/>
            <circle cx={sightHeightHandle.x} cy={sightHeightHandle.y} r="10" className="trig-length-handle"/>
          </g>
          <g data-trig-handle="sightDistance" role="slider" tabIndex="0" aria-label={`Horizontal distance ${sightline.distance} metres. Drag the green point left or right to change.`} aria-valuemin="40" aria-valuemax="180" aria-valuenow={sightline.distance}>
            <circle cx={sightTarget.x} cy={sightObserver.y} r="27" className="trig-hit"/>
            <circle cx={sightTarget.x} cy={sightObserver.y} r="9" className="trig-solution-point"/>
          </g>
          <g className="trig-sight-panel">
            <text x="1120" y="144" className="trig-panel-kicker">TANGENT LINKS THE HEIGHT TO THE DISTANCE</text>
            <text x="1120" y="225" className="trig-pythagoras-equation">tan Î¸ = opposite / adjacent</text>
            <text x="1120" y="285" className="trig-ratio-line">= {sightline.height} / {sightline.distance}</text>
            <text x="1120" y="348" className="trig-pythagoras-equation">Î¸ = {fmt(Math.abs(sightAngle), 3)}°</text>
            <text x="1120" y="410" className="trig-ratio-note">{sightline.kind === 'elevation' ? 'The line rises from the observer horizontal.' : 'The line falls below the observer horizontal.'}</text>
            <text x="1120" y="450" className="trig-ratio-note">Drag the cyan point for height and green point for distance.</text>
          </g>
        </g>}
      </svg>
      </div>
      <div className={`trig-live-strip${graphMode ? ' trig-graph-readouts' : ''}`}>{readouts.map((result) => <div className="trig-result" key={result.label}><small>{result.label}</small><b>{result.value}</b></div>)}</div>
      <div className={`trig-controls${graphMode ? ' trig-graph-controls' : ''}`}>
        {graphMode ? <>
          <label className="trig-range-control"><span><b>Graph input x</b><output>{theta}°</output></span><input type="range" min="0" max="360" step="1" value={theta} onChange={(event) => updateAngle(Number(event.target.value))}/><small>Move the crosshair. Drag directly inside the graph to scrub.</small></label>
          <label className="trig-range-control"><span><b>Equation level k</b><output>{currentTargetText}</output></span><input type="range" min={mode === 'tangent' ? '-4' : '-1'} max={mode === 'tangent' ? '4' : '1'} step="0.01" value={graphTarget} onChange={(event) => setTarget(Number(event.target.value))}/><small>Drag the dashed line. Its curve intersections solve {graphExpression} x = k.</small></label>
          <div className="trig-principle"><b>DOMAIN AND PERIOD</b><span>{mode === 'tangent' ? '0° ≤ x ≤ 360° · period 180° · asymptotes at 90° and 270°' : '0° ≤ x ≤ 360° · period 360° · range −1 ≤ y ≤ 1'}</span></div>
        </> : isBearing ? <>
          <NumericControl control={{ id: 'bearing', label: 'Bearing clockwise from north', unit: '°', min: 0, max: 359, step: 1 }} value={bearingValues.bearing} onChange={(value) => setBearingValues((previous) => ({ ...previous, bearing: value % 360 }))}/>
          <NumericControl control={{ id: 'distance', label: 'Journey distance', unit: 'km', min: 10, max: compass.r, step: 1 }} value={bearingValues.distance} onChange={(value) => setBearingValues((previous) => ({ ...previous, distance: value }))}/>
          <div className="trig-principle"><b>BEARING COMPONENTS</b><span>For clockwise bearing θ and distance d: easting = d sin θ, northing = d cos θ. A reciprocal bearing differs by 180°.</span></div>
        </> : isElevation ? <>
          <div className="trig-method-switch" aria-label="Choose sightline direction"><button type="button" className={sightline.kind === 'elevation' ? 'is-selected' : ''} onClick={() => setSightline((previous) => ({ ...previous, kind: 'elevation' }))}>Angle of elevation</button><button type="button" className={sightline.kind === 'depression' ? 'is-selected' : ''} onClick={() => setSightline((previous) => ({ ...previous, kind: 'depression' }))}>Angle of depression</button></div>
          <NumericControl control={{ id: 'sightDistance', label: 'Horizontal distance', unit: 'm', min: 40, max: 180, step: 1 }} value={sightline.distance} onChange={(value) => setSightline((previous) => ({ ...previous, distance: value }))}/>
          <NumericControl control={{ id: 'sightHeight', label: 'Vertical height difference', unit: 'm', min: 10, max: 120, step: 1 }} value={sightline.height} onChange={(value) => setSightline((previous) => ({ ...previous, height: value }))}/>
          <div className="trig-principle"><b>ANGLE OF ELEVATION / DEPRESSION</b><span>tan Î¸ = vertical height difference / horizontal distance. The line of sight is the hypotenuse.</span></div>
        </> : isPythagoras ? <>
          <NumericControl control={{ id: 'sideA', label: 'Base leg a', unit: 'cm', min: 10, max: 100, step: 1 }} value={legs.a} onChange={(value) => setLegs((previous) => ({ ...previous, a: value }))}/>
          <NumericControl control={{ id: 'sideB', label: 'Vertical leg b', unit: 'cm', min: 10, max: 100, step: 1 }} value={legs.b} onChange={(value) => setLegs((previous) => ({ ...previous, b: value }))}/>
          <div className="trig-principle"><b>PYTHAGORAS' THEOREM</b><span>For a right-angled triangle, a² + b² = c². The hypotenuse c is opposite the right angle.</span></div>
        </> : isNonRight ? <>
          <div className="trig-method-switch" aria-label="Choose triangle information"><button type="button" className={nonRight.method === 'SSA' ? 'is-selected' : ''} onClick={() => setNonRight((previous) => ({ ...previous, method: 'SSA' }))}>SSA ambiguous case</button><button type="button" className={nonRight.method === 'SAS' ? 'is-selected' : ''} onClick={() => setNonRight((previous) => ({ ...previous, method: 'SAS' }))}>SAS cosine rule</button></div>
          {nonRight.method === 'SSA' ? <><NumericControl control={{ id: 'sideA', label: 'Side a', unit: 'cm', min: 20, max: 120, step: 1 }} value={nonRight.a} onChange={(value) => setNonRight((previous) => ({ ...previous, a: value }))}/><NumericControl control={{ id: 'sideB', label: 'Side b', unit: 'cm', min: 20, max: 120, step: 1 }} value={nonRight.b} onChange={(value) => setNonRight((previous) => ({ ...previous, b: value }))}/></> : <><NumericControl control={{ id: 'sideB', label: 'Side b', unit: 'cm', min: 20, max: 120, step: 1 }} value={nonRight.b} onChange={(value) => setNonRight((previous) => ({ ...previous, b: value }))}/><NumericControl control={{ id: 'sideC', label: 'Side c', unit: 'cm', min: 20, max: 120, step: 1 }} value={nonRight.c} onChange={(value) => setNonRight((previous) => ({ ...previous, c: value }))}/></>}
          <NumericControl control={{ id: 'includedAngle', label: 'Angle A', unit: '°', min: 10, max: 170, step: 1 }} value={nonRight.angle} onChange={(value) => setNonRight((previous) => ({ ...previous, angle: value }))}/>
          <div className="trig-principle"><b>{nonRight.method === 'SSA' ? 'AMBIGUOUS SSA CASE' : 'COSINE RULE + AREA'}</b><span>{nonRight.method === 'SSA' ? 'A known side may give zero, one, or two valid triangles.' : 'Use the cosine rule for the third side, then the sine rule for the remaining angles.'}</span></div>
        </> : isThreeD ? <>
          <NumericControl control={{ id: 'boxLength', label: 'Cuboid length', unit: 'cm', min: 10, max: 60, step: 1 }} value={dimensions.length} onChange={(value) => setDimensions((previous) => ({ ...previous, length: value }))}/>
          <NumericControl control={{ id: 'boxWidth', label: 'Cuboid width', unit: 'cm', min: 10, max: 60, step: 1 }} value={dimensions.width} onChange={(value) => setDimensions((previous) => ({ ...previous, width: value }))}/>
          <NumericControl control={{ id: 'boxHeight', label: 'Cuboid height', unit: 'cm', min: 10, max: 60, step: 1 }} value={dimensions.height} onChange={(value) => setDimensions((previous) => ({ ...previous, height: value }))}/>
          <div className="trig-principle"><b>ANGLE BETWEEN LINE AND PLANE</b><span>Use tan θ = perpendicular height / the diagonal projection in the base plane.</span></div>
        </> : <>
          {!isExact && <NumericControl control={angleControl} value={theta} onChange={updateAngle}/>}
          {isTriangle && <NumericControl control={profile.controls[1]} value={values.hypotenuse} onChange={(value) => update('hypotenuse', value)}/>}
          {isExact && <div className="trig-angle-presets" aria-label="Standard angles">{exactAngles.map((value) => <button type="button" key={value} className={theta === value ? 'is-selected' : ''} onClick={() => setExactAngle(value)}>{value}°</button>)}</div>}
          <div className="trig-principle"><b>{isExact ? 'SPECIAL-ANGLE RATIOS' : 'SOH · CAH · TOA'}</b><span>{isExact ? 'Read the exact fraction or radical at each standard angle; tan 90° is undefined.' : 'sin θ = opposite / hypotenuse · cos θ = adjacent / hypotenuse · tan θ = opposite / adjacent'}</span></div>
        </>}
      </div>
    </section>
  </main>;
}

function getTrigSolutions(mode, target) {
  const toDegrees = (value) => ((value * 180 / Math.PI) % 360 + 360) % 360;
  let values;
  if (mode === 'sine') {
    if (Math.abs(target) > 1) return [];
    const first = toDegrees(Math.asin(target));
    values = [first, (180 - first + 360) % 360];
    if (Math.abs(target) < 1e-8) values.push(360);
  } else if (mode === 'cosine') {
    if (Math.abs(target) > 1) return [];
    const first = toDegrees(Math.acos(target));
    values = [first, (360 - first) % 360];
    if (Math.abs(target - 1) < 1e-8) values.push(360);
  } else {
    const first = toDegrees(Math.atan(target));
    values = [first, first + 180];
    if (Math.abs(target) < 1e-8) values.push(360);
  }
  return [...new Set(values.map((value) => Number(value.toFixed(4))))].filter((value) => value >= 0 && value <= 360).sort((a, b) => a - b);
}
