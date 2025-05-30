import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../shared/lib/firebase';
import Card from '../shared/ui/Card';
import Button from '../shared/ui/Button';

interface Subject {
  id: string;
  name: string;
  iconUrl: string;
  description: string;
  progress: number;
  totalTopics: number;
  completedTopics: number;
  averageGrade: number | null;
  color: string;
}

const Subjects: React.FC = () => {
  const { t } = useTranslation();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterValue, setFilterValue] = useState('all');

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        const userId = auth.currentUser?.uid;
        
        if (!userId) {
          throw new Error('User not authenticated');
        }
        
        // Get user document to see which subjects they're enrolled in
        const userSubjectsRef = collection(db, 'userSubjects');
        const q = query(userSubjectsRef, where('userId', '==', userId));
        const userSubjectsSnapshot = await getDocs(q);
        
        const userSubjects = userSubjectsSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: data.subjectId,
            progress: data.progress || 0,
            completedTopics: data.completedTopics || 0,
            averageGrade: data.averageGrade || null,
          };
        });
        
        // Get all subjects
        const subjectsRef = collection(db, 'subjects');
        const subjectsSnapshot = await getDocs(subjectsRef);
        
        // Map the subject data with the user's progress
        const subjectsData = subjectsSnapshot.docs.map(doc => {
          const subjectData = doc.data();
          const userSubject = userSubjects.find(us => us.id === doc.id) || {
            progress: 0,
            completedTopics: 0,
            averageGrade: null
          };
          
          return {
            id: doc.id,
            name: subjectData.name,
            iconUrl: subjectData.iconUrl || `/icons/subjects/${doc.id}.svg`,
            description: subjectData.description,
            progress: userSubject.progress,
            totalTopics: subjectData.topicsCount || 0,
            completedTopics: userSubject.completedTopics,
            averageGrade: userSubject.averageGrade,
            color: subjectData.color || '#4338CA',
          };
        });
        
        setSubjects(subjectsData);
      } catch (err) {
        console.error('Error fetching subjects:', err);
        setError(t('subjects.errorLoading', 'Error loading subjects. Please try again.'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubjects();
  }, [t]);
  
  // Mock data for development until Firebase is set up
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && subjects.length === 0 && !loading) {
      const mockSubjects: Subject[] = [
        {
          id: 'math',
          name: 'Mathematics',
          iconUrl: '/icons/subjects/math.svg',
          description: 'Algebra, Geometry, Statistics and more',
          progress: 65,
          totalTopics: 24,
          completedTopics: 16,
          averageGrade: 85,
          color: '#4338CA',
        },
        {
          id: 'physics',
          name: 'Physics',
          iconUrl: '/icons/subjects/physics.svg',
          description: 'Mechanics, Thermodynamics, Electricity',
          progress: 40,
          totalTopics: 18,
          completedTopics: 7,
          averageGrade: 78,
          color: '#0891B2',
        },
        {
          id: 'chemistry',
          name: 'Chemistry',
          iconUrl: '/icons/subjects/chemistry.svg',
          description: 'Organic Chemistry, Inorganic Chemistry',
          progress: 22,
          totalTopics: 20,
          completedTopics: 4,
          averageGrade: 72,
          color: '#65A30D',
        },
        {
          id: 'biology',
          name: 'Biology',
          iconUrl: '/icons/subjects/biology.svg',
          description: 'Cells, Genetics, Ecology',
          progress: 58,
          totalTopics: 16,
          completedTopics: 9,
          averageGrade: 90,
          color: '#059669',
        },
        {
          id: 'history',
          name: 'History',
          iconUrl: '/icons/subjects/history.svg',
          description: 'World History, Kazakhstan History',
          progress: 30,
          totalTopics: 22,
          completedTopics: 7,
          averageGrade: 75,
          color: '#B45309',
        },
        {
          id: 'languages',
          name: 'Languages',
          iconUrl: '/icons/subjects/languages.svg',
          description: 'Kazakh, Russian, English',
          progress: 50,
          totalTopics: 30,
          completedTopics: 15,
          averageGrade: 82,
          color: '#BE185D',
        },
      ];
      
      setSubjects(mockSubjects);
    }
  }, [loading, subjects.length]);
  
  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'text-error';
    if (progress < 70) return 'text-warning';
    return 'text-success';
  };
  
  const filteredSubjects = filterValue === 'all' 
    ? subjects 
    : filterValue === 'inProgress' 
      ? subjects.filter(s => s.progress > 0 && s.progress < 100)
      : filterValue === 'notStarted'
        ? subjects.filter(s => s.progress === 0)
        : subjects.filter(s => s.progress === 100);

  const subjectCardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      }
    })
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-error/10 text-error px-4 py-3 rounded-md">
          {error}
        </div>
        <Button 
          variant="primary" 
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          {t('common.tryAgain', 'Try Again')}
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">
          {t('subjects.title', 'My Subjects')}
        </h1>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filterValue === 'all' ? 'primary' : 'outline'}
            onClick={() => setFilterValue('all')}
          >
            {t('subjects.filters.all', 'All')}
          </Button>
          <Button
            variant={filterValue === 'inProgress' ? 'primary' : 'outline'}
            onClick={() => setFilterValue('inProgress')}
          >
            {t('subjects.filters.inProgress', 'In Progress')}
          </Button>
          <Button
            variant={filterValue === 'notStarted' ? 'primary' : 'outline'}
            onClick={() => setFilterValue('notStarted')}
          >
            {t('subjects.filters.notStarted', 'Not Started')}
          </Button>
          <Button
            variant={filterValue === 'completed' ? 'primary' : 'outline'}
            onClick={() => setFilterValue('completed')}
          >
            {t('subjects.filters.completed', 'Completed')}
          </Button>
        </div>
      </div>

      {filteredSubjects.length === 0 ? (
        <div className="text-center py-16">
          <h3 className="text-xl font-medium mb-2">
            {t('subjects.noSubjectsFound', 'No subjects found')}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {filterValue !== 'all' 
              ? t('subjects.tryChangingFilters', 'Try changing your filters or adding new subjects')
              : t('subjects.noSubjectsEnrolled', 'You are not enrolled in any subjects yet')}
          </p>
          <Button variant="primary">
            {t('subjects.browseSubjects', 'Browse Subjects')}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map((subject, index) => (
            <motion.div
              key={subject.id}
              custom={index}
              variants={subjectCardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Link to={`/subjects/${subject.id}`} className="block h-full">
                <Card className="h-full">
                  <Card.Body className="p-6">
                    <div className="flex items-start">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                        style={{ backgroundColor: `${subject.color}20` }}
                      >
                        <img 
                          src={subject.iconUrl} 
                          alt={subject.name} 
                          className="w-6 h-6"
                          onError={(e) => {
                            // Fallback to first letter if image fails to load
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.innerText = subject.name[0];
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-1">{subject.name}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                          {subject.description}
                        </p>
                        
                        <div className="mb-2">
                          <div className="flex justify-between text-sm mb-1">
                            <span>{t('subjects.progress')}</span>
                            <span className={getProgressColor(subject.progress)}>
                              {subject.progress}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full" 
                              style={{ 
                                width: `${subject.progress}%`, 
                                backgroundColor: subject.color 
                              }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap justify-between text-sm mt-4">
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">
                              {t('subjects.topics', 'Topics')}: 
                            </span>
                            <span className="ml-1 font-medium">
                              {subject.completedTopics}/{subject.totalTopics}
                            </span>
                          </div>
                          
                          {subject.averageGrade !== null && (
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">
                                {t('subjects.avgGrade', 'Avg Grade')}: 
                              </span>
                              <span className="ml-1 font-medium">
                                {subject.averageGrade}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Subjects; 