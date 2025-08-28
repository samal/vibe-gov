import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function getAssetTypeColor(type: string): string {
  switch (type) {
    case 'TABLE':
      return 'bg-blue-100 text-blue-800';
    case 'VIEW':
      return 'bg-green-100 text-green-800';
    case 'COLUMN':
      return 'bg-purple-100 text-purple-800';
    case 'REPORT':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function getClassificationColor(classification: string): string {
  switch (classification) {
    case 'PII':
      return 'bg-red-100 text-red-800';
    case 'PHI':
      return 'bg-orange-100 text-orange-800';
    case 'FINANCIAL':
      return 'bg-yellow-100 text-yellow-800';
    case 'CONFIDENTIAL':
      return 'bg-purple-100 text-purple-800';
    case 'PUBLIC':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}
