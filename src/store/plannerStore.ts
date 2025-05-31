import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { PlannerState, Task, WeekPlan, SmartInsight } from '../types/planner';
import { startOfWeek } from 'date-fns';
import { Timestamp } from 'firebase/firestore';

interface PlannerStore extends PlannerState {
  weekPlan: WeekPlan | null;
  insights: SmartInsight[];
  isQuickAddOpen: boolean;
  isInsightsOpen: boolean;
  setViewMode: (mode: PlannerState['viewMode']) => void;
  setCurrentWeekStart: (date: Date) => void;
  setSelectedSubjects: (subjects: string[]) => void;
  setShowHeatmap: (show: boolean) => void;
  setWeekPlan: (plan: WeekPlan | null) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  addTask: (task: Task) => void;
  removeTask: (taskId: string) => void;
  setInsights: (insights: SmartInsight[]) => void;
  setQuickAddOpen: (isOpen: boolean) => void;
  setInsightsOpen: (isOpen: boolean) => void;
}

const usePlannerStore = create<PlannerStore>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        currentWeekStart: startOfWeek(new Date()),
        viewMode: 'calendar',
        selectedSubjects: [],
        showHeatmap: false,
        weekPlan: null,
        insights: [],
        isQuickAddOpen: false,
        isInsightsOpen: false,

        // Actions
        setViewMode: (mode) => set({ viewMode: mode }),
        setCurrentWeekStart: (date) => set({ currentWeekStart: date }),
        setSelectedSubjects: (subjects) => set({ selectedSubjects: subjects }),
        setShowHeatmap: (show) => set({ showHeatmap: show }),
        setWeekPlan: (plan) => set({ weekPlan: plan }),
        updateTask: (taskId, updates) =>
          set((state) => ({
            weekPlan: state.weekPlan
              ? {
                  ...state.weekPlan,
                  tasks: state.weekPlan.tasks.map((task) =>
                    task.id === taskId ? { ...task, ...updates } : task
                  ),
                }
              : null,
          })),
        addTask: (task) =>
          set((state) => ({
            weekPlan: state.weekPlan
              ? {
                  ...state.weekPlan,
                  tasks: [...state.weekPlan.tasks, task],
                }
              : {
                  id: 'new',
                  createdAt: Timestamp.now(),
                  updatedAt: Timestamp.now(),
                  weekStart: state.currentWeekStart,
                  meta: {
                    streak: 0,
                    totalStudyHours: 0,
                    completedTasks: 0,
                    totalTasks: 1,
                  },
                  tasks: [task],
                },
          })),
        removeTask: (taskId) =>
          set((state) => ({
            weekPlan: state.weekPlan
              ? {
                  ...state.weekPlan,
                  tasks: state.weekPlan.tasks.filter((task) => task.id !== taskId),
                }
              : null,
          })),
        setInsights: (insights) => set({ insights }),
        setQuickAddOpen: (isOpen) => set({ isQuickAddOpen: isOpen }),
        setInsightsOpen: (isOpen) => set({ isInsightsOpen: isOpen }),
      }),
      {
        name: 'planner-storage',
        partialize: (state) => ({
          currentWeekStart: state.currentWeekStart,
          selectedSubjects: state.selectedSubjects,
          showHeatmap: state.showHeatmap,
          weekPlan: state.weekPlan,
        }),
      }
    )
  )
);

export default usePlannerStore; 