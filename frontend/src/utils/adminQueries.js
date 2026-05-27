import { supabase } from './supabase';
import { WORK_ENTRIES_TABLE } from './workEntries';
import { SESSION_ACTIVE, SESSION_INACTIVE } from '../constants/sessions';

/**
 * Fetch all work entries for a specific date
 */
export async function fetchAllWorkEntries(date) {
  const { data, error } = await supabase
    .from(WORK_ENTRIES_TABLE)
    .select('*')
    .eq('work_date', date)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

/**
 * Fetch employee statistics for a specific date
 */
export async function fetchEmployeeStats(employeeName, date) {
  try {
    // Get all entries for this employee on this date
    const { data: entries, error } = await supabase
      .from(WORK_ENTRIES_TABLE)
      .select('*')
      .eq('employee_name', employeeName)
      .eq('work_date', date)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    if (!entries || entries.length === 0) {
      return {
        status: null,
        loginTime: null,
        logoutTime: null,
        project: null,
        assignedMovie: null,
        productiveMinutes: 0,
        sessionDuration: 0,
        workStatus: null,
      };
    }

    // Get the latest entry for this employee
    const latestEntry = entries[0];
    
    // Determine status based on session field
    const status = latestEntry.session === SESSION_ACTIVE ? 'active' : 'completed';
    
    // Calculate session duration for active sessions
    let sessionDuration = 0;
    if (status === 'active' && latestEntry.login_time) {
      const loginTime = new Date(`${date}T${convertTo24Hour(latestEntry.login_time)}`);
      const now = new Date();
      sessionDuration = Math.floor((now - loginTime) / (1000 * 60)); // minutes
    }

    return {
      status,
      loginTime: latestEntry.login_time,
      logoutTime: latestEntry.logout_time,
      project: latestEntry.project,
      assignedMovie: latestEntry.assigned_movie,
      productiveMinutes: latestEntry.productive_minutes || 0,
      sessionDuration,
      workStatus: latestEntry.status,
    };
  } catch (error) {
    console.error(`Error fetching stats for ${employeeName}:`, error);
    return {
      status: null,
      loginTime: null,
      logoutTime: null,
      project: null,
      assignedMovie: null,
      productiveMinutes: 0,
      sessionDuration: 0,
      workStatus: null,
    };
  }
}

/**
 * Convert 12-hour time format to 24-hour format for date calculations
 */
function convertTo24Hour(time12h) {
  if (!time12h) return '00:00:00';
  
  const [time, modifier] = time12h.split(' ');
  let [hours, minutes] = time.split(':');
  
  if (hours === '12') {
    hours = '00';
  }
  
  if (modifier === 'PM') {
    hours = parseInt(hours, 10) + 12;
  }
  
  return `${hours.toString().padStart(2, '0')}:${minutes}:00`;
}

/**
 * Get summary statistics for all employees on a specific date
 */
export async function getDailySummary(date) {
  try {
    const entries = await fetchAllWorkEntries(date);
    
    const activeCount = entries.filter(entry => entry.session === SESSION_ACTIVE).length;
    const completedCount = entries.filter(entry => entry.session === SESSION_INACTIVE).length;
    const totalProductiveMinutes = entries.reduce((sum, entry) => sum + (entry.productive_minutes || 0), 0);
    
    return {
      activeCount,
      completedCount,
      totalProductiveMinutes,
      totalEntries: entries.length,
    };
  } catch (error) {
    console.error('Error fetching daily summary:', error);
    return {
      activeCount: 0,
      completedCount: 0,
      totalProductiveMinutes: 0,
      totalEntries: 0,
    };
  }
}
/**
 *
 Fetch detailed statistics for an employee over a date range
 */
export async function fetchEmployeeDetailedStats(employeeName, startDate, endDate) {
  try {
    const { data: entries, error } = await supabase
      .from(WORK_ENTRIES_TABLE)
      .select('*')
      .eq('employee_name', employeeName)
      .gte('work_date', startDate)
      .lte('work_date', endDate)
      .order('work_date', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    if (!entries || entries.length === 0) {
      return {
        totalDays: 0,
        totalProductiveMinutes: 0,
        averageProductiveMinutes: 0,
        completedTasks: 0,
        currentStatus: null,
      };
    }

    // Calculate statistics
    const uniqueDates = [...new Set(entries.map(entry => entry.work_date))];
    const totalDays = uniqueDates.length;
    const totalProductiveMinutes = entries.reduce((sum, entry) => sum + (entry.productive_minutes || 0), 0);
    const averageProductiveMinutes = totalDays > 0 ? Math.round(totalProductiveMinutes / totalDays) : 0;
    const completedTasks = entries.filter(entry => entry.status === 'Completed').length;

    // Get current status (today's latest entry)
    const today = new Date().toISOString().split('T')[0];
    const todayEntries = entries.filter(entry => entry.work_date === today);
    let currentStatus = null;

    if (todayEntries.length > 0) {
      const latestEntry = todayEntries[0];
      let sessionDuration = 0;

      if (latestEntry.session === SESSION_ACTIVE && latestEntry.login_time) {
        const loginTime = new Date(`${today}T${convertTo24Hour(latestEntry.login_time)}`);
        const now = new Date();
        sessionDuration = Math.floor((now - loginTime) / (1000 * 60));
      }

      currentStatus = {
        session: latestEntry.session,
        loginTime: latestEntry.login_time,
        logoutTime: latestEntry.logout_time,
        project: latestEntry.project,
        assignedMovie: latestEntry.assigned_movie,
        sessionDuration,
        workStatus: latestEntry.status,
      };
    }

    return {
      totalDays,
      totalProductiveMinutes,
      averageProductiveMinutes,
      completedTasks,
      currentStatus,
    };
  } catch (error) {
    console.error(`Error fetching detailed stats for ${employeeName}:`, error);
    throw error;
  }
}

/**
 * Fetch work history for an employee over a date range
 */
export async function fetchEmployeeWorkHistory(employeeName, startDate, endDate) {
  try {
    const { data: entries, error } = await supabase
      .from(WORK_ENTRIES_TABLE)
      .select('*')
      .eq('employee_name', employeeName)
      .gte('work_date', startDate)
      .lte('work_date', endDate)
      .order('work_date', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return entries || [];
  } catch (error) {
    console.error(`Error fetching work history for ${employeeName}:`, error);
    throw error;
  }
}