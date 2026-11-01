# Cambridge IGCSE Interactive Simulation Platform (IGCSE LAB)

[![CAIE 2023-2026 Ready](https://img.shields.io/badge/Cambridge%20IGCSE-2023--2026%20Syllabus-0284c7.svg)](https://www.cambridgeinternational.org/)
[![Subjects Covered](https://img.shields.io/badge/Subjects-6%20Pure%20Disciplines-10b981.svg)](#the-six-igcse-subjects)
[![Pedagogical Paradigm](https://img.shields.io/badge/Model-Predict%20%E2%86%92%20Experiment%20%E2%86%92%20Understand-6366f1.svg)](#pedagogical-architecture)
[![Build Status](https://img.shields.io/badge/Build-Passing-emerald.svg)](#getting-started)

> **"Don't just read about science. Experiment with it."**  
> A high-fidelity virtual scientific and mathematical experimental platform designed specifically around the Cambridge Assessment International Education (CAIE) curriculum.

---

## 🌟 The Core Educational Vision

Most conventional revision websites focus on passive notes, static PDF diagrams, memorization flashcards, or non-interactive video animations.

**IGCSE LAB** transforms learning into an interactive experimental journey:
1. **Concept**: The student identifies a syllabus learning objective.
2. **Predict**: The student forms an initial scientific hypothesis before running the experiment.
3. **Experiment**: The student manipulates independent variables (temperature, volume, acid concentration, optical focus, demographic drivers, logic inputs) on high-frequency mathematical simulation canvases.
4. **Observe**: Dynamic SI sensor gauges, synchronized real-time graphs, and molecular/optical visualizations react instantaneously.
5. **Understand**: The platform provides conceptual feedback, alerts students to common misconceptions, and logs data for IGCSE Paper 6 Alternative to Practical analysis.

---

## 🔬 The Six IGCSE Subjects

The platform implements a strict hierarchy:  
**Home → Subject → Syllabus Unit → Chapter → Concept → Simulation Lab → Experiment Modes**

| Subject | Code | Examination Series | Core Simulation Toolkit |
| :--- | :--- | :--- | :--- |
| **Physics Pure** | `0625` | 2023–2026 | Ideal Gas Laws ($PV = nRT$), Kinetic particle collisions, Circuits ($V=IR$), Hooke's Law, Space physics |
| **Chemistry Pure** | `0620` | 2023–2026 | Volumetric acid-base burette titration, Reaction rates gas syringe, Molecular phases, Stoichiometry |
| **Biology Pure** | `0610` | 2023–2026 | Virtual optical microscope (4x–40x), Plant/animal cell cytology, Graticule measurement, Osmosis |
| **Environmental Management** | `0680` | 2024–2026 | Demographic Transition Model (5 Stages), Dynamic age-sex pyramids, Hydrology, Climate balance |
| **Mathematics Pure** | `0580` | 2025–2027 | Dynamic 2D coordinate grapher, Tangent slopes ($m = dy/dx$), Roots & vertices, Unit circle |
| **Computer Science** | `0478` | 2023–2026 | Logic gate breadboard (AND, OR, NOT, NAND, NOR, XOR), Signal trace wires, Dynamic truth tables |

---

## 🚀 Key Platform Features

- **Real-Time Physics & Chemical Computational Engines**: No static GIF animations or pre-recorded movie clips. Every simulation computes live state from fundamental equations.
- **Predict → Experiment → Explain Workflow**: Fosters genuine scientific methodology and addresses persistent student misconceptions.
- **Multiple Synchronized Representations**:
  - Microscopic particle view
  - High-precision digital gauges
  - Real-time line/scatter graphs
  - Tabular data logger
- **IGCSE Paper 6 (Alternative to Practical) Preparation**: Students can record multi-variable trials and export formatted CSV data tables for graphing and error analysis.
- **Curriculum Coverage Matrix**: 100% traceable mapping to official Cambridge syllabus assessment codes.

---

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript (Strict mode)
- **Styling**: Tailwind CSS with custom neon scientific lab aesthetics
- **Graphics & Physics**: Direct HTML5 2D Canvas with `requestAnimationFrame`, Scalable Vector Graphics (SVG)
- **Icons**: Lucide React
- **Build Tool**: Vite 5
- **Mathematical Typography**: KaTeX & LaTeX mathematical notation

---

## 💻 Getting Started Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/jiyanshbothra/IGCSE-simulations-.git
cd IGCSE-simulations-

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Building for Production

```bash
npm run build
```

The production-ready artifacts will be generated in the `dist/` directory.

---

## 📄 License & Attribution

Designed around official Cambridge Assessment International Education (CAIE) syllabuses for IGCSE Physics (0625), Chemistry (0620), Biology (0610), Environmental Management (0680), Mathematics (0580), and Computer Science (0478).
