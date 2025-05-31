import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Task } from '../../types/planner';
import { format } from 'date-fns';
import { Timestamp } from 'firebase/firestore';

interface TaskCardProps {
  task: Task;
  subjectColor: string;
  onStatusChange: (taskId: string, status: Task['status']) => void;
  onPomodoroStart?: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  subjectColor,
  onStatusChange,
  onPomodoroStart,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const cardVariants = {
    initial: {
      rotateY: 0,
    },
    flipped: {
      rotateY: 180,
    },
  };

  const handleLongPress = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <motion.div
      className="relative w-full bg-white dark:bg-dark-800 rounded-xl shadow-sm 
                 border border-gray-100 dark:border-dark-700 overflow-hidden
                 cursor-pointer transform-gpu"
      style={{
        borderLeftWidth: '4px',
        borderLeftColor: subjectColor,
      }}
      variants={cardVariants}
      animate={isFlipped ? 'flipped' : 'initial'}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsFlipped(true)}
      onHoverEnd={() => setIsFlipped(false)}
      onTapStart={handleLongPress}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      whileDrag={{ scale: 1.05, zIndex: 50 }}
    >
      {/* Front of card */}
      <motion.div
        className="p-3"
        style={{ backfaceVisibility: 'hidden' }}
      >
        <div className="flex items-start justify-between">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
            {task.title}
          </h4>
          {task.status === 'completed' && (
            <span className="flex-shrink-0 ml-2 text-green-500">
              ✓
            </span>
          )}
        </div>
        
        <div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          {task.dueDate && (
            <span>
              {format(task.dueDate instanceof Timestamp ? task.dueDate.toDate() : task.dueDate, 'HH:mm')}
            </span>
          )}
          <span>
            {task.estimatedEffort}m
          </span>
        </div>
      </motion.div>

      {/* Back of card */}
      <motion.div
        className="absolute inset-0 p-3 bg-white dark:bg-dark-800"
        style={{
          backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
        }}
      >
        {task.checklist && task.checklist.length > 0 && (
          <div className="space-y-2">
            {task.checklist.map(item => (
              <div key={item.id} className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={item.completed}
                  className="mt-1 rounded text-blue-600"
                  onChange={() => {/* Handle checklist item toggle */}}
                />
                <span className="text-xs text-gray-700 dark:text-gray-300">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="absolute bottom-2 right-2 flex items-center gap-2">
          {/* Pomodoro Timer Button */}
          <button
            onClick={onPomodoroStart}
            className="p-1.5 rounded-full bg-gray-100 dark:bg-dark-700 
                     text-gray-600 dark:text-gray-400 hover:bg-gray-200 
                     dark:hover:bg-dark-600 transition-colors"
          >
            ⏱
          </button>

          {/* Complete Task Button */}
          <button
            onClick={() => onStatusChange(task.id, 
              task.status === 'completed' ? 'pending' : 'completed'
            )}
            className={`p-1.5 rounded-full transition-colors ${
              task.status === 'completed'
                ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
                : 'bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-400'
            }`}
          >
            ✓
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TaskCard; 