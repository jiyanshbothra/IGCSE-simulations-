import { mkdir, open, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const curriculum = JSON.parse(await readFile(path.join(root, 'src/simulation-library/curriculum.json'), 'utf8'));
let created = 0;
let preserved = 0;
for (const subject of curriculum.subjects) {
  const directory = path.join(root, 'src/simulations', subject.id);
  await mkdir(directory, { recursive: true });
  const componentPrefix = ({ computerscience: 'ComputerScience', additionalmaths: 'AdditionalMaths' })[subject.id] ?? subject.id[0].toUpperCase() + subject.id.slice(1);
  for (let index = 1; index <= 100; index += 1) {
    const number = String(index).padStart(3, '0');
    const filename = `${componentPrefix}${number}.tsx`;
    const source = `import { SimulationLab } from '../../simulation-library/SimulationLab';\n\nexport default function ${componentPrefix}${number}() {\n  return <SimulationLab simulationId="${subject.id}-${number}" />;\n}\n`;
    try {
      const file = await open(path.join(directory, filename), 'wx');
      try { await file.writeFile(source, 'utf8'); created += 1; }
      finally { await file.close(); }
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
      preserved += 1;
    }
  }
}
console.log(`Created ${created} modules; preserved ${preserved} existing modules.`);
