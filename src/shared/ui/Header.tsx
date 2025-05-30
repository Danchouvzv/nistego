import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '../../firebase';
import ThemeToggle from './ThemeToggle';

export const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const location = useLocation();
  const navigate = useNavigate();

  const isLandingPage = location.pathname === '/';
  const isAuthenticated = auth.currentUser !== null;

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle online/offline status
  useEffect(() => {
    const handleOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  // Close mobile menu on route change
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

  // Toggle language
  const toggleLanguage = () => {
    const currentLang = i18n.language;
    if (currentLang === 'en') {
      i18n.changeLanguage('ru');
    } else if (currentLang === 'ru') {
      i18n.changeLanguage('kk');
    } else {
      i18n.changeLanguage('en');
    }
  };

  // Get current language code
  const getCurrentLanguageCode = () => {
    const langMap: Record<string, string> = {
      'en': 'EN',
      'ru': 'RU',
      'kk': 'KZ'
    };
    return langMap[i18n.language] || 'EN';
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

  // Animation variants
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

  const drawerVariants = {
    hidden: { x: "-100%", opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      x: "-100%", 
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 0.5,
      transition: { duration: 0.2 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  return (
    <header className={headerClasses}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-12">
          {/* Logo and Hamburger */}
          <div className="flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className={`p-2 mr-2 rounded-md focus:outline-none md:hidden ${textClasses}`}
              aria-label="Menu"
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
            
            <motion.div 
              variants={logoVariants}
              whileHover="hover"
              className="flex-shrink-0"
            >
              <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center">
                <div className="bg-gradient-to-r from-primary to-secondary w-8 h-8 rounded-lg flex items-center justify-center mr-2">
                  <span className="text-white text-sm font-bold">N</span>
                </div>
                <h1 className={`text-lg font-bold ${textClasses}`}>NIStego</h1>
              </Link>
            </motion.div>
          </div>

          {/* Desktop Nav Links - Hidden on Mobile */}
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
                <span className="md:hidden lg:inline">{item.icon}</span>
                <span className="lg:inline">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Right side items - Optimized for Mobile */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Offline Indicator */}
            {!isOnline && (
              <div className="bg-warning/10 text-warning px-2 py-1 rounded-md text-xs flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                </svg>
                <span className="hidden sm:inline">Offline</span>
              </div>
            )}
            
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Language Toggle - Icon Only */}
            <button 
              onClick={toggleLanguage}
              className={`p-2 rounded-md focus:outline-none transition-colors ${textClasses} hover:bg-gray-100 dark:hover:bg-gray-800`}
              aria-label="Change Language"
            >
              <div className="flex items-center space-x-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802" />
                </svg>
                <span className="text-xs font-medium">{getCurrentLanguageCode()}</span>
              </div>
            </button>
            
            {/* User Avatar/Login Buttons */}
            {isAuthenticated ? (
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative group"
              >
                <div 
                  className="bg-gradient-to-r from-primary to-secondary text-white w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shadow-md cursor-pointer"
                  onClick={() => navigate('/profile')}
                >
                  {auth.currentUser?.displayName?.charAt(0) || 'U'}
                </div>
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="py-1">
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {t('profile.title')}
                    </Link>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-error hover:bg-error/5 transition-colors duration-200"
                      onClick={handleSignOut}
                    >
                      {t('profile.logout')}
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="flex space-x-2">
                <Link 
                  to="/auth/login" 
                  className={`text-xs sm:text-sm font-medium px-3 py-1.5 sm:px-4 sm:py-2 rounded-md transition-all duration-200
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
                  className={`hidden sm:block text-sm font-medium px-4 py-2 rounded-md transition-all duration-200
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
          </div>
        </div>
      </div>

      {/* Drawer Menu (Mobile) */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black z-40"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => setIsMenuOpen(false)}
            />
            
            {/* Drawer */}
            <motion.div
              className="fixed top-14 left-0 bottom-0 w-64 bg-white dark:bg-gray-900 shadow-xl z-50 overflow-y-auto"
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              role="dialog"
              aria-modal="true"
            >
              <div className="py-4">
                {filteredNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-3 text-base font-medium transition-colors duration-200
                      ${location.pathname === item.path 
                        ? 'bg-primary/10 text-primary border-r-4 border-primary' 
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`
                    }
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ))}
                {isAuthenticated && (
                  <button
                    className="flex items-center space-x-3 w-full text-left px-4 py-3 text-base font-medium text-error hover:bg-error/5 transition-colors duration-200"
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
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header; 