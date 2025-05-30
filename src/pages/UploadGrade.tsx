import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth, storage } from '../shared/lib/firebase';
import Card from '../shared/ui/Card';
import Button from '../shared/ui/Button';

interface Subject {
  id: string;
  name: string;
}

const UploadGrade: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        // Get subjects
        const subjectsRef = collection(db, 'subjects');
        const subjectsSnapshot = await getDocs(subjectsRef);
        
        const subjectsData = subjectsSnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name
        }));
        
        setSubjects(subjectsData);
      } catch (err) {
        console.error('Error fetching subjects:', err);
      }
    };
    
    fetchSubjects();
    
    // Set default date to today
    const today = new Date();
    setDate(today.toISOString().split('T')[0]);
  }, []);
  
  // Mock data for development until Firebase is set up
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && subjects.length === 0) {
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
  }, [subjects.length]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  
  const validateForm = () => {
    if (!subject) {
      setError(t('uploadGrade.errors.selectSubject', 'Please select a subject'));
      return false;
    }
    
    if (!grade) {
      setError(t('uploadGrade.errors.enterGrade', 'Please enter your grade'));
      return false;
    }
    
    const numericGrade = parseFloat(grade);
    if (isNaN(numericGrade) || numericGrade < 0 || numericGrade > 100) {
      setError(t('uploadGrade.errors.invalidGrade', 'Grade must be a number between 0 and 100'));
      return false;
    }
    
    if (!date) {
      setError(t('uploadGrade.errors.selectDate', 'Please select a date'));
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const userId = auth.currentUser?.uid;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      let fileUrl = null;
      
      if (file) {
        // Upload file to Firebase Storage
        const fileRef = ref(storage, `grades/${userId}/${subject}/${Date.now()}_${file.name}`);
        await uploadBytes(fileRef, file);
        fileUrl = await getDownloadURL(fileRef);
      }
      
      // Add grade to Firestore
      const gradeData = {
        userId,
        subjectId: subject,
        grade: parseFloat(grade),
        date: new Date(date),
        notes: notes || null,
        fileUrl,
        createdAt: serverTimestamp()
      };
      
      await addDoc(collection(db, 'grades'), gradeData);
      
      // Update user's subject stats
      const userSubjectsRef = collection(db, 'userSubjects');
      const q = query(
        userSubjectsRef, 
        where('userId', '==', userId),
        where('subjectId', '==', subject)
      );
      
      const userSubjectsSnapshot = await getDocs(q);
      
      if (!userSubjectsSnapshot.empty) {
        // User already has a record for this subject
        // Update logic would go here (e.g., recalculate average grade)
        // For simplicity, we're just adding the grade
      }
      
      setSubmitSuccess(true);
      
      // Reset form
      setSubject('');
      setGrade('');
      setNotes('');
      setFile(null);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err: any) {
      console.error('Error uploading grade:', err);
      setError(err.message || t('uploadGrade.errors.default', 'Error uploading grade. Please try again.'));
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <Card.Body className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-center">
              {t('uploadGrade.title', 'Upload Grade')}
            </h1>
            
            {submitSuccess ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <div className="mb-4 flex justify-center">
                  <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                </div>
                <h2 className="text-xl font-semibold mb-2">
                  {t('uploadGrade.success.title', 'Grade Uploaded Successfully!')}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {t('uploadGrade.success.message', 'Your grade has been recorded. Redirecting to dashboard...')}
                </p>
                <Button
                  variant="primary"
                  onClick={() => navigate('/dashboard')}
                >
                  {t('uploadGrade.success.goToDashboard', 'Go to Dashboard')}
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="mb-6 bg-error/10 text-error px-4 py-3 rounded-md">
                    {error}
                  </div>
                )}
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('uploadGrade.form.subject', 'Subject')}*
                    </label>
                    <select
                      id="subject"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-dark/50"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                    >
                      <option value="">{t('uploadGrade.form.selectSubject', 'Select subject')}</option>
                      {subjects.map(subject => (
                        <option key={subject.id} value={subject.id}>
                          {subject.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="grade" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('uploadGrade.form.grade', 'Grade (0-100)')}*
                    </label>
                    <input
                      id="grade"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-dark/50"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('uploadGrade.form.date', 'Date')}*
                    </label>
                    <input
                      id="date"
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-dark/50"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('uploadGrade.form.notes', 'Notes (optional)')}
                    </label>
                    <textarea
                      id="notes"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-dark/50"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="file" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('uploadGrade.form.file', 'Upload Document (optional)')}
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="flex text-sm text-gray-600 dark:text-gray-400">
                          <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-primary hover:text-secondary focus-within:outline-none">
                            <span>{t('uploadGrade.form.uploadFile', 'Upload a file')}</span>
                            <input 
                              id="file-upload" 
                              name="file-upload" 
                              type="file" 
                              className="sr-only"
                              onChange={handleFileChange}
                              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                            />
                          </label>
                          <p className="pl-1">{t('uploadGrade.form.dragDrop', 'or drag and drop')}</p>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {t('uploadGrade.form.fileTypes', 'PDF, DOCX, JPG, PNG up to 10MB')}
                        </p>
                        {file && (
                          <p className="text-sm text-success">
                            {file.name} ({Math.round(file.size / 1024)} KB)
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    isLoading={loading}
                  >
                    {t('uploadGrade.form.submit', 'Upload Grade')}
                  </Button>
                </div>
              </form>
            )}
          </Card.Body>
        </Card>
        
        <div className="mt-6">
          <Card>
            <Card.Body className="p-6">
              <h2 className="text-lg font-semibold mb-4">
                {t('uploadGrade.tips.title', 'Tips for Grade Uploading')}
              </h2>
              
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-primary mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{t('uploadGrade.tips.tip1', 'Enter grades as soon as you receive them for better tracking.')}</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-primary mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{t('uploadGrade.tips.tip2', 'You can upload a scan or photo of your graded paper as evidence.')}</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-primary mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{t('uploadGrade.tips.tip3', 'Use the notes section to record what topics the grade was for.')}</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-primary mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{t('uploadGrade.tips.tip4', 'Your grades are private and only visible to you.')}</span>
                </li>
              </ul>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UploadGrade;