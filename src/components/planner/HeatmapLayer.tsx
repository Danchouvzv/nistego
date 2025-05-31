import React from 'react';
import { motion } from 'framer-motion';
import type { Goal } from '../../types/planner';

interface HeatmapLayerProps {
  goals: Goal[];
  isVisible: boolean;
  onGoalClick: (goalId: string) => void;
}

const HeatmapLayer: React.FC<HeatmapLayerProps> = ({
  goals,
  isVisible,
  onGoalClick,
}) => {
  const getHeatmapColor = (progress: number) => {
    if (progress >= 90) return 'bg-green-500/20 dark:bg-green-500/30';
    if (progress >= 50) return 'bg-yellow-500/20 dark:bg-yellow-500/30';
    return 'bg-red-500/20 dark:bg-red-500/30';
  };

  const variants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.2,
      },
    },
  };

  if (!isVisible) return null;

  return (
    <motion.div
      className="absolute inset-0 grid grid-cols-1 md:grid-cols-7 gap-4 pointer-events-none"
      variants={variants}
      initial="hidden"
      animate="visible"
    >
      {/* One cell per day */}
      {Array.from({ length: 7 }).map((_, dayIndex) => (
        <div key={dayIndex} className="relative">
          {/* Goals grid within each day */}
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-1 p-4 mt-16">
            {goals
              .filter(goal => goal.status !== 'completed')
              .slice(0, 9) // Show max 9 goals per day
              .map(goal => (
                <motion.button
                  key={goal.id}
                  className={`rounded-md ${getHeatmapColor(goal.progress)} 
                           pointer-events-auto cursor-pointer hover:opacity-80
                           transition-opacity`}
                  onClick={() => onGoalClick(goal.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="sr-only">
                    Goal {goal.code} - {goal.progress}% complete
                  </span>
                </motion.button>
              ))}
          </div>
        </div>
      ))}
    </motion.div>
  );
};

export default HeatmapLayer; 