export default function ProductiveMinutesField({ value }) {
  const display =
    value === null || value === undefined || value === ''
      ? '—'
      : `${value} min`;

  return (
    <div className="form-field">
      <label htmlFor="productiveMinutes" className="form-label">
        Productive Minutes
      </label>
      <input
        id="productiveMinutes"
        name="productiveMinutes"
        type="text"
        className="form-control form-control--readonly"
        value={display}
        readOnly
        aria-describedby="productiveMinutes-hint"
      />
      <p id="productiveMinutes-hint" className="form-hint">
        Calculated from Start Time Code and End Time Code (read-only).
      </p>
    </div>
  );
}
