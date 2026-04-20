/**
 * HELPER FUNCTIONS
 * ================
 * Reusable utility functions used across the app
 */

/**
 * Get initials from a full name
 * @param name - Full name string (e.g., "John Doe")
 * @returns First letter of each word, uppercase, max 2 characters
 * @example
 * getInitials("John Doe") // "JD"
 * getInitials("Aisha Khan") // "AK"
 * getInitials("Muhammad Ali Khan") // "MA"
 */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const formatRelativeTime = (isoDate: string): string => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return '';

  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.max(0, Math.floor(diffMs / 1000));

  const minutes = Math.floor(diffSec / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (diffSec < 10) return 'Just now';
  if (diffSec < 60) return `${diffSec}s ago`;
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  // Fallback to a short date for older notifications
  return date.toLocaleDateString();
};
