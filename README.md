# IGCSE LAB

An interactive Cambridge IGCSE learning laboratory with **100 simulation entries per subject** and **700 individual `.tsx` simulation files** in total.

## Subjects

| Subject | Cambridge code | Syllabus period | Simulations |
| --- | ---: | --- | ---: |
| Physics | 0625 | 2026-2028 | 100 |
| Chemistry | 0620 | 2026-2028 | 100 |
| Biology | 0610 | 2026-2028 | 100 |
| Environmental Management | 0680 | 2027-2029 | 100 |
| Mathematics | 0580 | 2025-2027 | 100 |
| Computer Science | 0478 | 2026-2028 | 100 |
| Additional Mathematics | 0606 | 2028-2030 | 100 |

## Run locally

```bash
npm install
npm run dev
```

Build production assets with `npm run build`. Recreate the individual simulation entry files from the syllabus manifest with `npm run generate:simulations`.

## Structure

```text
src/
  App.jsx                         Subject library, search, and lazy simulation routing
  main.jsx                        Application entry point
  simulation-library/
    curriculum.json                Subject chapters, objectives, and model principles
    catalog.ts                     700 simulation records generated from the syllabus map
    models.ts                      Interactive calculations and variable definitions
    SimulationLab.jsx              Shared lab interface, live outputs, trial log, CSV export
  simulations/
    physics/                       100 individual TSX simulation modules
    chemistry/                     100 individual TSX simulation modules
    biology/                       100 individual TSX simulation modules
    environmental/                 100 individual TSX simulation modules
    mathematics/                   100 individual TSX simulation modules
    computerscience/               100 individual TSX simulation modules
    additionalmaths/               100 individual TSX simulation modules
scripts/
  generate-simulation-files.mjs    Creates missing route components while preserving existing files
```

Each simulation entry has its own ID and syllabus topic, investigation prompt, and starting conditions. The shared lab provides adjustable controls, calculations, diagrams, trial recording, and CSV export. Models are idealised teaching models; their assumptions and equations are shown in the lab.

The official Cambridge syllabus documents are the authority for course content and assessment requirements. Additional Mathematics follows Cambridge IGCSE 0606 for exams in 2028 to 2030. Update `src/simulation-library/curriculum.json` when adopting a later syllabus period.
