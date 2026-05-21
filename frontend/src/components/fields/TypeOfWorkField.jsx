import { WORK_TYPES } from '../../constants/workTypes';

export default function TypeOfWorkField({ value, onChange }) {
  return (
    <div className="form-field">
      <label htmlFor="typeOfWork" className="form-label">
        Type of Work
        <span className="form-required" aria-hidden="true">
          *
        </span>
      </label>
      <select
        id="typeOfWork"
        name="typeOfWork"
        className="form-control"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      >
        <option value="">Select type of work…</option>
        {WORK_TYPES.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
}
