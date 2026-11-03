import { LABS } from './catalog';

const bp = (instrument, action, _glyph, rig) => Object.freeze({
  instrument,
  action,
  glyph: instrument.split(/\s+/).slice(0, 2).map((part) => part.slice(0, 1)).join('').toUpperCase(),
  rig,
});

/* Every curriculum operation has its own named apparatus and touch instruction.
   The shared renderer supplies the topic-specific visual and mathematical model. */
export const EXPERIENCE_BLUEPRINTS = Object.freeze({
  measurement: bp('Vernier caliper', 'Drag the movable jaw across the object, then change the scale resolution to see how rounding and zero error affect the reading.', '▤', 'physics'),
  kinematics: bp('Motion trolley', 'Drag along the track to change the starting motion. Move vertically to test acceleration and elapsed time together.', '▰', 'physics'),
  density: bp('Mass-and-volume bench', 'Move the balance mass and displacement cylinder settings. Watch the calculated density respond to both measurements.', '⚖', 'physics'),
  force: bp('Force-table handle', 'Drag the force vector and load setting. Compare the resultant acceleration with the same mass under a different force.', '↗', 'physics'),
  momentum: bp('Collision trolley', 'Set the trolley speed and collision time. Compare momentum before impact with the average stopping force.', '▰', 'physics'),
  energy: bp('Energy-skate track', 'Move the rider between height and speed settings. Follow energy as it transfers between gravitational and kinetic stores.', '⌁', 'physics'),
  workPower: bp('Load-and-lift rig', 'Drag the load through a distance and change the lifting time to compare work done with power.', '⬆', 'physics'),
  pressure: bp('Pressure vessel', 'Move the piston and depth probe. Compare the pressure caused by a force with pressure from liquid depth.', '⊙', 'physics'),
  particleEnergy: bp('Gas chamber', 'Change the chamber state by dragging across the play area. Observe particle motion and the pressure index together.', '⋯', 'physics'),
  specificHeat: bp('Calorimeter', 'Set the energy input and sample mass. The temperature rise follows the heat-capacity relationship.', '♨', 'physics'),
  heatTransfer: bp('Thermal-transfer bench', 'Adjust the temperature gap and barrier properties. Compare the relative rate through each material.', '♨', 'physics'),
  wave: bp('Wave generator', 'Drag the source setting to alter frequency and wavelength; follow the moving crest through the medium.', '∿', 'physics'),
  refraction: bp('Ray box and glass block', 'Move the incident ray around the normal. The refracted ray and critical angle update with the material.', '↗', 'physics'),
  spectrum: bp('Spectrum selector', 'Touch a band to move from radio waves through gamma rays, then move the detector to compare intensity.', '◉', 'physics'),
  sound: bp('Sound source and microphone', 'Change the source frequency, then move the microphone to compare wavelength and relative intensity.', ')))', 'physics'),
  magneticField: bp('Compass and field mapper', 'Move a compass around the magnet, rotate or reverse the poles, and map the field direction.', '✥', 'physics'),
  charge: bp('Current-and-charge circuit', 'Set current and switch duration. Watch the amount of charge and energy delivered accumulate.', 'ϟ', 'physics'),
  circuit: bp('Circuit construction board', 'Change the supply and resistor components. Follow the live current and equivalent resistance.', '⌁', 'physics'),
  electricalPower: bp('Appliance safety board', 'Set appliance current and voltage, then compare it with the fuse rating to test the protection.', 'ϟ', 'physics'),
  induction: bp('Pickup coil and magnet', 'Move the magnet relative to the coil and change the time for the flux change. The induced e.m.f. follows.', '⇄', 'physics'),
  isotope: bp('Nuclear composition bench', 'Add or remove neutrons and electrons. The nuclide identity and ion charge update separately.', '⊙', 'physics'),
  decay: bp('Radioactive sample and clock', 'Advance elapsed time or change the half-life. Compare the expected remaining nuclei with the starting sample.', '◷', 'physics'),
  orbit: bp('Orbital system', 'Move the orbit radius and period. The orbital speed and centripetal acceleration are recalculated.', '◌', 'physics'),
  redshift: bp('Stellar spectrometer', 'Drag the observed spectral line relative to its rest wavelength and compare the inferred redshift.', '≋', 'physics'),

  particleState: bp('Heated particle chamber', 'Add energy and watch the particles spread or change state as temperature crosses the model thresholds.', '⋯', 'chemistry'),
  atomicStructure: bp('Atom and ion builder', 'Change neutron count and charge. Electron arrangement updates while the element identity stays fixed.', '⊙', 'chemistry'),
  moles: bp('Solution preparation bench', 'Set sample mass, formula mass and flask volume. Mix the solution to see amount and concentration.', '⚗', 'chemistry'),
  electrolysis: bp('Electrolysis cell', 'Set current and electrolysis time. Track charge through the cell and compare electrode deposits.', 'ϟ', 'chemistry'),
  enthalpy: bp('Bond-energy balance', 'Move the energy bars for bonds broken and formed. Their difference determines the reaction energy change.', '♨', 'chemistry'),
  reactionRate: bp('Collision chamber', 'Change temperature, concentration, particle surface area or catalyst. Watch collision frequency and reaction rate respond.', '⋯', 'chemistry'),
  neutralisation: bp('Titration apparatus', 'Operate the burette and add titrant drop by drop. Read the colour change and equivalence volume.', '⚗', 'chemistry'),
  periodicity: bp('Periodic-table explorer', 'Move across atomic numbers and inspect how shell arrangement and outer electrons repeat by period.', '▦', 'chemistry'),
  reactivity: bp('Metal displacement tray', 'Choose the solid metal and metal-ion solution. Observe whether a displacement reaction is predicted.', '⇄', 'chemistry'),
  pollution: bp('Water-treatment works', 'Set the pollutant load and treatment efficiency, then compare concentrations before and after treatment.', '▽', 'chemistry'),
  organic: bp('Molecular structure bench', 'Add carbon atoms or unsaturation and inspect how the displayed hydrocarbon formula changes.', '⌬', 'chemistry'),
  chromatography: bp('Chromatography tank', 'Move the sample spot or solvent front and compare their distances to calculate the Rf value.', '↑', 'chemistry'),

  classification: bp('Classification key', 'Choose an observable feature and follow the matching branch until the specimen is identified.', '⑂', 'biology'),
  magnification: bp('Microscope stage and scale', 'Change image or actual size. Drag the specimen scale to compare magnification and dimensions.', '⌕', 'biology'),
  osmosis: bp('Membrane transport chamber', 'Set the concentrations on both sides and membrane area. Track net water movement across the membrane.', '⇄', 'biology'),
  biomolecule: bp('Food-test bench', 'Change sample concentration and reagent volume, then compare the model response for a controlled test.', '⚗', 'biology'),
  enzyme: bp('Enzyme reaction chamber', 'Change temperature and substrate concentration. Follow enzyme activity toward its optimum.', '⌬', 'biology'),
  photosynthesis: bp('Illuminated leaf chamber', 'Move the lamp and adjust carbon dioxide or temperature to find the factor limiting photosynthesis.', '☼', 'biology'),
  digestion: bp('Digestion pathway', 'Set enzyme activity and time, then track substrate breakdown along the digestive pathway.', '⇢', 'biology'),
  transpiration: bp('Potometer', 'Adjust light, wind and humidity. Watch the water-uptake rate respond to leaf conditions.', '♧', 'biology'),
  cardiacOutput: bp('Circulatory pump', 'Set heart rate and stroke volume. Follow the blood volume pumped per minute.', '♡', 'biology'),
  bioTransmission: bp('Transmission network', 'Set contacts, transmission probability and infectious duration. Observe how the outbreak changes.', '⌘', 'biology'),
  ventilation: bp('Ventilation bellows', 'Move the breathing-rate and tidal-volume controls to model minute ventilation.', '↕', 'biology'),
  respiration: bp('Respiration chamber', 'Set glucose and oxygen available. Track products and the limiting reactant.', '⋯', 'biology'),
  kidney: bp('Nephron filtration bench', 'Adjust filtration and reabsorption. Follow how the water balance changes along the nephron.', '⇣', 'biology'),
  reflex: bp('Reflex-arc pathway', 'Change pathway length, nerve speed or processing delay, then trace the response time.', '⚡', 'biology'),
  doseResponse: bp('Dose-response chamber', 'Increase dose or exposure duration and compare the response at different sensitivities.', '∿', 'biology'),
  reproduction: bp('Reproductive success model', 'Set gamete production, fertilisation and survival. Follow how expected offspring number changes.', '◉', 'biology'),
  inheritance: bp('Punnett-square cross', 'Choose parent alleles, then tap offspring cells to build a genotype sample.', '⊞', 'biology'),
  selection: bp('Natural-selection field', 'Set the starting trait frequency and fitness advantage, then advance generations.', '♧', 'biology'),
  foodWeb: bp('Trophic-energy web', 'Adjust producer energy and transfer efficiency. Trace energy lost at each trophic level.', '⇢', 'biology'),
  biodiversity: bp('Quadrat and diversity survey', 'Sample individuals and change species dominance to compare richness and diversity.', '⌗', 'biology'),
  fermentation: bp('Fermentation vessel', 'Adjust sugar, temperature and time. Observe gas production during yeast fermentation.', '♨', 'biology'),

  resourceBalance: bp('Resource-flow plant', 'Set sustainable supply, demand and recycling. See whether the resource balance remains positive.', '⇄', 'environment'),
  erosion: bp('Catchment erosion table', 'Change slope, rainfall and ground cover. Compare runoff and relative soil loss.', '⌁', 'environment'),
  waterBalance: bp('Catchment and reservoir', 'Add rainfall, recharge groundwater or abstract water. Watch basin storage update after each action.', '▽', 'environment'),
  climateBalance: bp('Atmospheric energy balance', 'Change reflection and greenhouse retention. Follow the energy entering and leaving the system.', '☼', 'environment'),
  hazardRisk: bp('Hazard-risk map', 'Set probability, exposure and vulnerability to compare the resulting risk index.', '⌖', 'environment'),
  populationGrowth: bp('Population cohort model', 'Change birth, death and migration rates. Advance the population through each year.', '♙', 'environment'),

  number: bp('Number line and percentage wheel', 'Drag the starting value and percentage change. Compare the exact result with rounding.', '↔', 'mathematics'),
  algebra: bp('Coordinate graph board', 'Move the input point and intercept. Follow how the straight-line output changes.', '⌁', 'mathematics'),
  coordinate: bp('Coordinate geometry plane', 'Drag points A and B to change the line; gradient, distance and midpoint update live.', '•', 'mathematics'),
  geometry: bp('Triangle construction board', 'Move two angle controls and the side length. The third angle and remaining sides follow.', '△', 'mathematics'),
  mensuration: bp('Solid-measurement bench', 'Change the radius or height of the cylinder and compare volume with curved surface area.', '◉', 'mathematics'),
  trigonometry: bp('Right-triangle angle arm', 'Rotate the angle arm or change the hypotenuse. Read opposite and adjacent lengths.', '∠', 'mathematics'),
  vector: bp('Vector component board', 'Drag vector endpoints or adjust components and inspect the resultant arrow.', '↗', 'mathematics'),
  probability: bp('Probability spinner and trial board', 'Set the event probability and number of trials, then compare expected frequency.', '◉', 'mathematics'),
  statistics: bp('Sampling distribution bench', 'Change the sample size, mean and spread. Compare the standard error of repeated samples.', '▥', 'mathematics'),

  binary: bp('Binary register', 'Tap bit cells to switch them; denary, binary, hexadecimal and overflow status update together.', '▦', 'computerscience'),
  transmission: bp('Packet-transmission link', 'Set data size, rate and packet payload. Follow packets from source to destination.', '▰', 'computerscience'),
  cpu: bp('Processor-cycle display', 'Adjust instruction count, cycles per instruction and clock rate; watch execution time recalculate.', '▦', 'computerscience'),
  software: bp('Translator pipeline', 'Change source size and translation rate. Step through the estimated translation time.', '⇢', 'computerscience'),
  network: bp('Network route map', 'Move route distance and link rate. Compare packet transmission delay with propagation delay.', '⌘', 'computerscience'),
  controlSystem: bp('Sensor-controller-actuator rig', 'Move the sensor around the set point. Observe hysteresis and the actuator state.', '◉', 'computerscience'),
  algorithm: bp('Search-array workbench', 'Tap the array target and switch between sorted and unsorted modes to compare search traces.', '▦', 'computerscience'),
  programTrace: bp('Program trace table', 'Step through loop iterations and watch the variable state update after each assignment.', '▷', 'computerscience'),
  database: bp('Database query workbench', 'Change the criteria and matching rate. Inspect how the result set shrinks after filtering.', '▤', 'computerscience'),
  logic: bp('Logic-gate board', 'Tap the two input switches or select a gate. The output responds using the truth function.', 'ϟ', 'computerscience'),

  amFunctions: bp('Function transformation plane', 'Drag the input point and horizontal/vertical shifts to compare f(x) with f(g(x)).', 'ƒ', 'additionalmaths'),
  amQuadratics: bp('Quadratic graph board', 'Move a, b or c and drag the test point; roots, discriminant and turning point update.', '⌁', 'additionalmaths'),
  amPolynomialFactors: bp('Polynomial-root explorer', 'Move the known roots and trace how each factor changes the cubic and its intercepts.', '⌁', 'additionalmaths'),
  amEquationsInequalities: bp('Inequality sign-line', 'Move the polynomial coefficients and test point. Read the sign between the roots.', '↔', 'additionalmaths'),
  amSimultaneous: bp('Line-and-curve intersection board', 'Drag the line or parabola settings and count their real intersection points.', '∩', 'additionalmaths'),
  amLogExponential: bp('Inverse-function explorer', 'Change the base and exponent, then compare the exponential value with its logarithmic inverse.', 'ƒ', 'additionalmaths'),
  amStraightLine: bp('Straight-line relationship board', 'Move the point or gradient and compare parallel and perpendicular line tests.', '⌁', 'additionalmaths'),
  amCircle: bp('Circle-and-tangent plane', 'Drag the centre, radius or contact angle. Follow the tangent perpendicular to the radius.', '◯', 'additionalmaths'),
  amCircularMeasure: bp('Circular-measure sector', 'Move the radius and radian angle to change arc length, chord and sector area.', '◔', 'additionalmaths'),
  amTrigonometry: bp('Trigonometric wave board', 'Drag the phase point and change amplitude or period to transform the wave.', '∿', 'additionalmaths'),
  amPermutationsCombinations: bp('Selection tray', 'Choose objects and selection size. Compare arrangements where order matters with combinations.', '⊞', 'additionalmaths'),
  amSeries: bp('Sequence-and-series board', 'Change the first term, difference, ratio or term count. Compare AP and GP sequences.', '⋯', 'additionalmaths'),
  amVectors2D: bp('Two-vector component board', 'Drag vector endpoints and inspect the resultant, dot product and included angle.', '↗', 'additionalmaths'),
  amCalculus: bp('Calculus tangent plane', 'Drag the point along the curve. The tangent gradient and signed area update.', 'ƒ', 'additionalmaths'),
});

// These trigonometry labs render their own topic-specific workbenches in
// SubjectLabs. They intentionally do not use the generic experience blueprint.
const specializedLabOperations = new Set([
  'trigPythagoras', 'trigExact', 'trigSineGraph', 'trigCosineGraph',
  'trigTangentGraph', 'trigNonRight', 'trigThreeD', 'trigBearings', 'trigElevation',
]);
const curriculumOperations = new Set(
  LABS.map((lab) => lab.operation).filter((operation) => !specializedLabOperations.has(operation)),
);
const missingExperiences = [...curriculumOperations].filter((operation) => !EXPERIENCE_BLUEPRINTS[operation]);
if (missingExperiences.length) {
  throw new Error(`Missing hands-on interaction blueprint: ${missingExperiences.join(', ')}`);
}

export function getExperienceBlueprint(operation) {
  const experience = EXPERIENCE_BLUEPRINTS[operation];
  if (!experience) throw new Error(`No interactive lab experience registered for operation: ${operation}`);
  return experience;
}
