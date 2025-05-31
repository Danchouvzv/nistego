import React from 'react';
import useGoalsStore from '../../store/goalsStore';

const SearchBar: React.FC = () => {
  const { searchQuery, setSearchQuery } = useGoalsStore();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleClear = () => {
    setSearchQuery('');
  };
  
  return (
    <div className="relative mb-4">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg 
          className="w-5 h-5 text-gray-500 dark:text-gray-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
      </div>
      
      <input
        type="search"
        className="block w-full p-2.5 pl-10 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
        placeholder="Поиск целей по названию или коду..."
        value={searchQuery}
        onChange={handleChange}
      />
      
      {searchQuery && (
        <button
          className="absolute inset-y-0 right-0 flex items-center pr-3"
          onClick={handleClear}
          type="button"
        >
          <svg 
            className="w-5 h-5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      )}
    </div>
  );
};

export default SearchBar; 