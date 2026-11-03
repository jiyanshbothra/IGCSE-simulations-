import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createModelProfile, evaluateModel } from './models';
import './subject-workbench.css';

const clamp = (value, min, max) => Math.min(max, Math.max(min, Number(value) || 0));
const fmt = (value, digits = 3) => Number(value).toPrecision(digits).replace(/(?:\.0+|(?:(\.\d*?)0+))$/, '$1');

function SubjectLabHeader({ spec, title, objective }) {
  return <header className="lab-hero subject-lab-hero" style={{ '--lab-accent': spec.color }}>
    <div className="single-lab-top"><div className="lab-breadcrumb"><span>{spec.subjectName}</span><i />{spec.subjectCode}<i />Chapter {spec.chapterCode}</div><button className="lab-back" onClick={() => { window.location.hash = `#/subject/${spec.subjectId}` }}>Back to subject</button></div>
    <div className="subject-lab-title"><div><p className="lab-overline">{spec.chapter}</p><h1>{title}</h1><p className="lab-objective">{objective}</p></div><span className="subject-live-tag"><i /> LIVE MODEL</span></div>
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
  const hypotenuse = 52 + ((spec.variant * 7) % 29);
  const [values, setValues] = useState({ ...defaults, angle, hypotenuse });
  const svgRef = useRef(null);
  const dragRef = useRef(null);
  const origin = { x: 95, y: 460 };
  const radians = values.angle * Math.PI / 180;
  // Scale the drawing to fill the stage while keeping length changes visible.
  const drawingScale = Math.min(730 / Math.cos(radians), 330 / Math.sin(radians));
  const radius = (values.hypotenuse / 100) * drawingScale;
  const foot = { x: origin.x + radius * Math.cos(radians), y: origin.y };
  const tip = { x: foot.x, y: origin.y - radius * Math.sin(radians) };
  const oppositeLabelX = foot.x + (values.angle > 48 ? 112 : 30);
  const opposite = values.hypotenuse * Math.sin(radians);
  const adjacent = values.hypotenuse * Math.cos(radians);
  const results = evaluateModel(profile, values);
  const update = (id, next) => {
    const control = profile.controls.find((item) => item.id === id);
    const bounded = clamp(next, control.min, control.max);
    const quantized = control.min + Math.round((bounded - control.min) / control.step) * control.step;
    setValues((previous) => ({ ...previous, [id]: Number(quantized.toPrecision(10)) }));
  };
  const pointFromEvent = (event) => {
    const svg = svgRef.current; const matrix = svg?.getScreenCTM?.();
    if (!svg || !matrix) return null;
    const point = svg.createSVGPoint(); point.x = event.clientX; point.y = event.clientY;
    return point.matrixTransform(matrix.inverse());
  };
  const beginDrag = (event) => {
    const handle = event.target.closest('[data-trig-handle]')?.getAttribute('data-trig-handle');
    if (!handle) return;
    dragRef.current = { handle, pointerId: event.pointerId };
    event.currentTarget.setPointerCapture(event.pointerId); event.preventDefault();
  };
  const moveDrag = (event) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    const point = pointFromEvent(event); if (!point) return;
    const dx = point.x - origin.x, dy = origin.y - point.y;
    if (dragRef.current.handle === 'angle') update('angle', Math.atan2(dy, dx) * 180 / Math.PI);
    if (dragRef.current.handle === 'length') update('hypotenuse', Math.hypot(dx, dy) / (drawingScale * .72) * 100);
  };
  const endDrag = (event) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };
  const reset = () => setValues({ ...defaults, angle, hypotenuse });
  return <main className="lab-page subject-workbench-page">
    <SubjectLabHeader spec={spec} title="Trigonometry: shape a right-angled triangle" objective="Drag the angle handle to change θ or pull the hypotenuse handle to resize the triangle. The opposite, adjacent, sine, cosine and tangent values update from the geometry."/>
    <section className="subject-workbench-frame trig-frame">
      <div className="subject-scene-head"><span>RIGHT-ANGLED TRIANGLE</span><button type="button" onClick={reset}>Reset triangle</button></div>
      <svg ref={svgRef} className="trig-scene" viewBox="0 0 900 520" role="img" aria-label="Large interactive right triangle. Drag the amber angle handle or cyan hypotenuse handle." onPointerDown={beginDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag}>
        <defs><pattern id="trig-grid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="#22384b" strokeWidth="1"/></pattern><marker id="trig-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#a8c5d6"/></marker></defs>
        <rect width="1100" height="520" fill="#08111c"/><rect width="1100" height="520" fill="url(#trig-grid)" opacity=".76"/>
        <path className="trig-fill" d={`M${origin.x} ${origin.y}L${foot.x} ${foot.y}L${tip.x} ${tip.y}Z`}/>
        <path className="trig-adjacent" d={`M${origin.x} ${origin.y}H${foot.x}`}/><path className="trig-opposite" d={`M${foot.x} ${foot.y}V${tip.y}`}/><path className="trig-hypotenuse" d={`M${origin.x} ${origin.y}L${tip.x} ${tip.y}`}/>
        <path className="trig-right-angle" d={`M${foot.x-26} ${foot.y}V${foot.y-26}H${foot.x}`}/>
        <path className="trig-angle-arc" d={`M${origin.x+66} ${origin.y}A66 66 0 0 0 ${origin.x+66*Math.cos(radians)} ${origin.y-66*Math.sin(radians)}`}/>
        <text x={origin.x+58} y={origin.y-16} className="trig-angle-label">θ = {fmt(values.angle, 3)}°</text>
        <text x={(origin.x+foot.x)/2} y={origin.y+42} textAnchor="middle" className="trig-side-label adjacent-label">ADJACENT · {fmt(adjacent, 4)} cm</text>
        <text x={oppositeLabelX} y={(foot.y+tip.y)/2} textAnchor="start" className="trig-side-label opposite-label">OPPOSITE</text><text x={oppositeLabelX} y={(foot.y+tip.y)/2+25} textAnchor="start" className="trig-side-value">{fmt(opposite, 4)} cm</text>
        <text x={(origin.x+tip.x)/2-10*Math.sin(radians)} y={(origin.y+tip.y)/2-22*Math.cos(radians)} textAnchor="middle" className="trig-side-label hypotenuse-label">HYPOTENUSE · {fmt(values.hypotenuse, 4)} cm</text>
        <g data-trig-handle="angle" tabIndex="0" role="slider" aria-label="Triangle angle. Drag around the angle arc or use arrow keys." aria-valuemin="1" aria-valuemax="89" aria-valuenow={values.angle} onKeyDown={(event) => { if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); update('angle', values.angle + (event.key === 'ArrowRight' ? 1 : -1)); } }}><circle cx={tip.x} cy={tip.y} r="27" className="trig-hit"/><circle cx={tip.x} cy={tip.y} r="11" className="trig-angle-handle"/><text x={tip.x+18} y={tip.y-18} className="trig-handle-tag">DRAG θ</text></g>
        <g data-trig-handle="length" tabIndex="0" role="slider" aria-label="Hypotenuse length. Drag along the hypotenuse or use arrow keys." aria-valuemin="0.1" aria-valuemax="100" aria-valuenow={values.hypotenuse} onKeyDown={(event) => { if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') update('hypotenuse', values.hypotenuse - .1); if (event.key === 'ArrowRight' || event.key === 'ArrowUp') update('hypotenuse', values.hypotenuse + .1); }}><circle cx={origin.x+radius*.72*Math.cos(radians)} cy={origin.y-radius*.72*Math.sin(radians)} r="24" className="trig-hit"/><circle cx={origin.x+radius*.72*Math.cos(radians)} cy={origin.y-radius*.72*Math.sin(radians)} r="9" className="trig-length-handle"/><text x={origin.x+radius*.72*Math.cos(radians)-20} y={origin.y-radius*.72*Math.sin(radians)-18} className="trig-handle-tag">DRAG LENGTH</text></g>
        <text x="70" y="70" className="trig-scene-kicker">MOVE THE POINTS · READ THE SIDES</text>
      </svg>
      <div className="trig-live-strip">{results.map((result) => <div className="trig-result" key={result.label}><small>{result.label}</small><b>{typeof result.value === 'number' ? fmt(result.value, 4) : result.value}<i>{result.unit}</i></b></div>)}</div>
      <div className="trig-controls"><NumericControl control={profile.controls[0]} value={values.angle} onChange={(value) => update('angle', value)}/><NumericControl control={profile.controls[1]} value={values.hypotenuse} onChange={(value) => update('hypotenuse', value)}/><div className="trig-principle"><b>SOH · CAH · TOA</b><span>sin θ = opposite / hypotenuse · cos θ = adjacent / hypotenuse · tan θ = opposite / adjacent</span></div></div>
    </section>
  </main>;
}
