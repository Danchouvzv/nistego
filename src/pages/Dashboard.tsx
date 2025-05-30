import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { auth, db } from '../shared/lib/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import Card from '../shared/ui/Card';
import Button from '../shared/ui/Button';
import { Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Filler,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Filler
);

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [recentGrades, setRecentGrades] = useState<any[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<any[]>([]);
  const [stats, setStats] = useState({
    avgGrade: 0,
    completedTasks: 0,
    riskAlerts: 0,
  });

  // Define the Subject interface
  interface Subject {
    id: string;
    title?: string;
    progress?: number;
    risk?: 'low' | 'medium' | 'high';
    userId?: string;
    [key: string]: any;
  }

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (!auth.currentUser) return;
        
        const userId = auth.currentUser.uid;
        
        // Fetch subjects
        const subjectsQuery = query(
          collection(db, 'subjects'),
          where('userId', '==', userId)
        );
        const subjectsSnapshot = await getDocs(subjectsQuery);
        const subjectsData = subjectsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Subject[];
        setSubjects(subjectsData);
        
        // Fetch recent grades
        const gradesQuery = query(
          collection(db, `grades/${userId}/all`),
          orderBy('date', 'desc'),
          limit(5)
        );
        const gradesSnapshot = await getDocs(gradesQuery);
        const gradesData = gradesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecentGrades(gradesData);
        
        // Fetch upcoming tasks
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const tasksQuery = query(
          collection(db, `tasks/${userId}/all`),
          where('dueDate', '>=', today),
          where('completed', '==', false),
          orderBy('dueDate', 'asc'),
          limit(5)
        );
        const tasksSnapshot = await getDocs(tasksQuery);
        const tasksData = tasksSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUpcomingTasks(tasksData);
        
        // Calculate stats
        const allGradesQuery = query(
          collection(db, `grades/${userId}/all`)
        );
        const allGradesSnapshot = await getDocs(allGradesQuery);
        const allGradesData = allGradesSnapshot.docs.map(doc => doc.data());
        
        const allTasksQuery = query(
          collection(db, `tasks/${userId}/all`),
          where('completed', '==', true)
        );
        const allTasksSnapshot = await getDocs(allTasksQuery);
        
        // Calculate average grade
        const totalScore = allGradesData.reduce((sum, grade) => sum + (grade.score / grade.maxScore) * 100, 0);
        const avgGrade = allGradesData.length > 0 ? totalScore / allGradesData.length : 0;
        
        // Count risk alerts
        const riskAlerts = subjectsData.filter(subject => subject.risk === 'high').length;
        
        setStats({
          avgGrade: Math.round(avgGrade),
          completedTasks: allTasksSnapshot.docs.length,
          riskAlerts: riskAlerts,
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  // Mock data for charts
  const doughnutData = {
    labels: subjects.slice(0, 5).map(subject => subject.title || 'Unknown'),
    datasets: [
      {
        data: subjects.slice(0, 5).map(subject => subject.progress || Math.floor(Math.random() * 100)),
        backgroundColor: [
          '#0056C7',
          '#00C897',
          '#EAB308',
          '#EF4444',
          '#8B5CF6',
        ],
        borderWidth: 0,
      },
    ],
  };

  const lineData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: t('dashboard.stats.avgGrade'),
        data: [65, 70, 73, 72, 78, 82],
        borderColor: '#0056C7',
        backgroundColor: 'rgba(0, 86, 199, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'bg-success text-white';
      case 'medium':
        return 'bg-warning text-dark';
      case 'high':
        return 'bg-error text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(navigator.language, {
      day: 'numeric',
      month: 'short',
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card variant="gradient" className="mb-8">
          <Card.Body className="p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              {t('dashboard.welcome', { name: auth.currentUser?.displayName || 'Student' })}
            </h1>
            <p className="text-white/90">
              {new Date().toLocaleDateString(navigator.language, { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </Card.Body>
        </Card>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="h-full" hoverEffect>
            <Card.Body className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">
                  {t('dashboard.stats.avgGrade')}
                </h3>
                <div className="bg-primary/10 dark:bg-primary/20 p-2 rounded-full">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold">{stats.avgGrade}%</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {stats.avgGrade >= 85 
                  ? 'Excellent'
                  : stats.avgGrade >= 70
                    ? 'Good'
                    : 'Needs improvement'
                }
              </div>
            </Card.Body>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="h-full" hoverEffect>
            <Card.Body className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">
                  {t('dashboard.stats.completedTasks')}
                </h3>
                <div className="bg-secondary/10 dark:bg-secondary/20 p-2 rounded-full">
                  <svg className="w-5 h-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold">{stats.completedTasks}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                This term
              </div>
            </Card.Body>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="h-full" hoverEffect>
            <Card.Body className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">
                  {t('dashboard.stats.riskAlerts')}
                </h3>
                <div className="bg-error/10 dark:bg-error/20 p-2 rounded-full">
                  <svg className="w-5 h-5 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold">{stats.riskAlerts}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Active alerts
              </div>
            </Card.Body>
          </Card>
        </motion.div>
      </div>

      {/* Charts & Subject Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="h-full">
            <Card.Header>
              {t('dashboard.subjects.title')}
            </Card.Header>
            <Card.Body className="p-4">
              <div className="h-64 flex justify-center items-center">
                {subjects.length > 0 ? (
                  <Doughnut 
                    data={doughnutData}
                    options={{
                      plugins: {
                        legend: {
                          position: 'bottom',
                        },
                      },
                      cutout: '70%',
                    }}
                  />
                ) : (
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <p>{t('dashboard.subjects.empty')}</p>
                    <Link to="/subjects" className="mt-4 inline-block">
                      <Button variant="primary" size="sm">
                        {t('subjects.add')}
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="h-full">
            <Card.Header>
              {t('dashboard.stats.avgGrade')} - {t('dashboard.trend')}
            </Card.Header>
            <Card.Body className="p-4">
              <div className="h-64">
                <Line 
                  data={lineData}
                  options={{
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: false,
                        min: 60,
                        max: 100,
                      },
                    },
                    maintainAspectRatio: false,
                  }}
                />
              </div>
            </Card.Body>
          </Card>
        </motion.div>
      </div>

      {/* Subject Progress Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mb-8"
      >
        <Card>
          <Card.Header className="flex justify-between items-center">
            <h2>{t('dashboard.subjects.title')}</h2>
            <Link to="/subjects">
              <Button variant="ghost" size="sm">
                {t('common.viewAll')}
              </Button>
            </Link>
          </Card.Header>
          <Card.Body className="p-0">
            {subjects.length > 0 ? (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {subjects.map((subject) => (
                  <Link key={subject.id} to={`/subjects/${subject.id}`}>
                    <div className="p-4 hover:bg-gray-50 dark:hover:bg-dark/40 transition-colors">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">{subject.title}</h3>
                        <div className={`text-xs px-2 py-1 rounded-full ${getRiskColor(subject.risk || 'none')}`}>
                          {subject.risk ? t(`dashboard.subjects.risk.${subject.risk}`) : 'N/A'}
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${
                            (subject.progress || 0) >= 85 
                              ? 'bg-secondary' 
                              : 'bg-primary'
                          }`}
                          style={{ width: `${subject.progress || 0}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <span>{t('dashboard.subjects.progress')}: {subject.progress || 0}%</span>
                        <span>{subject.currentUnit || ''}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400 mb-4">{t('dashboard.subjects.empty')}</p>
                <Link to="/subjects/new">
                  <Button variant="primary">{t('subjects.add')}</Button>
                </Link>
              </div>
            )}
          </Card.Body>
        </Card>
      </motion.div>

      {/* Recent Grades & Upcoming Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card className="h-full">
            <Card.Header className="flex justify-between items-center">
              <h2>{t('dashboard.grades.title')}</h2>
              <Link to="/upload">
                <Button variant="ghost" size="sm">
                  {t('grades.upload')}
                </Button>
              </Link>
            </Card.Header>
            <Card.Body className="p-0">
              {recentGrades.length > 0 ? (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {recentGrades.map((grade) => (
                    <div key={grade.id} className="p-4 flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                        grade.type === 'СОР' || grade.type === 'БЖБ' 
                          ? 'bg-primary' 
                          : grade.type === 'СОЧ' || grade.type === 'ТЖБ' 
                            ? 'bg-secondary'
                            : 'bg-warning'
                      }`}>
                        {grade.type}
                      </div>
                      <div className="ml-4 flex-grow">
                        <div className="font-medium">{grade.subjectTitle}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {grade.title || `Unit ${grade.unitId || ''}`} • {formatDate(grade.date)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          {grade.score}/{grade.maxScore}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {Math.round((grade.score / grade.maxScore) * 100)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">{t('dashboard.grades.empty')}</p>
                  <Link to="/upload">
                    <Button variant="primary">{t('grades.upload')}</Button>
                  </Link>
                </div>
              )}
            </Card.Body>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Card className="h-full">
            <Card.Header className="flex justify-between items-center">
              <h2>{t('dashboard.tasks.title')}</h2>
              <Link to="/planner">
                <Button variant="ghost" size="sm">
                  {t('common.viewAll')}
                </Button>
              </Link>
            </Card.Header>
            <Card.Body className="p-0">
              {upcomingTasks.length > 0 ? (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {upcomingTasks.map((task) => (
                    <div key={task.id} className="p-4 flex items-center">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/10 dark:bg-primary/20 text-primary">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-4 flex-grow">
                        <div className="font-medium">{task.title}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {task.subjectTitle} • {formatDate(task.dueDate)}
                        </div>
                      </div>
                      <div>
                        <div className={`text-xs px-2 py-1 rounded-full ${
                          new Date(task.dueDate).getTime() - new Date().getTime() < 86400000 * 2
                            ? 'bg-error text-white'
                            : 'bg-warning/20 text-warning'
                        }`}>
                          {new Date(task.dueDate).getTime() - new Date().getTime() < 86400000
                            ? t('dashboard.tasks.today')
                            : t('dashboard.tasks.upcoming')
                          }
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">{t('dashboard.tasks.empty')}</p>
                  <Link to="/planner/new">
                    <Button variant="primary">{t('planner.add')}</Button>
                  </Link>
                </div>
              )}
            </Card.Body>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions FAB */}
      <motion.div
        className="fixed bottom-6 right-6"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring' }}
      >
        <div className="relative group">
          <button
            className="bg-primary hover:bg-primary/90 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            aria-label="Quick actions"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
          
          <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
            <div className="bg-white dark:bg-dark rounded-lg shadow-xl p-2 flex flex-col items-end space-y-2">
              <Link to="/upload" className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-dark/40 rounded-lg w-full">
                <span className="text-sm font-medium">{t('grades.upload')}</span>
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
              </Link>
              <Link to="/goals/new" className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-dark/40 rounded-lg w-full">
                <span className="text-sm font-medium">{t('goals.add')}</span>
                <div className="w-8 h-8 bg-secondary text-white rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </Link>
              <Link to="/planner/new" className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-dark/40 rounded-lg w-full">
                <span className="text-sm font-medium">{t('planner.add')}</span>
                <div className="w-8 h-8 bg-warning text-white rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard; 