export type SubjectId = 
  | 'physics' 
  | 'chemistry' 
  | 'biology' 
  | 'environmental' 
  | 'mathematics' 
  | 'computerscience';

export interface SubjectMetadata {
  id: SubjectId;
  name: string;
  code: string;
  syllabusYear: string;
  tagline: string;
  description: string;
  themeColor: string;
  accentColor: string;
  gradient: string;
  iconName: string;
  unitCount: number;
  chapterCount: number;
  simulationCount: number;
}

export interface LearningObjective {
  id: string;
  code: string; // e.g. "0625.2.1.1"
  description: string;
  tier: 'core' | 'supplement' | 'both';
  simulationType: 'full_simulation' | 'interactive_visualisation' | 'virtual_experiment' | 'graph_model' | 'conceptual_tool';
  verifiedStatus: 'verified' | 'in_development' | 'planned';
}

export interface Concept {
  id: string;
  title: string;
  description: string;
  learningObjectives: LearningObjective[];
  simulationId?: string;
  keyEquations?: string[];
  keyTerms?: string[];
}

export interface Chapter {
  id: string;
  number: string;
  title: string;
  description: string;
  concepts: Concept[];
}

export interface Unit {
  id: string;
  number: number;
  title: string;
  description: string;
  chapters: Chapter[];
}

export interface SubjectCurriculum {
  subjectId: SubjectId;
  subjectName: string;
  syllabusCode: string;
  syllabusPeriod: string;
  units: Unit[];
}
