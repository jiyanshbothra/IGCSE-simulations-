import { LABS } from './catalog';
import { createModelProfile } from './models';

const xTrack = (part, shape, index, x1, x2, y) => ({ part, shape, index, mode: 'x', track: [x1, x2, y] });
const yTrack = (part, shape, index, x, y1, y2) => ({ part, shape, index, mode: 'y', track: [x, y1, y2] });
const angle = (part, shape, index, x, y, radius) => ({ part, shape, index, mode: 'angle', center: [x, y], radius });
const vector = (part, shape, x, y, radius, indices = [0, 1]) => ({ part, shape, mode: 'vector', center: [x, y], radius, indices });

/* One direct-manipulation target per model operation. Coordinates use the same
   760 x 340 play-area coordinate system as the scientific drawing beneath it. */
const definitions = {
  measurement: xTrack('caliper jaw', 'jaw', 0, 138, 354, 101),
  kinematics: xTrack('motion trolley', 'cart', 0, 178, 544, 228),
  density: xTrack('displacement block', 'block', 1, 180, 454, 188),
  force: xTrack('force-vector tip', 'arrow', 1, 326, 560, 178),
  momentum: xTrack('collision trolley', 'cart', 1, 178, 544, 228),
  energy: yTrack('skater on the track', 'person', 1, 402, 97, 250),
  workPower: xTrack('lifted load', 'block', 1, 214, 464, 224),
  pressure: yTrack('depth probe', 'probe', 2, 524, 105, 260),
  particleEnergy: yTrack('gas piston', 'piston', 1, 380, 83, 238),
  specificHeat: yTrack('calorimeter heater', 'flame', 0, 226, 122, 252),
  heatTransfer: xTrack('hot-side source', 'flame', 0, 164, 568, 176),
  wave: xTrack('wave-source control', 'waveSource', 0, 164, 570, 155),
  refraction: angle('incident-ray handle', 'ray', 0, 350, 176, 132),
  spectrum: xTrack('spectrum selector', 'spectrum', 0, 132, 628, 160),
  sound: xTrack('microphone', 'microphone', 2, 182, 576, 175),
  magneticField: xTrack('field compass', 'compass', 0, 140, 620, 206),
  charge: xTrack('current probe', 'probe', 0, 214, 522, 104),
  circuit: yTrack('resistor slider', 'resistor', 1, 354, 84, 230),
  electricalPower: xTrack('appliance current selector', 'plug', 1, 278, 482, 181),
  induction: xTrack('moving bar magnet', 'magnet', 2, 162, 320, 184),
  isotope: angle('nuclear particle', 'nucleus', 0, 386, 173, 46),
  decay: xTrack('sample-time marker', 'particle', 2, 172, 584, 180),
  orbit: angle('orbiting body', 'planet', 0, 382, 188, 132),
  redshift: xTrack('observed spectral line', 'spectrum', 1, 194, 566, 166),

  particleState: yTrack('energy input control', 'flame', 1, 268, 104, 232),
  atomicStructure: angle('outer-shell electron', 'electron', 0, 382, 176, 96),
  moles: yTrack('balance pan', 'flask', 0, 265, 117, 260),
  electrolysis: xTrack('current control', 'probe', 0, 173, 584, 185),
  enthalpy: xTrack('bond-energy bar', 'energyBlock', 0, 176, 584, 224),
  reactionRate: xTrack('reactant particle', 'particle', 0, 182, 548, 180),
  neutralisation: yTrack('burette stopcock', 'valve', 0, 360, 142, 204),
  periodicity: xTrack('atomic-number selector', 'nucleus', 0, 174, 594, 187),
  reactivity: xTrack('metal sample', 'block', 0, 190, 524, 216),
  pollution: yTrack('treatment filter', 'filter', 1, 504, 112, 246),
  organic: xTrack('carbon-chain atom', 'molecule', 0, 188, 568, 183),
  chromatography: yTrack('solvent-front marker', 'drop', 0, 470, 102, 246),

  classification: xTrack('specimen feature marker', 'specimen', 0, 182, 568, 190),
  magnification: xTrack('microscope stage', 'slide', 0, 158, 454, 208),
  osmosis: xTrack('solute particle', 'particle', 0, 198, 540, 187),
  biomolecule: yTrack('sample pipette', 'pipette', 0, 226, 108, 242),
  enzyme: xTrack('substrate molecule', 'molecule', 2, 194, 548, 184),
  photosynthesis: xTrack('lamp position', 'lamp', 0, 154, 392, 108),
  digestion: xTrack('food bolus', 'food', 1, 196, 552, 188),
  transpiration: xTrack('leaf chamber vent', 'leaf', 0, 188, 546, 170),
  cardiacOutput: xTrack('heart-rate control', 'heart', 0, 184, 536, 184),
  bioTransmission: xTrack('infectious contact marker', 'particle', 0, 180, 556, 184),
  ventilation: yTrack('diaphragm', 'diaphragm', 0, 380, 174, 262),
  respiration: xTrack('glucose molecule', 'molecule', 0, 185, 552, 190),
  kidney: yTrack('filtration valve', 'valve', 1, 501, 118, 245),
  reflex: xTrack('stimulus marker', 'spark', 0, 182, 574, 178),
  doseResponse: xTrack('dose applicator', 'pipette', 0, 172, 574, 186),
  reproduction: xTrack('gamete', 'cell', 0, 178, 556, 184),
  inheritance: xTrack('allele tile', 'gene', 0, 150, 608, 187),
  selection: xTrack('selected organism', 'specimen', 1, 188, 560, 196),
  foodWeb: xTrack('energy packet', 'particle', 0, 175, 568, 210),
  biodiversity: xTrack('species sample', 'specimen', 0, 170, 566, 184),
  fermentation: yTrack('gas bubble probe', 'bubble', 1, 442, 98, 242),

  resourceBalance: xTrack('demand marker', 'resource', 0, 178, 574, 195),
  erosion: angle('slope-angle handle', 'slope', 0, 380, 238, 125),
  waterBalance: yTrack('watershed level probe', 'probe', 1, 518, 134, 240),
  climateBalance: yTrack('greenhouse-retention control', 'sun', 1, 512, 92, 240),
  hazardRisk: xTrack('risk-exposure marker', 'hazard', 0, 180, 568, 185),
  populationGrowth: xTrack('population marker', 'people', 0, 178, 575, 194),

  number: xTrack('number-line marker', 'point', 0, 180, 576, 194),
  algebra: xTrack('input point on the line', 'point', 2, 130, 637, 196),
  coordinate: vector('movable coordinate point', 'point', 380, 203, 112, [0, 1]),
  geometry: angle('angle-arm vertex', 'angleArm', 0, 380, 204, 118),
  mensuration: yTrack('cylinder height collar', 'collar', 1, 380, 110, 256),
  trigonometry: angle('triangle angle arm', 'angleArm', 0, 354, 224, 106),
  vector: vector('resultant vector tip', 'vectorTip', 380, 230, 125, [0, 1]),
  probability: xTrack('event-probability token', 'token', 0, 170, 580, 184),
  statistics: xTrack('sample-size marker', 'point', 0, 170, 580, 184),

  binary: xTrack('binary place-value bit', 'bit', 0, 180, 574, 192),
  transmission: xTrack('data-packet', 'packet', 0, 172, 575, 185),
  cpu: xTrack('instruction through pipeline', 'packet', 0, 168, 584, 186),
  software: xTrack('translator progress marker', 'code', 0, 172, 578, 187),
  network: xTrack('network packet', 'packet', 0, 155, 612, 192),
  controlSystem: yTrack('sensor probe', 'probe', 0, 518, 110, 250),
  algorithm: xTrack('search-range bracket', 'bracket', 0, 178, 578, 191),
  programTrace: xTrack('loop counter', 'counter', 1, 178, 578, 188),
  database: xTrack('query filter', 'filter', 1, 196, 525, 177),
  logic: xTrack('gate input switch', 'switch', 0, 283, 474, 175),

  amFunctions: xTrack('movable point on function', 'point', 3, 130, 636, 190),
  amQuadratics: yTrack('parabola coefficient handle', 'curveHandle', 0, 380, 112, 250),
  amPolynomialFactors: xTrack('root on number line', 'root', 0, 164, 590, 210),
  amEquationsInequalities: xTrack('test point', 'point', 3, 160, 594, 205),
  amSimultaneous: xTrack('line-parabola intersection', 'point', 1, 158, 604, 190),
  amLogExponential: xTrack('base selector', 'point', 0, 170, 590, 190),
  amStraightLine: xTrack('line point', 'point', 2, 152, 610, 188),
  amCircle: angle('radius endpoint', 'point', 3, 380, 190, 105),
  amCircularMeasure: angle('radian-angle handle', 'angleArm', 1, 380, 190, 110),
  amTrigonometry: xTrack('phase point on wave', 'point', 3, 130, 635, 186),
  amPermutationsCombinations: xTrack('selected object tile', 'token', 1, 188, 572, 202),
  amSeries: xTrack('selected term marker', 'point', 3, 160, 604, 188),
  amVectors2D: vector('second vector endpoint', 'vectorTip', 380, 222, 108, [2, 3]),
  amCalculus: xTrack('tangent point on curve', 'point', 3, 132, 634, 190),
};

// These topic-specific labs own their own pointer controls and do not use the
// shared model-profile overlay. Keep them out of the generic overlay registry
// check so one specialized topic cannot prevent the entire library loading.
const specializedLabOperations = new Set([
  'trigPythagoras', 'trigExact', 'trigSineGraph', 'trigCosineGraph',
  'trigTangentGraph', 'trigNonRight', 'trigThreeD', 'trigBearings', 'trigElevation',
]);
const operations = new Set(LABS.map((lab) => lab.operation).filter((operation) => !specializedLabOperations.has(operation)));
const missing = [...operations].filter((operation) => !definitions[operation]);
if (missing.length) throw new Error(`Missing direct-manipulation object: ${missing.join(', ')}`);
const invalidControls = [...operations].filter((operation) => {
  const profile = createModelProfile(operation, 1);
  const indexes = definitions[operation].indices ?? [definitions[operation].index ?? 0];
  return indexes.some((index) => !profile.controls[index]);
});
if (invalidControls.length) throw new Error(`Direct-manipulation target references a missing model control: ${invalidControls.join(', ')}`);

export function getDirectPart(operation, controls) {
  const definition = definitions[operation];
  if (!definition) throw new Error(`No direct-manipulation object for ${operation}`);
  const indexes = definition.indices ?? [definition.index ?? 0];
  const selectedControls = indexes.map((index) => controls[index]).filter(Boolean);
  if (selectedControls.length !== indexes.length) throw new Error(`Direct-manipulation control missing for ${operation}`);
  return Object.freeze({ ...definition, controls: selectedControls });
}
