import curriculum from './curriculum.json';

export type SubjectId = 'physics' | 'chemistry' | 'biology' | 'environmental' | 'mathematics' | 'computerscience' | 'additionalmaths';
export interface Topic { code: string; title: string; objective: string; visual: string; operation: string; principle: string }
export interface Subject { id: SubjectId; name: string; code: string; period: string; color: string; icon: string; topics: Topic[] }
export interface LabSpec { id: string; subjectId: SubjectId; subjectName: string; subjectCode: string; period: string; color: string; chapterCode: string; chapter: string; title: string; objective: string; visual: string; operation: string; principle: string; lens: string; investigationFocus: string; studyMode: string; variant: number }

const lenses = [
  'Start with a reference', 'Trace the response', 'Hold conditions steady', 'Compare two settings',
  'Test for proportionality', 'Find the boundary', 'Infer an unknown value', 'Build a data set',
  'Read the graph', 'Check the precision', 'Test repeatability', 'Predict, then measure',
  'Locate the threshold', 'Find the optimum', 'Explain the result', 'Transfer the model',
  'Audit the balance', 'Model against evidence', 'Challenge the assumptions', 'Plan a fair test',
];

const investigationFocus: Record<string, string> = {
  measurement: 'Instrument scale, zero correction and uncertainty', kinematics: 'Acceleration, velocity and displacement',
  force: 'Weight, resultant force and acceleration', density: 'Mass, volume and buoyancy', momentum: 'Impulse and collision time',
  energy: 'Gravitational and kinetic energy stores', workPower: 'Work transferred and power output', pressure: 'Contact pressure and liquid depth',
  particleEnergy: 'Particle speed, temperature and gas pressure', specificHeat: 'Energy supplied and temperature rise',
  heatTransfer: 'Temperature difference and transfer rate', wave: 'Frequency, wavelength and wave speed', refraction: 'Incidence angle and refractive index',
  spectrum: 'Electromagnetic wavelength, frequency and intensity', sound: 'Sound frequency, wavelength and distance', magneticField: 'Field direction, coil current and distance',
  charge: 'Current, charge and electrical energy', circuit: 'Series resistance, current and potential difference',
  electricalPower: 'Appliance current, power and fuse rating', induction: 'Flux change and induced e.m.f.', isotope: 'Proton, neutron and electron counts',
  decay: 'Half-life and the remaining unstable nuclei', orbit: 'Orbital radius, period and speed', redshift: 'Spectral shift and recession speed',
  particleState: 'Particle spacing, motion and state changes', chromatography: 'Solvent front, spot distance and Rf', atomicStructure: 'Atomic number, ions and electron arrangement',
  moles: 'Formula mass, amount and solution concentration', electrolysis: 'Charge passed and electrode products', enthalpy: 'Bond energies and reaction profile',
  reactionRate: 'Collision frequency and reaction rate', neutralisation: 'Titrant volume and equivalence point', periodicity: 'Electron shells and repeating properties',
  reactivity: 'Metal displacement and reactivity order', pollution: 'Pollutant load and treatment efficiency', organic: 'Carbon structure and hydrocarbon formula',
  classification: 'Diagnostic features and identification pathway', magnification: 'Image scale and actual specimen size', osmosis: 'Water potential and net membrane movement',
  biomolecule: 'Sample concentration and biochemical test', enzyme: 'Temperature, pH and enzyme activity', photosynthesis: 'Light, carbon dioxide and limiting factors',
  digestion: 'Enzyme action and nutrient absorption', transpiration: 'Light, wind, humidity and water uptake', cardiacOutput: 'Heart rate, stroke volume and cardiac output',
  bioTransmission: 'Contact rate and infection transmission', ventilation: 'Breathing rate, tidal volume and ventilation',
  respiration: 'Substrate use and respiratory products', kidney: 'Filtration, reabsorption and water balance', reflex: 'Pathway length, nerve speed and response time',
  doseResponse: 'Dose, exposure and biological response', reproduction: 'Fertilisation, survival and offspring number', inheritance: 'Allele combinations and genotype probability',
  selection: 'Fitness advantage and trait frequency', foodWeb: 'Trophic transfer and energy loss', biodiversity: 'Species richness, dominance and diversity',
  fermentation: 'Sugar use, temperature and carbon-dioxide yield', resourceBalance: 'Supply, demand and resource renewal', erosion: 'Rainfall, slope, runoff and soil loss',
  waterBalance: 'Rainfall, abstraction and basin storage', climateBalance: 'Reflection, greenhouse retention and energy balance',
  hazardRisk: 'Probability, exposure and vulnerability', populationGrowth: 'Births, deaths, migration and population change',
  number: 'Percentage change, exact value and rounding', algebra: 'Gradient, intercept and line output', coordinate: 'Gradient, distance and midpoint',
  geometry: 'Interior angles and triangle construction', mensuration: 'Cylinder dimensions, volume and surface area',
  trigPythagoras: 'Side lengths, right angle and hypotenuse', trigonometry: 'Sine, cosine and tangent ratios',
  trigBearings: 'Bearing angle, distance and position', trigElevation: 'Line of sight, height and horizontal distance', trigExact: 'Exact ratios at special angles',
  trigSineGraph: 'Sine curve, period and equation solutions', trigCosineGraph: 'Cosine curve, period and equation solutions',
  trigTangentGraph: 'Tangent curve, asymptotes and equation solutions', trigNonRight: 'Sine rule, cosine rule and triangle area',
  trigThreeD: 'Face diagonal, space diagonal and inclination', vector: 'Vector components and resultant direction',
  probability: 'Event probability and expected frequency', statistics: 'Sample size, spread and standard error',
  binary: 'Bit pattern, denary value and hexadecimal form', transmission: 'Packet payload, bit rate and transmission time',
  cpu: 'Instruction count, clock rate and execution time', software: 'Source size and translation rate',
  network: 'Route distance, packet size and network delay', controlSystem: 'Sensor reading, set point and actuator state',
  algorithm: 'Search strategy, item count and comparison total', programTrace: 'Loop count, increment and final variable state',
  database: 'Query criteria and estimated result set', logic: 'Boolean inputs, gate selection and output',
  amFunctions: 'Function transformations and graph coordinates', amQuadratics: 'Discriminant, roots and turning point',
  amPolynomialFactors: 'Polynomial roots, factors and cubic shape', amEquationsInequalities: 'Roots, intervals and sign changes',
  amSimultaneous: 'Line–curve intersections and solution count', amLogExponential: 'Exponential growth and logarithmic inverse',
  amStraightLine: 'Gradient, intercept and perpendicularity', amCircle: 'Circle centre, radius and tangent',
  amCircularMeasure: 'Radian angle, arc length and sector area', amTrigonometry: 'Amplitude, period and phase shift',
  amPermutationsCombinations: 'Ordered arrangements and selections', amSeries: 'Arithmetic and geometric terms and sums',
  amVectors2D: 'Vector resultant, dot product and included angle', amCalculus: 'Tangent gradient and signed area',
};

const topicFocus: Record<string, string> = {
  'Mass and weight': 'Mass, gravitational field strength and weight',
  Forces: 'Resultant force, acceleration, moments and stability',
  'The kinetic particle model': 'Particle speed, absolute temperature and gas pressure',
  'Thermal properties and temperature': 'Specific heat capacity, expansion and latent heat',
  'Electric circuits': 'Current and potential difference in series and parallel paths',
  'Electromagnetic effects': 'Motor effect, magnetic flux and induced e.m.f.',
  'The particulate nature of matter': 'Particle arrangement, motion and changes of state',
  'Chemical reactions': 'Collision rate, catalyst and reversible reaction',
  Carbonates: 'Carbonate particle size, acid concentration and gas production',
  'Air and water': 'Water composition, pollutants and treatment efficiency',
  Sulfur: 'Sulfur dioxide emissions and atmospheric removal',
  'Plastic pollution': 'Plastic waste, breakdown and removal from a water system',
  'Natural resources': 'Resource supply, demand, recycling and renewal',
  'Sustainable management of rocks, ores and minerals': 'Mineral extraction, reuse and sustainable supply',
  Fracking: 'Extraction rate, resource yield and environmental pressure',
  'The atmosphere and human activities': 'Energy entering, reflecting and leaving the atmosphere',
  'Climate change': 'Greenhouse retention and global energy balance',
  'Ecosystems, biodiversity and fieldwork': 'Species abundance, sampling and ecosystem diversity',
  'Fieldwork investigations': 'Sample size, site comparison and ecological evidence',
  'Right-angled triangle trigonometry': 'Sine, cosine and tangent ratios',
  'Bearings and triangle applications': 'Three-figure bearings, distance and position',
  'Angles of elevation and depression': 'Line of sight, horizontal distance and height',
  'Sine graph and equations': 'Sine curve, period and solutions over one full turn',
  'Cosine graph and equations': 'Cosine curve, period and solutions over one full turn',
  'Tangent graph and equations': 'Tangent curve, asymptotes and solutions over one full turn',
};

const studyModes = [
  'Baseline calibration', 'Response curve', 'Controlled comparison', 'Time-series trace', 'Operating-range sweep',
  'Prediction against data', 'Sensitivity analysis', 'Repeatability trial', 'Threshold study', 'Assumption audit',
];

const subjects: Subject[] = (curriculum.subjects as Array<{id:SubjectId;name:string;code:string;period:string;color:string;icon:string;topics:Array<[string,string,string,string,string,string]>}>).map((subject) => ({
  ...subject,
  topics: subject.topics.map(([code,title,objective,visual,operation,principle]) => ({code,title,objective,visual,operation,principle})),
}));

export const SUBJECTS = subjects;
export const LABS: LabSpec[] = subjects.flatMap((subject) => Array.from({ length: 100 }, (_, index) => {
  const topic = subject.topics[index % subject.topics.length];
  const variant = Math.floor(index / subject.topics.length) + 1;
  const lens = lenses[(variant - 1) % lenses.length];
  const focus = topicFocus[topic.title] ?? investigationFocus[topic.operation] ?? topic.title;
  const studyMode = studyModes[(variant - 1) % studyModes.length];
  const serial = String(index + 1).padStart(3, '0');
  return {
    id: `${subject.id}-${serial}`, subjectId: subject.id, subjectName: subject.name, subjectCode: subject.code,
    period: subject.period, color: subject.color, chapterCode: topic.code, chapter: topic.title,
    title: `${topic.title}: ${focus} · ${studyMode}`,
    objective: topic.objective, visual: topic.visual, operation: topic.operation, principle: topic.principle,
    lens, investigationFocus: focus, studyMode, variant,
  };
}));

export const LAB_BY_ID = Object.fromEntries(LABS.map((lab) => [lab.id, lab])) as Record<string, LabSpec>;
export const LABS_BY_SUBJECT = Object.fromEntries(SUBJECTS.map((subject) => [subject.id, LABS.filter((lab) => lab.subjectId === subject.id)])) as Record<SubjectId, LabSpec[]>;

if (LABS.length !== 700 || SUBJECTS.length !== 7 || SUBJECTS.some((subject) => LABS_BY_SUBJECT[subject.id].length !== 100)) {
  throw new Error('The simulation library must contain exactly 100 simulations for each of its seven subjects.');
}

if (new Set(LABS.map((lab) => lab.title)).size !== LABS.length) {
  throw new Error('Every simulation must have its own topic-specific name.');
}
