import { format, addHours, parse, isValid } from 'date-fns';
import type { Task } from '../types/planner';
import { Timestamp } from 'firebase/firestore';

interface ParsedTask {
  subjectId: string;
  linkedGoalId?: string;
  dueDate: Date;
  estimatedEffort: number;
  title: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed' | 'in_progress';
}

// Mock subjects for demo purposes
const SUBJECTS = {
  math: { id: 'math', name: 'Mathematics', color: '#0056C7', icon: '📐' },
  physics: { id: 'physics', name: 'Physics', color: '#7209B7', icon: '⚛️' },
  chemistry: { id: 'chemistry', name: 'Chemistry', color: '#4CC9F0', icon: '🧪' },
  biology: { id: 'biology', name: 'Biology', color: '#38B000', icon: '🧬' },
  history: { id: 'history', name: 'History', color: '#BC6C25', icon: '📜' },
  english: { id: 'english', name: 'English', color: '#FF5400', icon: '📝' },
  literature: { id: 'literature', name: 'Literature', color: '#9D4EDD', icon: '📚' },
  geography: { id: 'geography', name: 'Geography', color: '#2D6A4F', icon: '🌍' },
  computer: { id: 'computer', name: 'Computer Science', color: '#2B2D42', icon: '💻' },
  art: { id: 'art', name: 'Art', color: '#E63946', icon: '🎨' },
};

/**
 * Parse a natural language task description into structured task data
 */
export async function parseTaskText(text: string): Promise<ParsedTask | null> {
  try {
    // Default values
    let subjectId = '';
    let linkedGoalId = undefined;
    let dueDate = addHours(new Date(), 1); // Default: 1 hour from now
    let estimatedEffort = 30; // Default: 30 minutes
    let title = text.trim();
    let priority: 'low' | 'medium' | 'high' = 'medium';
    
    // Extract subject using hashtags
    const subjectMatch = text.match(/#(\w+)/);
    if (subjectMatch) {
      const tag = subjectMatch[1].toLowerCase();
      // Find matching subject
      const matchedSubject = Object.values(SUBJECTS).find(
        s => s.id === tag || s.name.toLowerCase() === tag
      );
      
      if (matchedSubject) {
        subjectId = matchedSubject.id;
        // Remove the hashtag from the title
        title = title.replace(/#\w+/, '').trim();
      }
    }
    
    // Extract goal code (format: numbers separated by dots, e.g., 10.3.2.1)
    const goalCodeMatch = text.match(/(\d+\.\d+(\.\d+)*)/);
    if (goalCodeMatch) {
      linkedGoalId = goalCodeMatch[1];
      // Remove the goal code from the title
      title = title.replace(goalCodeMatch[0], '').trim();
    }
    
    // Extract date and time
    // Check for common date formats
    const dateTimePatterns = [
      { regex: /today at (\d{1,2}):(\d{2})/i, handler: (m: RegExpMatchArray) => {
        const today = new Date();
        return new Date(today.setHours(parseInt(m[1]), parseInt(m[2])));
      }},
      { regex: /tomorrow at (\d{1,2}):(\d{2})/i, handler: (m: RegExpMatchArray) => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return new Date(tomorrow.setHours(parseInt(m[1]), parseInt(m[2])));
      }},
      { regex: /tomorrow (\d{1,2}):(\d{2})/i, handler: (m: RegExpMatchArray) => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return new Date(tomorrow.setHours(parseInt(m[1]), parseInt(m[2])));
      }},
      { regex: /today (\d{1,2}):(\d{2})/i, handler: (m: RegExpMatchArray) => {
        const today = new Date();
        return new Date(today.setHours(parseInt(m[1]), parseInt(m[2])));
      }},
      { regex: /(\d{1,2}):(\d{2})/i, handler: (m: RegExpMatchArray) => {
        const today = new Date();
        return new Date(today.setHours(parseInt(m[1]), parseInt(m[2])));
      }},
      { regex: /(mon|tue|wed|thu|fri|sat|sun)(day)? (\d{1,2}):(\d{2})/i, handler: (m: RegExpMatchArray) => {
        const dayMap: {[key: string]: number} = {
          mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6, sun: 0
        };
        const today = new Date();
        const targetDay = dayMap[m[1].toLowerCase()];
        const daysToAdd = (targetDay + 7 - today.getDay()) % 7 || 7; // If today, go to next week
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + daysToAdd);
        return new Date(targetDate.setHours(parseInt(m[3]), parseInt(m[4])));
      }}
    ];
    
    for (const pattern of dateTimePatterns) {
      const match = text.match(pattern.regex);
      if (match) {
        dueDate = pattern.handler(match);
        // Remove the date/time from the title
        title = title.replace(match[0], '').trim();
        break;
      }
    }
    
    // Extract estimated effort (e.g., "30min", "1h", "1.5h")
    const effortMatch = text.match(/(\d+(\.\d+)?)\s*(h|hour|hours|min|mins|minutes)/i);
    if (effortMatch) {
      const value = parseFloat(effortMatch[1]);
      const unit = effortMatch[3].toLowerCase();
      
      if (unit === 'h' || unit === 'hour' || unit === 'hours') {
        estimatedEffort = Math.round(value * 60);
      } else {
        estimatedEffort = Math.round(value);
      }
      
      // Remove the effort from the title
      title = title.replace(effortMatch[0], '').trim();
    }
    
    // Extract priority
    if (text.match(/!important|!high/i)) {
      priority = 'high';
      title = title.replace(/!important|!high/i, '').trim();
    } else if (text.match(/!low/i)) {
      priority = 'low';
      title = title.replace(/!low/i, '').trim();
    }
    
    // If title is empty after all extractions, use the original text
    if (!title) {
      title = text.trim();
    }
    
    return {
      subjectId,
      linkedGoalId,
      dueDate,
      estimatedEffort,
      title,
      priority,
      status: 'pending'
    };
  } catch (error) {
    console.error('Error parsing task text:', error);
    return null;
  }
}

/**
 * Generate a new task ID
 */
function generateTaskId(): string {
  return `task_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

/**
 * Create a new task from parsed data
 */
export function createTaskFromParsed(parsedTask: ParsedTask): Task {
  return {
    id: generateTaskId(),
    title: parsedTask.title,
    subjectId: parsedTask.subjectId,
    linkedGoalId: parsedTask.linkedGoalId || '',
    dueDate: parsedTask.dueDate,
    estimatedEffort: parsedTask.estimatedEffort,
    status: parsedTask.status,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    position: Date.now(), // Use timestamp as initial position
    priority: parsedTask.priority,
    tags: parsedTask.subjectId ? [parsedTask.subjectId] : [],
  };
}

/**
 * Parse text and create a new task
 */
export async function parseAndCreateTask(text: string): Promise<Task | null> {
  const parsedTask = await parseTaskText(text);
  if (!parsedTask) return null;
  
  return createTaskFromParsed(parsedTask);
} 