import React from 'react';
import './additional-math-stage.css';

const fmt = (value) => Number.isFinite(Number(value)) ? Number(value).toPrecision(3).replace(/\.0+$/, '') : String(value ?? '—');
const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
const xMap = (value) => 370 + value * 48;
const yMap = (value) => 230 - clamp(value, -4.8, 4.8) * 31;
const plot = (fn, start = -5, end = 5, steps = 100) => Array.from({ length: steps + 1 }, (_, index) => {
  const x = start + (end - start) * index / steps;
  const y = fn(x);
  return Number.isFinite(y) ? `${index ? 'L' : 'M'}${xMap(x).toFixed(1)} ${yMap(y).toFixed(1)}` : '';
}).filter(Boolean).join(' ');
const factorial = (n) => { let value = 1; for (let i = 2; i <= n; i += 1) value *= i; return value; };

export function AdditionalMathStage({ operation, values, results }) {
  const v = values;
  const readout = (label) => results.find((result) => result.label === label)?.value ?? '—';
  const axes = <g className="am-axes">
    {Array.from({ length: 11 }, (_, i) => <g key={i}><path d={`M${130 + i * 48} 76 V294`} /><path d={`M130 ${76 + i * 21.8} H610`} /></g>)}
    <path className="am-axis" d="M118 230 H624 M370 68 V300" />
    <text x="616" y="250">x</text><text x="380" y="82">y</text>
  </g>;
  const label = <text className="am-scene-kicker" x="44" y="36">CAMBRIDGE 0606 · LIVE MATHEMATICAL MODEL</text>;
  let diagram;

  if (operation === 'amFunctions') {
    diagram = <>{axes}<path className="am-curve am-muted" d={plot((x) => v.a * x * x + v.k)} /><path className="am-curve" d={plot((x) => v.a * (x - v.h) ** 2 + v.k)} /><circle className="am-point" cx={xMap(v.x)} cy={yMap(v.a * (v.x - v.h) ** 2 + v.k)} r="7" /><text className="am-label" x="480" y="62">f(g(x)) = a(x − h)² + k</text><text className="am-note" x="480" y="84">shifted image · original curve shown faintly</text><text className="am-value" x="480" y="112">f({fmt(v.x)}) = {fmt(readout('Composite f(g(x))'))}</text></>;
  } else if (operation === 'amQuadratics') {
    const d = v.b * v.b - 4 * v.a * v.c;
    const vx = v.a ? -v.b / (2 * v.a) : 0;
    const roots = v.a ? (d >= 0 ? [(-v.b - Math.sqrt(d)) / (2 * v.a), (-v.b + Math.sqrt(d)) / (2 * v.a)] : []) : v.b ? [-v.c / v.b] : [];
    diagram = <>{axes}<path className="am-curve" d={plot((x) => v.a * x * x + v.b * x + v.c)} />{v.a !== 0 && <><path className="am-guide" d={`M${xMap(vx)} 76 V294`} /><circle className="am-point" cx={xMap(vx)} cy={yMap(v.a * vx * vx + v.b * vx + v.c)} r="7" /></>}{roots.filter(Number.isFinite).map((x, i) => <circle key={i} className="am-root" cx={xMap(x)} cy="230" r="6" />)}<text className="am-label" x="480" y="62">Δ = {fmt(d)}</text><text className="am-note" x="480" y="84">{roots.length ? `${roots.length} real x-intercept${roots.length === 1 ? '' : 's'}` : 'no real x-intercepts'}</text><text className="am-value" x="480" y="112">turning point ({fmt(vx)}, {fmt(readout('Turning point y'))})</text></>;
  } else if (operation === 'amPolynomialFactors') {
    const roots = [v.r1, v.r2, v.r3];
    diagram = <>{axes}<path className="am-curve" d={plot((x) => roots.reduce((p, r) => p * (x - r), 1), -4.5, 4.5)} />{roots.map((x, i) => <g key={i}><circle className="am-root" cx={xMap(x)} cy="230" r="6" /><text className="am-note" x={xMap(x) - 20} y="258">r{i + 1}={fmt(x)}</text></g>)}<circle className="am-point" cx={xMap(v.x)} cy={yMap(roots.reduce((p, r) => p * (v.x - r), 1))} r="7" /><text className="am-label" x="472" y="62">P(x) = ∏(x − rᵢ)</text><text className="am-note" x="472" y="84">each root is an x-intercept</text><text className="am-value" x="472" y="112">P({fmt(v.x)}) = {fmt(readout('P(x)'))}</text></>;
  } else if (operation === 'amEquationsInequalities') {
    const d = v.b * v.b - 4 * v.a * v.c;
    const roots = v.a ? (d >= 0 ? [(-v.b - Math.sqrt(d)) / (2 * v.a), (-v.b + Math.sqrt(d)) / (2 * v.a)].sort((a, b) => a - b) : []) : v.b ? [-v.c / v.b] : [];
    diagram = <>{axes}{roots.length === 2 && <path className="am-solution-band" d={v.a > 0 ? `M${xMap(roots[0])} 220 H${xMap(roots[1])} V240 H${xMap(roots[0])} Z` : `M130 220 H${xMap(roots[0])} V240 H130 Z M${xMap(roots[1])} 220 H610 V240 H${xMap(roots[1])} Z`} />}<path className="am-curve" d={plot((x) => v.a * x * x + v.b * x + v.c)} />{roots.map((x, i) => <circle key={i} className="am-root" cx={xMap(x)} cy="230" r="6" />)}<circle className="am-point" cx={xMap(v.x)} cy={yMap(v.a * v.x * v.x + v.b * v.x + v.c)} r="7" /><text className="am-label" x="472" y="62">Solution intervals</text><text className="am-note" x="472" y="84">band marks where f(x) is negative</text><text className="am-value" x="472" y="112">f({fmt(v.x)}) = {fmt(readout('Expression at test point'))}</text></>;
  } else if (operation === 'amSimultaneous') {
    const a = v.a, m = v.m, c = v.c, q = v.q;
    const d = m * m - 4 * a * (q - c);
    const xs = Math.abs(a) < 1e-9 ? (Math.abs(m) > 1e-9 ? [(q - c) / m] : []) : d >= 0 ? [(m - Math.sqrt(d)) / (2 * a), (m + Math.sqrt(d)) / (2 * a)] : [];
    diagram = <>{axes}<path className="am-curve" d={plot((x) => a * x * x + q)} /><path className="am-line" d={plot((x) => m * x + c)} />{xs.filter(Number.isFinite).map((x, i) => <circle key={i} className="am-root" cx={xMap(x)} cy={yMap(m * x + c)} r="7" />)}<text className="am-label" x="476" y="62">curve: y = ax² + q</text><text className="am-note" x="476" y="84">line: y = mx + c</text><text className="am-value" x="476" y="112">{fmt(readout('Intersection count'))} intersection(s)</text></>;
  } else if (operation === 'amLogExponential') {
    const base = v.base;
    diagram = <>{axes}<path className="am-curve" d={plot((x) => base ** x, -4.5, 4.5)} /><path className="am-line" d={plot((x) => Math.log(Math.max(.08, x)) / Math.log(base), .08, 4.5)} /><path className="am-guide" d="M130 294 L610 76" /><circle className="am-point" cx={xMap(v.exponent)} cy={yMap(v.exponent)} r="6" /><circle className="am-root" cx={xMap(Math.min(v.argument, 4.5))} cy={yMap(Math.log(v.argument) / Math.log(base))} r="6" /><text className="am-label" x="485" y="62">exponential and logarithm</text><text className="am-note" x="485" y="84">reflected across y = x</text><text className="am-value" x="485" y="112">{fmt(base)}^{fmt(v.exponent)} = {fmt(readout('Exponential bˣ'))}</text></>;
  } else if (operation === 'amStraightLine') {
    diagram = <>{axes}<path className="am-line" d={plot((x) => v.m * x + v.c)} /><path className="am-curve am-muted" d={plot((x) => v.otherM * x)} /><circle className="am-point" cx={xMap(v.x)} cy={yMap(v.m * v.x + v.c)} r="7" /><text className="am-label" x="480" y="62">y = mx + c</text><text className="am-note" x="480" y="84">faint line through origin has gradient n</text><text className="am-value" x="480" y="112">m times n = {fmt(v.m * v.otherM)}</text></>;
  } else if (operation === 'amCircle') {
    const scale = Math.min(34, 180 / (Math.max(Math.abs(v.h), Math.abs(v.k)) + v.r));
    const cx = 370 + v.h * scale, cy = 230 - v.k * scale, radius = v.r * scale, angle = v.angle * Math.PI / 180;
    const px = cx + radius * Math.cos(angle), py = cy - radius * Math.sin(angle);
    const tx = -Math.sin(angle) * 42, ty = -Math.cos(angle) * 42;
    diagram = <>{axes}<circle className="am-circle" cx={cx} cy={cy} r={radius} /><path className="am-guide" d={'M' + cx + ' ' + cy + ' L' + px + ' ' + py} /><path className="am-line" d={'M' + (px - tx) + ' ' + (py - ty) + ' L' + (px + tx) + ' ' + (py + ty)} /><circle className="am-point" cx={px} cy={py} r="7" /><text className="am-label" x="478" y="62">centre ({fmt(v.h)}, {fmt(v.k)})</text><text className="am-note" x="478" y="84">radius {fmt(v.r)} | tangent is perpendicular to radius</text><text className="am-value" x="478" y="112">P = ({fmt(v.h + v.r * Math.cos(angle))}, {fmt(v.k + v.r * Math.sin(angle))})</text></>;
  } else if (operation === 'amCircularMeasure') {
    const theta = v.theta, r = v.r, radius = r * 23, cx = 360, cy = 210;
    const endX = cx + radius * Math.cos(theta), endY = cy - radius * Math.sin(theta), large = theta > Math.PI ? 1 : 0;
    const sector = theta <= 1e-6 ? '' : `M${cx} ${cy} L${cx + radius} ${cy} A${radius} ${radius} 0 ${large} 0 ${endX} ${endY} Z`;
    diagram = <><circle className="am-circle" cx={cx} cy={cy} r={radius} /><path className="am-sector" d={sector} /><path className="am-guide" d={`M${cx} ${cy} L${cx + radius} ${cy} M${cx} ${cy} L${endX} ${endY}`} /><path className="am-chord" d={`M${cx + radius} ${cy} L${endX} ${endY}`} /><text className="am-label" x="492" y="85">θ = {fmt(theta)} rad</text><text className="am-note" x="492" y="109">arc s = rθ = {fmt(r * theta)}</text><text className="am-value" x="492" y="137">sector area = ½r²θ = {fmt(.5 * r * r * theta)}</text><text className="am-note" x="492" y="164">chord = {fmt(2 * r * Math.sin(theta / 2))}</text></>;
  } else if (operation === 'amTrigonometry') {
    const w = v.period, phase = v.phase, a = v.amplitude, sine = (x) => a * Math.sin(2 * Math.PI * (x - phase) / w);
    diagram = <>{axes}<path className="am-curve" d={plot(sine, -6.2, 6.2, 150)} /><path className="am-line" d={plot((x) => a * Math.cos(2 * Math.PI * (x - phase) / w), -6.2, 6.2, 150)} /><path className="am-guide" d={`M${xMap(v.x)} 76 V294`} /><circle className="am-point" cx={xMap(v.x)} cy={yMap(sine(v.x))} r="7" /><text className="am-label" x="480" y="62">sine · cosine</text><text className="am-note" x="480" y="84">period T = {fmt(w)} rad · amplitude A = {fmt(a)}</text><text className="am-value" x="480" y="112">sin² + cos² = {fmt(readout('Identity check sin² + cos²'))}</text></>;
  } else if (operation === 'amPermutationsCombinations') {
    const n = Math.round(v.n), selected = Math.round(v.r), barW = 420 / Math.max(1, n + 1), max = factorial(n);
    diagram = <>{Array.from({ length: n + 1 }, (_, r) => { const choose = factorial(n) / (factorial(r) * factorial(n - r)); const perm = factorial(n) / factorial(n - r); const x = 152 + r * barW; return <g key={r}><rect className={r === selected ? 'am-bar am-bar-selected' : 'am-bar'} x={x} y={276 - choose / max * 148} width={Math.max(4, barW * .36)} height={choose / max * 148} rx="3"/><rect className="am-bar am-bar-secondary" x={x + barW * .42} y={276 - perm / max * 148} width={Math.max(4, barW * .36)} height={perm / max * 148} rx="3"/><text className="am-note" x={x + 2} y="296">{r}</text></g>; })}<text className="am-label" x="145" y="66">choose r from n = {n}</text><text className="am-note" x="145" y="88">gold: nCr (selection) · blue: nPr (ordered)</text><text className="am-value" x="490" y="118">r = {selected} · nCr = {fmt(readout('Unordered selections nCr'))}</text><text className="am-note" x="490" y="142">nPr = {fmt(readout('Ordered arrangements nPr'))}</text></>;
  } else if (operation === 'amSeries') {
    const n = Math.round(v.n), termsA = Array.from({ length: n }, (_, i) => v.first + i * v.difference), termsG = Array.from({ length: n }, (_, i) => v.first * v.ratio ** i);
    diagram = <>{Array.from({ length: n }, (_, i) => { const x = 150 + i * 36, ya = 180 - clamp(termsA[i], -5, 5) * 17, yg = 286 - clamp(termsG[i], -5, 5) * 13; return <g key={i}><path className="am-series-ap" d={`M${x} 180 V${ya}`} /><circle className="am-point" cx={x} cy={ya} r="5" /><path className="am-series-gp" d={`M${x} 286 V${yg}`} /><circle className="am-root" cx={x} cy={yg} r="5" /><text className="am-note" x={x - 4} y="318">{i + 1}</text></g>; })}<text className="am-label" x="150" y="58">term index n</text><text className="am-value" x="455" y="88">AP nth term {fmt(readout('AP nth term'))}</text><text className="am-note" x="455" y="110">AP sum {fmt(readout('AP partial sum'))}</text><text className="am-value" x="455" y="145">GP nth term {fmt(readout('GP nth term'))}</text><text className="am-note" x="455" y="167">GP sum {fmt(readout('GP partial sum'))}</text></>;
  } else if (operation === 'amVectors2D') {
    const end = (x, y) => `${370 + x * 25} ${230 - y * 25}`;
    diagram = <>{axes}<path className="am-vector-a" d={`M370 230 L${end(v.ux, v.uy)}`} markerEnd="url(#amArrow)" /><path className="am-vector-b" d={`M370 230 L${end(v.vx, v.vy)}`} markerEnd="url(#amArrow)" /><path className="am-vector-result" d={`M370 230 L${end(v.ux + v.vx, v.uy + v.vy)}`} markerEnd="url(#amArrow)" /><text className="am-label" x="486" y="62">u + v = {String(readout('u + v'))}</text><text className="am-note" x="486" y="86">u · v = {fmt(readout('Dot product u · v'))}</text><text className="am-value" x="486" y="112">angle = {fmt(readout('Angle between vectors'))}°</text><text className="am-note" x="486" y="140">blue u · gold v · coral resultant</text></>;
  } else {
    const f = (x) => v.a * x * x + v.b * x + v.c, slope = 2 * v.a * v.x + v.b, tangent = (x) => f(v.x) + slope * (x - v.x);
    const areaPoints = Array.from({ length: 41 }, (_, i) => { const x = -2 + i * .1; return `${xMap(x)} ${yMap(f(x))}`; }).join(' L');
    diagram = <>{axes}<path className="am-area" d={`M${xMap(-2)} 230 L${areaPoints} L${xMap(2)} 230 Z`} /><path className="am-curve" d={plot(f)} /><path className="am-tangent" d={plot(tangent)} /><circle className="am-point" cx={xMap(v.x)} cy={yMap(f(v.x))} r="7" /><text className="am-label" x="485" y="62">f′({fmt(v.x)}) = {fmt(readout('Tangent gradient f′(x)'))}</text><text className="am-note" x="485" y="84">gold line is the tangent</text><text className="am-value" x="485" y="112">signed area = {fmt(readout('Signed area from -2 to 2'))}</text></>;
  }

  return <svg className="am-svg" viewBox="0 0 760 340" role="img" aria-label={`Additional Mathematics interactive ${operation.replace(/^am/, '')} diagram`}>
    <defs><marker id="amArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10Z" fill="currentColor" /></marker></defs>
    {label}{diagram}
  </svg>;
}
