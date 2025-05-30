import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '../firebase/config';
import type { UserProfile } from '../firebase/users';
import { usersApi } from '../firebase/users';
import { doc, getDoc } from 'firebase/firestore';
import Card from '../shared/ui/Card';
import Button from '../shared/ui/Button';

const Profile: React.FC = () => {
  const { t } = useTranslation();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [xpProgress, setXpProgress] = useState(0);
  const [level, setLevel] = useState(1);
  const [xpToNextLevel, setXpToNextLevel] = useState(1000);
  const [showConfetti, setShowConfetti] = useState(false);

  // Загрузка профиля пользователя
  useEffect(() => {
    const loadUserProfile = async () => {
      if (auth.currentUser?.uid) {
        try {
          const profile = await usersApi.getProfile(auth.currentUser.uid);
          setUserProfile(profile);
          
          // Расчет уровня и опыта (для демонстрации)
          const mockXP = Math.floor(Math.random() * 5000);
          const calculatedLevel = Math.floor(mockXP / 1000) + 1;
          const remainingXP = 1000 - (mockXP % 1000);
          
          setLevel(calculatedLevel);
          setXpProgress((1000 - remainingXP) / 10);
          setXpToNextLevel(remainingXP);
          
        } catch (error) {
          console.error("Error loading profile:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadUserProfile();
  }, []);

  // Конфетти эффект при повышении уровня
  const handleLevelUp = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  // Достижения пользователя
  const achievements = [
    { id: 1, title: '100% Completion', icon: '🏆', description: 'Completed all tasks in a subject', unlocked: true },
    { id: 2, title: 'Perfect Week', icon: '📅', description: 'Completed all planned tasks for a week', unlocked: true },
    { id: 3, title: 'Early Bird', icon: '🌅', description: 'Completed 5 tasks before 9 AM', unlocked: false },
    { id: 4, title: 'Streak Master', icon: '🔥', description: 'Maintained a 7-day streak', unlocked: true },
    { id: 5, title: 'Study Guru', icon: '🧠', description: 'Achieved 5 A grades in a row', unlocked: false },
  ];

  // Предметы пользователя с прогрессом
  const subjects = [
    { id: 1, name: 'Mathematics', progress: 75 },
    { id: 2, name: 'Physics', progress: 60 },
    { id: 3, name: 'Chemistry', progress: 90 },
    { id: 4, name: 'Biology', progress: 40 },
    { id: 5, name: 'History', progress: 85 },
  ];

  // Активные цели
  const activeGoals = [
    { id: 1, title: 'Finish Mathematics Module 3', deadline: '2023-12-15', progress: 65 },
    { id: 2, title: 'Complete Physics Lab Report', deadline: '2023-12-10', progress: 30 },
    { id: 3, title: 'Prepare for Chemistry Test', deadline: '2023-12-20', progress: 80 },
  ];

  // Анимация для карточек
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: 'spring',
        stiffness: 300,
        damping: 24
      }
    }
  };

  // Анимация для табов
  const tabVariants = {
    inactive: { opacity: 0.7, scale: 0.95 },
    active: { 
      opacity: 1, 
      scale: 1,
      transition: { type: 'spring', stiffness: 300, damping: 20 }
    }
  };

  // Форматирование даты
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('default', { month: 'short', day: 'numeric' }).format(date);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24 md:py-28">
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          {/* Здесь будет конфетти анимация */}
        </div>
      )}
      
      <div className="max-w-6xl mx-auto">
        {/* Hero секция */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card variant="glass" className="overflow-hidden backdrop-blur-xl">
            <div className="relative">
              {/* Фоновые декоративные элементы */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2"></div>
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl translate-y-1/2"></div>
              
              <div className="p-6 md:p-8 relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  {/* Аватар с рангом */}
                  <div className="relative">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-r from-primary to-secondary p-1">
                      <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                        {userProfile?.photoURL ? (
                          <img src={userProfile.photoURL} alt={userProfile.displayName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-3xl md:text-4xl font-bold text-gray-700 dark:text-gray-300">
                            {userProfile?.displayName?.charAt(0) || 'U'}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center border-2 border-white dark:border-gray-800">
                      {level}
                    </div>
                  </div>
                  
                  {/* Информация о пользователе */}
                  <div className="flex-1 text-center md:text-left">
                    <h1 className="text-2xl md:text-3xl font-bold">{userProfile?.displayName}</h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      {userProfile?.role === 'student' ? 'Student' : userProfile?.role === 'teacher' ? 'Teacher' : 'User'}
                    </p>
                    <p className="text-gray-500 dark:text-gray-500 mb-4">{userProfile?.email}</p>
                    
                    {/* Прогресс XP */}
                    <div className="mb-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">XP</span>
                        <span className="text-sm text-primary font-medium">{xpProgress * 10} / 1000</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <motion.div 
                          className="bg-gradient-to-r from-primary to-secondary h-2.5 rounded-full" 
                          initial={{ width: 0 }}
                          animate={{ width: `${xpProgress}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        ></motion.div>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {xpToNextLevel} XP до уровня {level + 1}
                      </p>
                    </div>
                  </div>
                  
                  {/* Действия */}
                  <div className="flex flex-col space-y-3">
                    <Button 
                      variant="primary" 
                      className="flex items-center justify-center gap-2"
                      onClick={() => {}}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                      </svg>
                      {t('profile.editProfile')}
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex items-center justify-center gap-2"
                      onClick={() => {}}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935-2.186 2.25 2.25 0 0 0-3.935 2.186Z" />
                      </svg>
                      Share Profile
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
        
        {/* Навигационные табы */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 shadow-inner">
            {['overview', 'achievements', 'subjects', 'settings'].map((tab) => (
              <motion.button
                key={tab}
                variants={tabVariants}
                animate={activeTab === tab ? 'active' : 'inactive'}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  activeTab === tab
                    ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                } transition-all duration-200`}
              >
                {t(`profile.${tab}`) || tab.charAt(0).toUpperCase() + tab.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>
        
        {/* Содержимое активной вкладки */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
          >
            {/* Обзор */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Активные цели */}
                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  className="lg:col-span-2"
                >
                  <Card>
                    <Card.Header>
                      <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">{t('profile.activeGoals')}</h2>
                        <Button variant="ghost" size="sm" className="text-primary">See all</Button>
                      </div>
                    </Card.Header>
                    <Card.Body className="space-y-4">
                      {activeGoals.map((goal) => (
                        <div key={goal.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium">{goal.title}</h3>
                            <span className="text-sm bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                              {formatDate(goal.deadline)}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-1">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${goal.progress}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500 dark:text-gray-400">Progress</span>
                            <span className="text-xs font-medium">{goal.progress}%</span>
                          </div>
                        </div>
                      ))}
                    </Card.Body>
                  </Card>
                </motion.div>
                
                {/* Статистика */}
                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.1 }}
                >
                  <Card>
                    <Card.Header>
                      <h2 className="text-xl font-bold">{t('profile.statistics')}</h2>
                    </Card.Header>
                    <Card.Body>
                      <div className="space-y-4">
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Average Grade</span>
                            <span className="text-sm font-medium">85%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Tasks Completed</span>
                            <span className="text-sm font-medium">24/30</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Current Streak</span>
                            <span className="text-sm font-medium">5 days</span>
                          </div>
                          <div className="flex space-x-1 mt-2">
                            {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                              <div 
                                key={day} 
                                className={`h-8 w-8 rounded-full flex items-center justify-center ${
                                  day <= 5 ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                                }`}
                              >
                                {day}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </motion.div>
              </div>
            )}
            
            {/* Достижения */}
            {activeTab === 'achievements' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map((achievement, index) => (
                  <motion.div 
                    key={achievement.id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`h-full ${!achievement.unlocked && 'opacity-60'}`}>
                      <Card.Body className="flex flex-col items-center p-6 text-center">
                        <div className={`text-4xl mb-4 ${!achievement.unlocked && 'grayscale'}`}>
                          {achievement.icon}
                        </div>
                        <h3 className="text-lg font-bold mb-2">{achievement.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          {achievement.description}
                        </p>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          achievement.unlocked 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' 
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-400'
                        }`}>
                          {achievement.unlocked ? 'Unlocked' : 'Locked'}
                        </div>
                      </Card.Body>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
            
            {/* Предметы */}
            {activeTab === 'subjects' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {subjects.map((subject, index) => (
                  <motion.div 
                    key={subject.id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full">
                      <Card.Body className="p-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-bold">{subject.name}</h3>
                          <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                            subject.progress >= 80 
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' 
                              : subject.progress >= 50
                                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400'
                                : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'
                          }`}>
                            {subject.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
                          <motion.div 
                            className={`h-3 rounded-full ${
                              subject.progress >= 80 
                                ? 'bg-green-500' 
                                : subject.progress >= 50
                                  ? 'bg-blue-500'
                                  : 'bg-yellow-500'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${subject.progress}%` }}
                            transition={{ duration: 1, ease: "easeOut", delay: 0.2 + index * 0.1 }}
                          ></motion.div>
                        </div>
                        <div className="flex justify-between">
                          <Button variant="ghost" size="sm" className="text-primary">Details</Button>
                          <Button variant="outline" size="sm">Study Now</Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
            
            {/* Настройки */}
            {activeTab === 'settings' && (
              <motion.div 
                variants={cardVariants}
                initial="hidden"
                animate="visible"
              >
                <Card>
                  <Card.Header>
                    <h2 className="text-xl font-bold">{t('profile.settings')}</h2>
                  </Card.Header>
                  <Card.Body className="space-y-6 p-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Account</h3>
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                          <div className="flex-1 sm:max-w-md">
                            <input
                              type="email"
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-dark/50"
                              value={userProfile?.email || ''}
                              disabled
                            />
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Display Name</label>
                          <div className="flex-1 sm:max-w-md">
                            <input
                              type="text"
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-dark/50"
                              value={userProfile?.displayName || ''}
                              disabled
                            />
                          </div>
                        </div>
                        
                        <div className="flex justify-end">
                          <Button variant="outline" size="sm">Change Password</Button>
                        </div>
                      </div>
                    </div>
                    
                    <hr className="border-gray-200 dark:border-gray-700" />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Preferences</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Notifications</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 dark:peer-focus:ring-primary/25 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                          </label>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Push Notifications</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 dark:peer-focus:ring-primary/25 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <hr className="border-gray-200 dark:border-gray-700" />
                    
                    <div className="flex justify-between">
                      <Button 
                        variant="outline" 
                        className="text-error hover:bg-error/5 border-error"
                        onClick={() => {
                          if (auth.currentUser) {
                            auth.signOut();
                          }
                        }}
                      >
                        {t('profile.logout')}
                      </Button>
                      
                      <Button variant="primary">
                        {t('common.save')}
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Profile; 