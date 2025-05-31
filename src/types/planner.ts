import { Timestamp } from 'firebase/firestore';

export type SubjectId = string;
export type GoalId = string;
export type TaskId = string;
export type WeekId = string;

export interface Task {
  id: TaskId;
  title: string;
  subjectId: SubjectId;
  linkedGoalId: GoalId;
  dueDate: Date | Timestamp;
  estimatedEffort: number; // in minutes
  status: 'pending' | 'completed' | 'in_progress';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  position: number; // for ordering within a day
  pomodoroCount?: number;
  checklist?: {
    id: string;
    text: string;
    completed: boolean;
  }[];
  description?: string;
  priority: 'low' | 'medium' | 'high';
  goalId?: string;
  tags: string[];
}

export interface WeekPlan {
  id: WeekId;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  weekStart: Date;
  meta: {
    streak: number;
    totalStudyHours: number;
    completedTasks: number;
    totalTasks: number;
  };
  tasks: Task[];
}

export interface Subject {
  id: SubjectId;
  name: string;
  color: string;
  icon: string;
}

export interface Goal {
  id: string;
  code: string;
  title: string;
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed';
  description: string;
  subject: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface MiniLesson {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  duration: number; // in minutes
}

export interface SmartInsight {
  type: 'error' | 'recommendation' | 'achievement';
  title: string;
  description: string;
  createdAt: Timestamp;
  priority: number; // 1-5
  relatedSubjectId?: SubjectId;
  relatedGoalId?: GoalId;
}

export type ViewMode = 'calendar' | 'list' | 'timeline';

export interface PlannerState {
  currentWeekStart: Date;
  viewMode: ViewMode;
  selectedSubjects: SubjectId[];
  showHeatmap: boolean;
  activeTask?: TaskId;
  draggingTask?: TaskId;
} 