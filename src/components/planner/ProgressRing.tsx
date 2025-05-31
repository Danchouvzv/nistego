import React from 'react';
import { motion } from 'framer-motion';

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
}

const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 40,
  strokeWidth = 4,
  color = '#0056C7',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progressOffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Background circle */}
      <svg
        className="absolute inset-0"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-200 dark:text-gray-700"
        />
      </svg>

      {/* Progress circle */}
      <motion.svg
        className="absolute inset-0 transform -rotate-90"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: progressOffset }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </motion.svg>

      {/* Percentage text */}
      <div 
        className="absolute inset-0 flex items-center justify-center text-xs font-medium"
        style={{ color }}
      >
        {Math.round(progress)}%
      </div>
    </div>
  );
};

export default ProgressRing; 