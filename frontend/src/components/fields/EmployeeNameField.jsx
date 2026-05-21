import { EMPLOYEES } from '../../constants/employees';
import {
  getRecentEmployees,
  groupEmployeesForDropdown,
} from '../../utils/employeeStorage';

export default function EmployeeNameField({ value, onChange }) {
  const recent = getRecentEmployees();
  const { recentGroup, restGroup } = groupEmployeesForDropdown(EMPLOYEES, recent);

  return (
    <div className="form-field">
      <label htmlFor="employeeName" className="form-label">
        Employee Name
        <span className="form-required" aria-hidden="true">
          *
        </span>
      </label>
      <select
        id="employeeName"
        name="employeeName"
        className="form-control"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      >
        <option value="">Select employee…</option>
        {recentGroup.length > 0 && (
          <optgroup label="Recently used">
            {recentGroup.map((name) => (
              <option key={`recent-${name}`} value={name}>
                {name}
              </option>
            ))}
          </optgroup>
        )}
        <optgroup label={recentGroup.length > 0 ? 'All employees' : 'Employees'}>
          {restGroup.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </optgroup>
      </select>
      {recentGroup.length > 0 && (
        <p className="form-hint">Your recently selected names appear at the top.</p>
      )}
    </div>
  );
}
