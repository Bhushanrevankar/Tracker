/** Strict HH:MM:SS — hours 00–99, minutes/seconds 00–59. */
export const TIMECODE_PATTERN = /^\d{2}:[0-5]\d:[0-5]\d$/;

export const TIMECODE_PLACEHOLDER = '00:00:00';

export function isValidTimecode(value) {
  return TIMECODE_PATTERN.test(value);
}

/** Strip non-digits and build HH:MM:SS while the user types or pastes. */
export function formatTimecodeInput(raw) {
  const digits = raw.replace(/\D/g, '').slice(0, 6);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}:${digits.slice(2)}`;
  return `${digits.slice(0, 2)}:${digits.slice(2, 4)}:${digits.slice(4)}`;
}

export function timecodeToSeconds(value) {
  if (!isValidTimecode(value)) return null;
  const [hours, minutes, seconds] = value.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
}

/** Minutes between two valid HH:MM:SS timecodes (end minus start). */
export function calculateProductiveMinutes(startCode, endCode) {
  const startSeconds = timecodeToSeconds(startCode);
  const endSeconds = timecodeToSeconds(endCode);
  if (startSeconds === null || endSeconds === null) return null;
  const diff = endSeconds - startSeconds;
  if (diff < 0) return null;
  return Math.floor(diff / 60);
}

export function getTimecodeError(value, label = 'Time code') {
  if (!value) {
    return `${label} is required.`;
  }
  if (!isValidTimecode(value)) {
    return 'Use format HH:MM:SS (e.g. 00:45:32). Minutes and seconds must be 00–59.';
  }
  return null;
}
