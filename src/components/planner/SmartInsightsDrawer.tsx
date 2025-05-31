import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SmartInsight } from '../../types/planner';

interface SmartInsightsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  insights: SmartInsight[];
  studyHours: number;
  totalHours: number;
}

const SmartInsightsDrawer: React.FC<SmartInsightsDrawerProps> = ({
  isOpen,
  onClose,
  insights,
  studyHours,
  totalHours,
}) => {
  const drawerVariants = {
    hidden: {
      x: '100%',
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40,
      },
    },
    visible: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40,
      },
    },
  };

  // Calculate study time percentage
  const studyPercentage = (studyHours / totalHours) * 100;
  const dashArray = 2 * Math.PI * 40; // Circumference of the circle
  const dashOffset = dashArray - (dashArray * studyPercentage) / 100;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop (mobile only) */}
          <motion.div
            className="md:hidden fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="fixed top-16 bottom-0 right-0 w-full md:w-80 bg-white dark:bg-dark-800 
                     shadow-xl z-50 overflow-hidden flex flex-col"
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-dark-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Smart Insights
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700
                           text-gray-500 dark:text-gray-400"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Schedule Health */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                  Schedule Health
                </h3>
                <div className="relative w-24 h-24 mx-auto">
                  <svg className="w-full h-full transform -rotate-90">
                    {/* Background circle */}
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-gray-200 dark:text-gray-700"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      fill="none"
                      stroke="#0056C7"
                      strokeWidth="8"
                      strokeDasharray={dashArray}
                      strokeDashoffset={dashOffset}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {Math.round(studyPercentage)}%
                    </span>
                  </div>
                </div>
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Study vs Free Time
                </p>
              </div>

              {/* Top Errors */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Top Errors
                </h3>
                <div className="space-y-3">
                  {insights
                    .filter(insight => insight.type === 'error')
                    .map(error => (
                      <div
                        key={error.title}
                        className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg"
                      >
                        <h4 className="text-sm font-medium text-red-800 dark:text-red-300">
                          {error.title}
                        </h4>
                        <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                          {error.description}
                        </p>
                      </div>
                    ))}
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  AI Recommendations
                </h3>
                <div className="space-y-3">
                  {insights
                    .filter(insight => insight.type === 'recommendation')
                    .map(recommendation => (
                      <div
                        key={recommendation.title}
                        className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                      >
                        <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                          {recommendation.title}
                        </h4>
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                          {recommendation.description}
                        </p>
                      </div>
                    ))}
                </div>
              </div>

              {/* Achievements */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Recent Achievements
                </h3>
                <div className="space-y-3">
                  {insights
                    .filter(insight => insight.type === 'achievement')
                    .map(achievement => (
                      <div
                        key={achievement.title}
                        className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
                      >
                        <h4 className="text-sm font-medium text-green-800 dark:text-green-300">
                          {achievement.title}
                        </h4>
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                          {achievement.description}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SmartInsightsDrawer; 