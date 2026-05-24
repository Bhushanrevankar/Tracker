/** Returns today's date in YYYY-MM-DD (local timezone) for <input type="date">. */
export function getTodayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Returns current local time as HH:MM AM/PM (e.g. 08:22 PM). */
export function getCurrentTime12HourString() {
  const now = new Date();
  const hours24 = now.getHours();
  const period = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 || 12;
  const hoursStr = String(hours12).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hoursStr}:${minutes} ${period}`;
}

/** Returns formatted date string for display (e.g. "Monday, Dec 25, 2024"). */
export function getFormattedDateString(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString + 'T00:00:00'); // Avoid timezone issues
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}
