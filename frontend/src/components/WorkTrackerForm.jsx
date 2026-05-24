import { useEffect, useMemo, useState } from 'react';
import DateField from './fields/DateField';
import EmployeeNameField from './fields/EmployeeNameField';
import CaptureTimeField from './fields/CaptureTimeField';
import AssignedMovieField from './fields/AssignedMovieField';
import ProjectField from './fields/ProjectField';
import LanguagesField from './fields/LanguagesField';
import TimeCodeField from './fields/TimeCodeField';
import TypeOfWorkField from './fields/TypeOfWorkField';
import StatusField from './fields/StatusField';
import RemarksField from './fields/RemarksField';
import ProductiveMinutesField from './fields/ProductiveMinutesField';
import { getTodayDateString } from '../utils/date';
import { getLastEmployee, saveEmployeeSelection } from '../utils/employeeStorage';
import { calculateProductiveMinutes, isValidTimecode } from '../utils/timecode';
import {
  entryToFormFields,
  fetchLatestActiveSession,
  submitFinalLog,
  submitWorkEntry,
} from '../utils/workEntries';

function buildMorningDefaults(employeeName = getLastEmployee()) {
  return {
    employeeName,
    date: getTodayDateString(),
    loginTime: '',
    project: '',
    assignedMovie: '',
    startTimeCode: '',
    languages: '',
    typeOfWork: '',
    endTimeCode: '',
    logoutTime: '',
    status: '',
    remarks: '',
  };
}

export default function WorkTrackerForm() {
  const [formData, setFormData] = useState(buildMorningDefaults);
  const [, setPreferenceVersion] = useState(0);
  const [activeEntryId, setActiveEntryId] = useState(null);
  const [isLogoutMode, setIsLogoutMode] = useState(false);
  const [loadingSession, setLoadingSession] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  const productiveMinutes = useMemo(
    () => calculateProductiveMinutes(formData.startTimeCode, formData.endTimeCode),
    [formData.startTimeCode, formData.endTimeCode],
  );

  const loadSessionForEmployee = async (employeeName, cancelledRef) => {
    setLoadingSession(true);
    setSubmitError('');

    const { data, error } = await fetchLatestActiveSession(employeeName);

    if (cancelledRef.current) return;

    setLoadingSession(false);

    if (error) {
      setSubmitError(error.message);
      setIsLogoutMode(false);
      setActiveEntryId(null);
      return;
    }

    if (data) {
      setIsLogoutMode(true);
      setActiveEntryId(data.id);
      setFormData(entryToFormFields(data));
    } else {
      setIsLogoutMode(false);
      setActiveEntryId(null);
      setFormData(buildMorningDefaults(employeeName));
    }
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSubmitError('');
    setSubmitSuccess('');

    if (field === 'employeeName') {
      saveEmployeeSelection(value);
      setPreferenceVersion((v) => v + 1);

      if (!value) {
        setIsLogoutMode(false);
        setActiveEntryId(null);
        setFormData(buildMorningDefaults());
      }
    }
  };

  useEffect(() => {
    const employeeName = formData.employeeName;
    if (!employeeName) return;

    const cancelledRef = { current: false };

    void Promise.resolve().then(() => {
      if (!cancelledRef.current) {
        return loadSessionForEmployee(employeeName, cancelledRef);
      }
    });

    return () => {
      cancelledRef.current = true;
    };
  }, [formData.employeeName]);

  const validateMorningForm = () => {
    if (!formData.loginTime) {
      return 'Please click Set Time to capture your login time.';
    }
    if (!isValidTimecode(formData.startTimeCode)) {
      return 'Please enter a valid start time code (HH:MM:SS).';
    }
    return null;
  };

  const validateLogoutForm = () => {
    if (!isValidTimecode(formData.endTimeCode)) {
      return 'Please enter a valid end time code (HH:MM:SS).';
    }
    if (!formData.logoutTime) {
      return 'Please click Set Time to capture your logout time.';
    }
    if (productiveMinutes === null) {
      return 'End time code must be after start time code.';
    }
    if (!formData.status) {
      return 'Please select a status.';
    }
    return null;
  };

  const handleMorningSubmit = async () => {
    setSubmitError('');
    setSubmitSuccess('');

    const validationError = validateMorningForm();
    if (validationError) {
      setSubmitError(validationError);
      return;
    }

    setSubmitting(true);
    const { data, error } = await submitWorkEntry(formData);
    setSubmitting(false);

    if (error) {
      setSubmitError(error.message);
      return;
    }

    const entry = data?.[0];
    if (entry) {
      setActiveEntryId(entry.id);
      setIsLogoutMode(true);
      setFormData(entryToFormFields(entry));
    }

    setSubmitSuccess(
      'Login details saved. Complete evening logout below when you finish work.',
    );
  };

  const handleFinalSubmit = async () => {
    setSubmitError('');
    setSubmitSuccess('');

    if (!activeEntryId) {
      setSubmitError('No active session found. Select an employee with an open entry.');
      return;
    }

    const validationError = validateLogoutForm();
    if (validationError) {
      setSubmitError(validationError);
      return;
    }

    setSubmitting(true);
    const { error } = await submitFinalLog(activeEntryId, formData, productiveMinutes);
    setSubmitting(false);

    if (error) {
      setSubmitError(error.message);
      return;
    }

    setSubmitSuccess('Final log submitted successfully.');
    setFormData(buildMorningDefaults(formData.employeeName));
    setIsLogoutMode(false);
    setActiveEntryId(null);
  };

  const loginLocked = isLogoutMode || loadingSession;
  const logoutLocked = !isLogoutMode || loadingSession;

  return (
    <div className="tracker-layout">
      <EmployeeNameField
        value={formData.employeeName}
        onChange={(value) => updateField('employeeName', value)}
      />

      {loadingSession && (
        <p className="form-hint form-hint--loading">Checking for an open session…</p>
      )}

      {isLogoutMode && !loadingSession && (
        <p className="form-message form-message--info" role="status">
          Open session found. Complete your evening logout below.
        </p>
      )}

      <div className="tracker-panels">
        <section
          className={`tracker-panel${loginLocked ? ' tracker-panel--inactive' : ''}`}
          aria-labelledby="login-section-title"
        >
          <div className="tracker-panel__head">
            <h2 id="login-section-title" className="tracker-panel__title">
              Morning Login
            </h2>
            <p className="tracker-panel__subtitle">Start your work session with project details.</p>
            {loginLocked && isLogoutMode && (
              <p className="tracker-panel__status">Session active — login details are locked.</p>
            )}
          </div>
          <DateField
            value={formData.date}
            onChange={(value) => updateField('date', value)}
            readOnly={loginLocked}
          />
          <CaptureTimeField
            id="loginTime"
            label="Login Time"
            hint="Click Set Time to capture the current time. This field cannot be edited manually."
            value={formData.loginTime}
            onChange={(value) => updateField('loginTime', value)}
            captureAriaLabel="Set login time to now"
            disabled={loginLocked}
          />
          <ProjectField
            value={formData.project}
            onChange={(value) => updateField('project', value)}
            readOnly={loginLocked}
          />
          <AssignedMovieField
            value={formData.assignedMovie}
            onChange={(value) => updateField('assignedMovie', value)}
            readOnly={loginLocked}
          />
          <TimeCodeField
            id="startTimeCode"
            label="Start Time Code"
            hint="Movie timestamp where dubbing starts (HH:MM:SS)."
            value={formData.startTimeCode}
            onChange={(value) => updateField('startTimeCode', value)}
            readOnly={loginLocked}
          />
          <LanguagesField
            value={formData.languages}
            onChange={(value) => updateField('languages', value)}
            readOnly={loginLocked}
          />
          <TypeOfWorkField
            value={formData.typeOfWork}
            onChange={(value) => updateField('typeOfWork', value)}
            readOnly={loginLocked}
          />
          <button
            type="button"
            className="form-submit-btn"
            disabled={submitting || loginLocked}
            onClick={handleMorningSubmit}
          >
            {submitting && !isLogoutMode ? 'Saving…' : 'Save Login Details'}
          </button>
        </section>
        <section
          className={`tracker-panel${logoutLocked ? ' tracker-panel--inactive' : ''}`}
          aria-labelledby="logout-section-title"
        >
          <div className="tracker-panel__head">
            <h2 id="logout-section-title" className="tracker-panel__title">
              Evening Logout
            </h2>
            <p className="tracker-panel__subtitle">
              Close your active session and submit final production details.
            </p>
            {logoutLocked && !loadingSession && !isLogoutMode && (
              <p className="tracker-panel__status">Save morning login first to unlock this section.</p>
            )}
          </div>
          <TimeCodeField
            id="endTimeCode"
            label="End Time Code"
            hint="Movie timestamp where dubbing ended today (HH:MM:SS)."
            value={formData.endTimeCode}
            onChange={(value) => updateField('endTimeCode', value)}
            readOnly={logoutLocked}
          />
          <CaptureTimeField
            id="logoutTime"
            label="Logout Time"
            hint="Click Set Time to capture your logout time. This field cannot be edited manually."
            value={formData.logoutTime}
            onChange={(value) => updateField('logoutTime', value)}
            captureAriaLabel="Set logout time to now"
            disabled={logoutLocked}
          />
          <ProductiveMinutesField value={productiveMinutes} />
          <StatusField
            value={formData.status}
            onChange={(value) => updateField('status', value)}
            readOnly={logoutLocked}
          />
          <RemarksField
            value={formData.remarks}
            onChange={(value) => updateField('remarks', value)}
            readOnly={logoutLocked}
          />
          <button
            type="button"
            className="form-submit-btn"
            disabled={submitting || logoutLocked}
            onClick={handleFinalSubmit}
          >
            {submitting && isLogoutMode ? 'Saving…' : 'Submit Final Log'}
          </button>
        </section>
      </div>

      {submitError && (
        <p className="form-message form-message--error" role="alert">
          {submitError}
        </p>
      )}
      {submitSuccess && (
        <p className="form-message form-message--success" role="status">
          {submitSuccess}
        </p>
      )}
    </div>
  );
}
