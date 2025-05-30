import React from 'react';
import { motion } from 'framer-motion';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'gradient' | 'glass';
  hoverEffect?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  variant = 'default',
  hoverEffect = false,
  onClick 
}) => {
  const baseClasses = 'rounded-xl overflow-hidden shadow-md';
  
  const variantClasses = {
    default: 'bg-white dark:bg-dark/80 border border-gray-200 dark:border-gray-700',
    gradient: 'bg-gradient-to-br from-primary to-secondary text-white',
    glass: 'bg-white/80 dark:bg-dark/60 backdrop-blur-md border border-white/20 dark:border-dark/20',
  };

  const hoverClasses = hoverEffect 
    ? 'transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg cursor-pointer'
    : '';

  const combinedClasses = [
    baseClasses,
    variantClasses[variant],
    hoverClasses,
    className
  ].join(' ');

  return onClick ? (
    <motion.div 
      className={combinedClasses}
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.div>
  ) : (
    <div className={combinedClasses}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <div className={`p-4 border-b border-gray-200 dark:border-gray-700 font-semibold ${className}`}>
    {children}
  </div>
);

export const CardBody: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <div className={`p-4 ${className}`}>
    {children}
  </div>
);

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <div className={`p-4 border-t border-gray-200 dark:border-gray-700 ${className}`}>
    {children}
  </div>
);

export default Object.assign(Card, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
}); 