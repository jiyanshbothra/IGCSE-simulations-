import { SubjectCurriculum } from '../types/curriculum';

export const CURRICULUM_DATA: Record<string, SubjectCurriculum> = {
  physics: {
    subjectId: 'physics',
    subjectName: 'Cambridge IGCSE Physics Pure',
    syllabusCode: '0625',
    syllabusPeriod: '2023–2026',
    units: [
      {
        id: 'phys-u1',
        number: 1,
        title: 'Motion, Forces and Energy',
        description: 'Physical quantities, kinematics, dynamics, Hooke’s law, moments, momentum, energy conservation, pressure.',
        chapters: [
          {
            id: 'phys-c1-1',
            number: '1.1',
            title: 'Physical Quantities & Measurement Techniques',
            description: 'Units, vernier calipers, micrometer screw gauge, pendulum period oscillation.',
            concepts: [
              {
                id: 'phys-conc-1-1-1',
                title: 'Vernier Caliper & Micrometer Gauging',
                description: 'Measure small lengths with high precision using sliding vernier scales and screw gauges.',
                learningObjectives: [
                  {
                    id: 'obj-phys-1-1-1',
                    code: '0625.1.1.1',
                    description: 'Demonstrate an understanding of how to measure length, volume and time intervals using appropriate instruments.',
                    tier: 'core',
                    simulationType: 'virtual_experiment',
                    verifiedStatus: 'verified',
                  }
                ],
                keyEquations: ['\\text{Volume of cylinder} = \\pi r^2 h'],
              }
            ]
          },
          {
            id: 'phys-c1-2',
            number: '1.2',
            title: 'Motion & Kinematics',
            description: 'Speed, velocity, acceleration, distance-time graphs, speed-time graphs, acceleration of free fall.',
            concepts: [
              {
                id: 'phys-conc-1-2-1',
                title: 'Kinematic Acceleration & Travel Graphs',
                description: 'Investigate displacement, velocity and uniform acceleration with real-time gradient and area calculations.',
                simulationId: 'phys-motion-track',
                learningObjectives: [
                  {
                    id: 'obj-phys-1-2-1',
                    code: '0625.1.2.1',
                    description: 'Plot and interpret distance–time and speed–time graphs to find speed, acceleration and distance travelled.',
                    tier: 'both',
                    simulationType: 'full_simulation',
                    verifiedStatus: 'verified',
                  }
                ],
                keyEquations: ['v = \\frac{\\Delta s}{\\Delta t}', 'a = \\frac{v - u}{t}', '\\text{Distance} = \\text{Area under } v-t \\text{ graph}'],
              }
            ]
          },
          {
            id: 'phys-c1-5',
            number: '1.5',
            title: 'Forces & Hooke’s Law',
            description: 'Resultant forces, Newton’s laws, friction, elastic deformation, spring balance, moments.',
            concepts: [
              {
                id: 'phys-conc-1-5-3',
                title: 'Hooke’s Law & Spring Elasticity',
                description: 'Investigate force vs extension, spring constant k, and the limit of proportionality.',
                simulationId: 'phys-hookes-law',
                learningObjectives: [
                  {
                    id: 'obj-phys-1-5-3',
                    code: '0625.1.5.3',
                    description: 'State Hooke’s law and recall and use the equation F = kΔx.',
                    tier: 'both',
                    simulationType: 'full_simulation',
                    verifiedStatus: 'verified',
                  }
                ],
                keyEquations: ['F = k \\Delta x'],
              }
            ]
          }
        ]
      },
      {
        id: 'phys-u2',
        number: 2,
        title: 'Thermal Physics',
        description: 'Kinetic particle model of matter, thermal properties, temperature, specific heat capacity, latent heat, conduction, convection, radiation, and gas laws.',
        chapters: [
          {
            id: 'phys-c2-1',
            number: '2.1',
            title: 'Kinetic Particle Model & Gas Laws',
            description: 'States of matter, Brownian motion, particle velocity, gas pressure, Boyle’s Law, Charles’s Law.',
            concepts: [
              {
                id: 'phys-conc-2-1-1',
                title: 'Ideal Gas Laws & Kinetic Particle Dynamics',
                description: 'Explore the relationship between pressure, volume, and temperature at the microscopic molecular level with live collisions and pressure gauges.',
                simulationId: 'phys-gas-laws',
                learningObjectives: [
                  {
                    id: 'obj-phys-2-1-1',
                    code: '0625.2.1.3',
                    description: 'Describe qualitatively the pressure of a gas in terms of the motion of its particles and their collisions with the container walls.',
                    tier: 'both',
                    simulationType: 'full_simulation',
                    verifiedStatus: 'verified',
                  },
                  {
                    id: 'obj-phys-2-1-2',
                    code: '0625.2.1.4',
                    description: 'Recall and use Boyle’s Law p1V1 = p2V2 and describe the relationship between temperature and pressure at constant volume.',
                    tier: 'supplement',
                    simulationType: 'full_simulation',
                    verifiedStatus: 'verified',
                  }
                ],
                keyEquations: ['p_1 V_1 = p_2 V_2', '\\frac{p_1}{T_1} = \\frac{p_2}{T_2}', 'pV = nRT'],
                keyTerms: ['Pressure', 'Absolute Zero (0 K = -273°C)', 'Maxwell-Boltzmann Velocity', 'Molecular Collision']
              }
            ]
          },
          {
            id: 'phys-c2-2',
            number: '2.2',
            title: 'Thermal Properties & Temperature',
            description: 'Thermal expansion, specific heat capacity, melting, boiling, evaporation and specific latent heat.',
            concepts: [
              {
                id: 'phys-conc-2-2-2',
                title: 'Specific Heat Capacity & Calorimetry',
                description: 'Measure thermal energy absorption, temperature change, and heat capacities of water, copper, and iron.',
                simulationId: 'phys-specific-heat',
                learningObjectives: [
                  {
                    id: 'obj-phys-2-2-2',
                    code: '0625.2.2.2',
                    description: 'Recall and use the equation ΔE = mcΔθ to calculate specific heat capacity.',
                    tier: 'supplement',
                    simulationType: 'virtual_experiment',
                    verifiedStatus: 'verified',
                  }
                ],
                keyEquations: ['\\Delta E = m c \\Delta \\theta', 'P = \\frac{\\Delta E}{t} = IV'],
              }
            ]
          }
        ]
      },
      {
        id: 'phys-u4',
        number: 4,
        title: 'Electricity and Magnetism',
        description: 'Electric charge, current, electromotive force, resistance, Ohm’s law, series and parallel circuits, electromagnetic effects.',
        chapters: [
          {
            id: 'phys-c4-2',
            number: '4.2',
            title: 'Electric Circuits & Ohm’s Law',
            description: 'Circuit diagrams, ammeters, voltmeters, series vs parallel voltage and current division, component characteristics.',
            concepts: [
              {
                id: 'phys-conc-4-2-1',
                title: 'Virtual Circuit Breadboard & Ohm’s Law',
                description: 'Build series and parallel circuits with batteries, variable resistors, lamps, and digital multimeters.',
                simulationId: 'phys-circuits',
                learningObjectives: [
                  {
                    id: 'obj-phys-4-2-1',
                    code: '0625.4.2.4',
                    description: 'Recall and use the equation V = IR to determine potential difference, current and resistance.',
                    tier: 'both',
                    simulationType: 'full_simulation',
                    verifiedStatus: 'verified',
                  },
                  {
                    id: 'obj-phys-4-2-2',
                    code: '0625.4.3.2',
                    description: 'Determine the combined resistance of resistors in series (R = R1 + R2) and parallel (1/R = 1/R1 + 1/R2).',
                    tier: 'both',
                    simulationType: 'full_simulation',
                    verifiedStatus: 'verified',
                  }
                ],
                keyEquations: ['V = IR', 'P = IV = I^2 R', 'R_{\\text{series}} = R_1 + R_2', '\\frac{1}{R_{\\text{parallel}}} = \\frac{1}{R_1} + \\frac{1}{R_2}'],
              }
            ]
          }
        ]
      },
      {
        id: 'phys-u6',
        number: 6,
        title: 'Space Physics',
        description: 'The Earth, the Solar System, orbital speed, stellar evolution, and cosmic expansion.',
        chapters: [
          {
            id: 'phys-c6-1',
            number: '6.1',
            title: 'The Earth & Planetary Orbits',
            description: 'Gravitational attraction, planetary orbital mechanics, seasons, day and night.',
            concepts: [
              {
                id: 'phys-conc-6-1-1',
                title: 'Planetary Orbits & Keplerian Gravitation',
                description: 'Model orbital period, radius, speed v = 2πr/T, and gravitational field variations.',
                simulationId: 'phys-orbits',
                learningObjectives: [
                  {
                    id: 'obj-phys-6-1-1',
                    code: '0625.6.1.1',
                    description: 'Recall and use the orbital speed equation v = 2πr / T.',
                    tier: 'supplement',
                    simulationType: 'full_simulation',
                    verifiedStatus: 'verified',
                  }
                ],
                keyEquations: ['v = \\frac{2\\pi r}{T}'],
              }
            ]
          }
        ]
      }
    ]
  },
  chemistry: {
    subjectId: 'chemistry',
    subjectName: 'Cambridge IGCSE Chemistry Pure',
    syllabusCode: '0620',
    syllabusPeriod: '2023–2026',
    units: [
      {
        id: 'chem-u1',
        number: 1,
        title: 'States of Matter & Kinetic Particle Theory',
        description: 'Solid, liquid, gas molecular arrangements, changes of state, heating/cooling curves, gas diffusion.',
        chapters: [
          {
            id: 'chem-c1-1',
            number: '1.1',
            title: 'States of Matter & Diffusion',
            description: 'Particle motion, temperature dependence, Graham’s diffusion rate.',
            concepts: [
              {
                id: 'chem-conc-1-1-1',
                title: 'States of Matter & Molecular Phase Change',
                description: 'Explore inter-particle forces and thermal kinetic agitation across melting, boiling, and sublimation.',
                simulationId: 'chem-states-matter',
                learningObjectives: [
                  {
                    id: 'obj-chem-1-1-1',
                    code: '0620.1.1.1',
                    description: 'Describe the states of matter and their interconversions in terms of kinetic particle theory.',
                    tier: 'both',
                    simulationType: 'full_simulation',
                    verifiedStatus: 'verified',
                  }
                ],
              }
            ]
          }
        ]
      },
      {
        id: 'chem-u6',
        number: 6,
        title: 'Chemical Reactions & Kinetics',
        description: 'Collision theory, factors affecting reaction rates, gas volume collection, equilibrium, redox.',
        chapters: [
          {
            id: 'chem-c6-2',
            number: '6.2',
            title: 'Rates of Reaction & Collision Theory',
            description: 'Investigate the effect of concentration, temperature, surface area, and catalysts on reaction speed.',
            concepts: [
              {
                id: 'chem-conc-6-2-1',
                title: 'Reaction Rates & Gas Syringe Dynamometer',
                description: 'Measure calcium carbonate + HCl acid reaction rates, collecting CO2 gas over time under varying temperature and particle surface areas.',
                simulationId: 'chem-reaction-rates',
                learningObjectives: [
                  {
                    id: 'obj-chem-6-2-1',
                    code: '0620.6.2.1',
                    description: 'Describe and explain the effects of temperature, concentration, surface area and catalysts on the rate of reaction using collision theory.',
                    tier: 'both',
                    simulationType: 'full_simulation',
                    verifiedStatus: 'verified',
                  }
                ],
                keyEquations: ['\\text{Rate} = \\frac{\\Delta \\text{Volume of Gas}}{\\Delta t}'],
              }
            ]
          }
        ]
      },
      {
        id: 'chem-u7',
        number: 7,
        title: 'Acids, Bases and Salts',
        description: 'The pH scale, proton donor/acceptor behavior, indicators, neutralization titrations, salt preparation.',
        chapters: [
          {
            id: 'chem-c7-1',
            number: '7.1',
            title: 'Acid-Base Titration & pH Scale',
            description: 'Burette volumetric analysis, universal indicator, phenolphthalein color shifts, equivalence points.',
            concepts: [
              {
                id: 'chem-conc-7-1-1',
                title: 'Volumetric Acid-Base Titration & pH Curve',
                description: 'Control a precision burette drop valve to titrate standard sodium hydroxide against hydrochloric acid with real-time pH and indicator colorimetry.',
                simulationId: 'chem-titration',
                learningObjectives: [
                  {
                    id: 'obj-chem-7-1-1',
                    code: '0620.7.1.1',
                    description: 'Describe the characteristic properties of acids and bases, the pH scale, and the use of indicators in volumetric acid-base titrations.',
                    tier: 'both',
                    simulationType: 'full_simulation',
                    verifiedStatus: 'verified',
                  },
                  {
                    id: 'obj-chem-7-1-2',
                    code: '0620.3.3.4',
                    description: 'Calculate unknown solution concentration from titration volumetric data using n = c × V.',
                    tier: 'supplement',
                    simulationType: 'full_simulation',
                    verifiedStatus: 'verified',
                  }
                ],
                keyEquations: ['n = c \\times V', 'HCl + NaOH \\rightarrow NaCl + H_2O', 'pH = -\\log_{10}[H^+]'],
                keyTerms: ['Equivalence Point', 'Titre', 'Meniscus', 'Indicator', 'End Point']
              }
            ]
          }
        ]
      }
    ]
  },
  biology: {
    subjectId: 'biology',
    subjectName: 'Cambridge IGCSE Biology Pure',
    syllabusCode: '0610',
    syllabusPeriod: '2023–2026',
    units: [
      {
        id: 'bio-u2',
        number: 2,
        title: 'Organisation of the Organism',
        description: 'Cell structure, magnification calculations, organelle functions, plant vs animal cell comparison.',
        chapters: [
          {
            id: 'bio-c2-1',
            number: '2.1',
            title: 'Cell Structure & Virtual Microscopy',
            description: 'Light microscopy, coarse/fine focus, stage micrometer, magnification formula.',
            concepts: [
              {
                id: 'bio-conc-2-1-1',
                title: 'Virtual Optical Microscope & Cell Cytology',
                description: 'Operate a laboratory compound microscope with 4x, 10x, 40x objectives, stage controls, and focus adjustments to examine plant and animal cells.',
                simulationId: 'bio-microscope',
                learningObjectives: [
                  {
                    id: 'obj-bio-2-1-1',
                    code: '0610.2.1.1',
                    description: 'Identify and describe the structure of plant and animal cells as seen under a light microscope.',
                    tier: 'both',
                    simulationType: 'full_simulation',
                    verifiedStatus: 'verified',
                  },
                  {
                    id: 'obj-bio-2-1-2',
                    code: '0610.2.1.3',
                    description: 'Recall and use the magnification formula: Image size = Actual size × Magnification (I = A × M).',
                    tier: 'both',
                    simulationType: 'full_simulation',
                    verifiedStatus: 'verified',
                  }
                ],
                keyEquations: ['I = A \\times M', 'A = \\frac{I}{M}', 'M = \\frac{I}{A}'],
                keyTerms: ['Chloroplast', 'Vacuole', 'Cell Wall', 'Mitochondria', 'Nucleus', 'Eyepiece Graticule']
              }
            ]
          }
        ]
      },
      {
        id: 'bio-u3',
        number: 3,
        title: 'Movement Into and Out of Cells',
        description: 'Diffusion, osmosis, water potential, active transport, turgor pressure and plasmolysis.',
        chapters: [
          {
            id: 'bio-c3-2',
            number: '3.2',
            title: 'Osmosis & Water Potential',
            description: 'Investigation of potato tissue in sucrose solutions, semi-permeable membranes.',
            concepts: [
              {
                id: 'bio-conc-3-2-1',
                title: 'Osmosis & Plant Cell Water Potential',
                description: 'Observe water molecule flux across selectively permeable membranes under varying sucrose gradients.',
                simulationId: 'bio-osmosis',
                learningObjectives: [
                  {
                    id: 'obj-bio-3-2-1',
                    code: '0610.3.2.1',
                    description: 'Describe osmosis as the net movement of water molecules from a region of higher water potential to lower water potential through a partially permeable membrane.',
                    tier: 'both',
                    simulationType: 'full_simulation',
                    verifiedStatus: 'verified',
                  }
                ],
                keyEquations: ['\\% \\text{ Change in Mass} = \\frac{\\text{Final Mass} - \\text{Initial Mass}}{\\text{Initial Mass}} \\times 100'],
              }
            ]
          }
        ]
      }
    ]
  },
  environmental: {
    subjectId: 'environmental',
    subjectName: 'Cambridge IGCSE Environmental Management',
    syllabusCode: '0680',
    syllabusPeriod: '2024–2026',
    units: [
      {
        id: 'env-u8',
        number: 8,
        title: 'Human Population',
        description: 'Population dynamics, birth and death rates, demographic transition model, population pyramids, resource pressure.',
        chapters: [
          {
            id: 'env-c8-1',
            number: '8.1',
            title: 'Demographic Transition & Population Pyramids',
            description: 'The 5 stages of the Demographic Transition Model (DTM), dependency ratios, fertility trends.',
            concepts: [
              {
                id: 'env-conc-8-1-1',
                title: 'Demographic Transition Model (DTM) & Population Simulator',
                description: 'Manipulate birth rate, death rate, healthcare, and economic factors to simulate national population projections, age-sex pyramids, and carrying capacity.',
                simulationId: 'env-population-dynamics',
                learningObjectives: [
                  {
                    id: 'obj-env-8-1-1',
                    code: '0680.8.1.1',
                    description: 'Describe and explain the stages of the Demographic Transition Model and construct and interpret population pyramids.',
                    tier: 'both',
                    simulationType: 'full_simulation',
                    verifiedStatus: 'verified',
                  },
                  {
                    id: 'obj-env-8-1-2',
                    code: '0680.8.1.2',
                    description: 'Calculate natural increase and dependency ratio from demographic data.',
                    tier: 'both',
                    simulationType: 'full_simulation',
                    verifiedStatus: 'verified',
                  }
                ],
                keyEquations: ['\\text{Natural Increase Rate} = \\text{Birth Rate} - \\text{Death Rate}', '\\text{Dependency Ratio} = \\frac{\\text{Population } 0-14 + 65+}{\\text{Working Population } 15-64} \\times 100'],
                keyTerms: ['Stage 1: High Stationary', 'Stage 2: Early Expanding', 'Stage 3: Late Expanding', 'Stage 4: Low Stationary', 'Stage 5: Declining']
              }
            ]
          }
        ]
      }
    ]
  },
  mathematics: {
    subjectId: 'mathematics',
    subjectName: 'Cambridge IGCSE Mathematics Pure',
    syllabusCode: '0580',
    syllabusPeriod: '2025–2027',
    units: [
      {
        id: 'math-u2',
        number: 2,
        title: 'Algebra and Graphs',
        description: 'Linear, quadratic, cubic, reciprocal and exponential graphs; tangents and gradients; simultaneous equations.',
        chapters: [
          {
            id: 'math-c2-3',
            number: '2.3',
            title: 'Dynamic Function Grapher & Tangent Slopes',
            description: 'Explore equations y = mx + c, parabolas y = ax^2 + bx + c, turning points, roots, and tangent gradients.',
            concepts: [
              {
                id: 'math-conc-2-3-1',
                title: 'Dynamic Function Grapher & Instantaneous Tangent Gradient',
                description: 'Plot mathematical equations in real time, slide a tangent point along curves to observe instantaneous gradients and turning points.',
                simulationId: 'math-dynamic-grapher',
                learningObjectives: [
                  {
                    id: 'obj-math-2-3-1',
                    code: '0580.2.3.1',
                    description: 'Draw and interpret graphs of linear, quadratic, cubic and reciprocal functions.',
                    tier: 'both',
                    simulationType: 'full_simulation',
                    verifiedStatus: 'verified',
                  },
                  {
                    id: 'obj-math-2-3-2',
                    code: '0580.2.3.4',
                    description: 'Estimate the gradient of a curve at a given point by drawing a tangent.',
                    tier: 'supplement',
                    simulationType: 'full_simulation',
                    verifiedStatus: 'verified',
                  }
                ],
                keyEquations: ['y = mx + c', 'y = ax^2 + bx + c', 'm = \\frac{\\Delta y}{\\Delta x}'],
                keyTerms: ['Gradient', 'Y-Intercept', 'Turning Point (Vertex)', 'Roots (Solutions)', 'Tangent']
              }
            ]
          }
        ]
      }
    ]
  },
  computerscience: {
    subjectId: 'computerscience',
    subjectName: 'Cambridge IGCSE Computer Science',
    syllabusCode: '0478',
    syllabusPeriod: '2023–2026',
    units: [
      {
        id: 'cs-u10',
        number: 10,
        title: 'Boolean Logic',
        description: 'Logic gates (AND, OR, NOT, NAND, NOR, XOR), truth tables, logic circuits, and Boolean algebra.',
        chapters: [
          {
            id: 'cs-c10-1',
            number: '10.1',
            title: 'Logic Gates & Digital Circuit Breadboard',
            description: 'Construct combinational circuits using standard logic gates, trace input/output states, auto-generate truth tables.',
            concepts: [
              {
                id: 'cs-conc-10-1-1',
                title: 'Interactive Logic Gate Breadboard & Truth Table Verifier',
                description: 'Drag and drop standard logic gates (AND, OR, NOT, NAND, NOR, XOR), wire digital inputs (0/1), and verify truth table logic in real time.',
                simulationId: 'cs-logic-gates',
                learningObjectives: [
                  {
                    id: 'obj-cs-10-1-1',
                    code: '0478.10.1.1',
                    description: 'Identify and use the standard logic gate symbols: NOT, AND, OR, NAND, NOR, XOR.',
                    tier: 'both',
                    simulationType: 'full_simulation',
                    verifiedStatus: 'verified',
                  },
                  {
                    id: 'obj-cs-10-1-2',
                    code: '0478.10.2.1',
                    description: 'Construct the truth table for given logic circuits and problem statements.',
                    tier: 'both',
                    simulationType: 'full_simulation',
                    verifiedStatus: 'verified',
                  }
                ],
                keyEquations: ['A \\cdot B', 'A + B', '\\overline{A}', '\\overline{A \\cdot B}', 'A \\oplus B'],
                keyTerms: ['Truth Table', 'High (1) / Low (0)', 'Combinational Logic', 'Boolean Expression']
              }
            ]
          }
        ]
      }
    ]
  }
};
