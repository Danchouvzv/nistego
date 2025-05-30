import { clsx } from 'clsx';
import type { ClassValue } from 'clsx/dist/types';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge tailwind classes using clsx and tailwind-merge
 * This prevents class conflicts when multiple classes affect the same property
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
} 