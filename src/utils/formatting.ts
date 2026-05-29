/**
 * FaceAuth Offline - Formatting Utilities
 * Pure utility functions for display formatting throughout the app.
 */

/**
 * Formats a timestamp into a human-readable relative time string.
 * Examples: "Just now", "5 minutes ago", "2 hours ago", "Yesterday", "3 days ago"
 */
export function formatTimestamp(date: Date | number): string {
  const timestamp = typeof date === 'number' ? date : date.getTime();
  const now = Date.now();
  const diffMs = now - timestamp;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) {
    return 'Just now';
  }

  if (diffMinutes < 60) {
    return diffMinutes === 1 ? '1 minute ago' : `${diffMinutes} minutes ago`;
  }

  if (diffHours < 24) {
    return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
  }

  if (diffDays === 1) {
    return 'Yesterday';
  }

  if (diffDays < 7) {
    return `${diffDays} days ago`;
  }

  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
  }

  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return months === 1 ? '1 month ago' : `${months} months ago`;
  }

  const years = Math.floor(diffDays / 365);
  return years === 1 ? '1 year ago' : `${years} years ago`;
}

/**
 * Formats a confidence score as a percentage string.
 * Example: 94.2 → "94.2%"
 */
export function formatConfidence(confidence: number): string {
  return `${confidence.toFixed(1)}%`;
}

/**
 * Extracts initials from a full name.
 * Example: "Rajesh Kumar" → "RK", "Priya" → "P"
 */
export function getInitials(name: string): string {
  if (!name || name.trim().length === 0) {
    return '?';
  }

  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return (
    parts[0].charAt(0).toUpperCase() +
    parts[parts.length - 1].charAt(0).toUpperCase()
  );
}

/**
 * Formats a duration in milliseconds to a human-readable string.
 * Examples: 45 → "45ms", 1200 → "1.2s", 65000 → "1m 5s"
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${Math.round(ms)}ms`;
  }

  if (ms < 60000) {
    const seconds = ms / 1000;
    return seconds % 1 === 0 ? `${seconds}s` : `${seconds.toFixed(1)}s`;
  }

  const minutes = Math.floor(ms / 60000);
  const remainingSeconds = Math.round((ms % 60000) / 1000);

  if (remainingSeconds === 0) {
    return `${minutes}m`;
  }

  return `${minutes}m ${remainingSeconds}s`;
}

/**
 * Generates a UUID-like unique identifier string.
 * Format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
 */
export function generateId(): string {
  const hexChars = '0123456789abcdef';
  const sections = [8, 4, 4, 4, 12];
  const parts: string[] = [];

  for (let s = 0; s < sections.length; s++) {
    let section = '';
    for (let i = 0; i < sections[s]; i++) {
      if (s === 2 && i === 0) {
        section += '4';
      } else if (s === 3 && i === 0) {
        section += hexChars[8 + Math.floor(Math.random() * 4)];
      } else {
        section += hexChars[Math.floor(Math.random() * 16)];
      }
    }
    parts.push(section);
  }

  return parts.join('-');
}

/**
 * Formats a date to a locale-appropriate date string.
 * Example: "29 May 2026, 1:19 PM"
 */
export function formatDateTime(date: Date | number): string {
  const d = typeof date === 'number' ? new Date(date) : date;
  const day = d.getDate();
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  const hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;

  return `${day} ${month} ${year}, ${displayHours}:${minutes} ${ampm}`;
}

/**
 * Truncates a string to max length and appends ellipsis.
 * Example: truncate("Long text here", 8) → "Long tex…"
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + '…';
}

/**
 * Formats a file size in bytes to a human-readable string.
 * Example: 1536 → "1.5 KB"
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB'];
  const factor = 1024;
  let unitIndex = 0;
  let size = bytes;

  while (size >= factor && unitIndex < units.length - 1) {
    size /= factor;
    unitIndex++;
  }

  return unitIndex === 0
    ? `${size} ${units[unitIndex]}`
    : `${size.toFixed(1)} ${units[unitIndex]}`;
}

/**
 * Formats a count with proper singular/plural label.
 * Example: pluralize(3, 'event') → "3 events"
 */
export function pluralize(
  count: number,
  singular: string,
  plural?: string,
): string {
  const label = count === 1 ? singular : plural ?? `${singular}s`;
  return `${count} ${label}`;
}
