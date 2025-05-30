import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '../../firebase';
import ThemeToggle from './ThemeToggle';
import LanguageSelector from './LanguageSelector';

export const Header: React.FC = () => {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isLandingPage = location.pathname === '/';
  const isAuthenticated = auth.currentUser !== null;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Закрываем мобильное меню при изменении маршрута
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const headerClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 
    ${isScrolled 
      ? 'bg-white/90 dark:bg-dark/90 backdrop-blur-md shadow-md py-2' 
      : isLandingPage 
        ? 'bg-transparent py-4' 
        : 'bg-white dark:bg-dark py-3'}`;
  
  const textClasses = isLandingPage && !isScrolled ? 'text-white' : 'text-gray-800 dark:text-white';

  const navItems = [
    { path: isAuthenticated ? '/dashboard' : '/', label: t('subjects.title'), icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
      </svg>
    ), requireAuth: true },
    { path: '/planner', label: t('planner.title'), icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
      </svg>
    ), requireAuth: true },
    { path: '/goals', label: t('goals.title'), icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
      </svg>
    ), requireAuth: true },
  ];

  const filteredNavItems = navItems.filter(item => 
    !item.requireAuth || (item.requireAuth && isAuthenticated)
  );

  const logoVariants = {
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2 }
    }
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: 'auto',
      transition: {
        duration: 0.3,
        ease: 'easeInOut'
      }
    },
    exit: { 
      opacity: 0, 
      height: 0,
      transition: {
        duration: 0.3,
        ease: 'easeInOut'
      }
    }
  };

  return (
    <header className={headerClasses}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            variants={logoVariants}
            whileHover="hover"
            className="flex-shrink-0"
          >
            <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center">
              <div className="bg-gradient-to-r from-primary to-secondary w-10 h-10 rounded-lg flex items-center justify-center mr-2">
                <span className="text-white text-lg font-bold">N</span>
              </div>
              <h1 className={`text-xl font-bold ${textClasses}`}>NIStego</h1>
            </Link>
          </motion.div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex md:items-center md:space-x-1">
            {filteredNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1.5 transition-all duration-200 
                  ${location.pathname === item.path 
                    ? 'text-primary bg-primary/5 dark:bg-primary/10' 
                    : `${textClasses} hover:bg-gray-100 dark:hover:bg-gray-800`}`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Right side items */}
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <LanguageSelector />
            
            {isAuthenticated ? (
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => navigate('/profile')}
              >
                <div className="bg-gradient-to-r from-primary to-secondary text-white w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-md">
                  {auth.currentUser?.displayName?.charAt(0) || 'U'}
                </div>
                <div className="hidden sm:block">
                  <span className={`text-sm font-medium ${textClasses}`}>
                    {auth.currentUser?.displayName || 'User'}
                  </span>
                </div>
              </motion.div>
            ) : (
              <div className="flex space-x-2">
                <Link 
                  to="/auth/login" 
                  className={`text-sm font-medium px-4 py-2 rounded-md transition-all duration-200
                    ${isLandingPage && !isScrolled
                      ? 'bg-white text-primary hover:bg-white/90 shadow-md hover:shadow-lg'
                      : 'bg-primary text-white hover:bg-primary/90 shadow-md hover:shadow-lg hover:-translate-y-0.5'
                    }`
                  }
                >
                  {t('auth.login')}
                </Link>
                <Link 
                  to="/auth/register" 
                  className={`text-sm font-medium px-4 py-2 rounded-md transition-all duration-200
                    ${isLandingPage && !isScrolled
                      ? 'border border-white text-white hover:bg-white/10'
                      : 'border border-primary text-primary dark:text-white dark:border-white hover:bg-primary/5 dark:hover:bg-white/5'
                    }`
                  }
                >
                  {t('auth.register')}
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button 
                className={`p-2 rounded-md focus:outline-none ${textClasses}`}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-expanded={isMenuOpen}
              >
                <motion.svg 
                  className="h-6 w-6" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  animate={{ rotate: isMenuOpen ? 90 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </motion.svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              className="md:hidden bg-white dark:bg-gray-800 mt-2 rounded-lg shadow-lg overflow-hidden"
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="p-2 space-y-1">
                {filteredNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-md text-base font-medium transition-colors duration-200
                      ${location.pathname === item.path 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`
                    }
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ))}
                {isAuthenticated && (
                  <button
                    className="flex items-center space-x-3 w-full text-left px-4 py-3 rounded-md text-base font-medium text-error hover:bg-error/5 transition-colors duration-200"
                    onClick={handleSignOut}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                    </svg>
                    <span>{t('profile.logout')}</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header; 