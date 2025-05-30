import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../shared/lib/firebase';
import Card from '../shared/ui/Card';
import Button from '../shared/ui/Button';

interface Topic {
  id: string;
  title: string;
  description: string;
  order: number;
  duration: number; // in minutes
  isCompleted: boolean;
  materials: Material[];
}

interface Material {
  id: string;
  title: string;
  type: 'video' | 'article' | 'quiz' | 'practice';
  url?: string;
  duration?: number; // in minutes
  isCompleted: boolean;
}

interface Subject {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  progress: number;
  color: string;
  topics: Topic[];
}

const SubjectDetail: React.FC = () => {
  const { t } = useTranslation();
  const { subjectId } = useParams<{ subjectId: string }>();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchSubjectDetails = async () => {
      try {
        setLoading(true);
        const userId = auth.currentUser?.uid;
        
        if (!userId || !subjectId) {
          throw new Error('User not authenticated or subject ID missing');
        }
        
        // Get subject document
        const subjectRef = doc(db, 'subjects', subjectId);
        const subjectSnap = await getDoc(subjectRef);
        
        if (!subjectSnap.exists()) {
          throw new Error('Subject not found');
        }
        
        const subjectData = subjectSnap.data();
        
        // Get user progress for this subject
        const userSubjectRef = doc(db, 'userSubjects', `${userId}_${subjectId}`);
        const userSubjectSnap = await getDoc(userSubjectRef);
        
        const userProgress = userSubjectSnap.exists() 
          ? userSubjectSnap.data().progress || 0
          : 0;
        
        // Get topics for this subject
        const topicsRef = collection(db, 'topics');
        const topicsQuery = query(topicsRef, where('subjectId', '==', subjectId));
        const topicsSnap = await getDocs(topicsQuery);
        
        const topicsPromises = topicsSnap.docs.map(async (topicDoc) => {
          const topicData = topicDoc.data();
          
          // Get materials for this topic
          const materialsRef = collection(db, 'materials');
          const materialsQuery = query(materialsRef, where('topicId', '==', topicDoc.id));
          const materialsSnap = await getDocs(materialsQuery);
          
          // Get user progress for these materials
          const materialIds = materialsSnap.docs.map(doc => doc.id);
          const userMaterialsRef = collection(db, 'userMaterials');
          const userMaterialsQuery = query(
            userMaterialsRef, 
            where('userId', '==', userId),
            where('materialId', 'in', materialIds.length > 0 ? materialIds : ['placeholder'])
          );
          const userMaterialsSnap = await getDocs(userMaterialsQuery);
          
          const userCompletedMaterials = userMaterialsSnap.docs.reduce((acc, doc) => {
            const data = doc.data();
            if (data.isCompleted) {
              acc[data.materialId] = true;
            }
            return acc;
          }, {} as Record<string, boolean>);
          
          const materials = materialsSnap.docs.map(materialDoc => {
            const materialData = materialDoc.data();
            return {
              id: materialDoc.id,
              title: materialData.title,
              type: materialData.type,
              url: materialData.url,
              duration: materialData.duration,
              isCompleted: !!userCompletedMaterials[materialDoc.id]
            };
          }).sort((a, b) => a.title.localeCompare(b.title));
          
          // Get user progress for this topic
          const userTopicRef = doc(db, 'userTopics', `${userId}_${topicDoc.id}`);
          const userTopicSnap = await getDoc(userTopicRef);
          
          const isTopicCompleted = userTopicSnap.exists() 
            ? userTopicSnap.data().isCompleted || false
            : false;
          
          return {
            id: topicDoc.id,
            title: topicData.title,
            description: topicData.description,
            order: topicData.order || 0,
            duration: topicData.duration || 0,
            isCompleted: isTopicCompleted,
            materials
          };
        });
        
        const topics = await Promise.all(topicsPromises);
        topics.sort((a, b) => a.order - b.order);
        
        setSubject({
          id: subjectId,
          name: subjectData.name,
          description: subjectData.description,
          iconUrl: subjectData.iconUrl || `/icons/subjects/${subjectId}.svg`,
          progress: userProgress,
          color: subjectData.color || '#4338CA',
          topics
        });
      } catch (err: any) {
        console.error('Error fetching subject details:', err);
        setError(err.message || t('subjectDetail.errorLoading', 'Error loading subject details. Please try again.'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubjectDetails();
  }, [subjectId, t]);
  
  // Mock data for development until Firebase is set up
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && !subject && !loading && !error) {
      const mockSubject: Subject = {
        id: subjectId || 'math',
        name: subjectId === 'math' ? 'Mathematics' : 
              subjectId === 'physics' ? 'Physics' : 
              subjectId === 'chemistry' ? 'Chemistry' : 
              subjectId === 'biology' ? 'Biology' : 
              subjectId === 'history' ? 'History' : 'Subject',
        description: 'Learn and master the fundamentals of this subject',
        iconUrl: `/icons/subjects/${subjectId}.svg`,
        progress: 65,
        color: subjectId === 'math' ? '#4338CA' : 
               subjectId === 'physics' ? '#0891B2' : 
               subjectId === 'chemistry' ? '#65A30D' : 
               subjectId === 'biology' ? '#059669' : 
               subjectId === 'history' ? '#B45309' : '#4338CA',
        topics: [
          {
            id: 'topic1',
            title: 'Introduction to the Subject',
            description: 'Learn the fundamentals and key concepts',
            order: 1,
            duration: 60,
            isCompleted: true,
            materials: [
              {
                id: 'material1',
                title: 'Overview Video',
                type: 'video',
                url: 'https://example.com/video1',
                duration: 15,
                isCompleted: true
              },
              {
                id: 'material2',
                title: 'Key Concepts',
                type: 'article',
                url: 'https://example.com/article1',
                duration: 10,
                isCompleted: true
              },
              {
                id: 'material3',
                title: 'Basic Quiz',
                type: 'quiz',
                duration: 10,
                isCompleted: true
              }
            ]
          },
          {
            id: 'topic2',
            title: 'Core Principles',
            description: 'Understanding the core principles and applications',
            order: 2,
            duration: 90,
            isCompleted: true,
            materials: [
              {
                id: 'material4',
                title: 'Principles Explained',
                type: 'video',
                url: 'https://example.com/video2',
                duration: 20,
                isCompleted: true
              },
              {
                id: 'material5',
                title: 'Practical Applications',
                type: 'article',
                url: 'https://example.com/article2',
                duration: 15,
                isCompleted: true
              },
              {
                id: 'material6',
                title: 'Practice Exercises',
                type: 'practice',
                duration: 25,
                isCompleted: true
              }
            ]
          },
          {
            id: 'topic3',
            title: 'Advanced Concepts',
            description: 'Diving deeper into complex topics',
            order: 3,
            duration: 120,
            isCompleted: false,
            materials: [
              {
                id: 'material7',
                title: 'Advanced Theory',
                type: 'video',
                url: 'https://example.com/video3',
                duration: 30,
                isCompleted: false
              },
              {
                id: 'material8',
                title: 'Case Studies',
                type: 'article',
                url: 'https://example.com/article3',
                duration: 20,
                isCompleted: false
              },
              {
                id: 'material9',
                title: 'Comprehensive Quiz',
                type: 'quiz',
                duration: 20,
                isCompleted: false
              },
              {
                id: 'material10',
                title: 'Advanced Exercises',
                type: 'practice',
                duration: 25,
                isCompleted: false
              }
            ]
          },
          {
            id: 'topic4',
            title: 'Practical Applications',
            description: 'Applying concepts to real-world problems',
            order: 4,
            duration: 150,
            isCompleted: false,
            materials: [
              {
                id: 'material11',
                title: 'Real-world Examples',
                type: 'video',
                url: 'https://example.com/video4',
                duration: 25,
                isCompleted: false
              },
              {
                id: 'material12',
                title: 'Industry Applications',
                type: 'article',
                url: 'https://example.com/article4',
                duration: 15,
                isCompleted: false
              },
              {
                id: 'material13',
                title: 'Problem Solving Workshop',
                type: 'practice',
                duration: 40,
                isCompleted: false
              },
              {
                id: 'material14',
                title: 'Final Assessment',
                type: 'quiz',
                duration: 30,
                isCompleted: false
              }
            ]
          }
        ]
      };
      
      setSubject(mockSubject);
      
      // Set first two topics as expanded by default
      setExpandedTopics({
        topic1: true,
        topic2: true
      });
    }
  }, [loading, subject, error, subjectId]);
  
  const toggleTopic = (topicId: string) => {
    setExpandedTopics(prev => ({
      ...prev,
      [topicId]: !prev[topicId]
    }));
  };
  
  const getMaterialIcon = (type: string) => {
    switch (type) {
      case 'video':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        );
      case 'article':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
          </svg>
        );
      case 'quiz':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        );
      case 'practice':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        );
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error || !subject) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-error/10 text-error px-4 py-3 rounded-md mb-4">
          {error || t('subjectDetail.subjectNotFound', 'Subject not found')}
        </div>
        <Link to="/subjects">
          <Button variant="primary">
            {t('subjectDetail.backToSubjects', 'Back to Subjects')}
          </Button>
        </Link>
      </div>
    );
  }
  
  const topicCardVariants = {
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
  
  const materialCardVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: 'auto',
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      height: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link to="/subjects" className="text-gray-600 dark:text-gray-400 hover:text-primary mr-4">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
        </Link>
        
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
        
        <div>
          <h1 className="text-3xl font-bold">{subject.name}</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {subject.description}
          </p>
        </div>
      </div>
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm">
            {t('subjectDetail.progress', 'Progress')}:
            <span className="ml-1 font-medium">
              {subject.progress}%
            </span>
          </div>
          <div className="text-sm">
            {subject.topics.filter(t => t.isCompleted).length}/{subject.topics.length}
            {' '}{t('subjectDetail.topicsCompleted', 'topics completed')}
          </div>
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
      
      <div className="mb-8 flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {t('subjectDetail.topics', 'Topics')}
        </h2>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setExpandedTopics({})}
          >
            {t('subjectDetail.collapseAll', 'Collapse All')}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              const allExpanded = subject.topics.reduce((acc, topic) => {
                acc[topic.id] = true;
                return acc;
              }, {} as Record<string, boolean>);
              setExpandedTopics(allExpanded);
            }}
          >
            {t('subjectDetail.expandAll', 'Expand All')}
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        {subject.topics.map((topic, index) => (
          <motion.div
            key={topic.id}
            custom={index}
            variants={topicCardVariants}
            initial="hidden"
            animate="visible"
          >
            <Card className={topic.isCompleted ? 'border-l-4 border-l-success' : ''}>
              <Card.Body className="p-4">
                <div 
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleTopic(topic.id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center">
                      {topic.isCompleted && (
                        <span className="text-success mr-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                        </span>
                      )}
                      <h3 className="text-lg font-semibold">{topic.title}</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {topic.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mr-4">
                      {t('subjectDetail.duration', 'Duration')}: {topic.duration} {t('subjectDetail.minutes', 'min')}
                    </div>
                    
                    <svg 
                      className={`w-5 h-5 transition-transform ${expandedTopics[topic.id] ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
                
                <motion.div
                  variants={materialCardVariants}
                  initial="hidden"
                  animate={expandedTopics[topic.id] ? 'visible' : 'hidden'}
                  exit="exit"
                >
                  {expandedTopics[topic.id] && (
                    <div className="mt-4 space-y-3 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                      {topic.materials.map(material => (
                        <div 
                          key={material.id}
                          className="flex items-center p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          <div className={`mr-3 ${material.isCompleted ? 'text-success' : 'text-gray-500 dark:text-gray-400'}`}>
                            {getMaterialIcon(material.type)}
                          </div>
                          
                          <div className="flex-1">
                            <div className="font-medium">{material.title}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {t(`subjectDetail.materialTypes.${material.type}`, material.type)}
                              {material.duration && ` • ${material.duration} ${t('subjectDetail.minutes', 'min')}`}
                            </div>
                          </div>
                          
                          <div>
                            {material.isCompleted ? (
                              <span className="text-xs text-success font-medium flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                {t('subjectDetail.completed', 'Completed')}
                              </span>
                            ) : (
                              <Button size="sm">
                                {
                                  material.type === 'video' ? t('subjectDetail.watch', 'Watch') :
                                  material.type === 'article' ? t('subjectDetail.read', 'Read') :
                                  material.type === 'quiz' ? t('subjectDetail.takeQuiz', 'Take Quiz') :
                                  t('subjectDetail.practice', 'Practice')
                                }
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </Card.Body>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SubjectDetail; 