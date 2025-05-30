import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge tailwind classes using clsx and tailwind-merge
 * This prevents class conflicts when multiple classes affect the same property
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
} 