import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { auth } from '../firebase';
import { 
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider 
} from 'firebase/auth';
import Card from '../shared/ui/Card';
import Button from '../shared/ui/Button';

const Login: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    // After main animation completes, set animationComplete to true
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err: any) {
      const errorCode = err.code;
      switch (errorCode) {
        case 'auth/invalid-email':
          setError(t('auth.errors.invalidEmail', 'Invalid email address.'));
          break;
        case 'auth/user-disabled':
          setError(t('auth.errors.userDisabled', 'This account has been disabled.'));
          break;
        case 'auth/user-not-found':
          setError(t('auth.errors.userNotFound', 'No account found with this email.'));
          break;
        case 'auth/wrong-password':
          setError(t('auth.errors.wrongPassword', 'Incorrect password.'));
          break;
        default:
          setError(t('auth.errors.default', 'An error occurred during sign in. Please try again.'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ hd: 'nis.edu.kz' }); // Restrict to NIS email domain
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        // User closed the popup, not an error to display
        return;
      }
      setError(t('auth.errors.googleSignIn', 'Error signing in with Google. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 50
      }
    }
  };

  const floatingShapesVariants = {
    animate: {
      y: [0, -10, 0],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        repeatType: "mirror" as const
      }
    }
  };

  return (
    <div className="min-h-screen w-full overflow-hidden bg-gradient-to-br from-primary/5 via-white to-secondary/5 dark:from-primary/20 dark:via-dark dark:to-secondary/20 flex items-center justify-center relative">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-20 left-[10%] w-64 h-64 rounded-full bg-primary/10 dark:bg-primary/20 blur-3xl"
          animate={{ 
            x: [0, 50, 0], 
            y: [0, 30, 0],
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity,
            repeatType: "mirror"
          }}
        />
        <motion.div 
          className="absolute bottom-20 right-[10%] w-80 h-80 rounded-full bg-secondary/10 dark:bg-secondary/20 blur-3xl"
          animate={{ 
            x: [0, -40, 0], 
            y: [0, -40, 0],
          }}
          transition={{ 
            duration: 18, 
            repeat: Infinity,
            repeatType: "mirror"
          }}
        />
        <motion.div 
          className="absolute top-1/3 right-1/4 w-40 h-40 rounded-full bg-purple-500/10 dark:bg-purple-500/20 blur-3xl"
          animate={{ 
            x: [0, 30, 0], 
            y: [0, -50, 0],
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity,
            repeatType: "mirror"
          }}
        />
      </div>

      {/* Floating decorative shapes */}
      <motion.div 
        className="absolute top-20 right-[15%] w-12 h-12 rounded-lg bg-primary/20 backdrop-blur-sm border border-white/20 dark:border-white/10"
        variants={floatingShapesVariants}
        animate="animate"
      />
      <motion.div 
        className="absolute bottom-32 left-[20%] w-16 h-16 rounded-full bg-secondary/20 backdrop-blur-sm border border-white/20 dark:border-white/10"
        variants={floatingShapesVariants}
        animate="animate"
        transition={{
          delay: 1,
          duration: 7,
          repeat: Infinity,
          repeatType: "mirror"
        }}
      />
      <motion.div 
        className="absolute top-[45%] left-[10%] w-10 h-10 rotate-45 bg-white/20 backdrop-blur-sm border border-white/20 dark:border-white/10"
        variants={floatingShapesVariants}
        animate="animate"
        transition={{
          delay: 2,
          duration: 5,
          repeat: Infinity,
          repeatType: "mirror"
        }}
      />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-md mx-auto">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              NIStego
            </h1>
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mb-3"></div>
            <p className="text-gray-600 dark:text-gray-300">
              {t('auth.loginSubtitle', 'Sign in to your NIStego account')}
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Card variant="glass" className="backdrop-blur-xl overflow-visible">
              <Card.Body className="p-8">
                {error && (
                  <motion.div 
                    className="bg-error/10 text-error px-4 py-3 rounded-md mb-6 border border-error/20"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      {error}
                    </div>
                  </motion.div>
                )}

                <motion.div variants={itemVariants} className="mb-6">
                  <Button
                    variant="outline"
                    className="w-full backdrop-blur-sm bg-white/50 dark:bg-dark/50 border-gray-200 dark:border-gray-700 hover:border-primary hover:bg-primary/5 text-gray-800 dark:text-white flex items-center justify-center transition-all duration-300 h-12"
                    onClick={handleGoogleLogin}
                    isLoading={loading}
                    leftIcon={
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                    }
                  >
                    {t('auth.googleLogin')}
                  </Button>
                </motion.div>

                <motion.div variants={itemVariants} className="flex items-center my-6">
                  <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent"></div>
                  <div className="mx-4 text-sm text-gray-500 dark:text-gray-400 font-medium px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
                    {t('auth.or', 'or')}
                  </div>
                  <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent"></div>
                </motion.div>

                <motion.form variants={itemVariants} onSubmit={handleEmailLogin}>
                  <div className="mb-4">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      {t('auth.email', 'Email')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                      </div>
                      <input
                        id="email"
                        type="email"
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary dark:bg-dark/30 backdrop-blur-sm transition-colors duration-200"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between mb-1">
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        {t('auth.password', 'Password')}
                      </label>
                      <Link
                        to="/auth/forgot-password"
                        className="text-sm text-primary hover:text-secondary transition-colors duration-200"
                      >
                        {t('auth.forgotPassword', 'Forgot password?')}
                      </Link>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <input
                        id="password"
                        type="password"
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary dark:bg-dark/30 backdrop-blur-sm transition-colors duration-200"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 shadow-lg hover:shadow-primary/50 transform hover:-translate-y-1"
                    isLoading={loading}
                  >
                    {t('auth.login')}
                  </Button>
                </motion.form>

                <motion.div variants={itemVariants} className="mt-6 text-center">
                  <div className="text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {t('auth.noAccount', "Don't have an account?")}
                    </span>{' '}
                    <Link
                      to="/auth/register"
                      className="text-primary hover:text-secondary font-medium transition-colors duration-200 border-b border-dashed border-primary hover:border-secondary"
                    >
                      {t('auth.register')}
                    </Link>
                  </div>
                </motion.div>

                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-xl z-[-1]"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-tr from-secondary/20 to-transparent rounded-full blur-xl z-[-1]"></div>
              </Card.Body>
            </Card>
          </motion.div>
        </div>

        {/* 3D floating elements that appear after main animation */}
        {animationComplete && (
          <>
            <motion.div
              className="absolute -bottom-2 -right-2 w-16 h-16 rounded-xl bg-white dark:bg-dark border border-gray-200 dark:border-gray-800 shadow-xl"
              initial={{ opacity: 0, y: 20, rotateX: 0, rotateY: 0, rotateZ: 0 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                rotateX: [0, 10, 0, -10, 0],
                rotateY: [0, -10, 0, 10, 0],
                rotateZ: [0, 5, 0, -5, 0]
              }}
              transition={{ 
                duration: 10,
                repeat: Infinity,
                repeatType: "mirror",
                delay: 0.5
              }}
            />
            <motion.div
              className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-white dark:bg-dark border border-gray-200 dark:border-gray-800 shadow-xl"
              initial={{ opacity: 0, y: -20, rotateX: 0, rotateY: 0, rotateZ: 0 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                rotateX: [0, -15, 0, 15, 0],
                rotateY: [0, 15, 0, -15, 0],
                rotateZ: [0, -10, 0, 10, 0]
              }}
              transition={{ 
                duration: 12,
                repeat: Infinity,
                repeatType: "mirror",
                delay: 0.8
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Login; 