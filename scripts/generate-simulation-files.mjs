import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const curriculum = JSON.parse(await readFile(path.join(root, 'src/simulation-library/curriculum.json'), 'utf8'));
for (const subject of curriculum.subjects) {
  const directory = path.join(root, 'src/simulations', subject.id);
  await mkdir(directory, { recursive: true });
  const componentPrefix = subject.id === 'computerscience' ? 'ComputerScience' : subject.id[0].toUpperCase() + subject.id.slice(1);
  for (let index = 1; index <= 100; index += 1) {
    const number = String(index).padStart(3, '0');
    const filename = `${componentPrefix}${number}.tsx`;
    const source = `import { SimulationLab } from '../../simulation-library/SimulationLab';\n\nexport default function ${componentPrefix}${number}() {\n  return <SimulationLab simulationId="${subject.id}-${number}" />;\n}\n`;
    await writeFile(path.join(directory, filename), source, 'utf8');
  }
}
console.log(`Generated ${curriculum.subjects.length * 100} per-simulation TSX modules.`);
