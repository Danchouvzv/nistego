import React from 'react';
import useGoalsStore from '../../store/goalsStore';
import { QUARTERS } from '../../types/curriculum';

const QuarterFilter: React.FC = () => {
  const { selectedQuarter, setSelectedQuarter } = useGoalsStore();
  
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <button
        className={`px-4 py-2 text-sm rounded-full transition-colors ${
          selectedQuarter === null
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
        }`}
        onClick={() => setSelectedQuarter(null)}
      >
        Все четверти
      </button>
      
      {QUARTERS.map((quarter) => (
        <button
          key={quarter}
          className={`px-4 py-2 text-sm rounded-full transition-colors ${
            selectedQuarter === quarter
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          onClick={() => setSelectedQuarter(quarter)}
        >
          {quarter} четверть
        </button>
      ))}
    </div>
  );
};

export default QuarterFilter; 