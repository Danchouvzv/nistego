import React, { useEffect } from 'react';
import useGoalsStore from '../store/goalsStore';
import SubjectFilter from '../components/goals/SubjectFilter';
import QuarterFilter from '../components/goals/QuarterFilter';
import SearchBar from '../components/goals/SearchBar';
import ObjectiveGrid from '../components/goals/ObjectiveGrid';
import ObjectiveModal from '../components/goals/ObjectiveModal';
import ProgressSummary from '../components/goals/ProgressSummary';
import { CurriculumObjective, ObjectiveProgress } from '../types/curriculum';
import { Timestamp } from 'firebase/firestore';

// Mock data for initial objectives
const mockObjectives: CurriculumObjective[] = [
  {
    code: '10.3.2.1',
    title: 'Решение линейных уравнений',
    description: 'Научиться решать линейные уравнения вида ax + b = 0, где a и b - некоторые числа.',
    quarter: 1,
    unit: 'Алгебраические выражения',
    subjectId: 'math',
    locale: 'ru',
    progress: 75,
    errorRate: 0.15
  },
  {
    code: '10.3.2.2',
    title: 'Решение квадратных уравнений',
    description: 'Научиться решать квадратные уравнения вида ax² + bx + c = 0, где a, b и c - некоторые числа.',
    quarter: 1,
    unit: 'Алгебраические выражения',
    subjectId: 'math',
    locale: 'ru',
    progress: 60,
    errorRate: 0.25
  },
  {
    code: '10.3.3.1',
    title: 'Функция и ее график',
    description: 'Научиться строить графики функций и определять их свойства.',
    quarter: 2,
    unit: 'Функции',
    subjectId: 'math',
    locale: 'ru',
    progress: 40,
    errorRate: 0.3
  },
  {
    code: '10.4.1.1',
    title: 'Закон Ома',
    description: 'Изучить закон Ома и научиться применять его для расчета электрических цепей.',
    quarter: 2,
    unit: 'Электричество',
    subjectId: 'physics',
    locale: 'ru',
    progress: 85,
    errorRate: 0.1
  },
  {
    code: '10.4.2.1',
    title: 'Магнитное поле',
    description: 'Изучить свойства магнитного поля и его взаимодействие с проводниками с током.',
    quarter: 3,
    unit: 'Магнетизм',
    subjectId: 'physics',
    locale: 'ru',
    progress: 30,
    errorRate: 0.4
  },
  {
    code: '10.5.1.1',
    title: 'Типы химических связей',
    description: 'Изучить ковалентную, ионную и металлическую химические связи.',
    quarter: 1,
    unit: 'Химические связи',
    subjectId: 'chemistry',
    locale: 'ru',
    progress: 90,
    errorRate: 0.05
  }
];

// Mock data for objective progress
const mockObjectiveProgress: Record<string, ObjectiveProgress> = {
  '10.3.2.1': {
    objectiveCode: '10.3.2.1',
    progress: 75,
    lastUpdated: Timestamp.now(),
    attempts: 20,
    successfulAttempts: 15,
    streak: 3
  },
  '10.4.1.1': {
    objectiveCode: '10.4.1.1',
    progress: 85,
    lastUpdated: Timestamp.now(),
    attempts: 20,
    successfulAttempts: 17,
    streak: 5
  },
  '10.5.1.1': {
    objectiveCode: '10.5.1.1',
    progress: 90,
    lastUpdated: Timestamp.now(),
    attempts: 20,
    successfulAttempts: 18,
    streak: 7
  }
};

// Mock errors data
const mockErrors = [
  {
    id: 'error1',
    objectiveCode: '10.3.2.1',
    misConceptTag: 'wrong_definition',
    explanation: 'Ошибка при переносе слагаемых из одной части уравнения в другую',
    timestamp: Timestamp.now(),
    masteryDelta: -0.1
  },
  {
    id: 'error2',
    objectiveCode: '10.3.2.1',
    misConceptTag: 'calculation_error',
    explanation: 'Ошибка при делении обеих частей уравнения на коэффициент',
    timestamp: Timestamp.now(),
    masteryDelta: -0.05
  },
  {
    id: 'error3',
    objectiveCode: '10.4.1.1',
    misConceptTag: 'formula_error',
    explanation: 'Неправильное применение формулы для расчета сопротивления',
    timestamp: Timestamp.now(),
    masteryDelta: -0.15
  }
];

const Goals: React.FC = () => {
  const { 
    setObjectives, 
    setObjectiveProgress,
    setErrors,
    isLoading,
    setIsLoading
  } = useGoalsStore();
  
  // Load mock data on component mount
  useEffect(() => {
    let mounted = true;
    
    // Simulate API loading
    setIsLoading(true);
    
    // Simulate API calls with timeout
    const loadObjectives = setTimeout(() => {
      if (!mounted) return;
      setObjectives(mockObjectives);
      setObjectiveProgress(mockObjectiveProgress);
      setErrors(mockErrors);
      setIsLoading(false);
    }, 800); // Simulate network delay
    
    return () => { 
      mounted = false;
      clearTimeout(loadObjectives);
    };
  }, [setObjectives, setObjectiveProgress, setErrors, setIsLoading]);
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">
          Учебные цели
        </h1>
      </div>
      
      <ProgressSummary />
      
      <div className="mb-6">
        <SubjectFilter />
        <QuarterFilter />
        <SearchBar />
      </div>
      
      <ObjectiveGrid />
      <ObjectiveModal />
    </div>
  );
};

export default Goals; 