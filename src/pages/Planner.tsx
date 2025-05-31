import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { format, addDays } from 'date-fns';
import type { Task, Goal } from '../types/planner';
import TaskCard from '../components/planner/TaskCard';
import ProgressRing from '../components/planner/ProgressRing';
import QuickAdd from '../components/planner/QuickAdd';
import SmartInsightsDrawer from '../components/planner/SmartInsightsDrawer';
import HeatmapLayer from '../components/planner/HeatmapLayer';
import { GoalModal } from '../components/planner/GoalModal';
import usePlannerStore from '../store/plannerStore';
import { parseAndCreateTask } from '../services/taskParser';
import { Timestamp } from 'firebase/firestore';

const Planner: React.FC = () => {
  // Cursor with tail effect
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  // Get state and actions from store
  const {
    currentWeekStart,
    viewMode,
    weekPlan,
    insights,
    isQuickAddOpen,
    isInsightsOpen,
    setViewMode,
    updateTask,
    setQuickAddOpen,
    setInsightsOpen,
    addTask
  } = usePlannerStore();

  // Local state for selected goal
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isHeatmapVisible, setIsHeatmapVisible] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  // Mock goals data (in production, this would come from the store)
  const mockGoals: Goal[] = [
    {
      id: '1',
      code: '10.3.2.1',
      title: 'Understand Linear Equations',
      progress: 75,
      status: 'in_progress',
      description: 'Master the concepts of linear equations and their applications',
      subject: 'Mathematics',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      code: '10.4.1.2',
      title: 'Chemical Bonding',
      progress: 90,
      status: 'in_progress',
      description: 'Learn about different types of chemical bonds',
      subject: 'Chemistry',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    // Add more mock goals as needed
  ];

  // Effect to track cursor
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [cursorX, cursorY]);

  // Effect to clear notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Generate week days
  const weekDays = Array.from({ length: 7 }, (_, i) => 
    addDays(currentWeekStart, i)
  );

  // Handle task status change
  const handleTaskStatusChange = (taskId: string, status: Task['status']) => {
    updateTask(taskId, { status });
    setNotification({
      message: status === 'completed' ? 'Task completed! 🎉' : 'Task status updated',
      type: 'success'
    });
  };

  // Calculate progress for ProgressRing
  const calculateProgress = () => {
    if (!weekPlan) return 0;
    const totalTasks = weekPlan.tasks.length;
    if (totalTasks === 0) return 0;
    const completedTasks = weekPlan.tasks.filter(
      task => task.status === 'completed'
    ).length;
    return (completedTasks / totalTasks) * 100;
  };

  // Handle quick add
  const handleQuickAdd = async (text: string) => {
    try {
      const task = await parseAndCreateTask(text);
      if (task) {
        addTask(task);
        setNotification({
          message: 'Task added successfully! 📝',
          type: 'success'
        });
      } else {
        setNotification({
          message: 'Could not parse task. Please try again.',
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Error adding task:', error);
      setNotification({
        message: 'Error adding task. Please try again.',
        type: 'error'
      });
    }
  };

  // Handle goal click in heatmap
  const handleGoalClick = (goalId: string) => {
    const goal = mockGoals.find(g => g.id === goalId);
    if (goal) {
      setSelectedGoal(goal);
    }
  };

  // Get tasks for a specific day
  const getTasksForDay = (date: Date) => {
    if (!weekPlan) return [];
    return weekPlan.tasks.filter(task => {
      // Handle both Date and Timestamp types
      let taskDate: Date;
      if (task.dueDate instanceof Date) {
        taskDate = task.dueDate;
      } else if (task.dueDate instanceof Timestamp) {
        taskDate = task.dueDate.toDate();
      } else {
        // Fallback for unexpected type
        return false;
      }
      return format(taskDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
    }).sort((a, b) => a.position - b.position);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      {/* Custom Cursor */}
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 pointer-events-none z-50"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          backgroundColor: '#0056C7',
          borderRadius: '50%',
          mixBlendMode: 'difference',
        }}
      />

      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 right-4 z-50 px-4 py-2 rounded-lg shadow-lg ${
              notification.type === 'success' 
                ? 'bg-green-500 text-white' 
                : 'bg-red-500 text-white'
            }`}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-dark-800 shadow-sm z-40 px-4">
        <div className="flex items-center justify-between h-full max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Planner</h1>
            <nav className="hidden md:flex space-x-2">
              {/* View Switcher */}
              <button
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  viewMode === 'calendar'
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700'
                }`}
                onClick={() => setViewMode('calendar')}
              >
                Calendar
              </button>
              {/* Add other view modes here */}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {/* Progress Ring */}
            <div className="hidden md:block">
              <ProgressRing progress={calculateProgress()} />
            </div>

            {/* Streak Bar */}
            <div className="hidden md:flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Streak:
              </span>
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {weekPlan?.meta?.streak || 0}
              </span>
            </div>

            {/* Date Picker */}
            <button className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300">
              {format(currentWeekStart, 'MMM d, yyyy')}
            </button>

            {/* Smart Insights Toggle */}
            <button
              onClick={() => setInsightsOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700
                       text-gray-600 dark:text-gray-400"
            >
              <span className="sr-only">Open Smart Insights</span>
              📊
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Controls */}
          <div className="flex justify-between mb-4">
            <button
              onClick={() => setQuickAddOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                       transition-colors flex items-center space-x-2"
            >
              <span>+ Add Task</span>
            </button>
            
            <button
              onClick={() => setIsHeatmapVisible(!isHeatmapVisible)}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                isHeatmapVisible
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700'
              }`}
            >
              {isHeatmapVisible ? 'Hide' : 'Show'} Heatmap
            </button>
          </div>

          {/* Week Grid with Heatmap Layer */}
          <div className="relative">
            {/* Base Week Grid */}
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              {weekDays.map(day => (
                <div
                  key={format(day, 'yyyy-MM-dd')}
                  className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-4 min-h-[200px]"
                >
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {format(day, 'EEEE')}
                  </h3>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {format(day, 'd')}
                  </p>
                  
                  {/* Task Cards */}
                  <div className="mt-4 space-y-2">
                    {getTasksForDay(day).map(task => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        subjectColor={task.subjectId === 'math' ? '#0056C7' : '#7209B7'} // TODO: Get from subject
                        onStatusChange={handleTaskStatusChange}
                      />
                    ))}
                    
                    {getTasksForDay(day).length === 0 && (
                      <div className="py-8 text-center text-gray-400 dark:text-gray-600 text-sm">
                        No tasks for this day
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Heatmap Layer */}
            <HeatmapLayer
              goals={mockGoals}
              isVisible={isHeatmapVisible}
              onGoalClick={handleGoalClick}
            />
          </div>
        </div>
      </main>

      {/* Quick Add Button (Mobile) */}
      <button
        onClick={() => setQuickAddOpen(true)}
        className="fixed right-4 bottom-4 md:hidden w-14 h-14 bg-blue-600 text-white 
                 rounded-full shadow-lg flex items-center justify-center"
      >
        <span className="text-2xl">+</span>
      </button>

      {/* Quick Add Modal */}
      <QuickAdd
        isOpen={isQuickAddOpen}
        onClose={() => setQuickAddOpen(false)}
        onAdd={handleQuickAdd}
      />

      {/* Smart Insights Drawer */}
      <SmartInsightsDrawer
        isOpen={isInsightsOpen}
        onClose={() => setInsightsOpen(false)}
        insights={insights}
        studyHours={weekPlan?.meta?.totalStudyHours || 0}
        totalHours={24 * 7} // Total hours in a week
      />

      {/* Goal Modal */}
      <GoalModal
        goal={selectedGoal}
        onClose={() => setSelectedGoal(null)}
      />
    </div>
  );
};

export default Planner;