import { format, isValid, parseISO } from 'date-fns';

export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
  
  if (!isValid(date)) return 'Invalid Date';
  
  // Example: "Oct 24, 2025 • 2:30 PM"
  return format(date, 'MMM d, yyyy • h:mm a');
};

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
  
  if (!isValid(date)) return 'Invalid Date';
  return format(date, 'MMM d, yyyy');
};

// Helper to truncate long text for tables
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};