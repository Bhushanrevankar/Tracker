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

export default function CaptureTimeField({
  id,
  label,
  hint,
  value,
  onChange,
  captureLabel = 'Set Time',
  captureAriaLabel,
}) {
  const handleCapture = () => {
    onChange(getCurrentTime12HourString());
  };

  return (
    <div className="form-field">
      <label htmlFor={id} className="form-label">
        {label}
        <span className="form-required" aria-hidden="true">
          *
        </span>
      </label>
      <div className="time-input-group">
        <input
          id={id}
          name={id}
          type="text"
          className="form-control time-input-group__input"
          value={value}
          readOnly
          placeholder="--:-- --"
          required
          aria-describedby={`${id}-hint`}
        />
        <button
          type="button"
          className="time-capture-btn"
          onClick={handleCapture}
          aria-label={captureAriaLabel ?? `Set ${label.toLowerCase()} to now`}
          title={captureLabel}
        >
          <ClockIcon />
          <span className="time-capture-btn__label">{captureLabel}</span>
        </button>
      </div>
      {hint && (
        <p id={`${id}-hint`} className="form-hint">
          {hint}
        </p>
      )}
    </div>
  );
}
