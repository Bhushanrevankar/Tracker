import { WORK_STATUSES } from '../../constants/statuses';

export default function StatusField({ value, onChange, readOnly = false }) {
  return (
    <div className="form-field">
      <label htmlFor="status" className="form-label">
        Status
        <span className="form-required" aria-hidden="true">
          *
        </span>
      </label>
      <select
        id="status"
        name="status"
        className="form-control"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={readOnly}
        required={!readOnly}
      >
        <option value="">Select status…</option>
        {WORK_STATUSES.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
}
