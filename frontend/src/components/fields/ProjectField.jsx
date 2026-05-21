import { PROJECTS } from '../../constants/projects';

export default function ProjectField({ value, onChange, readOnly = false }) {
  return (
    <div className="form-field">
      <label htmlFor="project" className="form-label">
        Project
        <span className="form-required" aria-hidden="true">
          *
        </span>
      </label>
      <select
        id="project"
        name="project"
        className="form-control"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={readOnly}
        required={!readOnly}
      >
        <option value="">Select project…</option>
        {PROJECTS.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
}
