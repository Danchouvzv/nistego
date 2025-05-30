import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../shared/lib/firebase';
import Card from '../shared/ui/Card';
import Button from '../shared/ui/Button';

interface Event {
  id: string;
  title: string;
  description?: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  subject?: string;
  type: 'exam' | 'homework' | 'study' | 'other';
}

const Planner: React.FC = () => {
  const { t } = useTranslation();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const userId = auth.currentUser?.uid;
        
        if (!userId) {
          throw new Error('User not authenticated');
        }
        
        // Get first and last day of current month
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        
        // Fetch events for the current month
        const eventsRef = collection(db, 'events');
        const q = query(
          eventsRef, 
          where('userId', '==', userId),
          where('date', '>=', firstDay),
          where('date', '<=', lastDay)
        );
        
        const eventsSnapshot = await getDocs(q);
        
        const eventsData = eventsSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            description: data.description,
            date: data.date.toDate(),
            startTime: data.startTime,
            endTime: data.endTime,
            subject: data.subject,
            type: data.type,
          };
        });
        
        setEvents(eventsData);
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, [currentDate]);
  
  // Mock data for development until Firebase is set up
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && events.length === 0 && !loading) {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth();
      
      const mockEvents: Event[] = [
        {
          id: '1',
          title: 'Math Exam',
          description: 'Final exam for calculus',
          date: new Date(year, month, 15),
          startTime: '09:00',
          endTime: '11:00',
          subject: 'math',
          type: 'exam',
        },
        {
          id: '2',
          title: 'Physics Homework',
          description: 'Complete problems 1-10',
          date: new Date(year, month, 10),
          subject: 'physics',
          type: 'homework',
        },
        {
          id: '3',
          title: 'Study Group',
          description: 'Chemistry study group at library',
          date: new Date(year, month, 8),
          startTime: '16:00',
          endTime: '18:00',
          subject: 'chemistry',
          type: 'study',
        },
        {
          id: '4',
          title: 'Language Quiz',
          date: new Date(year, month, today.getDate()),
          subject: 'languages',
          type: 'exam',
        },
      ];
      
      setEvents(mockEvents);
    }
  }, [loading, events.length]);
  
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };
  
  const goToPreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };
  
  const goToNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };
  
  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'exam':
        return 'bg-error/10 text-error border-error/20';
      case 'homework':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'study':
        return 'bg-info/10 text-info border-info/20';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700';
    }
  };
  
  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const today = new Date();
    const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;
    const todayDate = today.getDate();
    
    // Create array of days
    const days = [];
    
    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    // Get events for each day
    const eventsByDay: Record<number, Event[]> = {};
    events.forEach(event => {
      const day = event.date.getDate();
      if (!eventsByDay[day]) {
        eventsByDay[day] = [];
      }
      eventsByDay[day].push(event);
    });
    
    return (
      <div className="grid grid-cols-7 gap-1">
        {/* Week day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
          <div key={`header-${index}`} className="py-2 text-center text-sm font-medium">
            {t(`planner.weekdays.${day.toLowerCase()}`, day)}
          </div>
        ))}
        
        {/* Calendar days */}
        {days.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="h-24 bg-gray-50 dark:bg-gray-900/30 rounded-md"></div>;
          }
          
          const isToday = isCurrentMonth && day === todayDate;
          const isSelected = selectedDate && 
                            selectedDate.getDate() === day && 
                            selectedDate.getMonth() === month && 
                            selectedDate.getFullYear() === year;
          
          const dayEvents = eventsByDay[day] || [];
          
          return (
            <div 
              key={`day-${day}`}
              className={`h-24 p-1 border rounded-md overflow-hidden transition-colors ${
                isToday 
                  ? 'bg-primary/5 border-primary'
                  : 'border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/30'
              } ${
                isSelected ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedDate(new Date(year, month, day))}
            >
              <div className={`text-right mb-1 font-medium ${isToday ? 'text-primary' : ''}`}>
                {day}
              </div>
              
              <div className="overflow-y-auto h-[calc(100%-20px)] space-y-1">
                {dayEvents.map(event => (
                  <div 
                    key={event.id}
                    className={`px-1 py-0.5 text-xs truncate rounded border ${getEventTypeColor(event.type)}`}
                  >
                    {event.startTime && `${event.startTime} `}
                    {event.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  
  const renderSelectedDateEvents = () => {
    if (!selectedDate) return null;
    
    const dateEvents = events.filter(event => 
      event.date.getDate() === selectedDate.getDate() &&
      event.date.getMonth() === selectedDate.getMonth() &&
      event.date.getFullYear() === selectedDate.getFullYear()
    );
    
    if (dateEvents.length === 0) {
      return (
        <div className="text-gray-600 dark:text-gray-400 py-4 text-center">
          {t('planner.noEvents', 'No events for this day')}
        </div>
      );
    }
    
    // Sort events by start time
    dateEvents.sort((a, b) => {
      if (!a.startTime) return 1;
      if (!b.startTime) return -1;
      return a.startTime.localeCompare(b.startTime);
    });
    
    return (
      <div className="space-y-3">
        {dateEvents.map(event => (
          <div key={event.id} className="border rounded-md p-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{event.title}</h3>
                {event.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {event.description}
                  </p>
                )}
              </div>
              <div className={`px-2 py-1 text-xs rounded ${getEventTypeColor(event.type)}`}>
                {t(`planner.eventTypes.${event.type}`, event.type)}
              </div>
            </div>
            
            <div className="mt-2 flex flex-wrap gap-3 text-sm">
              {event.startTime && (
                <div className="flex items-center">
                  <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {event.startTime}{event.endTime ? ` - ${event.endTime}` : ''}
                </div>
              )}
              
              {event.subject && (
                <div className="flex items-center">
                  <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {event.subject}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {t('planner.title', 'Study Planner')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t('planner.subtitle', 'Plan and organize your study schedule')}
            </p>
          </div>
          
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button
              variant="primary"
              disabled={true} // Feature to be implemented
            >
              {t('planner.addEvent', 'Add Event')}
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-3/4">
            <Card>
              <Card.Body className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold">
                      {currentDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                    </h2>
                    <button 
                      className="text-sm text-primary underline"
                      onClick={goToToday}
                    >
                      {t('planner.today', 'Today')}
                    </button>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={goToPreviousMonth}
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                      </svg>
                    </button>
                    <button 
                      className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={goToNextMonth}
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                
                {renderCalendar()}
              </Card.Body>
            </Card>
          </div>
          
          <div className="lg:w-1/4">
            <Card className="sticky top-24">
              <Card.Body className="p-4">
                <h2 className="text-lg font-semibold mb-4">
                  {selectedDate 
                    ? selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }) 
                    : t('planner.selectDate', 'Select a date')}
                </h2>
                
                {selectedDate ? (
                  renderSelectedDateEvents()
                ) : (
                  <div className="text-gray-600 dark:text-gray-400 py-4 text-center">
                    {t('planner.clickToViewEvents', 'Click on a day to view events')}
                  </div>
                )}
              </Card.Body>
            </Card>
          </div>
        </div>
        
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">
            {t('planner.legend', 'Legend')}
          </h2>
          
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded mr-2 ${getEventTypeColor('exam')}`}></div>
              <span>{t('planner.eventTypes.exam', 'Exam')}</span>
            </div>
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded mr-2 ${getEventTypeColor('homework')}`}></div>
              <span>{t('planner.eventTypes.homework', 'Homework')}</span>
            </div>
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded mr-2 ${getEventTypeColor('study')}`}></div>
              <span>{t('planner.eventTypes.study', 'Study')}</span>
            </div>
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded mr-2 ${getEventTypeColor('other')}`}></div>
              <span>{t('planner.eventTypes.other', 'Other')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Planner;