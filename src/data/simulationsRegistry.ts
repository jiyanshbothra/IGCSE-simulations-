import { SimulationMetadata } from '../types/simulation';
import { buildSimulationCatalog } from './simulationCatalog';

const EXISTING_SIMULATIONS: Record<string, SimulationMetadata> = {
  'phys-vernier-caliper': {
    id: 'phys-vernier-caliper',
    subjectId: 'physics',
    unitId: 'phys-u1',
    chapterId: 'phys-c1-1',
    title: 'Vernier Caliper & Micrometer Gauging',
    subtitle: 'Read main and vernier scales, compare instrument resolution, and correct for zero error',
    syllabusCode: '0625.1.1.1',
    difficulty: 'Both',
    learningObjectives: [
      'Measure length using appropriate instruments and record a reading to a precision justified by the instrument.',
      'Read a vernier caliper and micrometer screw gauge using the main scale and aligned subdivision.',
      'Identify zero error and apply a correction to an observed measurement.'
    ],
    scientificPrinciples: [
      'Vernier reading = main scale reading + (aligned vernier division × least count).',
      'Micrometer reading = sleeve scale reading + (thimble division × least count).',
      'Corrected reading = observed reading − zero error.',
      'A smaller least count gives finer resolution, but does not remove all measurement uncertainty.'
    ],
    assumptions: [
      'The instrument scale is ideal and its stated least count is exact.',
      'The object is held squarely between the measuring faces.',
      'Random reading uncertainty is not modelled; this lab isolates scale resolution and zero error.'
    ],
    parameters: [
      {
        id: 'objectLength', name: 'Object length', symbol: 'L', unit: 'mm', min: 1, max: 19.99, step: 0.01,
        defaultValue: 12.36, description: 'Length of the object being measured.', category: 'primary'
      },
      {
        id: 'instrument', name: 'Instrument', symbol: 'I', unit: '', min: 0, max: 1, step: 1,
        defaultValue: 0, description: 'Choose a vernier caliper (0) or micrometer (1).', category: 'primary'
      },
      {
        id: 'zeroError', name: 'Zero error', symbol: 'e_0', unit: 'mm', min: -0.2, max: 0.2, step: 0.01,
        defaultValue: 0, description: 'Systematic offset applied to the instrument reading.', category: 'secondary'
      }
    ],
    measurements: [
      { id: 'observedReading', label: 'Observed reading', symbol: 'R_o', unit: 'mm', precision: 2 },
      { id: 'correctedReading', label: 'Corrected reading', symbol: 'R_c', unit: 'mm', precision: 2, formula: 'R_c = R_o - e_0' },
      { id: 'mainScaleReading', label: 'Main scale reading', symbol: 'MSR', unit: 'mm', precision: 2 },
      { id: 'subdivisionIndex', label: 'Aligned subdivision', symbol: 'n', unit: 'divisions', precision: 0 }
    ],
    challenges: [],
    guidedSteps: [
      {
        stepNumber: 1,
        instruction: 'Set the instrument to a vernier caliper and inspect the main scale.',
        actionRequired: 'Move the object length slider and identify the last whole millimetre before the vernier zero.',
        scientificInsight: 'The main scale gives the whole millimetre part of a vernier caliper reading.'
      },
      {
        stepNumber: 2,
        instruction: 'Find the vernier division that aligns with a main scale mark.',
        actionRequired: 'Read the aligned division and multiply its number by the 0.1 mm least count.',
        scientificInsight: 'The vernier scale resolves the fraction of a millimetre between main scale marks.'
      },
      {
        stepNumber: 3,
        instruction: 'Switch to the micrometer and compare the least count.',
        actionRequired: 'Observe how the finer thimble scale changes the recorded precision.',
        scientificInsight: 'A micrometer screw gauge commonly resolves 0.01 mm, finer than a 0.1 mm vernier caliper.'
      }
    ],
    defaultMode: 'explore',
    formulae: [
      'R = MSR + n × LC',
      'R_c = R_o - e_0',
      'LC_{vernier} = 0.1 mm',
      'LC_{micrometer} = 0.01 mm'
    ],
    tags: ['Measurement', 'Vernier Caliper', 'Micrometer', 'Resolution', 'Zero Error']
  },
  'phys-gas-laws': {
    id: 'phys-gas-laws',
    subjectId: 'physics',
    unitId: 'phys-u2',
    chapterId: 'phys-c2-1',
    title: 'Kinetic Particle Theory & Gas Laws',
    subtitle: 'Microscopic collisions, absolute zero, Boyle’s Law and Charles’s Law',
    syllabusCode: '0625.2.1.3 / 0625.2.1.4',
    difficulty: 'Both',
    learningObjectives: [
      'Describe qualitatively the pressure of a gas in terms of the motion of its particles and their collisions with the container walls.',
      'Explain that increasing the temperature of a gas increases the kinetic energy and speed of particles.',
      'Relate pressure and volume at constant temperature (Boyle’s Law: p1V1 = p2V2).',
      'Relate pressure and absolute temperature (Kelvin) at constant volume (p/T = constant).'
    ],
    scientificPrinciples: [
      'Kinetic Theory of Gases: Gas particles are in continuous, random, rapid motion.',
      'Pressure is the force exerted per unit area by gas particles colliding elastically with the walls.',
      'Temperature in Kelvin is directly proportional to the average kinetic energy of the particles: E_k = (3/2) k_B T.',
      'Ideal Gas Law: pV = N k_B T.'
    ],
    assumptions: [
      'Particles behave as hard elastic spheres of negligible volume compared to container.',
      'Collisions with walls and each other are perfectly elastic (no energy lost).',
      'Intermolecular attractive forces are negligible.'
    ],
    parameters: [
      {
        id: 'temperature',
        name: 'Gas Temperature',
        symbol: 'T',
        unit: 'K',
        min: 100,
        max: 800,
        step: 10,
        defaultValue: 300,
        description: 'Controls average kinetic energy and root-mean-square speed of particles.',
        category: 'primary'
      },
      {
        id: 'volume',
        name: 'Container Volume',
        symbol: 'V',
        unit: 'L',
        min: 2,
        max: 12,
        step: 0.5,
        defaultValue: 6.0,
        description: 'Position of movable container piston wall.',
        category: 'primary'
      },
      {
        id: 'particleCount',
        name: 'Number of Particles',
        symbol: 'N',
        unit: 'particles',
        min: 20,
        max: 150,
        step: 10,
        defaultValue: 60,
        description: 'Quantity of gas molecules inside the sealed container.',
        category: 'secondary'
      },
      {
        id: 'molecularMass',
        name: 'Particle Type',
        symbol: 'm',
        unit: 'u',
        min: 4,
        max: 32,
        step: 4,
        defaultValue: 4, // Helium
        description: 'Mass of particles (Helium 4u vs Oxygen 32u).',
        category: 'secondary'
      }
    ],
    measurements: [
      { id: 'pressure', label: 'Gas Pressure', symbol: 'p', unit: 'kPa', precision: 1, formula: 'p = N k_B T / V' },
      { id: 'temperatureK', label: 'Temperature (Kelvin)', symbol: 'T', unit: 'K', precision: 0 },
      { id: 'temperatureC', label: 'Temperature (Celsius)', symbol: 'θ', unit: '°C', precision: 0, formula: 'θ = T - 273.15' },
      { id: 'avgSpeed', label: 'RMS Particle Speed', symbol: 'v_rms', unit: 'm/s', precision: 0, formula: 'v = \\sqrt{3 k_B T / m}' },
      { id: 'wallCollisions', label: 'Collision Rate', symbol: 'f_coll', unit: 'coll/s', precision: 0 }
    ],
    challenges: [
      {
        id: 'chal-1',
        title: 'Calibrate Pressure to Exactly 250 kPa',
        difficulty: 'Foundation',
        description: 'Using only the temperature burner and volume piston, adjust the gas system to achieve a stable pressure of 250 kPa (± 5 kPa) at Volume = 6.0 L.',
        hint: 'Recall that p is proportional to T. If pressure is too low, increase temperature.',
        targetCriteria: { property: 'pressure', targetValue: 250, tolerance: 5, unit: 'kPa' },
        explanationOnSuccess: 'Excellent! At V = 6.0 L, increasing T increased molecular speed and wall collision impulse, raising the pressure to 250 kPa.'
      },
      {
        id: 'chal-2',
        title: 'Investigate Boyle’s Law (Half Volume, Double Pressure)',
        difficulty: 'Intermediate',
        description: 'Fix Temperature at 300 K. Halve the volume from 8.0 L to 4.0 L. Observe the final pressure.',
        hint: 'According to Boyle’s Law, p1V1 = p2V2. Halving volume doubles the frequency of wall collisions.',
        targetCriteria: { property: 'volume', targetValue: 4.0, tolerance: 0.2, unit: 'L' },
        explanationOnSuccess: 'Verified Boyle’s Law! Halving the volume doubled the collision density, exactly doubling the registered wall pressure.'
      }
    ],
    guidedSteps: [
      {
        stepNumber: 1,
        instruction: 'Observe the particles moving in random directions inside the box at 300 K.',
        actionRequired: 'Note the baseline pressure reading on the digital gauge.',
        scientificInsight: 'Pressure is created by countless individual collisions of gas molecules with the walls.'
      },
      {
        stepNumber: 2,
        instruction: 'Use the Temperature slider to increase temperature from 300 K to 600 K.',
        actionRequired: 'Observe both the particle speed and the live pressure gauge.',
        scientificInsight: 'Doubling absolute temperature doubles particle kinetic energy, doubling collision force and frequency.'
      },
      {
        stepNumber: 3,
        instruction: 'Drag the Volume piston inward to compress the gas container from 6.0 L to 3.0 L.',
        actionRequired: 'Watch how quickly wall collisions occur in the compressed space.',
        scientificInsight: 'When volume decreases, particles have less distance to travel between collisions, causing pressure to surge.'
      }
    ],
    defaultMode: 'explore',
    formulae: ['p = \\frac{F}{A}', 'p V = n R T', 'p_1 V_1 = p_2 V_2', '\\frac{p_1}{T_1} = \\frac{p_2}{T_2}'],
    tags: ['Thermal Physics', 'Kinetic Theory', 'Gas Laws', 'Boyle’s Law', 'Charles’s Law']
  },

  'chem-titration': {
    id: 'chem-titration',
    subjectId: 'chemistry',
    unitId: 'chem-u7',
    chapterId: 'chem-c7-1',
    title: 'Volumetric Acid-Base Titration & pH Curve',
    subtitle: 'Precision burette control, indicator colorimetric transition and equivalence curve',
    syllabusCode: '0620.7.1.1 / 0620.3.3.4',
    difficulty: 'Both',
    learningObjectives: [
      'Describe the use of volumetric apparatus: burette, pipette, conical flask.',
      'Explain the color transitions of acid-base indicators (phenolphthalein, methyl orange, universal indicator).',
      'Interpret titration curves to determine the neutralization equivalence point.',
      'Calculate the concentration of an unknown acid or base from experimental titre volumes.'
    ],
    scientificPrinciples: [
      'Neutralization reaction: H⁺(aq) + OH⁻(aq) → H₂O(l).',
      'Equivalence occurs when stoichiometric moles of acid equal moles of base: n(acid) = n(base).',
      'The pH scale is logarithmic: pH = -log₁₀[H⁺]. Near the equivalence point, pH changes drastically with a single drop.',
      'Indicators are weak acids that exhibit distinct conjugated base colors above specific pKa thresholds.'
    ],
    assumptions: [
      'Strong acid (HCl) reacting with strong base (NaOH).',
      'Room temperature 25°C, complete ionic dissociation.',
      'Drop volume calibrated to standard 0.05 cm³.'
    ],
    parameters: [
      {
        id: 'acidConcentration',
        name: 'Acid (HCl) Conc.',
        symbol: 'C_acid',
        unit: 'mol/dm³',
        min: 0.05,
        max: 0.50,
        step: 0.05,
        defaultValue: 0.10,
        description: 'Concentration of hydrochloric acid in conical flask.',
        category: 'primary'
      },
      {
        id: 'flaskVolume',
        name: 'Flask Acid Volume',
        symbol: 'V_acid',
        unit: 'cm³',
        min: 10,
        max: 50,
        step: 5,
        defaultValue: 25.0,
        description: 'Precise volume of acid pipetted into conical flask.',
        category: 'primary'
      },
      {
        id: 'baseConcentration',
        name: 'Burette Base (NaOH) Conc.',
        symbol: 'C_base',
        unit: 'mol/dm³',
        min: 0.05,
        max: 0.50,
        step: 0.05,
        defaultValue: 0.10,
        description: 'Standardized sodium hydroxide solution in burette.',
        category: 'primary'
      },
      {
        id: 'indicatorChoice',
        name: 'Indicator Type',
        symbol: 'Ind',
        unit: '',
        min: 0,
        max: 2,
        step: 1,
        defaultValue: 0, // 0 = Phenolphthalein, 1 = Methyl Orange, 2 = Universal Indicator
        description: 'Choice of color indicator.',
        category: 'secondary'
      }
    ],
    measurements: [
      { id: 'buretteReading', label: 'Burette Dispensed', symbol: 'V_titre', unit: 'cm³', precision: 2 },
      { id: 'phValue', label: 'Solution pH', symbol: 'pH', unit: '', precision: 2, formula: 'pH = -\\log_{10}[H^+]' },
      { id: 'equivalenceTitre', label: 'Expected Equivalence', symbol: 'V_eq', unit: 'cm³', precision: 2, formula: 'V_{eq} = \\frac{C_a V_a}{C_b}' },
      { id: 'solutionColor', label: 'Flask Color', unit: '', precision: 0 }
    ],
    challenges: [
      {
        id: 'chal-titr-1',
        title: 'Reach the Exact Neutralization End Point (pH 7.00 ± 0.3)',
        difficulty: 'Intermediate',
        description: 'Dispense base carefully drop-by-drop as you approach the steep vertical curve until the indicator changes color and pH reaches 7.0.',
        hint: 'As the pH starts rising above 3.5, switch the burette valve to Single Drop mode (0.05 cm³ per drop).',
        targetCriteria: { property: 'phValue', targetValue: 7.0, tolerance: 0.5, unit: 'pH' },
        explanationOnSuccess: 'Outstanding lab technique! You achieved the sharp equivalence end point where [H⁺] = [OH⁻].'
      }
    ],
    guidedSteps: [
      {
        stepNumber: 1,
        instruction: 'Inspect the conical flask containing 25.0 cm³ of 0.10 mol/dm³ HCl with Phenolphthalein.',
        actionRequired: 'Notice that in acidic solution (pH 1.0), phenolphthalein is completely colorless.',
        scientificInsight: 'The high concentration of H⁺ ions keeps the indicator in its un-ionized, colorless HIn form.'
      },
      {
        stepNumber: 2,
        instruction: 'Open the burette valve to Fast Flow (1.0 cm³/s) until ~22 cm³ has been added.',
        actionRequired: 'Observe pH steadily rising from 1.0 to ~2.5.',
        scientificInsight: 'Added OH⁻ ions neutralize H⁺ ions, but the excess acid still maintains low pH.'
      },
      {
        stepNumber: 3,
        instruction: 'Switch to Single Drop mode (0.05 cm³). Click drop-by-drop around 24.5 - 25.0 cm³.',
        actionRequired: 'Observe the instantaneous surge in pH from 3.5 up to 10.5 and the flash of pink.',
        scientificInsight: 'Because pH is logarithmic, neutralizing the final traces of H⁺ causes an explosive 7-unit pH jump.'
      }
    ],
    defaultMode: 'explore',
    formulae: ['n = c \\times V', 'C_1 V_1 = C_2 V_2', 'pH = -\\log_{10}[H^+]'],
    tags: ['Acids & Bases', 'Titration', 'pH Curve', 'Volumetric Analysis', 'Stoichiometry']
  },

  'bio-microscope': {
    id: 'bio-microscope',
    subjectId: 'biology',
    unitId: 'bio-u2',
    chapterId: 'bio-c2-1',
    title: 'Virtual Optical Microscope & Cell Cytology',
    subtitle: 'Compound lens magnification, coarse/fine focal depth, and organelle comparison',
    syllabusCode: '0610.2.1.1 / 0610.2.1.3',
    difficulty: 'Both',
    learningObjectives: [
      'Operate a compound optical microscope with 4x, 10x, and 40x objective lenses.',
      'Adjust coarse and fine focal planes to resolve cellular details.',
      'Identify and contrast structures in plant cells (cell wall, chloroplasts, large vacuole) and animal cells.',
      'Apply the magnification equation: Image size = Actual size × Magnification (I = A × M).'
    ],
    scientificPrinciples: [
      'Total Magnification = Eyepiece (10x) × Objective (4x, 10x, 40x). Maximum total 400x.',
      'Depth of field decreases at higher magnification, requiring fine micrometric focusing.',
      'Plant cells have rigid cellulose walls, chloroplasts for photosynthesis, and a permanent central sap vacuole; animal cells have only a flexible cell membrane and small temporary vacuoles.'
    ],
    assumptions: [
      'Standard 10x eyepiece magnification.',
      'Specimens stained with Iodine (plant onion epidermal cells) or Methylene Blue (animal cheek epithelial cells).'
    ],
    parameters: [
      {
        id: 'objectiveMagnification',
        name: 'Objective Lens',
        symbol: 'Obj',
        unit: 'x',
        min: 4,
        max: 40,
        step: 1, // 4, 10, 40
        defaultValue: 10,
        description: 'Turret nosepiece objective power: 4x (Scanning), 10x (Low power), 40x (High power).',
        category: 'primary'
      },
      {
        id: 'focalPosition',
        name: 'Focal Plane (Focus)',
        symbol: 'Z',
        unit: 'μm',
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 50,
        description: 'Stage height adjustment controlling optical focus sharpness.',
        category: 'primary'
      },
      {
        id: 'illumination',
        name: 'Substage Iris Diaphragm',
        symbol: 'Light',
        unit: '%',
        min: 20,
        max: 100,
        step: 5,
        defaultValue: 75,
        description: 'Condenser diaphragm controlling specimen contrast and illumination.',
        category: 'secondary'
      },
      {
        id: 'specimenType',
        name: 'Specimen Slide',
        symbol: 'Slide',
        unit: '',
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 0, // 0 = Onion Epidermal (Plant), 1 = Cheek Epithelial (Animal)
        description: 'Choice of prepared slide specimen.',
        category: 'secondary'
      }
    ],
    measurements: [
      { id: 'totalMagnification', label: 'Total Magnification', symbol: 'M', unit: 'x', precision: 0, formula: 'M = 10 \\times \\text{Objective}' },
      { id: 'fieldOfView', label: 'Field of View Diameter', symbol: 'FOV', unit: 'μm', precision: 0 },
      { id: 'focusSharpness', label: 'Image Sharpness', symbol: 'S', unit: '%', precision: 0 },
      { id: 'apparentSize', label: 'Apparent Cell Size', symbol: 'I', unit: 'mm', precision: 1 }
    ],
    challenges: [
      {
        id: 'chal-micro-1',
        title: 'Focus on High Power (40x) with >95% Sharpness',
        difficulty: 'Foundation',
        description: 'Switch to the 40x objective (Total 400x). Adjust the fine focus dial until the image clarity reaches at least 95%.',
        hint: 'High power has a very narrow focal plane around Z = 52 μm. Move the slider with micro precision.',
        targetCriteria: { property: 'focusSharpness', targetValue: 95, tolerance: 5, unit: '%' },
        explanationOnSuccess: 'Superb! You correctly focused at 400x magnification, revealing fine organelles like the nucleus and cell wall.'
      }
    ],
    guidedSteps: [
      {
        stepNumber: 1,
        instruction: 'Start on Low Power (4x objective) to locate the specimen field.',
        actionRequired: 'Note the wide field of view (~4500 μm) displaying dozens of cells.',
        scientificInsight: 'Always find the specimen on lowest power first before increasing magnification.'
      },
      {
        stepNumber: 2,
        instruction: 'Rotate to 10x and adjust coarse focus until cell boundaries appear sharp.',
        actionRequired: 'Identify the cell wall and distinct nucleus stained by iodine.',
        scientificInsight: 'Iodine reacts with starch and proteins to give cellular organelles high visual contrast.'
      },
      {
        stepNumber: 3,
        instruction: 'Switch specimen to Animal Cheek cells. Compare with plant cell structures.',
        actionRequired: 'Notice what is missing: animal cells lack a rigid cell wall and chloroplasts.',
        scientificInsight: 'Animal cells have only a thin flexible membrane, allowing versatile shapes and animal motility.'
      }
    ],
    defaultMode: 'explore',
    formulae: ['I = A \\times M', 'A = \\frac{I}{M}', 'M = \\text{Eyepiece} \\times \\text{Objective}'],
    tags: ['Microscopy', 'Cell Biology', 'Plant vs Animal', 'Magnification', 'Cytology']
  },

  'env-population-dynamics': {
    id: 'env-population-dynamics',
    subjectId: 'environmental',
    unitId: 'env-u8',
    chapterId: 'env-c8-1',
    title: 'Demographic Transition Model (DTM) & Population Simulator',
    subtitle: 'Birth rates, death rates, demographic transition stages 1–5, and population pyramids',
    syllabusCode: '0680.8.1.1 / 0680.8.1.2',
    difficulty: 'Both',
    learningObjectives: [
      'Describe and explain the five distinct stages of the Demographic Transition Model.',
      'Explain reasons for declining death rates (sanitation, healthcare, clean water) and birth rates (female education, family planning).',
      'Analyze age-sex population pyramids to determine youth dependency vs aging dependency.',
      'Calculate natural increase rate and total fertility impact over generational projections.'
    ],
    scientificPrinciples: [
      'Natural Increase = (Birth Rate - Death Rate) / 10 in % per year.',
      'Stage 1 (High Stationary): High birth rate & high death rate; stable small population.',
      'Stage 2 (Early Expanding): Death rate falls rapidly while birth rate remains high; population explosion.',
      'Stage 3 (Late Expanding): Birth rate falls; population growth slows.',
      'Stage 4 (Low Stationary): Low birth & death rates; stable large population.',
      'Stage 5 (Declining): Birth rate drops below death rate; aging shrinking population.'
    ],
    assumptions: [
      'Closed national population model (net migration assumed negligible for core demographic curve).',
      'Standard demographic cohorts: Youth (0–14), Working Age (15–64), Elderly (65+).'
    ],
    parameters: [
      {
        id: 'birthRate',
        name: 'Crude Birth Rate (CBR)',
        symbol: 'CBR',
        unit: 'per 1000',
        min: 8,
        max: 50,
        step: 1,
        defaultValue: 38,
        description: 'Number of live births per 1,000 population per year.',
        category: 'primary'
      },
      {
        id: 'deathRate',
        name: 'Crude Death Rate (CDR)',
        symbol: 'CDR',
        unit: 'per 1000',
        min: 6,
        max: 45,
        step: 1,
        defaultValue: 15,
        description: 'Number of deaths per 1,000 population per year.',
        category: 'primary'
      },
      {
        id: 'healthcareAccess',
        name: 'Healthcare & Sanitation',
        symbol: 'Health',
        unit: '%',
        min: 10,
        max: 100,
        step: 5,
        defaultValue: 45,
        description: 'Access to vaccines, clean drinking water, and maternal clinics.',
        category: 'secondary'
      },
      {
        id: 'femaleEducation',
        name: 'Female Literacy & Opportunities',
        symbol: 'Edu',
        unit: '%',
        min: 10,
        max: 100,
        step: 5,
        defaultValue: 40,
        description: 'Female educational attainment correlating with family planning and delayed motherhood.',
        category: 'secondary'
      }
    ],
    measurements: [
      { id: 'naturalIncrease', label: 'Rate of Natural Increase', symbol: 'RNI', unit: '%/yr', precision: 2, formula: 'RNI = \\frac{CBR - CDR}{10}' },
      { id: 'dtmStage', label: 'Classified DTM Stage', symbol: 'Stage', unit: '', precision: 0 },
      { id: 'dependencyRatio', label: 'Total Dependency Ratio', symbol: 'DR', unit: '%', precision: 1 },
      { id: 'doublingTime', label: 'Population Doubling Time', symbol: 'T_d', unit: 'years', precision: 0, formula: 'T_d = \\frac{70}{RNI}' }
    ],
    challenges: [
      {
        id: 'chal-env-1',
        title: 'Model a Stage 4 (Low Stationary) Developed Nation',
        difficulty: 'Intermediate',
        description: 'Adjust the birth rate and death rate parameters to achieve a balanced Stage 4 country with Natural Increase under 0.3% per year.',
        hint: 'In Stage 4, both birth rate and death rate stabilize at low levels (typically CBR ~ 10-12, CDR ~ 9-11).',
        targetCriteria: { property: 'naturalIncrease', targetValue: 0.2, tolerance: 0.2, unit: '%/yr' },
        explanationOnSuccess: 'Well done! You successfully modelled Stage 4 (e.g. UK, Germany), showing low fertility balanced by low mortality.'
      }
    ],
    guidedSteps: [
      {
        stepNumber: 1,
        instruction: 'Examine the baseline settings representing Stage 2 (Early Expanding).',
        actionRequired: 'Observe the wide-base triangular population pyramid indicating high youth dependency.',
        scientificInsight: 'Stage 2 features rapid medical death rate declines while cultural birth rates remain high, driving exponential growth.'
      },
      {
        stepNumber: 2,
        instruction: 'Increase Female Literacy & Opportunities from 40% to 85%.',
        actionRequired: 'Watch how the birth rate drops and the pyramid transitions into a beehive shape (Stage 3).',
        scientificInsight: 'Empowering women with education and career access is the most effective driver of demographic stabilization.'
      }
    ],
    defaultMode: 'explore',
    formulae: ['\\text{Natural Increase} = \\frac{\\text{CBR} - \\text{CDR}}{10}', '\\text{Dependency Ratio} = \\frac{\\text{Youth} + \\text{Elderly}}{\\text{Workers}} \\times 100'],
    tags: ['Demography', 'Population Pyramids', 'DTM Stages', 'Sustainability', 'Human Geography']
  },

  'math-dynamic-grapher': {
    id: 'math-dynamic-grapher',
    subjectId: 'mathematics',
    unitId: 'math-u2',
    chapterId: 'math-c2-3',
    title: 'Dynamic Function Grapher & Tangent Slopes',
    subtitle: 'Coordinate axes, algebraic transformations, turning points, and instantaneous gradient tangents',
    syllabusCode: '0580.2.3.1 / 0580.2.3.4',
    difficulty: 'Both',
    learningObjectives: [
      'Draw and interpret graphs of linear (y = mx + c), quadratic (y = ax² + bx + c), and reciprocal (y = k/x) functions.',
      'Identify key features: y-intercept, roots (x-intercepts), and turning points (vertices).',
      'Estimate the instantaneous gradient of a curve at a given point by constructing a tangent line.',
      'Explain that the gradient of a curve is zero at a turning point (local maximum or minimum).'
    ],
    scientificPrinciples: [
      'A straight line has constant gradient: m = (y2 - y1) / (x2 - x1).',
      'A tangent to a curve touches the curve at exactly one local point without crossing it locally; its slope equals the instantaneous rate of change.',
      'For a quadratic y = ax² + bx + c, the axis of symmetry is x = -b / (2a), and gradient at vertex is 0.'
    ],
    assumptions: [
      'Cartesian coordinate plane with equal scale x and y axes [-10, 10].'
    ],
    parameters: [
      {
        id: 'functionType',
        name: 'Function Family',
        symbol: 'f(x)',
        unit: '',
        min: 0,
        max: 2,
        step: 1,
        defaultValue: 1, // 0 = Linear, 1 = Quadratic, 2 = Reciprocal
        description: 'Type of algebraic curve.',
        category: 'primary'
      },
      {
        id: 'coeffA',
        name: 'Coefficient a (Curvature/Slope)',
        symbol: 'a',
        unit: '',
        min: -3,
        max: 3,
        step: 0.5,
        defaultValue: 1,
        description: 'Quadratic term or linear gradient multiplier.',
        category: 'primary'
      },
      {
        id: 'coeffB',
        name: 'Coefficient b (Shift)',
        symbol: 'b',
        unit: '',
        min: -6,
        max: 6,
        step: 0.5,
        defaultValue: -2,
        description: 'Linear coefficient shifting the vertex.',
        category: 'primary'
      },
      {
        id: 'coeffC',
        name: 'Constant c (y-intercept)',
        symbol: 'c',
        unit: '',
        min: -8,
        max: 8,
        step: 0.5,
        defaultValue: -3,
        description: 'Vertical translation where curve crosses y-axis.',
        category: 'primary'
      },
      {
        id: 'tangentX',
        name: 'Tangent Point X-Coordinate',
        symbol: 'x_0',
        unit: '',
        min: -5,
        max: 5,
        step: 0.2,
        defaultValue: 1.0,
        description: 'Position on curve where the tangent line is drawn.',
        category: 'secondary'
      }
    ],
    measurements: [
      { id: 'tangentGradient', label: 'Instantaneous Tangent Slope', symbol: 'm_{tan}', unit: '', precision: 2, formula: 'm = 2ax + b' },
      { id: 'pointY', label: 'Point Coordinates (x, y)', symbol: '(x_0, y_0)', unit: '', precision: 2 },
      { id: 'turningPoint', label: 'Turning Point (Vertex)', symbol: '(h, k)', unit: '', precision: 2 },
      { id: 'yIntercept', label: 'Y-Intercept', symbol: '(0, c)', unit: '', precision: 1 }
    ],
    challenges: [
      {
        id: 'chal-math-1',
        title: 'Find the Stationary Point (Gradient = 0.00)',
        difficulty: 'Intermediate',
        description: 'For the quadratic curve y = x² - 2x - 3, move the tangent point slider x_0 until the tangent slope is exactly 0.00.',
        hint: 'The tangent is horizontal at the vertex: x = -b / (2a) = -(-2) / (2 * 1) = 1.0.',
        targetCriteria: { property: 'tangentGradient', targetValue: 0.0, tolerance: 0.05, unit: '' },
        explanationOnSuccess: 'Spot on! At x = 1.0, the parabola reaches its minimum turning point, where the tangent gradient is zero.'
      }
    ],
    guidedSteps: [
      {
        stepNumber: 1,
        instruction: 'Select Quadratic Function y = x² - 2x - 3.',
        actionRequired: 'Note the U-shaped parabola crossing the y-axis at (0, -3).',
        scientificInsight: 'Because a > 0, the parabola opens upwards with a minimum turning point.'
      },
      {
        stepNumber: 2,
        instruction: 'Slide the Tangent Point x_0 from -3 to +3.',
        actionRequired: 'Observe the tangent line tilting: negative gradient on the left, zero at vertex, positive on the right.',
        scientificInsight: 'The slope of the tangent represents the instantaneous derivative dy/dx = 2ax + b.'
      }
    ],
    defaultMode: 'explore',
    formulae: ['y = m x + c', 'y = a x^2 + b x + c', 'm_{\\text{tangent}} = 2 a x + b', 'x_{\\text{vertex}} = -\\frac{b}{2a}'],
    tags: ['Coordinate Geometry', 'Algebraic Graphs', 'Quadratic', 'Tangent Gradient', 'Calculus Prep']
  },

  'cs-logic-gates': {
    id: 'cs-logic-gates',
    subjectId: 'computerscience',
    unitId: 'cs-u10',
    chapterId: 'cs-c10-1',
    title: 'Interactive Logic Gate Breadboard & Truth Table Verifier',
    subtitle: 'Standard logic gates (AND, OR, NOT, NAND, NOR, XOR), digital signal wiring, and truth tables',
    syllabusCode: '0478.10.1.1 / 0478.10.2.1',
    difficulty: 'Both',
    learningObjectives: [
      'Identify and use standard logic gate symbols: NOT, AND, OR, NAND, NOR, XOR.',
      'Understand binary logic levels: High (1 / True / 5V) and Low (0 / False / 0V).',
      'Trace digital signals through multi-stage combinational circuits.',
      'Construct and automatically verify complete truth tables for arbitrary gate configurations.'
    ],
    scientificPrinciples: [
      'NOT gate inverts input: Q = NOT A.',
      'AND gate outputs 1 only if BOTH inputs are 1: Q = A AND B.',
      'OR gate outputs 1 if AT LEAST ONE input is 1: Q = A OR B.',
      'NAND gate outputs 0 only if both inputs are 1: Q = NOT(A AND B).',
      'NOR gate outputs 1 only if both inputs are 0: Q = NOT(A OR B).',
      'XOR gate outputs 1 if inputs are DIFFERENT: Q = A XOR B.'
    ],
    assumptions: [
      'Ideal digital logic without propagation delay or gate fan-out attenuation.'
    ],
    parameters: [
      {
        id: 'inputA',
        name: 'Input Switch A',
        symbol: 'A',
        unit: '',
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 0,
        description: 'Binary state of Input A (0 = OFF, 1 = ON).',
        category: 'primary'
      },
      {
        id: 'inputB',
        name: 'Input Switch B',
        symbol: 'B',
        unit: '',
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 0,
        description: 'Binary state of Input B (0 = OFF, 1 = ON).',
        category: 'primary'
      },
      {
        id: 'gateType1',
        name: 'Gate 1 Selection',
        symbol: 'Gate 1',
        unit: '',
        min: 0,
        max: 5,
        step: 1,
        defaultValue: 0, // 0 = AND, 1 = OR, 2 = NOT, 3 = NAND, 4 = NOR, 5 = XOR
        description: 'Primary logic gate connected to inputs A and B.',
        category: 'primary'
      },
      {
        id: 'enableInverter',
        name: 'Output Inverter (NOT)',
        symbol: 'NOT',
        unit: '',
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 0,
        description: 'Optional subsequent NOT gate connected to output.',
        category: 'secondary'
      }
    ],
    measurements: [
      { id: 'outputQ', label: 'Circuit Output Q', symbol: 'Q', unit: '', precision: 0 },
      { id: 'intermediateState', label: 'Gate 1 Intermediate', symbol: 'X', unit: '', precision: 0 },
      { id: 'booleanExpression', label: 'Boolean Expression', symbol: 'Expr', unit: '', precision: 0 },
      { id: 'activeSignalPath', label: 'Signal Status', unit: '', precision: 0 }
    ],
    challenges: [
      {
        id: 'chal-cs-1',
        title: 'Construct an XOR Equivalent using NAND Logic',
        difficulty: 'Advanced',
        description: 'Configure the gates so that Output Q is HIGH (1) when A and B are DIFFERENT (A=1,B=0 or A=0,B=1), but LOW (0) when both are identical.',
        hint: 'Select the XOR gate directly or investigate how universal NAND/NOR configurations synthesize the exclusive-OR relation.',
        targetCriteria: { property: 'outputQ', targetValue: 1, tolerance: 0, unit: '' },
        explanationOnSuccess: 'Superb! XOR is fundamental to computer arithmetic—it forms the Half Adder sum bit!'
      }
    ],
    guidedSteps: [
      {
        stepNumber: 1,
        instruction: 'Select Gate 1 as AND. Toggle Input A and Input B to 1.',
        actionRequired: 'Observe the output LED light up green (1).',
        scientificInsight: 'An AND gate acts as two switches in series; both must close to conduct power.'
      },
      {
        stepNumber: 2,
        instruction: 'Switch Gate 1 to XOR. Set A = 1 and B = 1.',
        actionRequired: 'Notice that Output Q drops to 0 (OFF).',
        scientificInsight: 'Unlike an inclusive OR, XOR requires one OR the other, but NOT both.'
      }
    ],
    defaultMode: 'explore',
    formulae: ['Q = A \\cdot B', 'Q = A + B', 'Q = \\overline{A}', 'Q = \\overline{A \\cdot B}', 'Q = A \\oplus B'],
    tags: ['Boolean Logic', 'Logic Gates', 'Truth Tables', 'Digital Electronics', 'Computer Architecture']
  }
};

// Each catalog entry has its own syllabus topic, metadata and route. The seven
// hand-built labs below take precedence where a richer dedicated component exists.
export const SIMULATIONS_REGISTRY: Record<string, SimulationMetadata> = {
  ...buildSimulationCatalog(),
  ...EXISTING_SIMULATIONS,
};

