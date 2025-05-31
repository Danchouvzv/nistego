import { 
  CurriculumObjective, 
  MisConceptError, 
  ObjectiveProgress, 
  Quarter, 
  SubjectId,
  ObjectiveCode,
  Locale,
  PracticeQuestion,
  MiniLesson
} from '../types/curriculum';
import { Timestamp } from 'firebase/firestore';

// Mock data for development purposes
// In production, these would be API calls to the backend
const MOCK_OBJECTIVES: CurriculumObjective[] = [
  {
    code: '10.5.1.1',
    title: 'Монотонность функции на промежутке',
    description: 'Знать понятие монотонности функции на промежутке',
    quarter: 1,
    unit: '10.1A',
    subjectId: 'math',
    locale: 'ru',
    progress: 75,
    errorRate: 0.15
  },
  {
    code: '10.5.1.2',
    title: 'Доказательство монотонности функции',
    description: 'Доказывать по определению монотонность функции на промежутке в несложных случаях',
    quarter: 1,
    unit: '10.1A',
    subjectId: 'math',
    locale: 'ru',
    progress: 60,
    errorRate: 0.25
  },
  {
    code: '10.5.1.3',
    title: 'Ограниченность функций',
    description: 'Знать определение ограниченной функции и приводить примеры таких функций',
    quarter: 1,
    unit: '10.1A',
    subjectId: 'math',
    locale: 'ru',
    progress: 45,
    errorRate: 0.3
  },
  {
    code: '10.5.1.4',
    title: 'Четность функций',
    description: 'Знать определения четных и нечетных функций',
    quarter: 1,
    unit: '10.1A',
    subjectId: 'math',
    locale: 'ru',
    progress: 90,
    errorRate: 0.1
  },
  {
    code: '10.3.2.1',
    title: 'Параллельные и скрещивающиеся прямые',
    description: 'Знать определение параллельных и скрещивающихся прямых в пространстве, уметь распознавать и изображать их на чертеже',
    quarter: 1,
    unit: '10.1B',
    subjectId: 'math',
    locale: 'ru',
    progress: 85,
    errorRate: 0.05
  }
];

const MOCK_PROGRESS: Record<ObjectiveCode, ObjectiveProgress> = {
  '10.5.1.1': {
    objectiveCode: '10.5.1.1',
    progress: 75,
    lastUpdated: Timestamp.now(),
    attempts: 8,
    successfulAttempts: 6,
    streak: 3
  },
  '10.5.1.2': {
    objectiveCode: '10.5.1.2',
    progress: 60,
    lastUpdated: Timestamp.now(),
    attempts: 5,
    successfulAttempts: 3,
    streak: 1
  },
  '10.5.1.3': {
    objectiveCode: '10.5.1.3',
    progress: 45,
    lastUpdated: Timestamp.now(),
    attempts: 4,
    successfulAttempts: 2,
    streak: 0
  },
  '10.5.1.4': {
    objectiveCode: '10.5.1.4',
    progress: 90,
    lastUpdated: Timestamp.now(),
    attempts: 10,
    successfulAttempts: 9,
    streak: 5
  },
  '10.3.2.1': {
    objectiveCode: '10.3.2.1',
    progress: 85,
    lastUpdated: Timestamp.now(),
    attempts: 7,
    successfulAttempts: 6,
    streak: 4
  }
};

const MOCK_ERRORS: MisConceptError[] = [
  {
    id: 'error1',
    objectiveCode: '10.5.1.2',
    misConceptTag: 'wrong_definition',
    explanation: 'Неверное понимание определения монотонности функции',
    timestamp: Timestamp.now(),
    masteryDelta: -0.1
  },
  {
    id: 'error2',
    objectiveCode: '10.5.1.3',
    misConceptTag: 'incomplete_understanding',
    explanation: 'Неполное понимание ограниченности функции',
    timestamp: Timestamp.now(),
    masteryDelta: -0.15
  }
];

const MOCK_LESSONS: Record<ObjectiveCode, MiniLesson[]> = {
  '10.5.1.1': [
    {
      id: 'lesson1',
      objectiveCode: '10.5.1.1',
      title: 'Введение в монотонность функции',
      content: `
# Монотонность функции на промежутке

Функция называется **возрастающей** на промежутке, если для любых точек x₁ и x₂ из этого промежутка, таких что x₁ < x₂, выполняется неравенство f(x₁) < f(x₂).

Функция называется **убывающей** на промежутке, если для любых точек x₁ и x₂ из этого промежутка, таких что x₁ < x₂, выполняется неравенство f(x₁) > f(x₂).

Возрастающие и убывающие функции называются **монотонными**.

## Примеры

1. Функция f(x) = x² является возрастающей на промежутке [0, +∞) и убывающей на промежутке (-∞, 0].
2. Функция f(x) = x³ является возрастающей на всей числовой прямой.
`,
      duration: 10
    }
  ],
  '10.5.1.3': [
    {
      id: 'lesson2',
      objectiveCode: '10.5.1.3',
      title: 'Ограниченность функций',
      content: `
# Ограниченность функций

Функция f(x) называется **ограниченной сверху** на множестве X, если существует такое число M, что f(x) ≤ M для всех x ∈ X.

Функция f(x) называется **ограниченной снизу** на множестве X, если существует такое число m, что f(x) ≥ m для всех x ∈ X.

Функция f(x) называется **ограниченной** на множестве X, если она ограничена и сверху, и снизу на этом множестве.

## Примеры

1. Функция f(x) = sin(x) ограничена на всей числовой прямой, так как -1 ≤ sin(x) ≤ 1 для всех x.
2. Функция f(x) = x² ограничена снизу на всей числовой прямой, так как x² ≥ 0 для всех x, но не ограничена сверху.
`,
      duration: 15
    }
  ]
};

const MOCK_PRACTICE: Record<ObjectiveCode, PracticeQuestion[]> = {
  '10.5.1.1': [
    {
      id: 'q1',
      objectiveCode: '10.5.1.1',
      question: 'Какая из следующих функций является возрастающей на всей числовой прямой?',
      options: ['f(x) = x²', 'f(x) = x³', 'f(x) = sin(x)', 'f(x) = |x|'],
      correctAnswer: 'f(x) = x³',
      difficulty: 'easy',
      explanation: 'Функция f(x) = x³ является возрастающей на всей числовой прямой, так как для любых x₁ < x₂ выполняется неравенство x₁³ < x₂³.'
    },
    {
      id: 'q2',
      objectiveCode: '10.5.1.1',
      question: 'На каком из следующих промежутков функция f(x) = x² - 4x + 3 является убывающей?',
      options: ['(-∞, 0)', '(0, 2)', '(2, +∞)', '(-∞, 2)'],
      correctAnswer: '(0, 2)',
      difficulty: 'medium',
      explanation: 'Для определения промежутков монотонности функции f(x) = x² - 4x + 3 найдем ее производную: f\'(x) = 2x - 4. Функция убывает, когда f\'(x) < 0, то есть 2x - 4 < 0, откуда x < 2. Таким образом, функция убывает на промежутке (-∞, 2), в том числе и на (0, 2).'
    }
  ],
  '10.5.1.3': [
    {
      id: 'q3',
      objectiveCode: '10.5.1.3',
      question: 'Какая из следующих функций ограничена на всей числовой прямой?',
      options: ['f(x) = x²', 'f(x) = e^x', 'f(x) = sin(x)', 'f(x) = 1/x'],
      correctAnswer: 'f(x) = sin(x)',
      difficulty: 'easy',
      explanation: 'Функция f(x) = sin(x) ограничена на всей числовой прямой, так как -1 ≤ sin(x) ≤ 1 для всех x.'
    }
  ]
};

/**
 * Fetch curriculum objectives
 */
export async function fetchObjectives(
  subject?: SubjectId,
  quarter?: Quarter,
  locale: Locale = 'ru'
): Promise<CurriculumObjective[]> {
  // In production, this would be an API call
  // return fetch(`/api/objectives?subject=${subject}&quarter=${quarter}&locale=${locale}`)
  //   .then(res => res.json());
  
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredObjectives = [...MOCK_OBJECTIVES];
      
      if (subject) {
        filteredObjectives = filteredObjectives.filter(o => o.subjectId === subject);
      }
      
      if (quarter) {
        filteredObjectives = filteredObjectives.filter(o => o.quarter === quarter);
      }
      
      filteredObjectives = filteredObjectives.filter(o => o.locale === locale);
      
      resolve(filteredObjectives);
    }, 500); // Simulate network delay
  });
}

/**
 * Fetch objective progress
 */
export async function fetchObjectiveProgress(objectiveCode: ObjectiveCode): Promise<ObjectiveProgress | null> {
  // In production, this would be an API call
  // return fetch(`/api/progress/${objectiveCode}`).then(res => res.json());
  
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_PROGRESS[objectiveCode] || null);
    }, 300);
  });
}

/**
 * Update objective progress
 */
export async function updateObjectiveProgress(
  objectiveCode: ObjectiveCode,
  progress: Partial<ObjectiveProgress>
): Promise<ObjectiveProgress> {
  // In production, this would be an API call
  // return fetch(`/api/progress/${objectiveCode}`, {
  //   method: 'PUT',
  //   body: JSON.stringify(progress),
  //   headers: { 'Content-Type': 'application/json' }
  // }).then(res => res.json());
  
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      const current = MOCK_PROGRESS[objectiveCode] || {
        objectiveCode,
        progress: 0,
        lastUpdated: Timestamp.now(),
        attempts: 0,
        successfulAttempts: 0,
        streak: 0
      };
      
      const updated = {
        ...current,
        ...progress,
        lastUpdated: Timestamp.now()
      };
      
      MOCK_PROGRESS[objectiveCode] = updated;
      resolve(updated);
    }, 300);
  });
}

/**
 * Fetch errors for an objective
 */
export async function fetchObjectiveErrors(objectiveCode: ObjectiveCode): Promise<MisConceptError[]> {
  // In production, this would be an API call
  // return fetch(`/api/errors/${objectiveCode}`).then(res => res.json());
  
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      const errors = MOCK_ERRORS.filter(e => e.objectiveCode === objectiveCode);
      resolve(errors);
    }, 300);
  });
}

/**
 * Fetch mini lessons for an objective
 */
export async function fetchObjectiveLessons(objectiveCode: ObjectiveCode): Promise<MiniLesson[]> {
  // In production, this would be an API call
  // return fetch(`/api/lessons/${objectiveCode}`).then(res => res.json());
  
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      const lessons = MOCK_LESSONS[objectiveCode] || [];
      resolve(lessons);
    }, 300);
  });
}

/**
 * Fetch practice questions for an objective
 */
export async function fetchPracticeQuestions(
  objectiveCode: ObjectiveCode,
  count: number = 5,
  difficulty: 'easy' | 'medium' | 'hard' | 'adaptive' = 'adaptive'
): Promise<PracticeQuestion[]> {
  // In production, this would be an API call
  // return fetch(`/api/practice?objectiveCode=${objectiveCode}&count=${count}&difficulty=${difficulty}`)
  //   .then(res => res.json());
  
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      const questions = MOCK_PRACTICE[objectiveCode] || [];
      
      if (difficulty !== 'adaptive') {
        const filteredQuestions = questions.filter(q => q.difficulty === difficulty);
        resolve(filteredQuestions.slice(0, count));
      } else {
        resolve(questions.slice(0, count));
      }
    }, 300);
  });
}

/**
 * Evaluate practice answers
 */
export async function evaluatePracticeAnswers(
  objectiveCode: ObjectiveCode,
  answers: Array<{ id: string; userAnswer: string | number }>
): Promise<{
  correct: boolean;
  misConceptTag?: string;
  explanation?: string;
  masteryDelta: number;
}> {
  // In production, this would be an API call to Gemini
  // return fetch(`/api/evaluate`, {
  //   method: 'POST',
  //   body: JSON.stringify({ objectiveCode, answers }),
  //   headers: { 'Content-Type': 'application/json' }
  // }).then(res => res.json());
  
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      const questions = MOCK_PRACTICE[objectiveCode] || [];
      const questionMap = questions.reduce((map, q) => {
        map[q.id] = q;
        return map;
      }, {} as Record<string, PracticeQuestion>);
      
      const correctAnswers = answers.filter(a => {
        const question = questionMap[a.id];
        return question && question.correctAnswer === a.userAnswer;
      });
      
      const isAllCorrect = correctAnswers.length === answers.length;
      
      if (isAllCorrect) {
        resolve({
          correct: true,
          masteryDelta: 0.1
        });
      } else {
        const wrongAnswerId = answers.find(a => {
          const question = questionMap[a.id];
          return question && question.correctAnswer !== a.userAnswer;
        })?.id;
        
        const wrongQuestion = wrongAnswerId ? questionMap[wrongAnswerId] : null;
        
        resolve({
          correct: false,
          misConceptTag: 'incorrect_answer',
          explanation: wrongQuestion ? 
            `Неверный ответ на вопрос: ${wrongQuestion.question}. Правильный ответ: ${wrongQuestion.correctAnswer}. ${wrongQuestion.explanation}` : 
            'Некоторые ответы неверны.',
          masteryDelta: -0.05
        });
      }
    }, 500);
  });
}

/**
 * Add objective to planner
 */
export async function addObjectiveToPlanner(
  _objectiveCode: ObjectiveCode, // Prefixed with underscore to indicate it's intentionally unused
  _date: Date // Prefixed with underscore to indicate it's intentionally unused
): Promise<{ success: boolean; taskId?: string }> {
  // In production, this would be an API call
  // return fetch(`/api/planner/add-objective`, {
  //   method: 'POST',
  //   body: JSON.stringify({ objectiveCode, date }),
  //   headers: { 'Content-Type': 'application/json' }
  // }).then(res => res.json());
  
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        taskId: `task_${Date.now()}`
      });
    }, 300);
  });
} 