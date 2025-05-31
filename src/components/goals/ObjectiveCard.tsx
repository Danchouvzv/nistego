import React from 'react';
import { CurriculumObjective } from '../../types/curriculum';

interface ObjectiveCardProps {
  objective: CurriculumObjective;
  onClick: (objective: CurriculumObjective) => void;
}

const ObjectiveCard: React.FC<ObjectiveCardProps> = ({ objective, onClick }) => {
  const progressColor = objective.progress && objective.progress >= 80 
    ? 'bg-green-500' 
    : objective.progress && objective.progress >= 50 
      ? 'bg-yellow-500' 
      : 'bg-red-500';

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={() => onClick(objective)}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-semibold bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
          {objective.code}
        </span>
        {objective.progress !== undefined && (
          <div className="flex items-center">
            <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mr-2">
              <div 
                className={`h-full ${progressColor}`} 
                style={{ width: `${objective.progress}%` }}
              />
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {objective.progress}%
            </span>
          </div>
        )}
      </div>
      
      <h3 className="font-medium text-gray-900 dark:text-white mb-1">
        {objective.title}
      </h3>
      
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
        {objective.description}
      </p>
      
      <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
        <span>Раздел: {objective.unit}</span>
        <span>Четверть: {objective.quarter}</span>
      </div>
      
      {objective.errorRate !== undefined && objective.errorRate > 0.2 && (
        <div className="mt-2 text-xs text-red-600 dark:text-red-400 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Частые ошибки: {(objective.errorRate * 100).toFixed(0)}%
        </div>
      )}
    </div>
  );
};

export default ObjectiveCard; 