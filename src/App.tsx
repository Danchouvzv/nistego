import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import router from './app/router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { auth } from './shared/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Suspense, lazy } from 'react';
import ErrorBoundary from './shared/ui/ErrorBoundary';

// Create a client
const queryClient = new QueryClient();

function App() {
  const { i18n } = useTranslation();

  // Listen to auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Update user in query client
      queryClient.setQueryData(['user'], user);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Применение темной темы при загрузке приложения
  useEffect(() => {
    // Проверяем сохраненную тему
    const savedTheme = localStorage.getItem('theme') || 'system';
    
    // Функция для применения темы
    const applyTheme = () => {
      const isDark = 
        savedTheme === 'dark' || 
        (savedTheme === 'system' && 
          window.matchMedia('(prefers-color-scheme: dark)').matches);
      
      document.documentElement.classList.toggle('dark', isDark);
    };
    
    applyTheme();
    
    // Следим за изменениями системной темы
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (savedTheme === 'system') {
        applyTheme();
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
