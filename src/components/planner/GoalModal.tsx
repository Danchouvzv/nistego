import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Goal, MiniLesson } from '../../types/planner';

interface GoalModalProps {
  goal: Goal | null;
  onClose: () => void;
}

// Mock mini-lessons (in production, these would be fetched from a service)
const mockMiniLessons: MiniLesson[] = [
  {
    id: '1',
    title: 'Introduction',
    content: 'Let\'s start with the basics of this concept...',
    duration: 5,
  },
  {
    id: '2',
    title: 'Key Concepts',
    content: 'Here are the main points you need to understand...',
    duration: 10,
  },
  {
    id: '3',
    title: 'Practice Problems',
    content: 'Try solving these examples to reinforce your learning...',
    duration: 15,
  },
];

export const GoalModal: React.FC<GoalModalProps> = ({ goal, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!goal) return null;

  const handleNext = () => {
    if (currentSlide < mockMiniLessons.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const currentLesson = mockMiniLessons[currentSlide];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl mx-4 overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{goal.title}</h2>
                <p className="text-gray-500 dark:text-gray-400">Code: {goal.code}</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <span className="sr-only">Close</span>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Progress bar */}
            <div className="mt-4 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${goal.progress}%` }}
              />
            </div>
          </div>

          {/* Mini-lesson carousel */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-xl font-semibold">{currentLesson.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{currentLesson.content}</p>
                {currentLesson.imageUrl && (
                  <img
                    src={currentLesson.imageUrl}
                    alt={currentLesson.title}
                    className="w-full rounded-lg"
                  />
                )}
                {currentLesson.videoUrl && (
                  <div className="aspect-w-16 aspect-h-9">
                    <iframe
                      src={currentLesson.videoUrl}
                      className="w-full h-full rounded-lg"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <button
                  onClick={handlePrev}
                  disabled={currentSlide === 0}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                >
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentSlide === mockMiniLessons.length - 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                >
                  Next
                </button>
              </div>
              <button
                onClick={() => console.log('Start practice for goal:', goal.id)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Start Practice
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}; 