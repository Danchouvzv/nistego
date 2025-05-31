import { Timestamp } from 'firebase/firestore';

export type ObjectiveCode = string; // e.g. "10.3.2.1"
export type UnitCode = string; // e.g. "10.1A"
export type SubjectId = string; // e.g. "math"
export type Quarter = 1 | 2 | 3 | 4;
export type Locale = 'ru' | 'kk';

export interface CurriculumObjective {
  code: ObjectiveCode;
  title: string;
  description: string;
  quarter: Quarter;
  unit: UnitCode;
  subjectId: SubjectId;
  locale: Locale;
  progress?: number; // 0-100, derived server-side
  errorRate?: number; // 0-1, derived server-side
}

export interface MisConceptError {
  id: string;
  objectiveCode: ObjectiveCode;
  misConceptTag: string;
  explanation: string;
  timestamp: Timestamp;
  masteryDelta: number; // Change in mastery level (-1 to 1)
}

export interface ObjectiveProgress {
  objectiveCode: ObjectiveCode;
  progress: number; // 0-100
  lastUpdated: Timestamp;
  attempts: number;
  successfulAttempts: number;
  streak: number; // Consecutive successful attempts
}

export interface MiniLesson {
  id: string;
  objectiveCode: ObjectiveCode;
  title: string;
  content: string; // MDX content
  videoUrl?: string;
  imageUrl?: string;
  duration: number; // in minutes
}

export interface PracticeQuestion {
  id: string;
  objectiveCode: ObjectiveCode;
  question: string;
  options?: string[]; // For multiple choice
  correctAnswer: string | number;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation: string;
}

export interface Subject {
  id: SubjectId;
  name: string;
  color: string;
  icon: string;
}

// Mock subjects data
export const SUBJECTS: Record<SubjectId, Subject> = {
  math: { id: 'math', name: 'Математика', color: '#0056C7', icon: '📐' },
  physics: { id: 'physics', name: 'Физика', color: '#7209B7', icon: '⚛️' },
  chemistry: { id: 'chemistry', name: 'Химия', color: '#4CC9F0', icon: '🧪' },
  biology: { id: 'biology', name: 'Биология', color: '#38B000', icon: '🧬' },
  history: { id: 'history', name: 'История', color: '#BC6C25', icon: '📜' },
  literature: { id: 'literature', name: 'Литература', color: '#9D4EDD', icon: '📚' },
};

// Mock quarters data
export const QUARTERS: Quarter[] = [1, 2, 3, 4]; 