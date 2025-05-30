import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { auth } from '../firebase/config';
import { 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile
} from 'firebase/auth';
import Card from '../shared/ui/Card';
import Button from '../shared/ui/Button';
import { cn } from '../shared/lib/utils';

const Register: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);

  // Password strength checker
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }
    
    let strength = 0;
    // Length check
    if (password.length >= 8) strength += 1;
    // Uppercase check
    if (/[A-Z]/.test(password)) strength += 1;
    // Lowercase check
    if (/[a-z]/.test(password)) strength += 1;
    // Number check
    if (/[0-9]/.test(password)) strength += 1;
    // Special character check
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    setPasswordStrength(strength);
  }, [password]);

  useEffect(() => {
    // After main animation completes, set animationComplete to true
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!name || !email) {
        setError(t('Please fill in all fields'));
        return;
      }
      
      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError(t('auth.errors.invalidEmail'));
        return;
      }
      
      // Move to step 2
      setError(null);
      setStep(2);
      return;
    }
    
    // Step 2 validation
    if (password !== confirmPassword) {
      setError(t('auth.errors.passwordsDoNotMatch'));
      return;
    }
    
    if (password.length < 6) {
      setError(t('auth.errors.passwordTooShort'));
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with name
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: name
        });
      }
      
      navigate('/dashboard');
    } catch (err: any) {
      const errorCode = err.code;
      switch (errorCode) {
        case 'auth/email-already-in-use':
          setError(t('auth.errors.emailInUse'));
          break;
        case 'auth/invalid-email':
          setError(t('auth.errors.invalidEmail'));
          break;
        case 'auth/weak-password':
          setError(t('auth.errors.weakPassword'));
          break;
        default:
          setError(t('auth.errors.default'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
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
      setError(t('auth.errors.googleSignIn'));
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

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 500 : -500,
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    })
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
      
      {/* Extra animated elements for registration page */}
      <motion.div 
        className="absolute bottom-[15%] right-[15%] w-14 h-14 rounded-full bg-warning/20 backdrop-blur-sm border border-white/20 dark:border-white/10"
        variants={floatingShapesVariants}
        animate="animate"
        transition={{
          delay: 1.5,
          duration: 6.5,
          repeat: Infinity,
          repeatType: "mirror"
        }}
      />
      <motion.div 
        className="absolute top-[25%] right-[30%] w-8 h-8 rounded-md bg-success/20 backdrop-blur-sm border border-white/20 dark:border-white/10"
        variants={floatingShapesVariants}
        animate="animate"
        transition={{
          delay: 3,
          duration: 8,
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
              {t('auth.registerSubtitle', 'Create your NIStego account')}
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
                    onClick={handleGoogleRegister}
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
                    {t('auth.googleRegister')}
                  </Button>
                </motion.div>

                <motion.div variants={itemVariants} className="flex items-center justify-center mb-6">
                  <div className="flex-grow h-px bg-gray-300 dark:bg-gray-700"></div>
                  <p className="mx-4 text-sm text-gray-500 dark:text-gray-400">{t('auth.or')}</p>
                  <div className="flex-grow h-px bg-gray-300 dark:bg-gray-700"></div>
                </motion.div>

                <form onSubmit={handleEmailRegister}>
                  <motion.div 
                    className="relative"
                    custom={step === 1 ? 1 : -1}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                  >
                    {step === 1 ? (
                      <div className="space-y-4">
                        <motion.div variants={itemVariants}>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {t('auth.name')}
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              className="w-full h-12 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white/60 dark:bg-dark/60 backdrop-blur-sm transition-all duration-200"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="John Doe"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                          </div>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {t('auth.email')}
                          </label>
                          <div className="relative">
                            <input
                              type="email"
                              className="w-full h-12 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white/60 dark:bg-dark/60 backdrop-blur-sm transition-all duration-200"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="your@email.com"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </div>
                          </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="pt-2">
                          <Button
                            type="button"
                            className="w-full h-12"
                            onClick={(e) => handleEmailRegister(e)}
                          >
                            {t('common.next', 'Next')}
                          </Button>
                        </motion.div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <motion.div variants={itemVariants}>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {t('auth.password')}
                          </label>
                          <div className="relative">
                            <input
                              type="password"
                              className="w-full h-12 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white/60 dark:bg-dark/60 backdrop-blur-sm transition-all duration-200"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="********"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                            </div>
                          </div>
                          
                          {/* Password strength indicator */}
                          {password && (
                            <div className="mt-2">
                              <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden flex">
                                {[...Array(5)].map((_, i) => (
                                  <motion.div
                                    key={i}
                                    className={cn(
                                      "h-full flex-1 mx-0.5 first:ml-0 last:mr-0 rounded-full",
                                      i < passwordStrength ? (
                                        passwordStrength < 3 ? "bg-warning" : "bg-success"
                                      ) : "bg-gray-300 dark:bg-gray-600"
                                    )}
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: i < passwordStrength ? 1 : 0 }}
                                    transition={{ duration: 0.3, delay: i * 0.1 }}
                                  />
                                ))}
                              </div>
                              <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                                {passwordStrength < 3 ? t('Password strength: Weak') : 
                                 passwordStrength < 5 ? t('Password strength: Good') : 
                                 t('Password strength: Strong')}
                              </p>
                            </div>
                          )}
                        </motion.div>

                        <motion.div variants={itemVariants}>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {t('auth.confirmPassword')}
                          </label>
                          <div className="relative">
                            <input
                              type="password"
                              className="w-full h-12 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white/60 dark:bg-dark/60 backdrop-blur-sm transition-all duration-200"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder="********"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                          </div>
                          {password && confirmPassword && (
                            <motion.div 
                              className={cn(
                                "text-xs mt-1",
                                password === confirmPassword ? "text-success" : "text-error"
                              )}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                            >
                              {password === confirmPassword ? 
                                t('Passwords match') : 
                                t('Passwords do not match')}
                            </motion.div>
                          )}
                        </motion.div>

                        <motion.div variants={itemVariants} className="flex items-center justify-between pt-2">
                          <Button
                            type="button"
                            variant="outline"
                            className="w-[48%] h-12"
                            onClick={() => setStep(1)}
                          >
                            {t('common.back', 'Back')}
                          </Button>
                          <Button
                            type="submit"
                            className="w-[48%] h-12"
                            isLoading={loading}
                          >
                            {t('auth.register')}
                          </Button>
                        </motion.div>
                      </div>
                    )}
                  </motion.div>
                </form>

                <motion.div variants={itemVariants} className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                  {t('auth.haveAccount')}{' '}
                  <Link to="/login" className="text-primary hover:text-primary-dark transition-colors font-medium">
                    {t('auth.login')}
                  </Link>
                </motion.div>
              </Card.Body>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register; 