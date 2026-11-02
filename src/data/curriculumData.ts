import { SubjectCurriculum } from '../types/curriculum';

export const CURRICULUM_DATA: Record<string, SubjectCurriculum> = {
  physics: {
    subjectId: 'physics',
    subjectName: 'Cambridge IGCSE Physics Pure',
    syllabusCode: '0625',
    syllabusPeriod: '2026–2028',
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
                simulationId: 'phys-vernier-caliper',
                learningObjectives: [{ id: 'o-p-1', code: '0625.1.1.1', description: 'Measure length using calipers & gauges', tier: 'core', simulationType: 'full_simulation', verifiedStatus: 'verified' }],
                keyEquations: ['\\text{Precision} = 0.01\\text{ mm}']
              },
              {
                id: 'phys-conc-1-1-2',
                title: 'Simple Pendulum Period Timing',
                description: 'Investigate period T vs string length L (T = 2π√(L/g)) with live oscillation.',
                simulationId: 'phys-pendulum-period',
                learningObjectives: [{ id: 'o-p-2', code: '0625.1.1.2', description: 'Measure time intervals with a pendulum', tier: 'both', simulationType: 'full_simulation', verifiedStatus: 'verified' }],
                keyEquations: ['T = 2\\pi \\sqrt{\\frac{L}{g}}']
              },
              {
                id: 'phys-conc-1-1-3',
                title: 'Displacement Can & Liquid Volume',
                description: 'Eureka can irregular volume displacement measurement.',
                simulationId: 'phys-eureka-volume',
                learningObjectives: [{ id: 'o-p-3', code: '0625.1.1.3', description: 'Measure volume of irregular solids', tier: 'core', simulationType: 'virtual_experiment', verifiedStatus: 'verified' }]
              }
            ]
          },
          {
            id: 'phys-c1-2',
            number: '1.2',
            title: 'Motion & Kinematics',
            description: 'Speed, velocity, acceleration, distance-time and speed-time graphs, free fall.',
            concepts: [
              {
                id: 'phys-conc-1-2-1',
                title: 'Velocity-Time Acceleration Track',
                description: 'Cart on track with live gradient and area distance integration.',
                simulationId: 'phys-motion-track',
                learningObjectives: [{ id: 'o-p-4', code: '0625.1.2.1', description: 'Plot & interpret v-t and s-t graphs', tier: 'both', simulationType: 'full_simulation', verifiedStatus: 'verified' }],
                keyEquations: ['v = \\frac{s}{t}', 'a = \\frac{v-u}{t}', 's = \\text{Area under } v-t']
              },
              {
                id: 'phys-conc-1-2-2',
                title: 'Free Fall & Terminal Velocity Skydiver',
                description: 'Gravitational acceleration balanced by drag air resistance.',
                simulationId: 'phys-terminal-velocity',
                learningObjectives: [{ id: 'o-p-5', code: '0625.1.2.3', description: 'Describe motion of falling bodies with air resistance', tier: 'both', simulationType: 'full_simulation', verifiedStatus: 'verified' }],
                keyEquations: ['F_{net} = mg - F_{drag} = ma']
              },
              {
                id: 'phys-conc-1-2-3',
                title: 'Ticker Tape Motion Timer',
                description: 'Analyze dots on tape to calculate instantaneous acceleration.',
                simulationId: 'phys-ticker-timer',
                learningObjectives: [{ id: 'o-p-6', code: '0625.1.2.4', description: 'Determine acceleration from ticker timer data', tier: 'supplement', simulationType: 'virtual_experiment', verifiedStatus: 'verified' }]
              }
            ]
          },
          {
            id: 'phys-c1-3',
            number: '1.3',
            title: 'Mass, Weight and Density',
            description: 'Gravitational field strength, mass vs weight, density calculations.',
            concepts: [
              {
                id: 'phys-conc-1-3-1',
                title: 'Gravitational Field Strength Comparator',
                description: 'Compare W = mg across Earth (9.8 N/kg), Moon (1.6 N/kg), Mars (3.7 N/kg).',
                simulationId: 'phys-gravity-comparator',
                learningObjectives: [{ id: 'o-p-7', code: '0625.1.3.1', description: 'Distinguish between mass and weight', tier: 'core', simulationType: 'full_simulation', verifiedStatus: 'verified' }],
                keyEquations: ['W = mg']
              },
              {
                id: 'phys-conc-1-3-2',
                title: 'Density Flotation & Liquid Layers',
                description: 'Investigate ρ = m/V and why objects float or sink in liquids of different densities.',
                simulationId: 'phys-density-flotation',
                learningObjectives: [{ id: 'o-p-8', code: '0625.1.4.1', description: 'Recall and use the equation ρ = m/V', tier: 'both', simulationType: 'full_simulation', verifiedStatus: 'verified' }],
                keyEquations: ['\\rho = \\frac{m}{V}']
              }
            ]
          },
          {
            id: 'phys-c1-5',
            number: '1.5',
            title: 'Forces & Hooke’s Law',
            description: 'Resultant forces, friction, spring deformation, circular motion, turning moments.',
            concepts: [
              {
                id: 'phys-conc-1-5-1',
                title: 'Hooke’s Law & Spring Elasticity',
                description: 'Spring stretch F = kΔx, spring constant, and limit of proportionality.',
                simulationId: 'phys-hookes-law',
                learningObjectives: [{ id: 'o-p-9', code: '0625.1.5.3', description: 'State Hooke’s law and use F = kΔx', tier: 'both', simulationType: 'full_simulation', verifiedStatus: 'verified' }],
                keyEquations: ['F = k \\Delta x']
              },
              {
                id: 'phys-conc-1-5-2',
                title: 'Vector Forces & Resultant Sled',
                description: '2D vector addition, parallelogram rule, and resultant acceleration.',
                simulationId: 'phys-vector-forces',
                learningObjectives: [{ id: 'o-p-10', code: '0625.1.5.1', description: 'Determine resultant of two or more forces', tier: 'supplement', simulationType: 'full_simulation', verifiedStatus: 'verified' }],
                keyEquations: ['F = ma', 'F_{res} = \\sqrt{F_1^2 + F_2^2}']
              },
              {
                id: 'phys-conc-1-5-3',
                title: 'Principle of Moments & Seesaw Balance',
                description: 'Clockwise vs anticlockwise moments about a pivot in equilibrium.',
                simulationId: 'phys-turning-moments',
                learningObjectives: [{ id: 'o-p-11', code: '0625.1.5.5', description: 'Apply the principle of moments to balance systems', tier: 'both', simulationType: 'full_simulation', verifiedStatus: 'verified' }],
                keyEquations: ['\\text{Moment} = F \\times d', '\\sum M_{cw} = \\sum M_{acw}']
              },
              {
                id: 'phys-conc-1-5-4',
                title: 'Centripetal Force Carousel',
                description: 'Circular orbital speed and inwards centripetal force F = mv²/r.',
                simulationId: 'phys-centripetal-force',
                learningObjectives: [{ id: 'o-p-12', code: '0625.1.5.4', description: 'Describe motion in a curved path', tier: 'supplement', simulationType: 'full_simulation', verifiedStatus: 'verified' }],
                keyEquations: ['F = \\frac{m v^2}{r}']
              }
            ]
          },
          {
            id: 'phys-c1-6',
            number: '1.6',
            title: 'Momentum & Energy Conservation',
            description: 'Linear momentum, elastic/inelastic collisions, work, kinetic and potential energy.',
            concepts: [
              {
                id: 'phys-conc-1-6-1',
                title: '1D Particle Collision Track',
                description: 'Conservation of momentum p = mv and impulse FΔt = Δp in elastic impacts.',
                simulationId: 'phys-momentum-collider',
                learningObjectives: [{ id: 'o-p-13', code: '0625.1.6.1', description: 'Recall and use p = mv and impulse', tier: 'supplement', simulationType: 'full_simulation', verifiedStatus: 'verified' }],
                keyEquations: ['p = mv', 'm_1 u_1 + m_2 u_2 = m_1 v_1 + m_2 v_2']
              },
              {
                id: 'phys-conc-1-6-2',
                title: 'Rollercoaster Energy Transformation',
                description: 'Interchange of gravitational potential energy (mgh) and kinetic energy (½mv²).',
                simulationId: 'phys-energy-rollercoaster',
                learningObjectives: [{ id: 'o-p-14', code: '0625.1.7.2', description: 'Apply conservation of mechanical energy', tier: 'both', simulationType: 'full_simulation', verifiedStatus: 'verified' }],
                keyEquations: ['E_k = \\frac{1}{2}mv^2', 'E_p = mgh', 'W = Fd']
              },
              {
                id: 'phys-conc-1-6-3',
                title: 'Hydraulic Lift & Liquid Pressure',
                description: 'Pascal principle, pressure p = F/A and liquid column p = ρgh.',
                simulationId: 'phys-hydraulic-press',
                learningObjectives: [{ id: 'o-p-15', code: '0625.1.8.2', description: 'Recall and use p = F/A and p = ρgh', tier: 'both', simulationType: 'full_simulation', verifiedStatus: 'verified' }],
                keyEquations: ['p = \\frac{F}{A}', 'p = \\rho g h']
              }
            ]
          }
        ]
      },
      {
        id: 'phys-u2',
        number: 2,
        title: 'Thermal Physics',
        description: 'Kinetic particle model of matter, thermal properties, temperature, specific heat capacity, latent heat, heat transfer, gas laws.',
        chapters: [
          {
            id: 'phys-c2-1',
            number: '2.1',
            title: 'Kinetic Particle Model & Gas Laws',
            description: 'Particle motion, Brownian motion, gas pressure, Boyle’s Law and Charles’s Law.',
            concepts: [
              {
                id: 'phys-conc-2-1-1',
                title: 'Kinetic Particle Model & Gas Laws',
                description: 'Ideal gas container with live collision physics, temperature burner, and pressure gauge.',
                simulationId: 'phys-gas-laws',
                learningObjectives: [{ id: 'o-p-16', code: '0625.2.1.3', description: 'Describe gas pressure in terms of molecular collisions', tier: 'both', simulationType: 'full_simulation', verifiedStatus: 'verified' }],
                keyEquations: ['p_1 V_1 = p_2 V_2', '\\frac{p_1}{T_1} = \\frac{p_2}{T_2}']
              },
              {
                id: 'phys-conc-2-1-2',
                title: 'Brownian Motion Smoke Cell',
                description: 'Microscopic smoke particles bombarded randomly by invisible air molecules.',
                simulationId: 'phys-brownian-motion',
                learningObjectives: [{ id: 'o-p-17', code: '0625.2.1.2', description: 'Describe Brownian motion as evidence for moving particles', tier: 'both', simulationType: 'full_simulation', verifiedStatus: 'verified' }]
              },
              {
                id: 'phys-conc-2-1-3',
                title: 'Absolute Zero Kelvin Scale Extrapolator',
                description: 'Plot p vs T(°C) to extrapolate intersection at absolute zero (-273.15°C / 0 K).',
                simulationId: 'phys-absolute-zero',
                learningObjectives: [{ id: 'o-p-18', code: '0625.2.1.4', description: 'Understand absolute zero on Kelvin temperature scale', tier: 'supplement', simulationType: 'graph_model', verifiedStatus: 'verified' }],
                keyEquations: ['T(K) = \\theta(^{\\circ}C) + 273']
              }
            ]
          },
          {
            id: 'phys-c2-2',
            number: '2.2',
            title: 'Thermal Properties & Calorimetry',
            description: 'Thermal expansion, specific heat capacity, latent heat, and heating/cooling curves.',
            concepts: [
              {
                id: 'phys-conc-2-2-1',
                title: 'Specific Heat Capacity Calorimeter',
                description: 'Electrically heat metal blocks (Al, Cu, Fe, Water) to measure c = ΔE / (mΔθ).',
                simulationId: 'phys-specific-heat',
                learningObjectives: [{ id: 'o-p-19', code: '0625.2.2.2', description: 'Recall and use ΔE = mcΔθ', tier: 'supplement', simulationType: 'virtual_experiment', verifiedStatus: 'verified' }],
                keyEquations: ['\\Delta E = m c \\Delta \\theta']
              },
              {
                id: 'phys-conc-2-2-2',
                title: 'Specific Latent Heat Phase Transition',
                description: 'Heating curve with temperature plateaus during melting and boiling (ΔE = mL).',
                simulationId: 'phys-latent-heat',
                learningObjectives: [{ id: 'o-p-20', code: '0625.2.2.3', description: 'Distinguish between boiling and evaporation, use ΔE = mL', tier: 'supplement', simulationType: 'full_simulation', verifiedStatus: 'verified' }],
                keyEquations: ['\\Delta E = m L_f', '\\Delta E = m L_v']
              },
              {
                id: 'phys-conc-2-2-3',
                title: 'Bimetallic Strip Thermal Expansion',
                description: 'Deflection of bonded brass and iron strips due to unequal expansion rates.',
                simulationId: 'phys-bimetallic-strip',
                learningObjectives: [{ id: 'o-p-21', code: '0625.2.2.1', description: 'Describe thermal expansion of solids, liquids and gases', tier: 'core', simulationType: 'full_simulation', verifiedStatus: 'verified' }]
              }
            ]
          },
          {
            id: 'phys-c2-3',
            number: '2.3',
            title: 'Transfer of Thermal Energy',
            description: 'Conduction, convection, infrared radiation, consequences of heat transfer.',
            concepts: [
              {
                id: 'phys-conc-2-3-1',
                title: 'Conduction Rod Comparator',
                description: 'Compare thermal conductivity rates of copper, iron, glass, and wood with wax pins.',
                simulationId: 'phys-conduction-rods',
                learningObjectives: [{ id: 'o-p-22', code: '0625.2.3.1', description: 'Describe conduction in terms of particle vibrations & free electrons', tier: 'both', simulationType: 'virtual_experiment', verifiedStatus: 'verified' }]
              },
              {
                id: 'phys-conc-2-3-2',
                title: 'Convection Current Liquid Loop',
                description: 'Model density changes and convection currents in heated fluids with potassium permanganate tracer.',
                simulationId: 'phys-convection-loop',
                learningObjectives: [{ id: 'o-p-23', code: '0625.2.3.2', description: 'Explain convection in fluids in terms of density change', tier: 'both', simulationType: 'full_simulation', verifiedStatus: 'verified' }]
              },
              {
                id: 'phys-conc-2-3-3',
                title: 'Leslie’s Cube Thermal Radiation',
                description: 'Compare emission and absorption of matte black vs shiny silver surfaces with thermopiles.',
                simulationId: 'phys-leslies-cube',
                learningObjectives: [{ id: 'o-p-24', code: '0625.2.3.3', description: 'Identify good and bad emitters and absorbers of infrared radiation', tier: 'both', simulationType: 'virtual_experiment', verifiedStatus: 'verified' }]
              }
            ]
          }
        ]
      },
      {
        id: 'phys-u3',
        number: 3,
        title: 'Waves & Light',
        description: 'General wave properties, reflection, refraction, lenses, electromagnetic spectrum, sound.',
        chapters: [
          {
            id: 'phys-c3-1',
            number: '3.1',
            title: 'General Wave Properties',
            description: 'Transverse and longitudinal waves, wavelength, frequency, wave speed, ripple tank.',
            concepts: [
              {
                id: 'phys-conc-3-1-1',
                title: 'Ripple Tank Wave Simulator',
                description: 'Tunable wave frequency, wavelength, reflection from barriers, and diffraction through slits.',
                simulationId: 'phys-ripple-tank',
                learningObjectives: [{ id: 'o-p-25', code: '0625.3.1.2', description: 'Recall and use v = fλ', tier: 'both', simulationType: 'full_simulation', verifiedStatus: 'verified' }],
                keyEquations: ['v = f \\lambda', 'T = \\frac{1}{f}']
              },
              {
                id: 'phys-conc-3-1-2',
                title: 'Transverse vs Longitudinal Wave Spring',
                description: 'Compressions and rarefactions in a slinky vs crests and troughs.',
                simulationId: 'phys-transverse-longitudinal',
                learningObjectives: [{ id: 'o-p-26', code: '0625.3.1.1', description: 'Distinguish between transverse and longitudinal waves', tier: 'both', simulationType: 'full_simulation', verifiedStatus: 'verified' }]
              }
            ]
          },
          {
            id: 'phys-c3-2',
            number: '3.2',
            title: 'Light, Refraction & Lenses',
            description: 'Law of reflection, Snell’s Law, critical angle, total internal reflection, converging lenses.',
            concepts: [
              {
                id: 'phys-conc-3-2-1',
                title: 'Snell’s Law & Total Internal Reflection',
                description: 'Glass/water block ray refraction, critical angle sin(c) = 1/n, optical fibre TIR.',
                simulationId: 'phys-snells-law',
                learningObjectives: [{ id: 'o-p-27', code: '0625.3.2.2', description: 'Recall and use n = sin(i)/sin(r) and sin(c) = 1/n', tier: 'supplement', simulationType: 'full_simulation', verifiedStatus: 'verified' }],
                keyEquations: ['n = \\frac{\\sin i}{\\sin r}', '\\sin c = \\frac{1}{n}']
              },
              {
                id: 'phys-conc-3-2-2',
                title: 'Thin Converging Lens Optical Bench',
                description: 'Ray diagram formation of real and virtual images (projector, camera, magnifying glass).',
                simulationId: 'phys-converging-lens',
                learningObjectives: [{ id: 'o-p-28', code: '0625.3.2.3', description: 'Draw ray diagrams for thin converging lenses', tier: 'both', simulationType: 'full_simulation', verifiedStatus: 'verified' }],
                keyEquations: ['\\frac{1}{f} = \\frac{1}{u} + \\frac{1}{v}', 'M = \\frac{h_i}{h_o} = \\frac{v}{u}']
              },
              {
                id: 'phys-conc-3-2-3',
                title: 'Glass Prism Spectrum Dispersion',
                description: 'White light dispersion into colors of the visible spectrum due to differential refractive indices.',
                simulationId: 'phys-prism-dispersion',
                learningObjectives: [{ id: 'o-p-29', code: '0625.3.2.4', description: 'Describe dispersion of white light by a prism', tier: 'core', simulationType: 'full_simulation', verifiedStatus: 'verified' }]
              }
            ]
          },
          {
            id: 'phys-c3-4',
            number: '3.4',
            title: 'Sound & Acoustics',
            description: 'Sound waves, pitch, loudness, speed of sound in air, echo reflection.',
            concepts: [
              {
                id: 'phys-conc-3-4-1',
                title: 'CRO Sound Waveform Oscilloscope',
                description: 'Cathode-ray oscilloscope visualizer linking pitch to frequency and loudness to amplitude.',
                simulationId: 'phys-sound-cro',
                learningObjectives: [{ id: 'o-p-30', code: '0625.3.4.2', description: 'Relate loudness to amplitude and pitch to frequency', tier: 'both', simulationType: 'full_simulation', verifiedStatus: 'verified' }]
              },
              {
                id: 'phys-conc-3-4-2',
                title: 'Echo Speed of Sound Bench',
                description: 'Measure time delay of reflection from a tall wall to calculate v = 2d / t.',
                simulationId: 'phys-speed-sound',
                learningObjectives: [{ id: 'o-p-31', code: '0625.3.4.1', description: 'Describe an experiment to determine speed of sound in air', tier: 'both', simulationType: 'virtual_experiment', verifiedStatus: 'verified' }],
                keyEquations: ['v = \\frac{2d}{t}']
              }
            ]
          }
        ]
      },
      {
        id: 'phys-u4',
        number: 4,
        title: 'Electricity and Magnetism',
        description: 'Electric charge, Ohm’s law, series and parallel circuits, electrical safety, electromagnetic induction, motors and transformers.',
        chapters: [
          {
            id: 'phys-c4-2',
            number: '4.2',
            title: 'Electric Circuits & Ohm’s Law',
            description: 'Current, potential difference, resistance, series and parallel rules, component IV curves.',
            concepts: [
              {
                id: 'phys-conc-4-2-1',
                title: 'Virtual Circuit Breadboard & Ohm’s Law',
                description: 'Build circuits with power source, resistors, lamps, ammeters, voltmeters (V = IR).',
                simulationId: 'phys-circuits',
                learningObjectives: [{ id: 'o-p-32', code: '0625.4.2.4', description: 'Recall and use V = IR', tier: 'both', simulationType: 'full_simulation', verifiedStatus: 'verified' }],
                keyEquations: ['V = IR', 'P = IV = I^2 R', 'R_s = R_1 + R_2', '\\frac{1}{R_p} = \\frac{1}{R_1} + \\frac{1}{R_2}']
              },
              {
                id: 'phys-conc-4-2-2',
                title: 'LDR & Thermistor Potential Divider',
                description: 'Automated light sensing and temperature sensing circuit divider behavior.',
                simulationId: 'phys-potential-divider',
                learningObjectives: [{ id: 'o-p-33', code: '0625.4.3.3', description: 'Describe the action of a potential divider with LDR and thermistor', tier: 'supplement', simulationType: 'full_simulation', verifiedStatus: 'verified' }],
                keyEquations: ['V_{out} = V_{in} \\times \\frac{R_2}{R_1 + R_2}']
              },
              {
                id: 'phys-conc-4-2-3',
                title: 'Diode & Filament Lamp IV Characteristics',
                description: 'Plot non-ohmic IV curves showing filament resistance increasing with temperature.',
                simulationId: 'phys-iv-curves',
                learningObjectives: [{ id: 'o-p-34', code: '0625.4.2.5', description: 'Recall and sketch IV characteristic graphs for components', tier: 'both', simulationType: 'graph_model', verifiedStatus: 'verified' }]
              }
            ]
          },
          {
            id: 'phys-c4-5',
            number: '4.5',
            title: 'Electromagnetism & Motors',
            description: 'Magnetic fields, motor effect, Faraday induction, AC generators, transformers.',
            concepts: [
              {
                id: 'phys-conc-4-5-1',
                title: 'Faraday Induction & AC Generator',
                description: 'Moving magnet through solenoid coil and rotating coil in uniform magnetic field.',
                simulationId: 'phys-ac-generator',
                learningObjectives: [{ id: 'o-p-35', code: '0625.4.5.1', description: 'Describe electromagnetic induction and generator operation', tier: 'supplement', simulationType: 'full_simulation', verifiedStatus: 'verified' }]
              },
              {
                id: 'phys-conc-4-5-2',
                title: 'Fleming’s Left-Hand DC Motor',
                description: 'Current-carrying coil experiencing turning couple in magnetic field.',
                simulationId: 'phys-dc-motor',
                learningObjectives: [{ id: 'o-p-36', code: '0625.4.5.4', description: 'Describe turning effect on a current-carrying coil', tier: 'supplement', simulationType: 'full_simulation', verifiedStatus: 'verified' }]
              },
              {
                id: 'phys-conc-4-5-3',
                title: 'Transformer Voltage & Turns Ratio',
                description: 'Step-up and step-down transformer Vp/Vs = Np/Ns with power efficiency.',
                simulationId: 'phys-transformer',
                learningObjectives: [{ id: 'o-p-37', code: '0625.4.5.6', description: 'Recall and use Vp/Vs = Np/Ns', tier: 'both', simulationType: 'full_simulation', verifiedStatus: 'verified' }],
                keyEquations: ['\\frac{V_p}{V_s} = \\frac{N_p}{N_s}', 'I_p V_p = I_s V_s']
              }
            ]
          }
        ]
      },
      {
        id: 'phys-u5',
        number: 5,
        title: 'Nuclear Physics',
        description: 'Nuclear model of the atom, radioactive decay, half-life, alpha/beta/gamma emissions.',
        chapters: [
          {
            id: 'phys-c5-1',
            number: '5.1',
            title: 'Nuclear Model & Alpha Scattering',
            description: 'Rutherford gold foil alpha deflection, atomic composition, isotopes.',
            concepts: [
              {
                id: 'phys-conc-5-1-1',
                title: 'Rutherford Alpha Scattering Experiment',
                description: 'Alpha particles deflected by concentrated positive gold nucleus.',
                simulationId: 'phys-rutherford-scattering',
                learningObjectives: [{ id: 'o-p-38', code: '0625.5.1.1', description: 'Describe the Geiger-Marsden alpha particle experiment', tier: 'both', simulationType: 'full_simulation', verifiedStatus: 'verified' }]
              },
              {
                id: 'phys-conc-5-1-2',
                title: 'Nuclide Notation & Isotope Balancer',
                description: 'Inspect atomic number Z, mass number A, protons and neutrons in isotopes.',
                simulationId: 'phys-nuclide-notation',
                learningObjectives: [{ id: 'o-p-39', code: '0625.5.1.2', description: 'State meaning of proton number, nucleon number and isotope', tier: 'core', simulationType: 'full_simulation', verifiedStatus: 'verified' }]
              }
            ]
          },
          {
            id: 'phys-c5-2',
            number: '5.2',
            title: 'Radioactive Decay & Half-Life',
            description: 'Alpha, beta, gamma penetration, radioactive decay equations, half-life curves.',
            concepts: [
              {
                id: 'phys-conc-5-2-1',
                title: 'Radioactive Decay & Half-Life Simulator',
                description: 'Random decay of isotope nuclei with background radiation and half-life curve.',
                simulationId: 'phys-radioactive-halflife',
                learningObjectives: [{ id: 'o-p-40', code: '0625.5.2.4', description: 'Calculate half-life from decay curves and tables', tier: 'both', simulationType: 'full_simulation', verifiedStatus: 'verified' }],
                keyEquations: ['N = N_0 \\left(\\frac{1}{2}\\right)^{t/t_{1/2}}']
              },
              {
                id: 'phys-conc-5-2-2',
                title: 'Radiation Penetration & Shielding Bench',
                description: 'Test absorption of Alpha (paper), Beta (aluminum), Gamma (lead) with GM tube.',
                simulationId: 'phys-radiation-penetration',
                learningObjectives: [{ id: 'o-p-41', code: '0625.5.2.2', description: 'Compare ionizing and penetrating powers of alpha, beta, gamma', tier: 'both', simulationType: 'virtual_experiment', verifiedStatus: 'verified' }]
              }
            ]
          }
        ]
      },
      {
        id: 'phys-u6',
        number: 6,
        title: 'Space Physics',
        description: 'Earth, Solar system, orbital velocity, stellar life cycle, redshift, and Big Bang.',
        chapters: [
          {
            id: 'phys-c6-1',
            number: '6.1',
            title: 'Earth & Solar System Orbits',
            description: 'Planetary orbits, orbital speed v = 2πr/T, gravitational fields.',
            concepts: [
              {
                id: 'phys-conc-6-1-1',
                title: 'Planetary Orbits & Keplerian Speed',
                description: 'Model orbital period, radius, speed v = 2πr/T, and gravitational field variations.',
                simulationId: 'phys-orbits',
                learningObjectives: [{ id: 'o-p-42', code: '0625.6.1.1', description: 'Recall and use the orbital speed equation v = 2πr/T', tier: 'supplement', simulationType: 'full_simulation', verifiedStatus: 'verified' }],
                keyEquations: ['v = \\frac{2\\pi r}{T}']
              },
              {
                id: 'phys-conc-6-1-2',
                title: 'Day, Night & Seasonal Axial Tilt',
                description: 'Earth rotation on 23.5° tilted axis causing seasons and variable day length.',
                simulationId: 'phys-earth-seasons',
                learningObjectives: [{ id: 'o-p-43', code: '0625.6.1.2', description: 'Explain day/night and seasons from Earth rotation and orbit', tier: 'core', simulationType: 'full_simulation', verifiedStatus: 'verified' }]
              }
            ]
          },
          {
            id: 'phys-c6-2',
            number: '6.2',
            title: 'Stars & The Expanding Universe',
            description: 'Nuclear fusion in stars, stellar evolution, Hubble law, galactic redshift.',
            concepts: [
              {
                id: 'phys-conc-6-2-1',
                title: 'Stellar Evolution Life Cycle Pathway',
                description: 'Follow average star (Red Giant → White Dwarf) vs massive star (Supernova → Black Hole).',
                simulationId: 'phys-stellar-evolution',
                learningObjectives: [{ id: 'o-p-44', code: '0625.6.2.2', description: 'Describe life cycle of average and massive stars', tier: 'supplement', simulationType: 'full_simulation', verifiedStatus: 'verified' }]
              },
              {
                id: 'phys-conc-6-2-2',
                title: 'Doppler Redshift & Hubble Cosmic Expansion',
                description: 'Receding galaxies, redshift of spectral absorption lines, and age of universe.',
                simulationId: 'phys-doppler-redshift',
                learningObjectives: [{ id: 'o-p-45', code: '0625.6.2.3', description: 'Explain redshift as evidence for expanding Universe', tier: 'supplement', simulationType: 'full_simulation', verifiedStatus: 'verified' }],
                keyEquations: ['v = H_0 d', '\\frac{\\Delta \\lambda}{\\lambda} = \\frac{v}{c}']
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
    syllabusPeriod: '2026–2028',
    units: [
      {
        id: 'chem-u1',
        number: 1,
        title: 'States of Matter & Diffusion',
        description: 'Kinetic particle theory, interconversions, heating curves, and gas diffusion.',
        chapters: [
          {
            id: 'chem-c1-1',
            number: '1.1',
            title: 'States of Matter & Molecular Phase Change',
            description: 'Solid, liquid, and gas particle packing, melting, boiling, condensation.',
            concepts: [
              {
                id: 'chem-conc-1-1-1',
                title: 'States of Matter & Molecular Phase Change',
                description: 'Observe inter-particle forces, vibrational kinetic energy, and phase changes.',
                simulationId: 'chem-states-matter',
                learningObjectives: [{ id: 'o-c-1', code: '0620.1.1.1', description: 'Describe states of matter and phase changes in terms of particle theory', tier: 'both', simulationType: 'full_simulation', verifiedStatus: 'verified' }]
              },
              {
                id: 'chem-conc-1-1-2',
                title: 'Gas Diffusion Tube (NH₃ + HCl)',
                description: 'Diffusion rates of ammonia vs hydrogen chloride gas forming ammonium chloride ring.',
                simulationId: 'chem-gas-diffusion',
                learningObjectives: [{ id: 'o-c-2', code: '0620.1.1.2', description: 'Describe and explain diffusion in liquids and gases', tier: 'both', simulationType: 'virtual_experiment', verifiedStatus: 'verified' }],
                keyEquations: ['\\text{Rate} \\propto \\frac{1}{\\sqrt{M_r}}']
              }
            ]
          }
        ]
      },
      {
        id: 'chem-u2',
        number: 2,
        title: 'Atoms, Elements and Compounds',
        description: 'Atomic structure, isotopes, ionic bonding, covalent bonding, metallic bonding.',
        chapters: [
          {
            id: 'chem-c2-1',
            number: '2.1',
            title: 'Atomic Structure & Periodic Table',
            description: 'Protons, neutrons, electrons, electron shell configurations 2,8,8.',
            concepts: [
              {
                id: 'chem-conc-2-1-1',
                title: 'Interactive Bohr-Rutherford Atom Builder',
                description: 'Add protons, neutrons, electrons to build stable atoms and isotopes.',
                simulationId: 'chem-atom-builder',
                learningObjectives: [{ id: 'o-c-3', code: '0620.2.1.1', description: 'Describe atomic structure and electron shell filling', tier: 'both', simulationType: 'full_simulation', verifiedStatus: 'verified' }]
              },
              {
                id: 'chem-conc-2-1-2',
                title: 'Ionic Lattice Electron Transfer (NaCl)',
                description: 'Electron transfer from sodium to chlorine forming strong electrostatic ionic lattice.',
                simulationId: 'chem-ionic-bonding',
                learningObjectives: [{ id: 'o-c-4', code: '0620.2.3.1', description: 'Describe ionic bonding as attraction between oppositely charged ions', tier: 'both', simulationType: 'full_simulation', verifiedStatus: 'verified' }]
              },
              {
                id: 'chem-conc-2-1-3',
                title: 'Covalent Molecule Dot-and-Cross Studio',
                description: 'Shared pairs of electrons in H₂, O₂, H₂O, CH₄, CO₂ molecules.',
                simulationId: 'chem-covalent-bonding',
                learningObjectives: [{ id: 'o-c-5', code: '0620.2.4.1', description: 'Describe covalent bonds as shared pairs of electrons', tier: 'both', simulationType: 'full_simulation', verifiedStatus: 'verified' }]
              }
            ]
          }
        ]
      },
      {
        id: 'chem-u3',
        number: 3,
        title: 'Stoichiometry & Mole Concept',
        description: 'Formulae, balancing equations, moles, Avogadro constant, limiting reactants.',
        chapters: [
          {
            id: 'chem-c3-1',
            number: '3.1',
            title: 'Chemical Equations & Balancing',
            description: 'Conservation of atoms in balancing equations and calculating Mr.',
            concepts: [
              {
                id: 'chem-conc-3-1-1',
                title: 'Chemical Equation Balancer Studio',
                description: 'Balance synthesis, decomposition, and combustion equations with atom counts.',
                simulationId: 'chem-equation-balancer',
                learningObjectives: [{ id: 'o-c-6', code: '0620.3.1.1', description: 'Balance chemical equations including state symbols', tier: 'both', simulationType: 'full_simulation', verifiedStatus: 'verified' }]
              },
              {
                id: 'chem-conc-3-1-2',
                title: 'The Mole & Limiting Reactant Calculator',
                description: 'Calculate moles n = m/Mr, molar gas volume 24 dm³, and determine limiting reagent.',
                simulationId: 'chem-mole-calculator',
                learningObjectives: [{ id: 'o-c-7', code: '0620.3.3.1', description: 'Use the mole concept and calculate reactings masses', tier: 'supplement', simulationType: 'full_simulation', verifiedStatus: 'verified' }],
                keyEquations: ['n = \\frac{m}{M_r}', 'n = \\frac{V}{24\\text{ dm}^3}', 'c = \\frac{n}{V}']
              }
            ]
          }
        ]
      },
      {
        id: 'chem-u4',
        number: 4,
        title: 'Electrochemistry & Electrolysis',
        description: 'Electrolysis of molten and aqueous electrolytes, half-equations, fuel cells.',
        chapters: [
          {
            id: 'chem-c4-1',
            number: '4.1',
            title: 'Electrolysis Cell Laboratory',
            description: 'Cathode reduction, anode oxidation, molten PbBr₂ and aqueous CuSO₄ electrolysis.',
            concepts: [
              {
                id: 'chem-conc-4-1-1',
                title: 'Electrochemical Cell & Ion Migration',
                description: 'Trace cations moving to cathode and anions to anode with electrode half-equations.',
                simulationId: 'chem-electrolysis-cell',
                learningObjectives: [{ id: 'o-c-8', code: '0620.4.1.1', description: 'Describe electrolysis and write electrode half-equations', tier: 'both', simulationType: 'full_simulation', verifiedStatus: 'verified' }],
                keyEquations: ['\\text{Anode: } 2Cl^- \\rightarrow Cl_2 + 2e^-', '\\text{Cathode: } Cu^{2+} + 2e^- \\rightarrow Cu']
              },
              {
                id: 'chem-conc-4-1-2',
                title: 'Hydrogen-Oxygen Fuel Cell Generator',
                description: '2H₂ + O₂ → 2H₂O producing electrical potential without polluting greenhouse emissions.',
                simulationId: 'chem-fuel-cell',
                learningObjectives: [{ id: 'o-c-9', code: '0620.4.2.1', description: 'Describe advantages and disadvantages of hydrogen fuel cells', tier: 'supplement', simulationType: 'full_simulation', verifiedStatus: 'verified' }]
              }
            ]
          }
        ]
      },
      {
        id: 'chem-u5',
        number: 5,
        title: 'Chemical Energetics',
        description: 'Exothermic and endothermic reactions, bond energies, reaction progress profiles.',
        chapters: [
          {
            id: 'chem-c5-1',
            number: '5.1',
            title: 'Reaction Energetics & Profiles',
            description: 'Activation energy Ea, ΔH calculation from bond breaking and bond making.',
            concepts: [
              {
                id: 'chem-conc-5-1-1',
                title: 'Reaction Profile & Activation Energy Bench',
                description: 'Interactive enthalpy profiles for exothermic and endothermic reactions.',
                simulationId: 'chem-reaction-energetics',
                learningObjectives: [{ id: 'o-c-10', code: '0620.5.1.1', description: 'Interpret reaction energy profiles and calculate bond energies', tier: 'both', simulationType: 'full_simulation', verifiedStatus: 'verified' }],
                keyEquations: ['\\Delta H = \\sum \\text{Bonds Broken} - \\sum \\text{Bonds Formed}']
              }
            ]
          }
        ]
      },
      {
        id: 'chem-u6',
        number: 6,
        title: 'Chemical Reactions & Kinetics',
        description: 'Rates of reaction, collision theory, reversible reactions, Haber process equilibrium.',
        chapters: [
          {
            id: 'chem-c6-2',
            number: '6.2',
            title: 'Rates of Reaction & Gas Syringe',
            description: 'Effect of concentration, temperature, surface area, and catalysts on reaction speed.',
            concepts: [
              {
                id: 'chem-conc-6-2-1',
                title: 'Rates of Reaction & Gas Syringe Dynamometer',
                description: 'Marble chips + HCl: measure CO₂ gas volume over time with Maxwell-Boltzmann energy curves.',
                simulationId: 'chem-reaction-rates',
                learningObjectives: [{ id: 'o-c-11', code: '0620.6.2.1', description: 'Explain factors affecting reaction rates using collision theory', tier: 'both', simulationType: 'full_simulation', verifiedStatus: 'verified' }],
                keyEquations: ['\\text{Rate} = \\frac{\\Delta V}{\\Delta t}']
              },
              {
                id: 'chem-conc-6-2-2',
                title: 'Dynamic Equilibrium & Le Chatelier (Haber Process)',
                description: 'N₂ + 3H₂ ⇌ 2NH₃: Shift equilibrium with pressure, temperature, and catalysts.',
                simulationId: 'chem-dynamic-equilibrium',
                learningObjectives: [{ id: 'o-c-12', code: '0620.6.3.1', description: 'Apply Le Chatelier’s principle to industrial equilibrium', tier: 'supplement', simulationType: 'full_simulation', verifiedStatus: 'verified' }]
              }
            ]
          }
        ]
      },
      {
        id: 'chem-u7',
        number: 7,
        title: 'Acids, Bases and Salts',
        description: 'pH scale, proton transfer, neutralization titrations, insoluble salt precipitation.',
        chapters: [
          {
            id: 'chem-c7-1',
            number: '7.1',
            title: 'Acid-Base Titration & pH Curve',
            description: 'Burette volumetric analysis, indicators, neutralization curve.',
            concepts: [
              {
                id: 'chem-conc-7-1-1',
                title: 'Volumetric Acid-Base Titration & pH Curve',
                description: 'Burette drop valve, conical flask, indicators, and logarithmic neutralization curve.',
                simulationId: 'chem-titration',
                learningObjectives: [{ id: 'o-c-13', code: '0620.7.1.1', description: 'Perform acid-base titrations and interpret neutralization curves', tier: 'both', simulationType: 'full_simulation', verifiedStatus: 'verified' }],
                keyEquations: ['C_a V_a = C_b V_b', 'pH = -\\log_{10}[H^+]']
              },
              {
                id: 'chem-conc-7-1-2',
                title: 'Insoluble Salt Precipitation Bench',
                description: 'Mix soluble salts (Pb(NO₃)₂ + KI) to form insoluble precipitates (PbI₂).',
                simulationId: 'chem-salt-precipitation',
                learningObjectives: [{ id: 'o-c-14', code: '0620.7.3.1', description: 'Describe preparation of salts by precipitation', tier: 'both', simulationType: 'virtual_experiment', verifiedStatus: 'verified' }]
              }
            ]
          }
        ]
      },
      {
        id: 'chem-u8',
        number: 8,
        title: 'Periodic Trends & Group Chemistry',
        description: 'Group I alkali metals, Group VII halogens, transition metals, noble gases.',
        chapters: [
          {
            id: 'chem-c8-1',
            number: '8.1',
            title: 'Periodic Trends & Reactivity',
            description: 'Group 1 alkali reactions in water, Group 7 displacement reactions.',
            concepts: [
              {
                id: 'chem-conc-8-1-1',
                title: 'Alkali Metals in Water Reactivity Chamber',
                description: 'Observe Li, Na, K, Rb reacting with water producing hydrogen gas and alkaline hydroxide.',
                simulationId: 'chem-alkali-metals',
                learningObjectives: [{ id: 'o-c-15', code: '0620.8.2.1', description: 'Describe trends in physical and chemical properties of Group I', tier: 'core', simulationType: 'full_simulation', verifiedStatus: 'verified' }]
              },
              {
                id: 'chem-conc-8-1-2',
                title: 'Halogen Halide Displacement Matrix',
                description: 'Cl₂, Br₂, I₂ displacement reactions demonstrating decreasing reactivity down Group VII.',
                simulationId: 'chem-halogen-displacement',
                learningObjectives: [{ id: 'o-c-16', code: '0620.8.3.1', description: 'Explain displacement reactions of halogens', tier: 'both', simulationType: 'virtual_experiment', verifiedStatus: 'verified' }]
              }
            ]
          }
        ]
      },
      {
        id: 'chem-u11',
        number: 11,
        title: 'Organic Chemistry',
        description: 'Alkanes, alkenes, alcohols, carboxylic acids, polymerisation.',
        chapters: [
          {
            id: 'chem-c11-1',
            number: '11.1',
            title: 'Hydrocarbon Families & Isomerism',
            description: 'Homologous series, functional groups, combustion, bromine water saturation test.',
            concepts: [
              {
                id: 'chem-conc-11-1-1',
                title: '3D Organic Molecule & Polymer Builder',
                description: 'Construct alkanes, alkenes, alcohols, and model addition polymerisation of ethene.',
                simulationId: 'chem-organic-builder',
                learningObjectives: [{ id: 'o-c-17', code: '0620.11.1.1', description: 'Represent organic molecules with molecular and structural formulae', tier: 'both', simulationType: 'full_simulation', verifiedStatus: 'verified' }]
              },
              {
                id: 'chem-conc-11-1-2',
                title: 'Alkene Bromine Water Unsaturation Test',
                description: 'Rapid decolourisation of orange bromine water by carbon-carbon double bonds.',
                simulationId: 'chem-bromine-test',
                learningObjectives: [{ id: 'o-c-18', code: '0620.11.5.1', description: 'Distinguish between saturated and unsaturated hydrocarbons', tier: 'core', simulationType: 'virtual_experiment', verifiedStatus: 'verified' }]
              }
            ]
          }
        ]
      },
      {
        id: 'chem-u12',
        number: 12,
        title: 'Experimental Analysis & Gas Identification',
        description: 'Chromatography, cation/anion precipitation tests, flame tests, gas tests.',
        chapters: [
          {
            id: 'chem-c12-1',
            number: '12.1',
            title: 'Chemical Identification Bench',
            description: 'Flame test emission colors, sodium hydroxide precipitates, gas tests.',
            concepts: [
              {
                id: 'chem-conc-12-1-1',
                title: 'Flame Photometry & Cation Flame Test Bench',
                description: 'Identify metal ions by distinctive flame colors: Li (red), Na (yellow), K (lilac), Cu (blue-green).',
                simulationId: 'chem-flame-tests',
                learningObjectives: [{ id: 'o-c-19', code: '0620.12.5.1', description: 'Describe flame tests to identify cations', tier: 'both', simulationType: 'full_simulation', verifiedStatus: 'verified' }]
              },
              {
                id: 'chem-conc-12-1-2',
                title: 'Paper Chromatography Rf Calculator',
                description: 'Calculate Rf = distance travelled by solute / solvent front for forensic dye analysis.',
                simulationId: 'chem-chromatography',
                learningObjectives: [{ id: 'o-c-20', code: '0620.12.3.1', description: 'Interpret simple chromatograms and calculate Rf values', tier: 'both', simulationType: 'virtual_experiment', verifiedStatus: 'verified' }],
                keyEquations: ['R_f = \\frac{d_{\\text{solute}}}{d_{\\text{solvent}}}']
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
    syllabusPeriod: '2026–2028',
    units: [
      {
        id: 'bio-u2',
        number: 2,
        title: 'Organisation of the Organism',
        description: 'Cell structure, magnification calculations, organelle functions, plant vs animal cells.',
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
                description: '4x, 10x, 40x objectives, fine focus, onion epidermis vs cheek epithelial cytology.',
                simulationId: 'bio-microscope',
                learningObjectives: [{ id: 'o-b-1', code: '0610.2.1.1', description: 'Identify cell structures under a light microscope', tier: 'both', simulationType: 'full_simulation', verifiedStatus: 'verified' }],
                keyEquations: ['I = A \\times M', 'A = \\frac{I}{M}']
              },
              {
                id: 'bio-conc-2-1-2',
                title: 'Specialised Cells & Adaptation Gallery',
                description: 'Explore root hair cells, xylem vessels, ciliated cells, red blood cells and sperm cells.',
                simulationId: 'bio-specialised-cells',
                learningObjectives: [{ id: 'o-b-2', code: '0610.2.2.1', description: 'Relate specialised cell structure to function', tier: 'both', simulationType: 'full_simulation', verifiedStatus: 'verified' }]
              }
            ]
          }
        ]
      },
      {
        id: 'bio-u3',
        number: 3,
        title: 'Movement Into and Out of Cells',
        description: 'Diffusion, osmosis, water potential, turgor pressure, active transport.',
        chapters: [
          {
            id: 'bio-c3-2',
            number: '3.2',
            title: 'Osmosis & Water Potential',
            description: 'Potato cylinder osmometer, turgid vs flaccid vs plasmolysed plant cells.',
            concepts: [
              {
                id: 'bio-conc-3-2-1',
                title: 'Osmosis & Potato Tissue Osmometer',
                description: 'Incubate potato cylinders in sucrose solutions of varying molarities to plot % mass change.',
                simulationId: 'bio-osmosis',
                learningObjectives: [{ id: 'o-b-3', code: '0610.3.2.1', description: 'Describe osmosis and investigate using potato tissue', tier: 'both', simulationType: 'full_simulation', verifiedStatus: 'verified' }],
                keyEquations: ['\\% \\Delta m = \\frac{m_f - m_i}{m_i} \\times 100']
              },
              {
                id: 'bio-conc-3-2-2',
                title: 'Active Transport Carrier Protein Pump',
                description: 'Transport of ions against concentration gradient using ATP cellular energy.',
                simulationId: 'bio-active-transport',
                learningObjectives: [{ id: 'o-b-4', code: '0610.3.3.1', description: 'Define active transport as movement against concentration gradient using energy', tier: 'both', simulationType: 'full_simulation', verifiedStatus: 'verified' }]
              }
            ]
          }
        ]
      },
      {
        id: 'bio-u5',
        number: 5,
        title: 'Enzymes & Biological Catalysts',
        description: 'Enzyme action, active site, lock and key model, temperature and pH effects.',
        chapters: [
          {
            id: 'bio-c5-1',
            number: '5.1',
            title: 'Enzyme Kinetics & Denaturation',
            description: 'Amylase and catalase rates, optimum temperature (37°C), denaturation, optimum pH.',
            concepts: [
              {
                id: 'bio-conc-5-1-1',
                title: 'Enzyme Kinetics & Thermal Denaturation Lab',
                description: 'Investigate temperature and pH influence on substrate-active site binding and denaturation.',
                simulationId: 'bio-enzyme-kinetics',
                learningObjectives: [{ id: 'o-b-5', code: '0610.5.1.1', description: 'Explain effect of temperature and pH on enzyme action', tier: 'both', simulationType: 'full_simulation', verifiedStatus: 'verified' }]
              }
            ]
          }
        ]
      },
      {
        id: 'bio-u6',
        number: 6,
        title: 'Plant Nutrition & Photosynthesis',
        description: 'Chlorophyll, light intensity, CO₂ concentration, temperature limiting factors.',
        chapters: [
          {
            id: 'bio-c6-1',
            number: '6.1',
            title: 'Photosynthesis Rate & Limiting Factors',
            description: 'Elodea pondweed oxygen bubble counter, light inverse square law 1/d².',
            concepts: [
              {
                id: 'bio-conc-6-1-1',
                title: 'Photosynthesis Bubble Counter Potometer',
                description: 'Vary light intensity, lamp distance, and NaHCO₃ concentration to determine limiting factor.',
                simulationId: 'bio-photosynthesis',
                learningObjectives: [{ id: 'o-b-6', code: '0610.6.1.1', description: 'Investigate effect of light intensity and CO₂ on photosynthesis', tier: 'both', simulationType: 'virtual_experiment', verifiedStatus: 'verified' }],
                keyEquations: ['6CO_2 + 6H_2O \\xrightarrow{\\text{light}} C_6H_{12}O_6 + 6O_2', 'I \\propto \\frac{1}{d^2}']
              },
              {
                id: 'bio-conc-6-1-2',
                title: 'Leaf Cross-Section & Stomata Gas Exchange',
                description: 'Palisade mesophyll, spongy layer, vascular bundle, guard cell turgor opening stomata.',
                simulationId: 'bio-leaf-stomata',
                learningObjectives: [{ id: 'o-b-7', code: '0610.6.2.1', description: 'Identify leaf structures in relation to photosynthesis', tier: 'both', simulationType: 'full_simulation', verifiedStatus: 'verified' }]
              }
            ]
          }
        ]
      },
      {
        id: 'bio-u9',
        number: 9,
        title: 'Transport in Animals',
        description: 'Circulatory systems, heart anatomy, cardiac cycle, blood vessels, blood components.',
        chapters: [
          {
            id: 'bio-c9-1',
            number: '9.1',
            title: 'Heart Anatomy & Cardiac Cycle',
            description: '4-chambered heart pump, atria, ventricles, bicuspid/tricuspid/semilunar valves.',
            concepts: [
              {
                id: 'bio-conc-9-1-1',
                title: '4-Chambered Heart & Valve Pumping Visualizer',
                description: 'Follow deoxygenated and oxygenated blood flow through vena cava, pulmonary artery, and aorta.',
                simulationId: 'bio-heart-cycle',
                learningObjectives: [{ id: 'o-b-8', code: '0610.9.1.1', description: 'Describe the structure and function of the human heart', tier: 'both', simulationType: 'full_simulation', verifiedStatus: 'verified' }]
              },
              {
                id: 'bio-conc-9-1-2',
                title: 'Blood Vessel Comparison (Artery, Vein, Capillary)',
                description: 'Thick muscular walls of arteries vs valves of veins vs single-cell-thin capillaries.',
                simulationId: 'bio-blood-vessels',
                learningObjectives: [{ id: 'o-b-9', code: '0610.9.2.1', description: 'Compare structures of arteries, veins and capillaries', tier: 'both', simulationType: 'full_simulation', verifiedStatus: 'verified' }]
              }
            ]
          }
        ]
      },
      {
        id: 'bio-u17',
        number: 17,
        title: 'Inheritance & Genetics',
        description: 'Monohybrid crosses, Punnett squares, codominance, sex linkage, alleles.',
        chapters: [
          {
            id: 'bio-c17-1',
            number: '17.1',
            title: 'Monohybrid Inheritance & Punnett Square',
            description: 'Dominant vs recessive alleles, heterozygous/homozygous crosses, phenotypic ratio 3:1.',
            concepts: [
              {
                id: 'bio-conc-17-1-1',
                title: 'Interactive Punnett Square Genetic Cross Studio',
                description: 'Pair parental genotypes (Bb × Bb), compute offspring genotypic and phenotypic ratios.',
                simulationId: 'bio-punnett-cross',
                learningObjectives: [{ id: 'o-b-10', code: '0610.17.2.1', description: 'Use Punnett squares to predict phenotypic ratios in monohybrid crosses', tier: 'both', simulationType: 'full_simulation', verifiedStatus: 'verified' }]
              },
              {
                id: 'bio-conc-17-1-2',
                title: 'ABO Blood Group Codominance Simulator',
                description: 'Inheritance of IA, IB, Io alleles and codominant AB blood type.',
                simulationId: 'bio-blood-genetics',
                learningObjectives: [{ id: 'o-b-11', code: '0610.17.2.3', description: 'Describe codominance with reference to inheritance of ABO blood groups', tier: 'supplement', simulationType: 'full_simulation', verifiedStatus: 'verified' }]
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
    syllabusPeriod: '2027–2029',
    units: [
      {
        id: 'env-u2',
        number: 2,
        title: 'Energy and the Environment',
        description: 'Fossil fuels, renewable energy (wind, solar, hydro), national energy mix, emissions.',
        chapters: [
          {
            id: 'env-c2-1',
            number: '2.1',
            title: 'National Renewable Energy Grid Mix',
            description: 'Balance base-load reliability, carbon emissions, and levelized costs.',
            concepts: [
              {
                id: 'env-conc-2-1-1',
                title: 'National Grid Renewable Transition Simulator',
                description: 'Mix solar, wind, nuclear and gas to meet consumer peak demand with minimum CO₂ emissions.',
                simulationId: 'env-energy-grid',
                learningObjectives: [{ id: 'o-e-1', code: '0680.2.1.1', description: 'Compare fossil fuels and renewable energy resources', tier: 'both', simulationType: 'full_simulation', verifiedStatus: 'verified' }]
              }
            ]
          }
        ]
      },
      {
        id: 'env-u4',
        number: 4,
        title: 'Water and its Management',
        description: 'Hydrological water cycle, municipal water treatment, desalination, aquifer storage.',
        chapters: [
          {
            id: 'env-c4-1',
            number: '4.1',
            title: 'Aquifer Hydrology & Groundwater Management',
            description: 'Rainfall infiltration, over-abstraction, water table depression, saline intrusion.',
            concepts: [
              {
                id: 'env-conc-4-1-1',
                title: 'Aquifer Groundwater Balance & Saline Intrusion',
                description: 'Balance seasonal precipitation recharge against agricultural borehole abstraction.',
                simulationId: 'env-aquifer-management',
                learningObjectives: [{ id: 'o-e-2', code: '0680.4.1.1', description: 'Describe management strategies to conserve water supplies', tier: 'both', simulationType: 'full_simulation', verifiedStatus: 'verified' }]
              }
            ]
          }
        ]
      },
      {
        id: 'env-u7',
        number: 7,
        title: 'Atmosphere & Climate Systems',
        description: 'Enhanced greenhouse effect, global warming, radiative forcing, acid rain.',
        chapters: [
          {
            id: 'env-c7-1',
            number: '7.1',
            title: 'Greenhouse Radiative Forcing Climate Model',
            description: 'Solar shortwave radiation vs absorbed and re-emitted terrestrial longwave IR.',
            concepts: [
              {
                id: 'env-conc-7-1-1',
                title: 'Atmospheric Greenhouse Effect & Albedo Model',
                description: 'Vary CO₂ (ppm) and surface albedo to observe modelled mean global temperature rise.',
                simulationId: 'env-climate-model',
                learningObjectives: [{ id: 'o-e-3', code: '0680.7.1.1', description: 'Explain greenhouse effect and consequences of enhanced greenhouse effect', tier: 'both', simulationType: 'full_simulation', verifiedStatus: 'verified' }]
              }
            ]
          }
        ]
      },
      {
        id: 'env-u8',
        number: 8,
        title: 'Human Population',
        description: 'Population dynamics, birth and death rates, demographic transition model, population pyramids.',
        chapters: [
          {
            id: 'env-c8-1',
            number: '8.1',
            title: 'Demographic Transition & Population Pyramids',
            description: 'The 5 stages of DTM, dependency ratios, fertility trends.',
            concepts: [
              {
                id: 'env-conc-8-1-1',
                title: 'Demographic Transition Model & Population Simulator',
                description: 'Manipulate CBR, CDR, healthcare, female education to project age-sex pyramids.',
                simulationId: 'env-population-dynamics',
                learningObjectives: [{ id: 'o-e-4', code: '0680.8.1.1', description: 'Describe stages of Demographic Transition Model and interpret population pyramids', tier: 'both', simulationType: 'full_simulation', verifiedStatus: 'verified' }],
                keyEquations: ['\\text{RNI} = \\frac{\\text{CBR} - \\text{CDR}}{10}', 'T_d = \\frac{70}{\\text{RNI}}']
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
        description: 'Linear, quadratic, cubic, reciprocal and exponential graphs; tangents and gradients.',
        chapters: [
          {
            id: 'math-c2-3',
            number: '2.3',
            title: 'Dynamic Function Grapher & Tangent Slopes',
            description: 'Explore equations y = mx + c, parabolas y = ax² + bx + c, turning points, roots.',
            concepts: [
              {
                id: 'math-conc-2-3-1',
                title: 'Dynamic Function Grapher & Tangent Slopes',
                description: 'Plot curves, slide tangent point x₀ to observe instantaneous gradient and turning points.',
                simulationId: 'math-dynamic-grapher',
                learningObjectives: [{ id: 'o-m-1', code: '0580.2.3.1', description: 'Draw and interpret graphs of functions and estimate tangent gradients', tier: 'both', simulationType: 'full_simulation', verifiedStatus: 'verified' }],
                keyEquations: ['y = ax^2 + bx + c', 'm = 2ax + b']
              },
              {
                id: 'math-conc-2-3-2',
                title: 'Simultaneous Equations Intersection Solver',
                description: 'Plot two linear or quadratic equations to find exact intersection coordinates.',
                simulationId: 'math-simultaneous-solver',
                learningObjectives: [{ id: 'o-m-2', code: '0580.2.3.2', description: 'Solve simultaneous equations graphically', tier: 'both', simulationType: 'full_simulation', verifiedStatus: 'verified' }]
              }
            ]
          }
        ]
      },
      {
        id: 'math-u4',
        number: 4,
        title: 'Geometry & Circle Theorems',
        description: 'Angle properties, parallel lines, polygons, 7 circle theorems.',
        chapters: [
          {
            id: 'math-c4-1',
            number: '4.1',
            title: 'Interactive Circle Theorems Laboratory',
            description: 'Angle at centre is twice angle at circumference, angles in same segment, cyclic quads.',
            concepts: [
              {
                id: 'math-conc-4-1-1',
                title: 'Circle Theorems Interactive Geometry Bench',
                description: 'Drag points around circle circumference to prove circle theorems dynamically.',
                simulationId: 'math-circle-theorems',
                learningObjectives: [{ id: 'o-m-3', code: '0580.4.1.1', description: 'Apply circle theorems to calculate unknown angles', tier: 'supplement', simulationType: 'full_simulation', verifiedStatus: 'verified' }]
              }
            ]
          }
        ]
      },
      {
        id: 'math-u6',
        number: 6,
        title: 'Trigonometry',
        description: 'Right-angled SOHCAHTOA, unit circle, sine rule, cosine rule, 3D bearings.',
        chapters: [
          {
            id: 'math-c6-1',
            number: '6.1',
            title: 'Unit Circle & Trigonometric Ratios',
            description: 'Sine, cosine, tangent projection on unit circle across all 4 quadrants (0° to 360°).',
            concepts: [
              {
                id: 'math-conc-6-1-1',
                title: 'Unit Circle & Sine/Cosine Wave Generator',
                description: 'Rotate angle θ on unit circle to generate continuous sin(θ) and cos(θ) waves in real time.',
                simulationId: 'math-unit-circle',
                learningObjectives: [{ id: 'o-m-4', code: '0580.6.1.1', description: 'Understand trigonometric functions for angles up to 360°', tier: 'both', simulationType: 'full_simulation', verifiedStatus: 'verified' }],
                keyEquations: ['\\sin^2\\theta + \\cos^2\\theta = 1', '\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta}']
              },
              {
                id: 'math-conc-6-1-2',
                title: 'Sine & Cosine Rule Triangle Manipulator',
                description: 'Drag triangle vertices to solve non-right-angled triangles using a/sin(A) = b/sin(B).',
                simulationId: 'math-sine-cosine-rules',
                learningObjectives: [{ id: 'o-m-5', code: '0580.6.2.1', description: 'Apply the sine rule and cosine rule', tier: 'supplement', simulationType: 'full_simulation', verifiedStatus: 'verified' }],
                keyEquations: ['\\frac{a}{\\sin A} = \\frac{b}{\\sin B}', 'a^2 = b^2 + c^2 - 2bc\\cos A']
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
    syllabusPeriod: '2026–2028',
    units: [
      {
        id: 'cs-u1',
        number: 1,
        title: 'Data Representation',
        description: 'Binary, denary, hexadecimal, two’s complement, sound and image representation.',
        chapters: [
          {
            id: 'cs-c1-1',
            number: '1.1',
            title: 'Binary & Hexadecimal Number Converter',
            description: '8-bit binary bit switches, place values, hexadecimal nibble conversion.',
            concepts: [
              {
                id: 'cs-conc-1-1-1',
                title: '8-Bit Binary Bit Flipper & Hex Converter',
                description: 'Flip individual bits (128, 64, 32, 16, 8, 4, 2, 1) to convert binary to denary and hex.',
                simulationId: 'cs-binary-converter',
                learningObjectives: [{ id: 'o-cs-1', code: '0478.1.1.1', description: 'Convert between binary, denary and hexadecimal number systems', tier: 'both', simulationType: 'full_simulation', verifiedStatus: 'verified' }]
              },
              {
                id: 'cs-conc-1-1-2',
                title: 'Two’s Complement Signed Integer Bench',
                description: 'Represent negative numbers in binary using the most significant sign bit (-128).',
                simulationId: 'cs-twos-complement',
                learningObjectives: [{ id: 'o-cs-2', code: '0478.1.1.2', description: 'Represent positive and negative integers in two’s complement', tier: 'both', simulationType: 'full_simulation', verifiedStatus: 'verified' }]
              }
            ]
          }
        ]
      },
      {
        id: 'cs-u3',
        number: 3,
        title: 'Computer Architecture & Hardware',
        description: 'Von Neumann architecture, CPU registers, Fetch-Decode-Execute cycle, buses.',
        chapters: [
          {
            id: 'cs-c3-1',
            number: '3.1',
            title: 'Von Neumann CPU & FDE Cycle',
            description: 'PC, MAR, MDR, CIR, ACC registers, ALU, Control Unit, Address and Data buses.',
            concepts: [
              {
                id: 'cs-conc-3-1-1',
                title: 'Interactive Von Neumann CPU FDE Cycle Simulator',
                description: 'Step instruction by instruction through Fetch, Decode, and Execute cycles across registers.',
                simulationId: 'cs-cpu-fde',
                learningObjectives: [{ id: 'o-cs-3', code: '0478.3.1.1', description: 'Describe the Fetch-Decode-Execute cycle and CPU registers', tier: 'both', simulationType: 'full_simulation', verifiedStatus: 'verified' }]
              }
            ]
          }
        ]
      },
      {
        id: 'cs-u7',
        number: 7,
        title: 'Algorithms & Problem Solving',
        description: 'Bubble sort, linear search, binary search, trace tables.',
        chapters: [
          {
            id: 'cs-c7-1',
            number: '7.1',
            title: 'Sorting & Searching Visualizer',
            description: 'Live bar chart comparison of Bubble Sort, Linear Search, and Binary Search.',
            concepts: [
              {
                id: 'cs-conc-7-1-1',
                title: 'Visual Algorithm Laboratory (Bubble Sort & Binary Search)',
                description: 'Step through Bubble Sort element swaps and Binary Search divide-and-conquer in real time.',
                simulationId: 'cs-algorithm-visualizer',
                learningObjectives: [{ id: 'o-cs-4', code: '0478.7.4.1', description: 'Understand standard sorting and searching algorithms', tier: 'both', simulationType: 'full_simulation', verifiedStatus: 'verified' }]
              }
            ]
          }
        ]
      },
      {
        id: 'cs-u10',
        number: 10,
        title: 'Boolean Logic',
        description: 'Logic gates (AND, OR, NOT, NAND, NOR, XOR), truth tables, digital circuits.',
        chapters: [
          {
            id: 'cs-c10-1',
            number: '10.1',
            title: 'Logic Gates & Digital Circuit Breadboard',
            description: 'Construct combinational circuits, trace signals, auto-generate truth tables.',
            concepts: [
              {
                id: 'cs-conc-10-1-1',
                title: 'Interactive Logic Gate Breadboard & Truth Table Verifier',
                description: 'Wire digital gates (AND, OR, NOT, NAND, NOR, XOR) and observe live truth tables.',
                simulationId: 'cs-logic-gates',
                learningObjectives: [{ id: 'o-cs-5', code: '0478.10.1.1', description: 'Identify standard logic gates and construct truth tables', tier: 'both', simulationType: 'full_simulation', verifiedStatus: 'verified' }],
                keyEquations: ['Q = A \\cdot B', 'Q = A + B', 'Q = A \\oplus B']
              }
            ]
          }
        ]
      }
    ]
  }
};

// Geography and Business follow the Cambridge 2027–2029 syllabus content areas.
for (const [subjectId, subjectName, syllabusCode, topics] of [
  ['geography', 'Cambridge IGCSE Geography', '0460', ['Changing river environments', 'Changing coastal environments', 'Changing ecosystems', 'Tectonic hazards', 'Climate change', 'Changing populations', 'Changing towns and cities', 'Development', 'Changing economies', 'Resource provision']],
  ['business', 'Cambridge IGCSE Business', '0264', ['Understanding business activity', 'People in business', 'Marketing', 'Operations management', 'Financial information and decisions', 'External influences on business activity']],
] as const) {
  CURRICULUM_DATA[subjectId] = {
    subjectId, subjectName, syllabusCode, syllabusPeriod: '2027–2029',
    units: [{ id: `${subjectId}-unit-1`, number: 1, title: 'Syllabus topics', description: 'Cambridge syllabus content areas', chapters: topics.map((title, i) => ({
      id: `${subjectId}-chapter-${i + 1}`, number: String(i + 1), title,
      description: `Interactive syllabus investigations: ${title}.`, concepts: [],
    })) }],
  };
}
