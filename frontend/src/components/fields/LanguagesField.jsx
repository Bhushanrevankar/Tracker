import { LANGUAGES } from '../../constants/languages';

export default function LanguagesField({ value, onChange, readOnly = false }) {
  return (
    <div className="form-field">
      <label htmlFor="languages" className="form-label">
        Languages
        <span className="form-required" aria-hidden="true">
          *
        </span>
      </label>
      <select
        id="languages"
        name="languages"
        className="form-control"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={readOnly}
        required={!readOnly}
      >
        <option value="">Select language…</option>
        {LANGUAGES.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
}
