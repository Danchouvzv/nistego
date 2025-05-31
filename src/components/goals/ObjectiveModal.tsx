import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CurriculumObjective, MiniLesson, PracticeQuestion } from '../../types/curriculum';
import useGoalsStore from '../../store/goalsStore';
import { fetchObjectiveLessons, fetchPracticeQuestions } from '../../services/curriculumService';
import { SUBJECTS } from '../../types/curriculum';

const ObjectiveModal: React.FC = () => {
  const { 
    selectedObjective, 
    isObjectiveModalOpen, 
    closeObjectiveModal, 
    getObjectiveById,
    getObjectiveProgress,
    activeTab,
    setActiveTab
  } = useGoalsStore();
  
  const [lessons, setLessons] = useState<MiniLesson[]>([]);
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const objective = selectedObjective ? getObjectiveById(selectedObjective) : null;
  const progress = selectedObjective ? getObjectiveProgress(selectedObjective) : null;
  
  useEffect(() => {
    if (selectedObjective && isObjectiveModalOpen) {
      setIsLoading(true);
      
      // Reset state when opening a new objective
      setCurrentLessonIndex(0);
      setActiveTab('lesson');
      
      // Fetch lessons and questions
      Promise.all([
        fetchObjectiveLessons(selectedObjective),
        fetchPracticeQuestions(selectedObjective)
      ])
        .then(([lessonData, questionData]) => {
          setLessons(lessonData);
          setQuestions(questionData);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error fetching objective data:', error);
          setIsLoading(false);
        });
    }
  }, [selectedObjective, isObjectiveModalOpen, setActiveTab]);
  
  if (!isObjectiveModalOpen || !objective) {
    return null;
  }
  
  const handleNextLesson = () => {
    if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    }
  };
  
  const handlePreviousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    }
  };
  
  const handleAnswerSelect = (index: number) => {
    if (!isAnswerSubmitted) {
      setSelectedAnswer(index);
    }
  };
  
  const handleAnswerSubmit = () => {
    if (selectedAnswer !== null) {
      setIsAnswerSubmitted(true);
    }
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    }
  };
  
  const handleStartPractice = () => {
    setActiveTab('practice');
  };
  
  const currentLesson = lessons[currentLessonIndex];
  const currentQuestion = questions[currentQuestionIndex];
  const isCorrect = selectedAnswer === currentQuestion.correctOptionIndex;
  const subjectColor = SUBJECTS[objective.subjectId]?.color || '#3B82F6';
  
  return (
    <AnimatePresence>
      {isObjectiveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="border-b border-gray-200 dark:border-gray-700 p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                    {objective.title}
                  </h2>
                  <p className="text-sm font-mono text-gray-500 dark:text-gray-400">
                    {objective.code}
                  </p>
                </div>
                <button
                  onClick={closeObjectiveModal}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Tabs */}
              <div className="flex mt-4 border-b border-gray-200 dark:border-gray-700">
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === 'lesson'
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                  onClick={() => setActiveTab('lesson')}
                >
                  Урок
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === 'practice'
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                  onClick={() => setActiveTab('practice')}
                >
                  Практика
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === 'errors'
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                  onClick={() => setActiveTab('errors')}
                >
                  Ошибки
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-4 max-h-[70vh] overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <>
                  {activeTab === 'lesson' && (
                    <div>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {objective.description}
                      </p>
                      
                      {/* Mini lessons carousel */}
                      <div className="mt-6">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                          Мини-уроки ({currentLessonIndex + 1}/{lessons.length})
                        </h3>
                        
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <h4 className="text-base font-medium text-gray-900 dark:text-white mb-2">
                            {currentLesson.title}
                          </h4>
                          
                          {currentLesson.imageUrl && (
                            <div className="flex justify-center mb-3">
                              <img 
                                src={currentLesson.imageUrl} 
                                alt={currentLesson.title} 
                                className="h-32 object-contain"
                              />
                            </div>
                          )}
                          
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {currentLesson.content}
                          </p>
                          
                          <div className="flex justify-between mt-4">
                            <button
                              onClick={handlePreviousLesson}
                              disabled={currentLessonIndex === 0}
                              className={`px-3 py-1 text-xs rounded-md ${
                                currentLessonIndex === 0
                                  ? 'bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500'
                                  : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                              }`}
                            >
                              Назад
                            </button>
                            <button
                              onClick={handleNextLesson}
                              disabled={currentLessonIndex === lessons.length - 1}
                              className={`px-3 py-1 text-xs rounded-md ${
                                currentLessonIndex === lessons.length - 1
                                  ? 'bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500'
                                  : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                              }`}
                            >
                              Далее
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'practice' && (
                    <div>
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                            Вопрос {currentQuestionIndex + 1} из {questions.length}
                          </h3>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {Math.round((progress?.correctAnswers || 0) / 
                              Math.max(1, (progress?.totalAnswers || 1)) * 100)}% правильных ответов
                          </span>
                        </div>
                        
                        <p className="text-base text-gray-800 dark:text-gray-200 mb-4">
                          {currentQuestion.text}
                        </p>
                        
                        <div className="space-y-2 mb-4">
                          {currentQuestion.options.map((option, index) => (
                            <button
                              key={index}
                              onClick={() => handleAnswerSelect(index)}
                              className={`w-full text-left p-3 rounded-md border ${
                                selectedAnswer === index
                                  ? isAnswerSubmitted
                                    ? isCorrect
                                      ? 'bg-green-100 border-green-400 dark:bg-green-900 dark:border-green-700'
                                      : 'bg-red-100 border-red-400 dark:bg-red-900 dark:border-red-700'
                                    : 'bg-blue-50 border-blue-400 dark:bg-blue-900 dark:border-blue-700'
                                  : isAnswerSubmitted && index === currentQuestion.correctOptionIndex
                                  ? 'bg-green-100 border-green-400 dark:bg-green-900 dark:border-green-700'
                                  : 'bg-white border-gray-300 dark:bg-gray-800 dark:border-gray-600'
                              } ${
                                isAnswerSubmitted ? 'cursor-default' : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                              }`}
                              disabled={isAnswerSubmitted}
                            >
                              <span className="text-sm text-gray-800 dark:text-gray-200">{option}</span>
                            </button>
                          ))}
                        </div>
                        
                        {isAnswerSubmitted && (
                          <div className={`p-3 rounded-md mb-4 ${
                            isCorrect
                              ? 'bg-green-50 dark:bg-green-900/30'
                              : 'bg-red-50 dark:bg-red-900/30'
                          }`}>
                            <p className={`text-sm ${
                              isCorrect
                                ? 'text-green-800 dark:text-green-300'
                                : 'text-red-800 dark:text-red-300'
                            }`}>
                              {isCorrect ? 'Правильно!' : 'Неправильно.'} {currentQuestion.explanation}
                            </p>
                          </div>
                        )}
                        
                        <div className="flex justify-end">
                          {!isAnswerSubmitted ? (
                            <button
                              onClick={handleAnswerSubmit}
                              disabled={selectedAnswer === null}
                              className={`px-4 py-2 text-sm font-medium rounded-md ${
                                selectedAnswer === null
                                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                                  : 'bg-blue-600 hover:bg-blue-700 text-white'
                              }`}
                            >
                              Проверить
                            </button>
                          ) : (
                            <button
                              onClick={handleNextQuestion}
                              disabled={currentQuestionIndex === questions.length - 1}
                              className={`px-4 py-2 text-sm font-medium rounded-md ${
                                currentQuestionIndex === questions.length - 1
                                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                                  : 'bg-blue-600 hover:bg-blue-700 text-white'
                              }`}
                            >
                              Следующий вопрос
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'errors' && (
                    <div className="text-center py-12">
                      <p className="text-gray-500 dark:text-gray-400">
                        История ошибок пока недоступна.
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
            
            {/* Footer */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {activeTab === 'lesson' && `Урок ${currentLessonIndex + 1} из ${lessons.length}`}
                {activeTab === 'practice' && `Вопрос ${currentQuestionIndex + 1} из ${questions.length}`}
              </div>
              
              <button
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md"
                onClick={handleStartPractice}
              >
                Начать практику
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ObjectiveModal; 