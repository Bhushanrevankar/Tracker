export default function RemarksField({ value, onChange }) {
  return (
    <div className="form-field">
      <label htmlFor="remarks" className="form-label">
        Remarks
      </label>
      <textarea
        id="remarks"
        name="remarks"
        className="form-control form-control--textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        placeholder="Optional notes about today’s work…"
      />
    </div>
  );
}
