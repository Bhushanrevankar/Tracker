export default function DateField({ value, onChange, readOnly = false }) {
  return (
    <div className="form-field">
      <label htmlFor="date" className="form-label">
        Date
        <span className="form-required" aria-hidden="true">
          *
        </span>
      </label>
      <input
        id="date"
        name="date"
        type="date"
        className="form-control"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        readOnly={readOnly}
        required={!readOnly}
      />
    </div>
  );
}
