import { STATUS_IN_PROGRESS } from '../constants/statuses';
import { supabase } from './supabase';

export const WORK_ENTRIES_TABLE = 'work_entries';

export function formDataToInsertRow(formData) {
  return {
    employee_name: formData.employeeName,
    work_date: formData.date,
    login_time: formData.loginTime,
    project: formData.project,
    assigned_movie: formData.assignedMovie,
    start_time_code: formData.startTimeCode,
    languages: formData.languages,
    type_of_work: formData.typeOfWork,
    status: STATUS_IN_PROGRESS,
  };
}

export function entryToFormFields(entry) {
  return {
    employeeName: entry.employee_name,
    date: entry.work_date,
    loginTime: entry.login_time,
    project: entry.project,
    assignedMovie: entry.assigned_movie,
    startTimeCode: entry.start_time_code,
    languages: entry.languages,
    typeOfWork: entry.type_of_work,
    status: entry.status ?? STATUS_IN_PROGRESS,
    endTimeCode: entry.end_time_code ?? '',
    logoutTime: entry.logout_time ?? '',
    remarks: entry.remarks ?? '',
  };
}

export function logoutDataToUpdate(formData, productiveMinutes) {
  return {
    end_time_code: formData.endTimeCode,
    logout_time: formData.logoutTime,
    productive_minutes: productiveMinutes,
    status: formData.status,
    remarks: formData.remarks?.trim() || null,
  };
}

/** Morning: POST new row with status In Progress */
export async function submitWorkEntry(formData) {
  const { data, error } = await supabase
    .from(WORK_ENTRIES_TABLE)
    .insert([formDataToInsertRow(formData)])
    .select();

  return { data, error };
}

/** Evening: fetch open session for employee */
export async function fetchLatestInProgressEntry(employeeName) {
  const { data, error } = await supabase
    .from(WORK_ENTRIES_TABLE)
    .select('*')
    .eq('employee_name', employeeName)
    .eq('status', STATUS_IN_PROGRESS)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  return { data, error };
}

/** Evening: PATCH existing row with logout details */
export async function submitFinalLog(entryId, formData, productiveMinutes) {
  const { data, error } = await supabase
    .from(WORK_ENTRIES_TABLE)
    .update(logoutDataToUpdate(formData, productiveMinutes))
    .eq('id', entryId)
    .select();

  return { data, error };
}
