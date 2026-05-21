import { MOVIES } from '../../constants/movies';

export default function AssignedMovieField({ value, onChange, readOnly = false }) {
  return (
    <div className="form-field">
      <label htmlFor="assignedMovie" className="form-label">
        Assigned Movie
        <span className="form-required" aria-hidden="true">
          *
        </span>
      </label>
      <select
        id="assignedMovie"
        name="assignedMovie"
        className="form-control"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={readOnly}
        required={!readOnly}
      >
        <option value="">Select movie…</option>
        {MOVIES.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
}
