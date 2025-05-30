import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db, auth } from '../shared/lib/firebase';
import Card from '../shared/ui/Card';
import Button from '../shared/ui/Button';

interface Goal {
  id: string;
  title: string;
  description: string;
  subject?: string;
  targetDate: Date;
  isCompleted: boolean;
  progress: number;
  createdAt: Date;
}

const Goals: React.FC = () => {
  const { t } = useTranslation();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState<string>('');
  const [targetDate, setTargetDate] = useState('');
  
  // Subjects for dropdown
  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([]);
  
  // Filter state
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        setLoading(true);
        const userId = auth.currentUser?.uid;
        
        if (!userId) {
          throw new Error('User not authenticated');
        }
        
        // Get user's goals
        const goalsRef = collection(db, 'goals');
        const q = query(goalsRef, where('userId', '==', userId));
        const goalsSnapshot = await getDocs(q);
        
        const goalsData = goalsSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            description: data.description,
            subject: data.subject,
            targetDate: data.targetDate.toDate(),
            isCompleted: data.isCompleted,
            progress: data.progress,
            createdAt: data.createdAt.toDate()
          };
        });
        
        // Sort by target date (ascending)
        goalsData.sort((a, b) => a.targetDate.getTime() - b.targetDate.getTime());
        
        setGoals(goalsData);
        
        // Fetch subjects for dropdown
        const subjectsRef = collection(db, 'subjects');
        const subjectsSnapshot = await getDocs(subjectsRef);
        
        const subjectsData = subjectsSnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name
        }));
        
        setSubjects(subjectsData);
      } catch (err) {
        console.error('Error fetching goals:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchGoals();
  }, []);
  
  // Mock data for development until Firebase is set up
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && goals.length === 0 && !loading) {
      const now = new Date();
      const oneMonthFromNow = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
      const twoMonthsFromNow = new Date(now.getFullYear(), now.getMonth() + 2, now.getDate());
      const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
      
      const mockGoals: Goal[] = [
        {
          id: '1',
          title: 'Master Calculus',
          description: 'Complete all calculus exercises and practice tests',
          subject: 'math',
          targetDate: oneMonthFromNow,
          isCompleted: false,
          progress: 65,
          createdAt: new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
        },
        {
          id: '2',
          title: 'Complete physics project',
          description: 'Finish the semester project on quantum mechanics',
          subject: 'physics',
          targetDate: twoMonthsFromNow,
          isCompleted: false,
          progress: 30,
          createdAt: new Date(now.getFullYear(), now.getMonth() - 2, now.getDate())
        },
        {
          id: '3',
          title: 'Improve English vocabulary',
          description: 'Learn 100 new English words',
          subject: 'languages',
          targetDate: yesterday,
          isCompleted: true,
          progress: 100,
          createdAt: new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
        }
      ];
      
      setGoals(mockGoals);
      
      // Mock subjects
      const mockSubjects = [
        { id: 'math', name: 'Mathematics' },
        { id: 'physics', name: 'Physics' },
        { id: 'chemistry', name: 'Chemistry' },
        { id: 'biology', name: 'Biology' },
        { id: 'history', name: 'History' },
        { id: 'languages', name: 'Languages' }
      ];
      
      setSubjects(mockSubjects);
    }
  }, [loading, goals.length]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const userId = auth.currentUser?.uid;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      const goalData = {
        userId,
        title,
        description,
        subject: subject || null,
        targetDate: new Date(targetDate),
        isCompleted: false,
        progress: 0,
        createdAt: new Date()
      };
      
      if (editingGoal) {
        // Update existing goal
        const goalRef = doc(db, 'goals', editingGoal.id);
        await updateDoc(goalRef, {
          title,
          description,
          subject: subject || null,
          targetDate: new Date(targetDate),
          updatedAt: new Date()
        });
        
        // Update local state
        setGoals(goals.map(goal => 
          goal.id === editingGoal.id 
            ? { 
                ...goal, 
                title, 
                description, 
                subject: subject || undefined, 
                targetDate: new Date(targetDate) 
              } 
            : goal
        ));
      } else {
        // Add new goal
        const docRef = await addDoc(collection(db, 'goals'), goalData);
        
        // Update local state
        setGoals([
          ...goals,
          {
            id: docRef.id,
            ...goalData,
            subject: subject || undefined
          }
        ]);
      }
      
      // Reset form
      resetForm();
    } catch (err) {
      console.error('Error saving goal:', err);
    }
  };
  
  const handleDeleteGoal = async (goalId: string) => {
    try {
      // Delete from Firestore
      await deleteDoc(doc(db, 'goals', goalId));
      
      // Update local state
      setGoals(goals.filter(goal => goal.id !== goalId));
    } catch (err) {
      console.error('Error deleting goal:', err);
    }
  };
  
  const handleToggleComplete = async (goalId: string, isCompleted: boolean) => {
    try {
      // Update in Firestore
      const goalRef = doc(db, 'goals', goalId);
      await updateDoc(goalRef, {
        isCompleted,
        progress: isCompleted ? 100 : 0,
        updatedAt: new Date()
      });
      
      // Update local state
      setGoals(goals.map(goal => 
        goal.id === goalId 
          ? { ...goal, isCompleted, progress: isCompleted ? 100 : goal.progress } 
          : goal
      ));
    } catch (err) {
      console.error('Error updating goal status:', err);
    }
  };
  
  const handleUpdateProgress = async (goalId: string, progress: number) => {
    try {
      // Update in Firestore
      const goalRef = doc(db, 'goals', goalId);
      await updateDoc(goalRef, {
        progress,
        isCompleted: progress === 100,
        updatedAt: new Date()
      });
      
      // Update local state
      setGoals(goals.map(goal => 
        goal.id === goalId 
          ? { ...goal, progress, isCompleted: progress === 100 } 
          : goal
      ));
    } catch (err) {
      console.error('Error updating goal progress:', err);
    }
  };
  
  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setTitle(goal.title);
    setDescription(goal.description);
    setSubject(goal.subject || '');
    setTargetDate(goal.targetDate.toISOString().split('T')[0]);
    setFormOpen(true);
  };
  
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSubject('');
    setTargetDate('');
    setEditingGoal(null);
    setFormOpen(false);
  };
  
  const filteredGoals = filter === 'all' 
    ? goals 
    : filter === 'active' 
      ? goals.filter(goal => !goal.isCompleted) 
      : goals.filter(goal => goal.isCompleted);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {t('goals.title', 'My Learning Goals')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t('goals.subtitle', 'Set, track, and achieve your learning objectives')}
            </p>
          </div>
          
          <Button
            variant="primary"
            onClick={() => setFormOpen(true)}
            className="mt-4 md:mt-0"
          >
            {t('goals.addGoal', 'Add New Goal')}
          </Button>
        </div>
        
        {/* Goal Form */}
        {formOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card>
              <Card.Body className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  {editingGoal 
                    ? t('goals.editGoal', 'Edit Goal') 
                    : t('goals.newGoal', 'New Goal')}
                </h2>
                
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('goals.form.title', 'Goal Title')}*
                      </label>
                      <input
                        id="title"
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-dark/50"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('goals.form.description', 'Description')}
                      </label>
                      <textarea
                        id="description"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-dark/50"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('goals.form.subject', 'Related Subject')}
                      </label>
                      <select
                        id="subject"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-dark/50"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                      >
                        <option value="">{t('goals.form.noSubject', 'No specific subject')}</option>
                        {subjects.map(subject => (
                          <option key={subject.id} value={subject.id}>
                            {subject.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="targetDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('goals.form.targetDate', 'Target Date')}*
                      </label>
                      <input
                        id="targetDate"
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-dark/50"
                        value={targetDate}
                        onChange={(e) => setTargetDate(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetForm}
                    >
                      {t('common.cancel', 'Cancel')}
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                    >
                      {editingGoal 
                        ? t('common.save', 'Save') 
                        : t('goals.form.createGoal', 'Create Goal')}
                    </Button>
                  </div>
                </form>
              </Card.Body>
            </Card>
          </motion.div>
        )}
        
        {/* Filter Tabs */}
        <div className="flex mb-6 border-b dark:border-gray-700">
          <button
            className={`py-2 px-4 ${
              filter === 'all' 
                ? 'border-b-2 border-primary text-primary font-medium' 
                : 'text-gray-600 dark:text-gray-400'
            }`}
            onClick={() => setFilter('all')}
          >
            {t('goals.filters.all', 'All Goals')}
          </button>
          <button
            className={`py-2 px-4 ${
              filter === 'active' 
                ? 'border-b-2 border-primary text-primary font-medium' 
                : 'text-gray-600 dark:text-gray-400'
            }`}
            onClick={() => setFilter('active')}
          >
            {t('goals.filters.active', 'In Progress')}
          </button>
          <button
            className={`py-2 px-4 ${
              filter === 'completed' 
                ? 'border-b-2 border-primary text-primary font-medium' 
                : 'text-gray-600 dark:text-gray-400'
            }`}
            onClick={() => setFilter('completed')}
          >
            {t('goals.filters.completed', 'Completed')}
          </button>
        </div>
        
        {/* Goals List */}
        {filteredGoals.length === 0 ? (
          <div className="text-center py-12">
            <svg 
              className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium">
              {filter === 'all' 
                ? t('goals.noGoals', 'No goals yet') 
                : filter === 'active'
                  ? t('goals.noActiveGoals', 'No active goals') 
                  : t('goals.noCompletedGoals', 'No completed goals')}
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {filter === 'all' 
                ? t('goals.startByCreating', 'Start by creating your first learning goal') 
                : filter === 'active'
                  ? t('goals.createActiveGoal', 'Create a new goal or mark existing ones as in progress')
                  : t('goals.completeGoals', 'Complete some goals to see them here')}
            </p>
            {filter === 'all' && (
              <Button
                variant="primary"
                className="mt-4"
                onClick={() => setFormOpen(true)}
              >
                {t('goals.createFirstGoal', 'Create Your First Goal')}
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredGoals.map((goal, index) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={goal.isCompleted ? 'border-l-4 border-l-success' : ''}>
                  <Card.Body className="p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <input
                          type="checkbox"
                          className="h-5 w-5 text-primary border-gray-300 rounded"
                          checked={goal.isCompleted}
                          onChange={(e) => handleToggleComplete(goal.id, e.target.checked)}
                        />
                      </div>
                      
                      <div className="ml-3 flex-1">
                        <div className="flex justify-between">
                          <h3 className={`text-lg font-semibold ${goal.isCompleted ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>
                            {goal.title}
                          </h3>
                          <div className="flex space-x-2">
                            <button 
                              className="text-gray-500 hover:text-primary"
                              onClick={() => handleEditGoal(goal)}
                            >
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button 
                              className="text-gray-500 hover:text-error"
                              onClick={() => handleDeleteGoal(goal.id)}
                            >
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        
                        {goal.description && (
                          <p className="mt-1 text-gray-600 dark:text-gray-400">
                            {goal.description}
                          </p>
                        )}
                        
                        <div className="mt-2">
                          <div className="flex justify-between text-sm mb-1">
                            <span>{t('goals.progress', 'Progress')}:</span>
                            <span className={goal.progress >= 100 ? 'text-success' : ''}>
                              {goal.progress}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                goal.progress >= 100 
                                  ? 'bg-success' 
                                  : 'bg-primary'
                              }`}
                              style={{ width: `${goal.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        {!goal.isCompleted && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {[25, 50, 75, 100].map(value => (
                              <button
                                key={value}
                                className={`px-2 py-1 text-xs rounded ${
                                  goal.progress >= value 
                                    ? 'bg-primary/20 text-primary' 
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                }`}
                                onClick={() => handleUpdateProgress(goal.id, value)}
                              >
                                {value}%
                              </button>
                            ))}
                          </div>
                        )}
                        
                        <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400">
                          {goal.subject && (
                            <div>
                              <span className="font-medium">{t('goals.subject', 'Subject')}:</span>
                              <span className="ml-1">
                                {subjects.find(s => s.id === goal.subject)?.name || goal.subject}
                              </span>
                            </div>
                          )}
                          
                          <div>
                            <span className="font-medium">{t('goals.targetDate', 'Target')}:</span>
                            <span className="ml-1">
                              {goal.targetDate.toLocaleDateString()}
                            </span>
                          </div>
                          
                          {new Date() > goal.targetDate && !goal.isCompleted && (
                            <div className="text-error">
                              {t('goals.overdue', 'Overdue')}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Goals;