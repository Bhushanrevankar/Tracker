import { useState } from 'react';
import {
  formatTimecodeInput,
  getTimecodeError,
  isValidTimecode,
  TIMECODE_PLACEHOLDER,
} from '../../utils/timecode';

export default function StartTimeCodeField({ value, onChange }) {
  const [touched, setTouched] = useState(false);
  const error = touched ? getTimecodeError(value) : null;
  const showInvalid = touched && value && !isValidTimecode(value);

  const handleChange = (e) => {
    onChange(formatTimecodeInput(e.target.value));
  };

  return (
    <div className="form-field">
      <label htmlFor="startTimeCode" className="form-label">
        Start Time Code
        <span className="form-required" aria-hidden="true">
          *
        </span>
      </label>
      <input
        id="startTimeCode"
        name="startTimeCode"
        type="text"
        className={`form-control form-control--timecode${showInvalid ? ' form-control--invalid' : ''}`}
        value={value}
        onChange={handleChange}
        onBlur={() => setTouched(true)}
        placeholder={TIMECODE_PLACEHOLDER}
        inputMode="numeric"
        autoComplete="off"
        spellCheck={false}
        maxLength={8}
        aria-invalid={showInvalid}
        aria-describedby="startTimeCode-hint startTimeCode-error"
        required
      />
      <p id="startTimeCode-hint" className="form-hint">
        Movie timestamp where dubbing starts (HH:MM:SS).
      </p>
      {error && (
        <p id="startTimeCode-error" className="form-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
