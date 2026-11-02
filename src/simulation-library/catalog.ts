import curriculum from './curriculum.json';

export type SubjectId = 'physics' | 'chemistry' | 'biology' | 'environmental' | 'mathematics' | 'computerscience' | 'additionalmaths';
export interface Topic { code: string; title: string; objective: string; visual: string; operation: string; principle: string }
export interface Subject { id: SubjectId; name: string; code: string; period: string; color: string; icon: string; topics: Topic[] }
export interface LabSpec { id: string; subjectId: SubjectId; subjectName: string; subjectCode: string; period: string; color: string; chapterCode: string; chapter: string; title: string; objective: string; visual: string; operation: string; principle: string; lens: string; variant: number }

const lenses = [
  'Start with a reference', 'Trace the response', 'Hold conditions steady', 'Compare two settings',
  'Test for proportionality', 'Find the boundary', 'Infer an unknown value', 'Build a data set',
  'Read the graph', 'Check the precision', 'Test repeatability', 'Predict, then measure',
  'Locate the threshold', 'Find the optimum', 'Explain the result', 'Transfer the model',
  'Audit the balance', 'Model against evidence', 'Challenge the assumptions', 'Plan a fair test',
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
  const serial = String(index + 1).padStart(3, '0');
  return {
    id: `${subject.id}-${serial}`, subjectId: subject.id, subjectName: subject.name, subjectCode: subject.code,
    period: subject.period, color: subject.color, chapterCode: topic.code, chapter: topic.title,
    title: `${lens}${variant > lenses.length ? ` ${variant}` : ''} · ${topic.title}`,
    objective: topic.objective, visual: topic.visual, operation: topic.operation, principle: topic.principle, lens, variant,
  };
}));

export const LAB_BY_ID = Object.fromEntries(LABS.map((lab) => [lab.id, lab])) as Record<string, LabSpec>;
export const LABS_BY_SUBJECT = Object.fromEntries(SUBJECTS.map((subject) => [subject.id, LABS.filter((lab) => lab.subjectId === subject.id)])) as Record<SubjectId, LabSpec[]>;

if (LABS.length !== 700 || SUBJECTS.length !== 7 || SUBJECTS.some((subject) => LABS_BY_SUBJECT[subject.id].length !== 100)) {
  throw new Error('The simulation library must contain exactly 100 simulations for each of its seven subjects.');
}
