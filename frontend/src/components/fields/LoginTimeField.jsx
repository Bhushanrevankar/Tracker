import { getCurrentTime12HourString } from '../../utils/date';

function ClockIcon() {
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
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

export default function LoginTimeField({ value, onChange }) {
  const handleCapture = () => {
    onChange(getCurrentTime12HourString());
  };

  return (
    <div className="form-field">
      <label htmlFor="loginTime" className="form-label">
        Login Time
        <span className="form-required" aria-hidden="true">
          *
        </span>
      </label>
      <div className="time-input-group">
        <input
          id="loginTime"
          name="loginTime"
          type="text"
          className="form-control time-input-group__input"
          value={value}
          readOnly
          placeholder="--:-- --"
          required
          aria-describedby="loginTime-hint"
        />
        <button
          type="button"
          className="time-capture-btn"
          onClick={handleCapture}
          aria-label="Set login time to now"
          title="Set login time"
        >
          <ClockIcon />
          <span className="time-capture-btn__label">Set Time</span>
        </button>
      </div>
      <p id="loginTime-hint" className="form-hint">
        Click Set Time to capture the current time. This field cannot be edited manually.
      </p>
    </div>
  );
}
