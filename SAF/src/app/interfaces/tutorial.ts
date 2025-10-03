export interface Tutorial {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'principiante' | 'intermedio' | 'avanzado';
  level: string;
  duration: number;
  progress: number;
  icon: string;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'teal';
  objectives: string[];
  steps: TutorialStep[];
}

export interface TutorialStep {
  title: string;
  description: string;
  completed: boolean;
}

export type TutorialCategory = 'all' | 'basico' | 'facturacion' | 'reportes' | 'configuracion';

export type ViewMode = 'grid' | 'list';