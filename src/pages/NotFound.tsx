import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../shared/ui/Button';

const NotFound: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <div className="text-9xl font-bold text-primary mb-6">404</div>
        <h1 className="text-3xl font-bold mb-4">
          {t('notFound.title', 'Page Not Found')}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          {t(
            'notFound.description',
            "We couldn't find the page you're looking for."
          )}
        </p>
        <Link to="/">
          <Button variant="primary" size="lg">
            {t('notFound.backHome', 'Back to Home')}
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound; 