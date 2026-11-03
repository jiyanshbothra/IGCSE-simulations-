import React, { useMemo, useState } from 'react';
import { LAB_BY_ID } from './catalog';
import { createModelProfile, evaluateModel } from './models';
import { VisualStage } from './VisualStage';
import { MagnetCompassLab } from './MagnetCompassLab';
import { BinaryWorkbenchLab, CalculusWorkbenchLab, ChemistryTitrationLab, CoordinatePlaneLab, InheritanceWorkbenchLab, WaterBalanceWorkbenchLab } from './SignatureLabs';
import { getExperienceBlueprint } from './experience-blueprints';
import { getDirectPart } from './direct-manipulation';
import './lab-quality.css';
import './lab-controls.css';
import './lab-premium.css';
import './lab-visibility.css';
import './operation-experience.css';

export function SimulationLab({ simulationId }) {
  const spec = LAB_BY_ID[simulationId];
  const specialLabs = {
    'physics:magneticField': MagnetCompassLab,
    'chemistry:neutralisation': ChemistryTitrationLab,
    'biology:inheritance': InheritanceWorkbenchLab,
    'environmental:waterBalance': WaterBalanceWorkbenchLab,
    'mathematics:coordinate': CoordinatePlaneLab,
    'computerscience:binary': BinaryWorkbenchLab,
    'additionalmaths:amCalculus': CalculusWorkbenchLab,
  };
  const HandsOnLab = spec ? specialLabs[`${spec.subjectId}:${spec.operation}`] : null;
  if (HandsOnLab) return <HandsOnLab spec={spec} />;
  return <InteractiveOperationLab simulationId={simulationId} spec={spec} />;
}

function InteractiveOperationLab({ simulationId, spec }) {
  const profile = useMemo(() => createModelProfile(spec.operation, spec.variant), [spec.operation, spec.variant]);
  const experience = getExperienceBlueprint(spec.operation);
  const directPart = getDirectPart(spec.operation, profile.controls);
  const [values, setValues] = useState(() => makeScenarioValues(profile, spec.variant));
  const [trials, setTrials] = useState([]);
  const [graphControlId, setGraphControlId] = useState(profile.controls[0]?.id ?? '');
  const [prediction, setPrediction] = useState('');
  const [feedback, setFeedback] = useState('');
  const results = useMemo(() => evaluateModel(profile, values), [profile, values]);
  const reset = () => { setValues(makeScenarioValues(profile, spec.variant)); setTrials([]); setPrediction(''); setFeedback(''); };
  const updateValues = (changes) => setValues((previous) => ({ ...previous, ...changes }));
  const record = () => setTrials(previous => [...previous,{values:{...values},results}]);
  const exportCsv = () => {
    const headers=['Subject','Chapter','Simulation','Trial',...profile.controls.map(x=>`${x.label} (${x.unit})`),...results.map(x=>`${x.label} (${x.unit})`)];
    const rows=trials.map((t,i)=>[spec.subjectName,spec.chapter,spec.title,i+1,...profile.controls.map(x=>t.values[x.id]),...t.results.map(x=>x.value)]);
    const csv=[headers,...rows].map(row=>row.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',')).join('\r\n');
    const link=document.createElement('a');link.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));link.download=`${simulationId}-results.csv`;link.click();setTimeout(()=>URL.revokeObjectURL(link.href),1000);
  };
  const checkPrediction = () => {
    const output=results[0];
    if (!prediction.trim()) { setFeedback('Enter your prediction first, then compare it with the live model result.'); return; }
    if (typeof output?.value !== 'number') {
      const matches=prediction.trim().toLowerCase()===String(output?.value).toLowerCase();
      setFeedback(`${matches?'Your prediction matches the model.':'Compare your prediction with the model result.'} Model result: ${output?.value ?? 'No result'}.`);
      return;
    }
    const guess=Number(prediction);const actual=output.value;
    if (!Number.isFinite(guess)) { setFeedback('Enter a valid number to compare with the live model result.'); return; }
    const error=Math.abs(actual-guess);const relative=actual===0?null:error/Math.abs(actual)*100;
    const closeness=relative===null?(error===0?'exactly matches':'differs from'):(relative<5?'is very close to':relative<20?'is reasonably close to':'differs from');
    setFeedback(`Your prediction ${closeness} the model. Predicted ${guess.toPrecision(4)} ${output.unit}; model ${actual.toPrecision(4)} ${output.unit}; absolute difference ${error.toPrecision(3)}${relative===null?'':` (${relative.toPrecision(3)}% relative error)`}. Explain the difference using the model principle.`);
  };


  return <main className={`lab-page operation-page rig-${experience.rig}`} style={{ '--lab-accent': spec.color }}>
    <header className="lab-hero" style={{ '--lab-accent': spec.color }}>
      <div className="lab-hero-top">
        <div className="lab-breadcrumb"><span>{spec.subjectName}</span><i />{spec.subjectCode}<i />{spec.period}<i />Chapter {spec.chapterCode}</div>
        <button className="lab-back" onClick={() => { window.location.hash = '#/subject/' + spec.subjectId }}>Back <span>Subject library</span></button>
      </div>
      <div className="lab-hero-main">
        <div>
          <p className="lab-overline">CHAPTER {spec.chapterCode} <span>/</span> MODEL {String(simulationId.slice(-3))}</p>
          <h1>{spec.title}</h1>
          <p className="lab-objective">{spec.objective}</p>
        </div>
        <div className="lab-hero-stats"><span className="lab-count">100</span><small>models in<br />this subject</small></div>
      </div>
      <div className="lab-hero-foot"><span className="lab-subject-mark">{spec.subjectName}</span><span>{spec.chapter}</span><span className="lab-live-status"><i /> Interactive model</span></div>
    </header>

    <div className="lab-grid">
      <section className="panel model-panel">
        <div className="panel-head lab-section-head"><div><span className="section-index">01 / LIVE APPARATUS</span><h2>{experience.instrument}</h2><p>Drag the {directPart.part} with your mouse or touch. It changes {directPart.controls[0].label.toLowerCase()} and updates the model as it moves.</p></div><span className="live-pill"><i /> LIVE</span></div>
        <VisualStage operation={spec.operation} family={profile.family} values={values} results={results} accent={spec.color} title={spec.title} controls={profile.controls} onValuesChange={updateValues} experience={experience}/>
        <div className="principle"><div className="principle-title"><span>Model notes</span><small>ASSUMPTIONS & RELATIONSHIPS</small></div><p>{spec.principle}</p><code>{profile.formula}</code><small className="principle-foot">Idealised teaching model | Use the stated units and conditions when interpreting the result.</small></div>
      </section>

      <section className="panel controls-panel instrument-panel">
        <div className="panel-head lab-section-head"><div><span className="section-index">02 / MODEL SETTINGS</span><h2>Readings & adjustments</h2><p>Grab the named object in the play area for direct control. Enter exact values here when you need a precise setup.</p></div><button className="text-button" onClick={reset}>Reset</button></div>
        <div className="instrument-rack" aria-label={`${experience.instrument} exact model settings`}>{profile.controls.map(control => <ParameterControl key={control.id} control={control} value={values[control.id]} onChange={value => updateValues({ [control.id]: value })} />)}</div>
        <div className="results"><div className="results-heading"><h3>Live measurements</h3><span>UPDATES IN REAL TIME</span></div><div className="result-grid">{results.map((result, index) => <div className="result" key={result.label}><span><i>{String(index + 1).padStart(2, '0')}</i>{result.label}</span><strong>{typeof result.value === 'number' ? result.value.toPrecision(4) : result.value}<small>{result.unit}</small></strong></div>)}</div></div>
        <div className="actions"><button className="button primary" onClick={record}>Record this trial</button><button className="button secondary" onClick={reset}>Reset experiment</button></div>
      </section>

      <section className="panel investigation">
        <div className="panel-head lab-section-head"><div><span className="section-index">03 / YOUR CHALLENGE / {String(spec.variant).padStart(2, '0')}</span><h2>{spec.lens}</h2></div></div>
        <p className="investigation-question">{challengeQuestion(spec.operation, spec.lens)}</p>
        <p className="challenge-instructions">{lensInstruction(spec.lens)} Record at least five trials and use the pattern in your data to support an explanation.</p>
        <div className="lesson-steps"><span><b>1</b><em>Predict</em><small>Commit to an outcome</small></span><span><b>2</b><em>Change</em><small>Test a parameter</small></span><span><b>3</b><em>Explain</em><small>Use your evidence</small></span></div>
        <div className="predict"><label htmlFor="prediction">Predict: {results[0]?.label?.toLowerCase()}</label><div><input id="prediction" inputMode={typeof results[0]?.value === 'number' ? 'decimal' : 'text'} value={prediction} onChange={event => setPrediction(event.target.value)} placeholder={typeof results[0]?.value === 'number' ? 'Value in ' + (results[0]?.unit || 'displayed units') : 'Enter your predicted result'}/><button className="button secondary" onClick={checkPrediction}>Check prediction</button></div>{feedback && <p role="status" aria-live="polite">{feedback}</p>}</div>
      </section>

      <section className="panel data-panel">
        <div className="panel-head lab-section-head"><div><span className="section-index">04 / EVIDENCE</span><h2>Your trial record</h2><p>Compare readings to reveal a pattern.</p></div><div className="actions compact"><button className="button secondary" disabled={!trials.length} onClick={exportCsv}>Export CSV</button><button className="button secondary" disabled={!trials.length} onClick={() => setTrials([])}>Clear data</button></div></div>
        <div className="graph-controls"><label htmlFor="graph-variable">Graph horizontal axis</label><select id="graph-variable" value={graphControlId} onChange={event => setGraphControlId(event.target.value)}>{profile.controls.map(control => <option value={control.id} key={control.id}>{control.label} ({control.unit})</option>)}</select></div>
        <TrialGraph trials={trials} controls={profile.controls} controlId={graphControlId} result={results[0]}/>
        {trials.length === 0 ? <div className="empty-record"><span>?</span><p>Your data will appear here.</p><small>Change a parameter and record a trial to start building evidence.</small></div> : <div className="table-scroll"><table><thead><tr><th>Trial</th>{profile.controls.map(control => <th key={control.id}>{control.label} ({control.unit})</th>)}{results.map(result => <th key={result.label}>{result.label} ({result.unit})</th>)}</tr></thead><tbody>{trials.map((trial, index) => <tr key={index}><td>{String(index + 1).padStart(2, '0')}</td>{profile.controls.map(control => <td key={control.id}>{trial.values[control.id]}</td>)}{trial.results.map(result => <td key={result.label}>{typeof result.value === 'number' ? result.value.toPrecision(4) : result.value}</td>)}</tr>)}</tbody></table></div>}
      </section>
    </div>
  </main>;
}

function lensInstruction(lens){
  const instructions={
    'Start with a reference':'Record the starting state, then use it as the baseline for each comparison.',
    'Trace the response':'Move a control gradually and describe how the measured output changes.',
    'Hold conditions steady':'Change one factor while keeping the others fixed so the comparison is fair.',
    'Compare two settings':'Choose two distinct settings and explain the difference between their outcomes.',
    'Test for proportionality':'Double an input, compare the output, and use at least three points to judge proportionality.',
    'Find the boundary':'Move a control toward its limits and identify where the model changes behaviour.',
    'Infer an unknown value':'Use recorded points to estimate an intermediate value, then test your estimate.',
    'Build a data set':'Choose a consistent sequence of inputs, record each output, and look for a pattern.',
    'Read the graph':'Record several values and describe whether the relationship is linear, curved, increasing, or level.',
    'Check the precision':'Compare the measurement resolution with the size of the reading and consider the uncertainty.',
    'Test repeatability':'Repeat an identical setting, compare the readings, and judge whether differences are meaningful.',
    'Predict, then measure':'Write down a numerical or categorical prediction before checking the live output.',
    'Locate the threshold':'Test values around the transition and narrow down where the outcome changes.',
    'Find the optimum':'Vary one control at a time to find a setting that maximises or minimises the outcome.',
    'Explain the result':'Use the displayed relationship and assumptions to explain the observed change.',
    'Transfer the model':'Set up a new case and decide whether the same relationship still applies.',
    'Audit the balance':'Compare inputs, outputs, and stored quantities; account for any difference.',
    'Model against evidence':'Compare your recorded trend with the model prediction and explain any mismatch.',
    'Challenge the assumptions':'Identify a simplification in the model and explain how it could affect the result.',
    'Plan a fair test':'Choose one factor to change, one outcome to measure, and the conditions to hold constant.'
  };
  return instructions[lens] || 'Change one parameter at a time, record the result, and explain the pattern.';
}

function makeScenarioValues(profile, variant) {
  const values = Object.fromEntries(profile.controls.map(control => [control.id, control.initial]));
  if (profile.controls.length < 2) return values;
  const index = (Math.max(1, Number(variant) || 1) - 1) % profile.controls.length;
  const control = profile.controls[index];
  const cycle = Math.floor((Math.max(1, Number(variant) || 1) - 1) / profile.controls.length);
  const direction = (Number(variant) + index) % 2 === 0 ? 1 : -1;
  const step = Math.max(Number(control.step) || 1, 1e-9);
  const offset = (cycle + 1) * step * direction;
  const moved = Math.max(control.min, Math.min(control.max, values[control.id] + offset));
  values[control.id] = Number((control.min + Math.round((moved - control.min) / step) * step).toPrecision(10));
  if (profile.controls.some(item => item.id === 'n') && profile.controls.some(item => item.id === 'r')) {
    values.r = Math.min(values.r, values.n);
  }
  return values;
}

const discreteChoices = {
  band: ['Radio', 'Microwave', 'Infrared', 'Visible', 'Ultraviolet', 'X-ray', 'Gamma'],
  gate: ['AND', 'OR', 'XOR'],
};

function ParameterControl({ control, value, onChange }) {
  const step = Math.max(Number(control.step) || 1, 1e-9);
  const quantize = raw => {
    const limited = Math.max(control.min, Math.min(control.max, Number(raw)));
    const result = control.min + Math.round((limited - control.min) / step) * step;
    return Number(result.toPrecision(10));
  };
  const changeBy = amount => onChange(quantize(Number(value) + amount));
  const choices = discreteChoices[control.id];
  const isToggle = control.unit === 'toggle' || control.unit === 'bit' || control.id === 'previousState';
  return <div className={`parameter-control${choices ? ' is-choice' : ''}${isToggle ? ' is-toggle' : ''}`}>
    <div className="parameter-label"><b>{control.label}</b><small>{control.unit || 'model setting'}</small></div>
    {choices ? <div className="choice-bank" role="group" aria-label={control.label}>{choices.map((choice, index) => <button type="button" key={choice} aria-pressed={Math.round(Number(value)) === index} onClick={() => onChange(index)}>{choice}</button>)}</div>
      : isToggle ? <button type="button" className={`instrument-switch${Number(value) ? ' is-on' : ''}`} aria-label={`${control.label}: ${Number(value) ? 'on' : 'off'}`} aria-pressed={Boolean(Number(value))} onClick={() => onChange(Number(value) ? control.min : control.max)}><span /><b>{Number(value) ? 'ON' : 'OFF'}</b></button>
      : <div className="parameter-reading"><button type="button" aria-label={`Decrease ${control.label}`} disabled={Number(value) <= control.min} onClick={() => changeBy(-step)}>-</button><label><input aria-label={`Exact ${control.label}`} type="number" min={control.min} max={control.max} step={control.step} value={value} onChange={event => { const next = event.target.valueAsNumber; if (Number.isFinite(next)) onChange(quantize(next)); }} /><small>{control.unit}</small></label><button type="button" aria-label={`Increase ${control.label}`} disabled={Number(value) >= control.max} onClick={() => changeBy(step)}>+</button></div>}
  </div>;
}
function TrialGraph({trials,controls,controlId,result}){
  const selected=controls.find(control=>control.id===controlId)??controls[0];
  if(trials.length<2 || typeof result?.value!=='number' || typeof trials[0]?.values?.[selected?.id]!=='number') return null;
  const xId=selected.id;
  const points=trials.map(trial=>({x:Number(trial.values[xId]),y:Number(trial.results[0]?.value)})).filter(point=>Number.isFinite(point.x)&&Number.isFinite(point.y));
  if(points.length<2) return null;
  const minX=Math.min(...points.map(point=>point.x)),maxX=Math.max(...points.map(point=>point.x));
  const minY=Math.min(...points.map(point=>point.y)),maxY=Math.max(...points.map(point=>point.y));
  const xSpan=maxX-minX||1,ySpan=maxY-minY||1;
  const coordinates=points.map(point=>({x:42+(point.x-minX)/xSpan*610,y:175-(point.y-minY)/ySpan*135}));
  return <div className="trial-graph"><div className="trial-graph-heading"><span>Recorded relationship</span><small>{selected.label} → {result.label}</small></div><svg viewBox="0 0 690 220" role="img" aria-label={`${result.label} plotted against ${selected.label}`}><path className="graph-grid" d="M42 30 V176 H655 M42 104 H655 M42 67 H655 M42 140 H655"/><polyline className="trial-line" points={coordinates.map(point=>`${point.x},${point.y}`).join(' ')}/>{coordinates.map((point,index)=><circle key={index} cx={point.x} cy={point.y} r="5"/>)}<text x="42" y="200">{formatValue(minX)} {selected.unit}</text><text x="605" y="200">{formatValue(maxX)} {selected.unit}</text><text x="45" y="22">{formatValue(maxY)} {result.unit}</text><text x="45" y="169">{formatValue(minY)} {result.unit}</text></svg></div>;
}

function formatValue(value){ return Number(value).toPrecision(3).replace(/\.0+$/,''); }

function challengeQuestion(operation,lens){
  const questions={
    measurement:'How does instrument resolution or zero error affect the corrected reading and its percentage uncertainty?',kinematics:'How do acceleration and time change final velocity and displacement? Does reversing acceleration reverse the motion?',density:'With mass held constant, how does changing volume affect density? State the relationship supported by your measurements.',force:'For a fixed mass, how does resultant force change acceleration? Compare the model with F = ma.',momentum:'At fixed momentum, how does increasing collision time change average stopping force?',energy:'How do height and speed contribute separately to gravitational potential and kinetic energy?',workPower:'How does changing force or distance affect work done, and how does transfer time affect power?',pressure:'How do contact area and liquid depth affect pressure in their different parts of this model?',particleEnergy:'How does absolute temperature change particle kinetic energy, and how do particle number and volume affect the pressure index?',specificHeat:'For a fixed material, how does energy supplied per kilogram change the temperature rise?',heatTransfer:'How do temperature difference, conductivity, thickness and area affect the relative transfer rate?',wave:'How do frequency and wavelength combine to determine wave speed and period?',refraction:'How does incidence angle affect refraction, and how does refractive index determine the critical angle?',spectrum:'How does the selected electromagnetic band affect frequency, and how does distance change relative intensity?',sound:'How do frequency and distance affect wavelength in air and relative sound intensity?',magneticField:'How do current, coil turns and distance from the coil affect the relative magnetic field strength?',charge:'How does current or time change charge transferred and electrical energy?',circuit:'How does changing either resistance affect total series resistance, current and supply power?',electricalPower:'When does the current exceed the fuse rating, and how does voltage change electrical power?',induction:'How does changing the rate of magnetic-flux change affect induced e.m.f.?',isotope:'How do proton and neutron numbers set nucleon number, while electron number sets net charge?',decay:'How does elapsed time compared with half-life change the number of unstable nuclei remaining?',orbit:'How do orbital radius and period affect orbital speed and centripetal acceleration?',redshift:'How does the wavelength shift change the redshift estimate and inferred recession speed?',particleState:'How does energy input affect the particle-energy indicator as temperature changes?',atomicStructure:'How does atomic number or ion charge change shell arrangement and electron number?',moles:'How do mass, relative formula mass and solution volume determine amount and concentration?',electrolysis:'How does current and time change charge passed and the relative amount deposited?',enthalpy:'How does the balance between bond breaking and bond formation determine reaction type?',reactionRate:'Which factor produces the largest change in relative rate, and how does the model connect it to collision frequency?',neutralisation:'How does acid concentration or volume change the base volume needed for equivalence?',periodicity:'How does proton number affect electron-shell arrangement, period and outer-shell electron count?',reactivity:'Which metal displaces the other metal ion, and how does the rank difference predict the outcome?',pollution:'How effectively does treatment reduce concentration, and how does the volume of air or water matter?',organic:'How does increasing carbon number or unsaturation alter the displayed hydrocarbon formula?',chromatography:'How does the spot-to-solvent distance ratio determine the Rf value?',classification:'How does the number of matching features determine which branch of a classification key is followed?',magnification:'How does image size compare with actual size to determine magnification?',osmosis:'How does the concentration gradient change the direction and relative amount of net water movement?',biomolecule:'How does sample concentration affect the food-test response when reagent volume is controlled?',enzyme:'How do temperature, pH and substrate concentration affect the modelled enzyme rate?',photosynthesis:'Which of light, carbon dioxide or temperature is limiting, and how does changing it affect the rate?',digestion:'How do enzyme activity and time affect the amount of substrate digested and remaining?',transpiration:'How do light, wind and humidity combine to affect the relative transpiration rate?',cardiacOutput:'How do heart rate and stroke volume determine cardiac output?',bioTransmission:'How do contact rate and transmission probability change the expected number of new infections?',ventilation:'How do tidal volume and breathing rate combine to determine minute ventilation?',respiration:'How does substrate use change the modelled energy or gas-exchange products of respiration?',kidney:'How does water availability or filtration change the modelled urine concentration and water balance?',reflex:'How does pathway delay or response interval affect the timing of a reflex response?',doseResponse:'How does dose affect response, and where does the response begin to level off?',reproduction:'How do fertilisation and survival rates change expected offspring number?',inheritance:'How do allele frequencies determine expected genotype frequencies in the offspring?',selection:'How does a fitness advantage change trait frequency over successive generations?',foodWeb:'How much producer energy remains after each trophic transfer, and how much is lost?',biodiversity:'How do species richness and dominance affect the modelled diversity index?',fermentation:'How do temperature and time affect sugar use and carbon-dioxide production by yeast?',resourceBalance:'Does sustainable supply plus recycling meet demand, and how does the balance change?',erosion:'How do slope, rainfall and ground cover affect relative soil loss and runoff?',waterBalance:'Do rainfall and recharge exceed abstraction, and what does the resulting storage balance mean?',climateBalance:'How do reflection and greenhouse retention change the modelled energy balance?',hazardRisk:'How do probability, exposure and vulnerability combine to change the risk index?',populationGrowth:'How do birth rate, death rate and migration change population over one year?',number:'How does percentage change affect a starting value, and how does rounding alter the reported result?',algebra:'How do gradient and intercept determine y for a selected x?',coordinate:'How do two coordinate points determine gradient, distance and midpoint?',geometry:'How do two interior angles determine the third angle and the exterior-angle relationship?',mensuration:'How does changing cylinder radius or height affect volume and curved surface area?',trigonometry:'How does the angle in a right-angled triangle determine the opposite and adjacent sides?',vector:'How do the components of two vectors combine to determine resultant direction and magnitude?',probability:'How does event probability or trial count change expected frequency?',statistics:'How does sample size affect standard error while the standard deviation is fixed?',binary:'Can the selected bit width represent the denary value, and how do the binary and hexadecimal forms relate?',transmission:'How do data size, bit rate and packet payload affect transmission time and packet count?',cpu:'How do instruction count, cycles per instruction and clock rate determine execution time?',software:'How does source-code size or translation rate affect translation time?',network:'How do packet size, link rate and route distance contribute to total network delay?',controlSystem:'How does the sensor reading relative to the set point change the actuator state?',algorithm:'How does item count affect linear and binary search comparisons, and why must binary-search data be sorted?',programTrace:'How do loop count and increment determine the final variable value?',database:'How do matching rate and combined criteria change the estimated query result size?',logic:'How do the two input bits and selected gate determine the output?',amFunctions:'How does a horizontal or vertical translation change function values and the graph?',amQuadratics:'How does the discriminant determine the roots and how do coefficients move the turning point?',amPolynomialFactors:'How do known roots define the factors and the shape of the expanded cubic?',amEquationsInequalities:'How do the roots divide the number line into intervals with different signs?',amSimultaneous:'How does changing the line or parabola alter the number and coordinates of intersections?',amLogExponential:'How does the base change exponential growth and its inverse logarithmic scale?',amStraightLine:'How do gradients and intercepts determine a point, parallelism, and perpendicularity?',amCircle:'How do centre, radius, and direction determine the point and tangent on a circle?',amCircularMeasure:'How does a radian angle determine arc length, sector area, and chord length?',amTrigonometry:'How do amplitude, period, and phase transform the sine and cosine graphs?',amPermutationsCombinations:'How does selection size change ordered arrangements compared with unordered selections?',amSeries:'How do common difference and ratio shape arithmetic and geometric terms and sums?',amVectors2D:'How do vector components determine the resultant, dot product, and angle between vectors?',amCalculus:'How does the tangent gradient vary with x and how does the signed area respond to coefficients?'
  };
  return `${questions[operation]??'What relationship does the model predict between the selected input and its measured output?'} Focus: ${lens.toLowerCase()}.`;
}
