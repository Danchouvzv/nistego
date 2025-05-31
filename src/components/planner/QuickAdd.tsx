import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { parseAndCreateTask } from '../../services/taskParser';
import usePlannerStore from '../../store/plannerStore';

interface QuickAddProps {
  onAdd: (text: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const QuickAdd: React.FC<QuickAddProps> = ({ onAdd, isOpen, onClose }) => {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { addTask } = usePlannerStore();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Parse the input text and create a task
      const task = await parseAndCreateTask(inputValue.trim());
      
      if (task) {
        // Add the task to the store
        addTask(task);
        
        // Call the onAdd callback with the original text
        onAdd(inputValue.trim());
        
        // Clear the input and close the modal
        setInputValue('');
        onClose();
      } else {
        setError("Couldn't parse the task. Please try a different format.");
      }
    } catch (err) {
      console.error('Error adding task:', err);
      setError("An error occurred while adding the task.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black"
            onClick={onClose}
          />

          {/* Quick Add Modal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                     w-full max-w-lg bg-white dark:bg-dark-800 rounded-2xl shadow-xl
                     p-6 z-50"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="quickAdd"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Quick Add Task
                </label>
                <input
                  ref={inputRef}
                  id="quickAdd"
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g., math homework tomorrow 17:00 #algebra"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 
                           dark:border-dark-700 bg-white dark:bg-dark-900
                           text-gray-900 dark:text-white placeholder-gray-400
                           dark:placeholder-gray-600 focus:ring-2 focus:ring-blue-500
                           focus:border-transparent outline-none transition-shadow"
                  disabled={isLoading}
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Press <kbd className="px-2 py-1 bg-gray-100 dark:bg-dark-700 rounded">Enter</kbd> to add
                </div>
                <div className="space-x-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300
                             bg-gray-100 dark:bg-dark-700 rounded-lg hover:bg-gray-200
                             dark:hover:bg-dark-600 transition-colors"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white
                             bg-blue-600 rounded-lg hover:bg-blue-700
                             transition-colors flex items-center"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      'Add Task'
                    )}
                  </button>
                </div>
              </div>
            </form>

            {/* Example Format */}
            <div className="mt-6 p-4 bg-gray-50 dark:bg-dark-700 rounded-xl">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Example Formats:
              </h4>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <li>
                  <code className="px-2 py-1 bg-gray-100 dark:bg-dark-600 rounded">
                    math homework tomorrow 17:00 #algebra
                  </code>
                </li>
                <li>
                  <code className="px-2 py-1 bg-gray-100 dark:bg-dark-600 rounded">
                    10.3.2.1 solve practice exercises
                  </code>
                </li>
                <li>
                  <code className="px-2 py-1 bg-gray-100 dark:bg-dark-600 rounded">
                    english essay Fri 18:00 #essay
                  </code>
                </li>
                <li>
                  <code className="px-2 py-1 bg-gray-100 dark:bg-dark-600 rounded">
                    read chapter 5 2h !important
                  </code>
                </li>
              </ul>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default QuickAdd; 