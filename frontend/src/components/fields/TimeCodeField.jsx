import { useState } from 'react';
import {
  formatTimecodeInput,
  getTimecodeError,
  isValidTimecode,
  TIMECODE_PLACEHOLDER,
} from '../../utils/timecode';

export default function TimeCodeField({
  id,
  label,
  hint,
  value,
  onChange,
  readOnly = false,
  required = true,
}) {
  const [touched, setTouched] = useState(false);
  const error = touched && !readOnly ? getTimecodeError(value, label) : null;
  const showInvalid = touched && value && !readOnly && !isValidTimecode(value);

  const handleChange = (e) => {
    onChange(formatTimecodeInput(e.target.value));
  };

  return (
    <div className="form-field">
      <label htmlFor={id} className="form-label">
        {label}
        {required && (
          <span className="form-required" aria-hidden="true">
            *
          </span>
        )}
      </label>
      <input
        id={id}
        name={id}
        type="text"
        className={`form-control form-control--timecode${showInvalid ? ' form-control--invalid' : ''}${readOnly ? ' form-control--readonly' : ''}`}
        value={value}
        onChange={readOnly ? undefined : handleChange}
        onBlur={readOnly ? undefined : () => setTouched(true)}
        placeholder={TIMECODE_PLACEHOLDER}
        inputMode="numeric"
        autoComplete="off"
        spellCheck={false}
        maxLength={8}
        readOnly={readOnly}
        aria-invalid={showInvalid}
        aria-describedby={`${id}-hint ${id}-error`}
        required={required && !readOnly}
      />
      {hint && (
        <p id={`${id}-hint`} className="form-hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="form-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
