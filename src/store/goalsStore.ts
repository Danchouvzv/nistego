import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { 
  CurriculumObjective, 
  MisConceptError, 
  ObjectiveProgress, 
  Quarter, 
  SubjectId,
  ObjectiveCode,
  Locale
} from '../types/curriculum';

interface GoalsState {
  // Filters
  selectedSubject: SubjectId | null;
  selectedQuarter: Quarter | null;
  selectedLocale: Locale;
  searchQuery: string;
  
  // Data
  objectives: CurriculumObjective[];
  objectiveProgress: Record<ObjectiveCode, ObjectiveProgress>;
  errors: MisConceptError[];
  
  // UI state
  isLoading: boolean;
  selectedObjective: ObjectiveCode | null;
  isObjectiveModalOpen: boolean;
  activeTab: 'lesson' | 'practice' | 'errors';
}

interface GoalsActions {
  // Filter actions
  setSelectedSubject: (subject: SubjectId | null) => void;
  setSelectedQuarter: (quarter: Quarter | null) => void;
  setSelectedLocale: (locale: Locale) => void;
  setSearchQuery: (query: string) => void;
  
  // Data actions
  setObjectives: (objectives: CurriculumObjective[]) => void;
  setObjectiveProgress: (progress: Record<ObjectiveCode, ObjectiveProgress>) => void;
  updateObjectiveProgress: (objectiveCode: ObjectiveCode, progress: Partial<ObjectiveProgress>) => void;
  setErrors: (errors: MisConceptError[]) => void;
  addError: (error: MisConceptError) => void;
  
  // UI actions
  setIsLoading: (isLoading: boolean) => void;
  setSelectedObjective: (objectiveCode: ObjectiveCode | null) => void;
  openObjectiveModal: (objectiveCode: ObjectiveCode) => void;
  closeObjectiveModal: () => void;
  setActiveTab: (tab: 'lesson' | 'practice' | 'errors') => void;
  
  // Computed
  getFilteredObjectives: () => CurriculumObjective[];
  getObjectiveById: (objectiveCode: ObjectiveCode) => CurriculumObjective | undefined;
  getObjectiveProgress: (objectiveCode: ObjectiveCode) => ObjectiveProgress | undefined;
  getObjectiveErrors: (objectiveCode: ObjectiveCode) => MisConceptError[];
}

type GoalsStore = GoalsState & GoalsActions;

const useGoalsStore = create<GoalsStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        selectedSubject: 'math',
        selectedQuarter: null,
        selectedLocale: 'ru',
        searchQuery: '',
        
        objectives: [],
        objectiveProgress: {},
        errors: [],
        
        isLoading: false,
        selectedObjective: null,
        isObjectiveModalOpen: false,
        activeTab: 'lesson',
        
        // Filter actions
        setSelectedSubject: (subject) => set({ selectedSubject: subject }),
        setSelectedQuarter: (quarter) => set({ selectedQuarter: quarter }),
        setSelectedLocale: (locale) => set({ selectedLocale: locale }),
        setSearchQuery: (query) => set({ searchQuery: query }),
        
        // Data actions
        setObjectives: (objectives) => set({ objectives }),
        setObjectiveProgress: (progress) => set({ objectiveProgress: progress }),
        updateObjectiveProgress: (objectiveCode, progress) => set((state) => ({
          objectiveProgress: {
            ...state.objectiveProgress,
            [objectiveCode]: {
              ...state.objectiveProgress[objectiveCode],
              ...progress
            }
          }
        })),
        setErrors: (errors) => set({ errors }),
        addError: (error) => set((state) => ({
          errors: [...state.errors, error]
        })),
        
        // UI actions
        setIsLoading: (isLoading) => set({ isLoading }),
        setSelectedObjective: (objectiveCode) => set({ selectedObjective: objectiveCode }),
        openObjectiveModal: (objectiveCode) => set({ 
          selectedObjective: objectiveCode,
          isObjectiveModalOpen: true 
        }),
        closeObjectiveModal: () => set({ 
          isObjectiveModalOpen: false,
          selectedObjective: null
        }),
        setActiveTab: (tab) => set({ activeTab: tab }),
        
        // Computed
        getFilteredObjectives: () => {
          const { objectives, selectedSubject, selectedQuarter, selectedLocale, searchQuery } = get();
          
          return objectives.filter(objective => {
            // Filter by subject
            if (selectedSubject && objective.subjectId !== selectedSubject) {
              return false;
            }
            
            // Filter by quarter
            if (selectedQuarter && objective.quarter !== selectedQuarter) {
              return false;
            }
            
            // Filter by locale
            if (objective.locale !== selectedLocale) {
              return false;
            }
            
            // Filter by search query
            if (searchQuery) {
              const query = searchQuery.toLowerCase();
              return (
                objective.code.toLowerCase().includes(query) ||
                objective.title.toLowerCase().includes(query) ||
                objective.description.toLowerCase().includes(query)
              );
            }
            
            return true;
          });
        },
        
        getObjectiveById: (objectiveCode) => {
          return get().objectives.find(o => o.code === objectiveCode);
        },
        
        getObjectiveProgress: (objectiveCode) => {
          return get().objectiveProgress[objectiveCode];
        },
        
        getObjectiveErrors: (objectiveCode) => {
          return get().errors.filter(e => e.objectiveCode === objectiveCode);
        }
      }),
      {
        name: 'goals-storage',
        partialize: (state) => ({
          selectedSubject: state.selectedSubject,
          selectedQuarter: state.selectedQuarter,
          selectedLocale: state.selectedLocale,
          // Don't persist data that should be fetched from the server
        })
      }
    )
  )
);

export default useGoalsStore; 