import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isFilledHtml(html: string) {
  if (!html) return false;

  // Remove all HTML tags
  const textContent = html.replace(/<[^>]*>/g, '');

  // Check if there's any non-whitespace content left
  return textContent.trim().length > 0;
}
