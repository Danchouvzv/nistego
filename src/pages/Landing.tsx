import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Button from '../shared/ui/Button';

const Landing: React.FC = () => {
  const { t } = useTranslation();

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const steps = [
    { number: '1', key: 'step1', icon: '🎯' },
    { number: '2', key: 'step2', icon: '📝' },
    { number: '3', key: 'step3', icon: '📊' },
    { number: '4', key: 'step4', icon: '🏆' }
  ];

  const faqs = [
    { key: 'q1', answer: 'a1' },
    { key: 'q2', answer: 'a2' }
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-primary to-secondary text-white flex items-center">
        <div className="container mx-auto px-4 py-24 z-10 relative">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.h1 
              variants={fadeInUp}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              {t('landing.tagline')}
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="text-xl md:text-2xl mb-10 text-white/90"
            >
              {t('landing.subtitle')}
            </motion.p>
            
            <motion.div variants={fadeInUp}>
              <Link to="/auth/register">
                <Button 
                  variant="light" 
                  size="lg"
                  className="shadow-lg shadow-primary/20"
                >
                  {t('landing.getStarted')}
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-white/5 rounded-full blur-3xl transform translate-x-1/4 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-black/5 rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4"></div>
        
        {/* Floating Shapes */}
        <motion.div 
          className="absolute top-1/4 left-1/5 w-20 h-20 bg-white/10 rounded-xl"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div 
          className="absolute bottom-1/4 right-1/5 w-32 h-32 bg-white/10 rounded-full"
          animate={{
            y: [0, 30, 0],
            x: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div 
          className="absolute top-1/2 right-1/3 w-16 h-16 bg-white/10 rounded-lg rotate-45"
          animate={{
            y: [0, -15, 0],
            x: [0, 15, 0],
            rotate: [45, 60, 45]
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </section>

      {/* Benefits Section */}
      <section className="bg-white dark:bg-gray-900 py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold mb-6 gradient-text"
            >
              {t('landing.benefits.title')}
            </motion.h2>
          </motion.div>
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-10"
          >
            {/* Time Benefit */}
            <motion.div 
              variants={fadeInUp}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="bg-primary/10 dark:bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center text-primary mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-center">
                {t('landing.benefits.time.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center">
                {t('landing.benefits.time.description')}
              </p>
            </motion.div>
            
            {/* Grades Benefit */}
            <motion.div 
              variants={fadeInUp}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="bg-secondary/10 dark:bg-secondary/20 w-16 h-16 rounded-full flex items-center justify-center text-secondary mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-center">
                {t('landing.benefits.grades.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center">
                {t('landing.benefits.grades.description')}
              </p>
            </motion.div>
            
            {/* Gamification Benefit */}
            <motion.div 
              variants={fadeInUp}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="bg-warning/10 dark:bg-warning/20 w-16 h-16 rounded-full flex items-center justify-center text-warning mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-center">
                {t('landing.benefits.gamification.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center">
                {t('landing.benefits.gamification.description')}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold mb-6 gradient-text"
            >
              {t('landing.steps.title')}
            </motion.h2>
          </motion.div>
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {steps.map((step, index) => (
              <motion.div
                key={step.key}
                variants={fadeInUp}
                className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-md text-center relative"
              >
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                  {step.number}
                </div>
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-bold mb-2">
                  {t(`landing.steps.${step.key}`)}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {index === 0 && t('goals.smartify')}
                  {index === 1 && t('planner.title')}
                  {index === 2 && t('dashboard.subjects.progress')}
                  {index === 3 && t('profile.badges')}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white dark:bg-gray-900 py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold mb-6 gradient-text"
            >
              {t('landing.faq.title')}
            </motion.h2>
          </motion.div>
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
            className="max-w-3xl mx-auto"
          >
            {faqs.map((faq) => (
              <motion.div
                key={faq.key}
                variants={fadeInUp}
                className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-md"
              >
                <h3 className="text-xl font-bold mb-4">
                  {t(`landing.faq.${faq.key}`)}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t(`landing.faq.${faq.answer}`)}
                </p>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-center mt-10"
          >
            <Link to="/auth/register">
              <Button 
                variant="primary" 
                size="lg"
                className="shadow-lg shadow-primary/20"
              >
                {t('landing.getStarted')}
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 dark:bg-gray-950 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-primary to-secondary w-10 h-10 rounded-lg flex items-center justify-center mr-2">
                  <span className="text-white text-lg font-bold">N</span>
                </div>
                <h2 className="text-xl font-bold">NIStego</h2>
              </div>
              <p className="text-gray-400 mb-6">{t('landing.tagline')}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-6">{t('footer.links')}</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">{t('footer.about')}</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">{t('landing.faq.title')}</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">{t('footer.community')}</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">{t('footer.privacy')}</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-6">{t('footer.contact')}</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  <a href="mailto:hello@nistego.com" className="text-gray-300 hover:text-white transition-colors">hello@nistego.com</a>
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                  </svg>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">Discord</a>
                </li>
              </ul>
            </div>
            
            <div className="md:text-right">
              <Link to="/auth/register">
                <Button 
                  variant="outline"
                  className="mb-6 w-full md:w-auto"
                >
                  {t('landing.getStarted')}
                </Button>
              </Link>
              <p className="text-gray-400 text-sm">
                &copy; 2025 NIStego. {t('footer.rights')}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing; 