import { getTodayDateString, getFormattedDateString } from '../../utils/date';

function CalendarIcon() {
  return (
    <svg
      className="time-capture-btn__icon"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

export default function DateField({ value, onChange, readOnly = false }) {
  const handleSetToday = () => {
    if (readOnly) return;
    onChange(getTodayDateString());
  };

  const displayValue = value ? getFormattedDateString(value) : '';

  return (
    <div className="form-field">
      <label htmlFor="date" className="form-label">
        Date
        <span className="form-required" aria-hidden="true">
          *
        </span>
      </label>
      <div className="time-input-group">
        <input
          id="date"
          name="date"
          type="text"
          className="form-control time-input-group__input"
          value={displayValue}
          readOnly
          placeholder="Select date"
          required
          aria-describedby="date-hint"
        />
        <button
          type="button"
          className="time-capture-btn"
          onClick={handleSetToday}
          disabled={readOnly}
          aria-label="Set date to today"
          title="Set Date"
        >
          <CalendarIcon />
          <span className="time-capture-btn__label">Set Date</span>
        </button>
      </div>
      <p id="date-hint" className="form-hint">
        Click Set Date to use today's date. This field cannot be edited manually.
      </p>
    </div>
  );
}
