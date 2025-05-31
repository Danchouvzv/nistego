import React from 'react';
import useGoalsStore from '../../store/goalsStore';
import { SUBJECTS } from '../../types/curriculum';

const SubjectFilter: React.FC = () => {
  const { selectedSubject, setSelectedSubject } = useGoalsStore();
  
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <button
        className={`px-4 py-2 text-sm rounded-full transition-colors ${
          selectedSubject === null
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
        }`}
        onClick={() => setSelectedSubject(null)}
      >
        Все предметы
      </button>
      
      {Object.entries(SUBJECTS).map(([id, subject]) => (
        <button
          key={id}
          className={`px-4 py-2 text-sm rounded-full transition-colors ${
            selectedSubject === id
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          onClick={() => setSelectedSubject(id as any)}
          style={selectedSubject === id ? { backgroundColor: subject.color } : {}}
        >
          {subject.name}
        </button>
      ))}
    </div>
  );
};

export default SubjectFilter; 