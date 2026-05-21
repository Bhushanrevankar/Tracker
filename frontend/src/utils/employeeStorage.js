import { EMPLOYEES } from '../constants/employees';
import { MAX_RECENT_EMPLOYEES, STORAGE_KEYS } from '../constants/storageKeys';

function readRecentEmployees() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.recentEmployees);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getLastEmployee() {
  const last = localStorage.getItem(STORAGE_KEYS.lastEmployee) ?? '';
  return EMPLOYEES.includes(last) ? last : '';
}

export function getRecentEmployees() {
  return readRecentEmployees().filter((name) => EMPLOYEES.includes(name));
}

export function saveEmployeeSelection(name) {
  if (!name || !EMPLOYEES.includes(name)) return;

  localStorage.setItem(STORAGE_KEYS.lastEmployee, name);

  const recent = readRecentEmployees().filter((entry) => entry !== name);
  recent.unshift(name);
  localStorage.setItem(
    STORAGE_KEYS.recentEmployees,
    JSON.stringify(recent.slice(0, MAX_RECENT_EMPLOYEES)),
  );
}

/** Split employees into recently used (top) and the rest (alphabetical). */
export function groupEmployeesForDropdown(allEmployees, recent) {
  const recentSet = new Set(recent);
  const recentGroup = recent.filter((name) => allEmployees.includes(name));
  const restGroup = allEmployees
    .filter((name) => !recentSet.has(name))
    .sort((a, b) => a.localeCompare(b));

  return { recentGroup, restGroup };
}
