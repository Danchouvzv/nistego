import React from 'react';
import useGoalsStore from '../../store/goalsStore';

const ProgressSummary: React.FC = () => {
  const { objectives, objectiveProgress } = useGoalsStore();
  
  // Calculate overall progress
  const calculateOverallProgress = () => {
    if (objectives.length === 0) return 0;
    
    const totalProgress = objectives.reduce((sum, objective) => {
      const progress = objectiveProgress[objective.code]?.progress || 0;
      return sum + progress;
    }, 0);
    
    return Math.round(totalProgress / objectives.length);
  };
  
  // Count objectives by progress level
  const countByLevel = () => {
    const counts = {
      mastered: 0, // 90-100%
      proficient: 0, // 70-89%
      developing: 0, // 40-69%
      beginning: 0 // 0-39%
    };
    
    objectives.forEach(objective => {
      const progress = objectiveProgress[objective.code]?.progress || 0;
      
      if (progress >= 90) counts.mastered++;
      else if (progress >= 70) counts.proficient++;
      else if (progress >= 40) counts.developing++;
      else counts.beginning++;
    });
    
    return counts;
  };
  
  const overallProgress = calculateOverallProgress();
  const counts = countByLevel();
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Общий прогресс
      </h2>
      
      <div className="flex items-center mb-4">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mr-4">
          <div 
            className="h-4 rounded-full bg-blue-600" 
            style={{ width: `${overallProgress}%` }}
          />
        </div>
        <span className="text-lg font-medium text-gray-900 dark:text-white">
          {overallProgress}%
        </span>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-green-700 dark:text-green-400 font-medium">
              Освоено
            </span>
            <span className="text-lg font-semibold text-green-800 dark:text-green-300">
              {counts.mastered}
            </span>
          </div>
          <div className="text-xs text-green-600 dark:text-green-500 mt-1">
            90-100% прогресса
          </div>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-blue-700 dark:text-blue-400 font-medium">
              Уверенно
            </span>
            <span className="text-lg font-semibold text-blue-800 dark:text-blue-300">
              {counts.proficient}
            </span>
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-500 mt-1">
            70-89% прогресса
          </div>
        </div>
        
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-yellow-700 dark:text-yellow-400 font-medium">
              В процессе
            </span>
            <span className="text-lg font-semibold text-yellow-800 dark:text-yellow-300">
              {counts.developing}
            </span>
          </div>
          <div className="text-xs text-yellow-600 dark:text-yellow-500 mt-1">
            40-69% прогресса
          </div>
        </div>
        
        <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-red-700 dark:text-red-400 font-medium">
              Начато
            </span>
            <span className="text-lg font-semibold text-red-800 dark:text-red-300">
              {counts.beginning}
            </span>
          </div>
          <div className="text-xs text-red-600 dark:text-red-500 mt-1">
            0-39% прогресса
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressSummary; 