import { SubjectId } from './curriculum';

export type LearningMode = 'explore' | 'guided' | 'predict' | 'challenge' | 'free_lab';

export interface SimulationParameter {
  id: string;
  name: string;
  symbol?: string;
  unit?: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  description: string;
  category?: 'primary' | 'secondary' | 'environmental';
}

export interface MeasurementDefinition {
  id: string;
  label: string;
  symbol?: string;
  unit: string;
  precision: number;
  formula?: string;
}

export interface SimulationChallenge {
  id: string;
  title: string;
  difficulty: 'Foundation' | 'Intermediate' | 'Advanced';
  description: string;
  hint: string;
  targetCriteria: {
    property: string;
    targetValue: number;
    tolerance: number;
    unit: string;
  };
  explanationOnSuccess: string;
}

export interface GuidedStep {
  stepNumber: number;
  instruction: string;
  actionRequired: string;
  scientificInsight: string;
}

export interface SimulationLogEntry {
  id: string;
  timestamp: string;
  parameters: Record<string, number | string | boolean>;
  measurements: Record<string, number | string>;
  notes?: string;
}

export interface SimulationMetadata {
  id: string;
  subjectId: SubjectId;
  unitId: string;
  chapterId: string;
  title: string;
  subtitle: string;
  syllabusCode: string; // e.g. "0625.2.1"
  difficulty: 'Core' | 'Extended' | 'Both';
  visualType?: string;
  learningObjectives: string[];
  scientificPrinciples: string[];
  assumptions: string[];
  parameters: SimulationParameter[];
  measurements: MeasurementDefinition[];
  challenges: SimulationChallenge[];
  guidedSteps: GuidedStep[];
  defaultMode: LearningMode;
  formulae: string[];
  tags: string[];
}
