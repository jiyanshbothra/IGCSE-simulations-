import { CURRICULUM_DATA } from './curriculumData';
import { SimulationMetadata, SimulationParameter, MeasurementDefinition } from '../types/simulation';
import { SubjectId } from '../types/curriculum';

export interface SimulationTopic {
  code: string;
  title: string;
  model: string;
  objective: string;
  equations: string[];
}

const TOPICS: Record<SubjectId, SimulationTopic[]> = {
  physics: [
    { code: '1', title: 'Motion, speed and acceleration', model: 'kinematics', objective: 'Investigate how displacement, speed and acceleration change with time.', equations: ['v = u + at', 's = ut + ½at²'] },
    { code: '1', title: 'Forces, mass and momentum', model: 'forces', objective: 'Explore resultant force, acceleration and momentum in one-dimensional motion.', equations: ['F = ma', 'p = mv'] },
    { code: '1', title: 'Work, power and energy', model: 'energy', objective: 'Compare work done, kinetic energy and gravitational potential energy.', equations: ['W = Fd', 'Eₖ = ½mv²', 'Eₚ = mgh'] },
    { code: '2', title: 'Thermal physics and gas behaviour', model: 'thermal', objective: 'Relate temperature, energy transfer and particle motion.', equations: ['ΔE = mcΔT', 'p₁V₁ = p₂V₂'] },
    { code: '3', title: 'Wave properties and sound', model: 'waves', objective: 'Investigate how frequency and wavelength determine wave speed.', equations: ['v = fλ', 'T = 1/f'] },
    { code: '3', title: 'Light, refraction and lenses', model: 'optics', objective: 'Trace rays and investigate refraction, critical angle and image formation.', equations: ['n = sin i / sin r', '1/f = 1/u + 1/v'] },
    { code: '4', title: 'Electric circuits and resistance', model: 'circuits', objective: 'Measure how potential difference, current and resistance are related.', equations: ['V = IR', 'P = IV'] },
    { code: '4', title: 'Electromagnetism and induction', model: 'electromagnetism', objective: 'Explore how current, coils and magnetic fields produce force or induced voltage.', equations: ['F = BIL', 'E ∝ NΔΦ/Δt'] },
    { code: '5', title: 'Atomic structure and radioactivity', model: 'radioactivity', objective: 'Model nuclear decay, half-life and radiation absorption.', equations: ['N = N₀(½)^(t/T½)'] },
    { code: '6', title: 'Space physics and orbital motion', model: 'space', objective: 'Compare orbital speed, period, stellar properties and redshift.', equations: ['v = 2πr/T', 'z = Δλ/λ'] },
  ],
  chemistry: [
    { code: '1', title: 'Particulate nature of matter', model: 'particles', objective: 'Model particle spacing, diffusion and changes of state.', equations: ['rate ∝ 1/√M'] },
    { code: '2', title: 'Experimental techniques', model: 'practical', objective: 'Practise measurement, separation, chromatography and identification.', equations: ['R_f = distance moved by solute / distance moved by solvent'] },
    { code: '3', title: 'Atoms, elements and compounds', model: 'atoms', objective: 'Construct atoms, ions and electronic configurations from proton and electron numbers.', equations: ['A = Z + N'] },
    { code: '4', title: 'Stoichiometry and formulae', model: 'stoichiometry', objective: 'Use balanced equations, mole ratios and reacting masses.', equations: ['n = m/M_r', 'c = n/V'] },
    { code: '5', title: 'Electricity and chemistry', model: 'electrochemistry', objective: 'Investigate ion movement, electrode products and deposited mass.', equations: ['Q = It'] },
    { code: '6', title: 'Chemical energetics', model: 'energetics', objective: 'Compare energy transferred in exothermic and endothermic reactions.', equations: ['ΔH = energy bonds broken − energy bonds made'] },
    { code: '7', title: 'Chemical reactions and rates', model: 'kinetics', objective: 'Investigate concentration, temperature, surface area and catalysts.', equations: ['rate = change in quantity / time'] },
    { code: '8', title: 'Acids, bases, salts and titration', model: 'acidbase', objective: 'Model neutralisation, indicator end-points and salt preparation.', equations: ['acid + base → salt + water'] },
    { code: '9-10', title: 'Periodic table and metals', model: 'periodic', objective: 'Compare periodic trends, displacement and reactivity.', equations: ['more reactive metal displaces less reactive metal'] },
    { code: '11-12', title: 'Air, water and organic chemistry', model: 'organic', objective: 'Explore fuels, functional groups, polymerisation and environmental chemistry.', equations: ['alkane: CₙH₂ₙ₊₂', 'alkene: CₙH₂ₙ'] },
  ],
  biology: [
    { code: '1-2', title: 'Characteristics of living organisms and cells', model: 'cells', objective: 'Compare cell structures and investigate microscopy and magnification.', equations: ['magnification = image size / actual size'] },
    { code: '3-4', title: 'Movement in and out of cells and biological molecules', model: 'transport', objective: 'Model diffusion, osmosis and movement across membranes.', equations: ['rate ∝ concentration gradient'] },
    { code: '5', title: 'Enzymes', model: 'enzymes', objective: 'Investigate the effects of temperature, pH and substrate concentration.', equations: ['relative rate = product formed / time'] },
    { code: '6-7', title: 'Plant nutrition and transport', model: 'photosynthesis', objective: 'Investigate photosynthesis, limiting factors and stomatal responses.', equations: ['carbon dioxide + water → glucose + oxygen'] },
    { code: '8-10', title: 'Human nutrition, transport and disease', model: 'humanbiology', objective: 'Model digestion, circulation, gas exchange and disease transmission.', equations: ['cardiac output = heart rate × stroke volume'] },
    { code: '11-13', title: 'Gas exchange, respiration and excretion', model: 'respiration', objective: 'Compare gas exchange and aerobic respiration under changing conditions.', equations: ['glucose + oxygen → carbon dioxide + water'] },
    { code: '14-16', title: 'Coordination, response and reproduction', model: 'coordination', objective: 'Explore nervous, hormonal and reproductive responses.', equations: ['response time = distance / speed'] },
    { code: '17-18', title: 'Inheritance and variation', model: 'genetics', objective: 'Use crosses and allele frequencies to predict inheritance outcomes.', equations: ['allele frequency p + q = 1'] },
    { code: '19-20', title: 'Organisms and their environment', model: 'ecology', objective: 'Model food webs, population change, sampling and conservation.', equations: ['population change = births + immigration − deaths − emigration'] },
    { code: '21', title: 'Biotechnology and genetic modification', model: 'biotechnology', objective: 'Explore microbial growth, fermentation and biotechnology yields.', equations: ['population = initial × 2^(time / doubling time)'] },
  ],
  environmental: [
    { code: '1', title: 'Natural resources', model: 'resources', objective: 'Compare resource use, energy demand and sustainable management.', equations: ['resource balance = supply − demand'] },
    { code: '2', title: 'Land', model: 'land', objective: 'Investigate soil, crop yield, erosion and land management.', equations: ['soil loss ∝ slope × runoff × exposed area'] },
    { code: '3', title: 'Water', model: 'water', objective: 'Model water supply, pollution, treatment and marine resource use.', equations: ['water balance = recharge − abstraction'] },
    { code: '4', title: 'The atmosphere and human activities', model: 'atmosphere', objective: 'Explore climate change, air pollution and ozone depletion.', equations: ['warming tendency ∝ greenhouse gas concentration'] },
    { code: '5', title: 'Ecosystems, biodiversity and fieldwork', model: 'ecosystems', objective: 'Model sampling, biodiversity, conservation and ecosystem interactions.', equations: ['Simpson index = 1 − Σn(n−1)/N(N−1)'] },
    { code: '6', title: 'Natural hazards', model: 'hazards', objective: 'Compare hazard frequency, exposure, vulnerability and risk reduction.', equations: ['risk = probability × impact'] },
    { code: '7', title: 'Human population', model: 'population', objective: 'Explore population structure, growth, migration and management.', equations: ['natural increase = birth rate − death rate'] },
  ],
  mathematics: [
    { code: '1', title: 'Number', model: 'number', objective: 'Investigate number operations, bounds, standard form and sequences.', equations: ['percentage change = (new − original) / original × 100'] },
    { code: '2', title: 'Algebra and graphs', model: 'algebra', objective: 'Explore algebraic manipulation, equations, inequalities and sequences.', equations: ['y = mx + c'] },
    { code: '3', title: 'Coordinate geometry', model: 'coordinate', objective: 'Investigate gradients, midpoints, distances and line equations.', equations: ['m = (y₂−y₁)/(x₂−x₁)'] },
    { code: '4', title: 'Geometry', model: 'geometry', objective: 'Explore angle relationships, polygons and circle theorems.', equations: ['angles in a triangle = 180°'] },
    { code: '5', title: 'Mensuration', model: 'mensuration', objective: 'Compare area, surface area and volume across shapes.', equations: ['V_cylinder = πr²h'] },
    { code: '6', title: 'Trigonometry', model: 'trigonometry', objective: 'Investigate trigonometric ratios, rules and bearings.', equations: ['sin²θ + cos²θ = 1'] },
    { code: '7', title: 'Transformations and vectors', model: 'vectors', objective: 'Apply transformations and vector operations to coordinates.', equations: 'v = (x₂−x₁, y₂−y₁)'.split(';') },
    { code: '8', title: 'Probability', model: 'probability', objective: 'Model combined events, tree diagrams and expected frequency.', equations: ['P(A or B) = P(A) + P(B) for mutually exclusive events'] },
    { code: '9', title: 'Statistics', model: 'statistics', objective: 'Explore data displays, averages, spread and correlation.', equations: ['mean = Σx/n'] },
  ],
  computerscience: [
    { code: '1', title: 'Data representation', model: 'binary', objective: 'Convert and calculate with binary, denary, hexadecimal and data units.', equations: ['denary = Σ(bit × 2^position)'] },
    { code: '2', title: 'Data transmission', model: 'transmission', objective: 'Explore packets, error detection and data transmission methods.', equations: ['throughput = data / time'] },
    { code: '3', title: 'Hardware', model: 'hardware', objective: 'Model processors, memory, storage and input/output devices.', equations: ['CPU time = instruction count × cycles per instruction / clock rate'] },
    { code: '4', title: 'Software', model: 'software', objective: 'Compare operating system functions and software layers.', equations: [''] },
    { code: '5', title: 'The internet and its uses', model: 'network', objective: 'Trace routing, addressing, protocols and network performance.', equations: ['latency = round-trip time / 2'] },
    { code: '6', title: 'Automated and emerging technologies', model: 'automation', objective: 'Model sensors, control systems, AI and responsible technology use.', equations: ['output = control rule(sensor input)'] },
    { code: '7', title: 'Algorithm design and problem-solving', model: 'algorithms', objective: 'Trace searching, sorting, validation and algorithm efficiency.', equations: ['linear search comparisons ≤ n'] },
    { code: '8', title: 'Programming', model: 'programming', objective: 'Run and trace program constructs with variables, selection and iteration.', equations: ['iteration count = loop condition evaluations'] },
    { code: '9', title: 'Databases', model: 'database', objective: 'Explore records, fields, keys, queries and validation.', equations: ['query result = rows satisfying selection conditions'] },
    { code: '10', title: 'Boolean logic', model: 'logic', objective: 'Construct logic circuits and verify truth tables.', equations: ['Q = A ∧ B', 'Q = A ⊕ B'] },
  ],
  geography: [
    { code: '1', title: 'Changing river environments', model: 'geo-rivers', objective: 'Relate discharge, velocity and river landforms.', equations: ['discharge = area × velocity'] },
    { code: '2', title: 'Changing coastal environments', model: 'geo-coasts', objective: 'Investigate waves, sediment movement and coastal management.', equations: ['longshore drift transfers sediment alongshore'] },
    { code: '3', title: 'Changing ecosystems', model: 'geo-ecosystems', objective: 'Compare ecosystem structure, nutrient cycles and human impacts.', equations: ['NPP = photosynthesis − respiration'] },
    { code: '4', title: 'Tectonic hazards', model: 'geo-hazards', objective: 'Compare hazard risk, exposure, vulnerability and preparedness.', equations: ['risk = probability × impact'] },
    { code: '5', title: 'Climate change', model: 'geo-climate', objective: 'Interpret climate evidence and mitigation and adaptation choices.', equations: ['anomaly = observed − baseline'] },
    { code: '6', title: 'Changing populations', model: 'geo-population', objective: 'Interpret population structure, migration and demographic change.', equations: ['change = births − deaths + net migration'] },
    { code: '7', title: 'Changing towns and cities', model: 'geo-urban', objective: 'Investigate urban land use, growth and service access.', equations: ['density = population / area'] },
    { code: '8', title: 'Development', model: 'geo-development', objective: 'Compare development indicators and strategies.', equations: ['HDI combines health, education and income'] },
    { code: '9', title: 'Changing economies', model: 'geo-economies', objective: 'Explore employment structure and economic change.', equations: ['sector share = sector employment / total employment'] },
    { code: '10', title: 'Resource provision', model: 'geo-resources', objective: 'Assess resource demand, access and sustainable provision.', equations: ['deficit = demand − sustainable supply'] },
  ],
  business: [
    { code: '1', title: 'Understanding business activity', model: 'bus-enterprise', objective: 'Evaluate enterprise, ownership, objectives and stakeholders.', equations: ['added value = selling price − bought-in costs'] },
    { code: '2', title: 'People in business', model: 'bus-people', objective: 'Explore recruitment, training, motivation and productivity.', equations: ['productivity = output / employees'] },
    { code: '3', title: 'Marketing', model: 'bus-marketing', objective: 'Use market research and the marketing mix in decisions.', equations: ['market share = sales / total market × 100'] },
    { code: '4', title: 'Operations management', model: 'bus-operations', objective: 'Compare production methods, quality and productivity.', equations: ['productivity = output / input'] },
    { code: '5', title: 'Financial information and decisions', model: 'bus-finance', objective: 'Interpret costs, revenue, profit, cash flow and break-even.', equations: ['break-even = fixed costs / contribution per unit'] },
    { code: '6', title: 'External influences on business activity', model: 'bus-external', objective: 'Assess economic, legal, environmental and global influences.', equations: ['real value = nominal value / price index × 100'] },
  ],
};

const parameter = (id: string, name: string, symbol: string, unit: string, min: number, max: number, step: number, value: number, description: string): SimulationParameter => ({ id, name, symbol, unit, min, max, step, defaultValue: value, description, category: 'primary' });
const measure = (id: string, label: string, unit: string, precision: number, formula: string): MeasurementDefinition => ({ id, label, unit, precision, formula });

function modelDetails(model: string, variant: number) {
  const p = (id: string, name: string, unit: string, min: number, max: number, step: number, base: number, desc: string) => {
    const steps = Math.max(1, Math.floor((max - min) / step) + 1);
    const baseStep = Math.round((Math.min(max, Math.max(min, base)) - min) / step);
    const scenarioStep = Math.max(0, variant - 1) * 7;
    const variedValue = min + ((baseStep + scenarioStep) % steps) * step;
    return parameter(id, name, id, unit, min, max, step, variedValue, desc);
  };
  const common = {
    kinematics: { parameters: [p('initialSpeed','Initial speed','m/s',0,30,1,4,'Starting speed of the object.'),p('acceleration','Acceleration','m/s²',-5,5,.5,1,'Constant acceleration.'),p('time','Time','s',1,10,1,3,'Elapsed time.')], measurements: [measure('finalSpeed','Final speed','m/s',2,'v = u + at'),measure('distance','Displacement','m',2,'s = ut + ½at²')], formulae: ['v = u + at','s = ut + ½at²'] },
    forces: { parameters: [p('mass','Mass','kg',.1,20,.1,2,'Mass of the object.'),p('force','Resultant force','N',0,100,1,10,'Net force acting on the object.')], measurements: [measure('acceleration','Acceleration','m/s²',2,'a = F/m'),measure('weight','Weight','N',2,'W = mg')], formulae: ['F = ma','W = mg'] },
    energy: { parameters: [p('mass','Mass','kg',.1,20,.1,2,'Mass of the object.'),p('height','Height','m',0,20,.5,5,'Vertical height.'),p('speed','Speed','m/s',0,30,1,8,'Speed of the object.')], measurements: [measure('potentialEnergy','Gravitational potential energy','J',1,'Eₚ = mgh'),measure('kineticEnergy','Kinetic energy','J',1,'Eₖ = ½mv²')], formulae: ['Eₚ = mgh','Eₖ = ½mv²'] },
    waves: { parameters: [p('frequency','Frequency','Hz',1,20,1,5,'Number of oscillations per second.'),p('wavelength','Wavelength','m',.1,10,.1,2,'Distance between adjacent wavefronts.')], measurements: [measure('waveSpeed','Wave speed','m/s',2,'v = fλ'),measure('period','Period','s',3,'T = 1/f')], formulae: ['v = fλ','T = 1/f'] },
    circuits: { parameters: [p('voltage','Potential difference','V',0,24,1,12,'Supply potential difference.'),p('resistance','Resistance','Ω',1,100,1,12,'Circuit resistance.')], measurements: [measure('current','Current','A',3,'I = V/R'),measure('power','Power','W',2,'P = VI')], formulae: ['V = IR','P = VI'] },
    thermal: { parameters: [p('energy','Energy transferred','J',100,5000,100,1200,'Energy supplied to the sample.'),p('mass','Mass','kg',.1,5,.1,1,'Mass of the sample.'),p('specificHeat','Specific heat capacity','J/(kg·°C)',100,5000,100,4200,'Specific heat capacity of the material.')], measurements: [measure('temperatureChange','Temperature change','°C',2,'ΔT = E/(mc)'),measure('energyPerMass','Energy per unit mass','J/kg',1,'E/m')], formulae: ['ΔE = mcΔT'] },
    nuclear: { parameters: [p('initialCount','Initial nuclei','nuclei',100,10000,100,1000,'Starting number of unstable nuclei.'),p('halfLife','Half-life','s',1,100,1,10,'Time for half of the nuclei to decay.'),p('elapsedTime','Elapsed time','s',0,100,1,20,'Time since the sample was prepared.')], measurements: [measure('remainingNuclei','Remaining nuclei','nuclei',0,'N = N₀(½)^(t/T½)'),measure('decayedFraction','Decayed fraction','%',1,'100(1 − N/N₀)')], formulae: ['N = N₀(½)^(t/T½)'] },
    population: { parameters: [p('birthRate','Birth rate','per 1000',5,50,1,28,'Births per 1000 people each year.'),p('deathRate','Death rate','per 1000',1,40,1,12,'Deaths per 1000 people each year.'),p('population','Population','people',10000,1000000,10000,100000,'Starting population.')], measurements: [measure('naturalIncrease','Natural increase','per 1000',1,'birth rate − death rate'),measure('populationNextYear','Population after one year','people',0,'P × (1 + RNI/1000)')], formulae: ['RNI = birth rate − death rate'] },
    mathematics: { parameters: [p('coefficient','Coefficient','',-5,5,.5,1,'Coefficient in the selected relation.'),p('inputValue','Input value','',-10,10,1,3,'Independent variable value.'),p('constant','Constant','',-10,10,1,2,'Constant term.')], measurements: [measure('outputValue','Calculated output','',2,'y = ax + c'),measure('gradient','Gradient','',2,'dy/dx = a')], formulae: ['y = ax + c'] },
    binary: { parameters: [p('decimalValue','Denary value','',0,255,1,42,'Unsigned 8-bit value to convert.'),p('bitWidth','Bit width','bits',4,16,1,8,'Number of bits in the representation.')], measurements: [measure('binaryValue','Binary','',0,'base-2 representation'),measure('hexValue','Hexadecimal','',0,'base-16 representation')], formulae: ['denary = Σ(bit × 2^position)'] },
  } as const;
  const aliases: Record<string, keyof typeof common> = {
    optics: 'waves', electromagnetism: 'circuits', radioactivity: 'nuclear', space: 'energy',
    particles: 'thermal', practical: 'mathematics', atoms: 'binary', stoichiometry: 'energy',
    electrochemistry: 'circuits', energetics: 'thermal', kinetics: 'thermal', acidbase: 'thermal',
    periodic: 'forces', organic: 'energy', cells: 'mathematics', transport: 'thermal', enzymes: 'thermal',
    photosynthesis: 'energy', humanbiology: 'population', respiration: 'energy', coordination: 'kinematics',
    genetics: 'binary', ecology: 'population', biotechnology: 'population', resources: 'energy', land: 'forces',
    water: 'thermal', atmosphere: 'thermal', ecosystems: 'population', hazards: 'forces', number: 'mathematics',
    algebra: 'mathematics', coordinate: 'mathematics', geometry: 'mathematics', mensuration: 'mathematics',
    trigonometry: 'mathematics', statistics: 'mathematics', probability: 'mathematics', programming: 'binary',
    database: 'mathematics', logic: 'binary', algorithms: 'mathematics', data: 'binary', hardware: 'binary',
    networks: 'binary', network: 'binary', transmission: 'binary', software: 'mathematics', automation: 'mathematics',
    vectors: 'mathematics', security: 'binary', systems: 'binary',
  };
  const resolved = aliases[model] ?? model;
  return { ...common, [model]: common[resolved as keyof typeof common] ?? common.mathematics };
}

function classify(subject: SubjectId, title: string): string {
  const t = title.toLowerCase();
  if (subject === 'physics') return /refraction|lens|light|optics/.test(t) ? 'optics' : /electromagnet|induction|motor effect/.test(t) ? 'electromagnetism' : /radioactive|nuclear|rutherford|nuclide|half-life/.test(t) ? 'radioactivity' : /orbit|space|star|redshift|universe/.test(t) ? 'space' : /wave|sound|ripple/.test(t) ? 'waves' : /circuit|ohm|voltage|current|resistance/.test(t) ? 'circuits' : /thermal|heat|gas|brownian|latent|temperature/.test(t) ? 'thermal' : /energy|momentum|work|power/.test(t) ? 'energy' : /motion|ticker|pendulum|terminal|speed|acceleration/.test(t) ? 'kinematics' : 'forces';
  if (subject === 'chemistry') return /chromatograph|separat|filtrat|distill|crystall/.test(t) ? 'practical' : /atom|electron|proton|isotope|ion/.test(t) ? 'atoms' : /mole|equation|stoichi|formula|reacting mass/.test(t) ? 'stoichiometry' : /electrolys|fuel cell|electrode/.test(t) ? 'electrochemistry' : /energetic|enthalpy|exothermic|endothermic/.test(t) ? 'energetics' : /rate|collision|catalyst|equilibrium/.test(t) ? 'kinetics' : /acid|alkali|neutralis|titration|salt/.test(t) ? 'acidbase' : /periodic|group|metal|displacement|reactivity/.test(t) ? 'periodic' : /organic|alkane|alkene|polymer|ethanol|carboxylic/.test(t) ? 'organic' : /state|diffusion|gas|particle|melting|boiling/.test(t) ? 'particles' : 'practical';
  if (subject === 'biology') return /microscop|cell|organelle|magnification/.test(t) ? 'cells' : /osmosis|diffusion|membrane|transport/.test(t) ? 'transport' : /enzyme/.test(t) ? 'enzymes' : /photosynthesis|plant nutrition|stomata/.test(t) ? 'photosynthesis' : /heart|blood|digestion|disease|nutrition/.test(t) ? 'humanbiology' : /respiration|gas exchange|excretion/.test(t) ? 'respiration' : /nervous|hormone|response|reproduction|coordination/.test(t) ? 'coordination' : /genetic|inherit|variation|punnett|chromosome/.test(t) ? 'genetics' : /ecosystem|ecology|food web|population|biodiversity/.test(t) ? 'ecology' : /biotechnology|fermentation|genetic modification/.test(t) ? 'biotechnology' : 'cells';
  if (subject === 'environmental') return /land|soil|crop|erosion|agriculture/.test(t) ? 'land' : /water|aquifer|river|ocean|pollution/.test(t) ? 'water' : /atmosphere|climate|greenhouse|ozone|air/.test(t) ? 'atmosphere' : /ecosystem|biodiversity|fieldwork|sampling/.test(t) ? 'ecosystems' : /hazard|earthquake|volcano|flood|storm/.test(t) ? 'hazards' : /population|demographic|migration/.test(t) ? 'population' : 'resources';
  if (subject === 'mathematics') return /coordinate|gradient|midpoint|straight line/.test(t) ? 'coordinate' : /geometry|angle|circle theorem|polygon/.test(t) ? 'geometry' : /mensuration|area|volume|surface/.test(t) ? 'mensuration' : /trig|bearing|sine|cosine/.test(t) ? 'trigonometry' : /vector|transform/.test(t) ? 'vectors' : /probab/.test(t) ? 'probability' : /statistic|data|mean|median/.test(t) ? 'statistics' : /algebra|graph|equation|function|sequence/.test(t) ? 'algebra' : 'number';
  return /transmission|packet|error check|checksum/.test(t) ? 'transmission' : /hardware|processor|cpu|memory|storage/.test(t) ? 'hardware' : /software|operating system/.test(t) ? 'software' : /network|internet|router|ip address/.test(t) ? 'network' : /sensor|automated|control system|emerging technolog/.test(t) ? 'automation' : /algorithm|search|sort/.test(t) ? 'algorithms' : /program|iteration|loop|python/.test(t) ? 'programming' : /database|query|record|field/.test(t) ? 'database' : /logic|boolean|gate|truth table/.test(t) ? 'logic' : 'binary';
}

const subjectPrefix: Record<SubjectId, string> = { physics: 'phys', chemistry: 'chem', biology: 'bio', environmental: 'env', mathematics: 'math', computerscience: 'cs', geography: 'geo', business: 'bus' };

export function buildSimulationCatalog(): Record<string, SimulationMetadata> {
  const catalog: Record<string, SimulationMetadata> = {};
  const topics: Record<SubjectId, SimulationTopic[]> = TOPICS;
  for (const [subjectKey, curriculum] of Object.entries(CURRICULUM_DATA) as [SubjectId, typeof CURRICULUM_DATA[SubjectId]][]) {
    const legacy = curriculum.units.flatMap(unit => unit.chapters.flatMap(chapter => chapter.concepts.filter(concept => concept.simulationId).map(concept => ({ unit, chapter, concept }))));
    const syllabusChapters = curriculum.units.flatMap(unit => unit.chapters.map(chapter => ({ unit, chapter })));
    const chapterCoverage = new Map<string, number>();
    legacy.forEach(({ chapter }) => chapterCoverage.set(chapter.id, (chapterCoverage.get(chapter.id) ?? 0) + 1));
    const chaptersNeedingLabs = syllabusChapters.filter(({ chapter }) => (chapterCoverage.get(chapter.id) ?? 0) < 2);
    const topicList = topics[subjectKey];
    const scenarioCount = 100;
    for (let index = 0; index < scenarioCount; index++) {
      const scenario = index + 1;
      const legacyEntry = legacy[index];
      const supplementIndex = index - legacy.length;
      const assignedChapter = legacyEntry ?? chaptersNeedingLabs[supplementIndex] ?? syllabusChapters[Math.max(0, supplementIndex) % syllabusChapters.length];
      // Cycle through the official syllabus areas so supplementary entries cover
      // the full topic list even when a subject already has legacy concept IDs.
      const topic = topicList[index % topicList.length];
      const title = legacyEntry?.concept.title ?? `${topic.title} — ${assignedChapter?.chapter.title ?? 'Syllabus investigation'} (${String(supplementIndex + 1).padStart(2, '0')})`;
      const model = legacyEntry ? classify(subjectKey, title) : topic.model;
      const details = modelDetails(model, scenario) as unknown as Record<string, { parameters: SimulationParameter[]; measurements: MeasurementDefinition[]; formulae: string[] }>;
      const modelData = details[model] ?? details.mathematics ?? details.forces;
      const id = legacyEntry?.concept.simulationId ?? `${subjectPrefix[subjectKey]}-syllabus-${String(scenario).padStart(3, '0')}`;
      const objective = legacyEntry?.concept.learningObjectives[0];
      catalog[id] = {
        id,
        subjectId: subjectKey,
        unitId: assignedChapter?.unit.id ?? `${subjectPrefix[subjectKey]}-unit-${topic.code}`,
        chapterId: assignedChapter?.chapter.id ?? `${subjectPrefix[subjectKey]}-topic-${topic.code}`,
        title,
        subtitle: legacyEntry?.concept.description ?? `${topic.objective} Investigation ${supplementIndex + 1} of 100.`,
        syllabusCode: objective?.code ?? `${IGCSE_SUBJECTS_CODE[subjectKey]}.${topic.code}`,
        difficulty: 'Both',
        visualType: model,
        learningObjectives: [objective?.description ?? topic.objective],
        scientificPrinciples: [topic.objective],
        assumptions: ['Idealised classroom model; controls and initial values are shown in the lab.'],
        parameters: modelData.parameters,
        measurements: modelData.measurements,
        challenges: [],
        guidedSteps: [
          { stepNumber: 1, instruction: `Predict how changing ${modelData.parameters[0]?.name ?? 'the first control'} affects the result.`, actionRequired: 'Record a prediction, then change one control at a time.', scientificInsight: topic.objective },
          { stepNumber: 2, instruction: 'Compare the measured outputs across this scenario.', actionRequired: 'Record at least three trials and identify the relationship.', scientificInsight: topic.equations.join('; ') },
        ],
        defaultMode: 'explore',
        formulae: legacyEntry?.concept.keyEquations ?? topic.equations,
        tags: [topic.title, `Scenario ${scenario}`, `Syllabus ${topic.code}`],
      };
    }
  }
  for (const subjectId of Object.keys(TOPICS) as SubjectId[]) {
    const count = Object.values(catalog).filter((simulation) => simulation.subjectId === subjectId).length;
    if (count !== 100) throw new Error(`Expected 100 syllabus simulations for ${subjectId}, found ${count}.`);
  }
  return catalog;
}

const IGCSE_SUBJECTS_CODE: Record<SubjectId, string> = { physics: '0625', chemistry: '0620', biology: '0610', environmental: '0680', mathematics: '0580', computerscience: '0478', geography: '0460', business: '0264' };
