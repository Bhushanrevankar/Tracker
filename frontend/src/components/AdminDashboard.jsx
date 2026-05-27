import { useEffect, useState } from 'react';
import { EMPLOYEES } from '../constants/employees';
import { fetchAllWorkEntries, fetchEmployeeStats } from '../utils/adminQueries';
import { getTodayDateString } from '../utils/date';
import EmployeeDetail from './EmployeeDetail';

export default function AdminDashboard({ onBackToTracker }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(getTodayDateString());
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    if (!selectedEmployee) {
      loadEmployeeData();
    }
  }, [selectedDate, selectedEmployee]);

  const loadEmployeeData = async () => {
    setLoading(true);
    setError('');

    try {
      const employeeData = await Promise.all(
        EMPLOYEES.map(async (employeeName) => {
          const stats = await fetchEmployeeStats(employeeName, selectedDate);
          return {
            name: employeeName,
            ...stats,
          };
        })
      );

      setEmployees(employeeData);
    } catch (err) {
      setError('Failed to load employee data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeClick = (employeeName) => {
    setSelectedEmployee(employeeName);
  };

  const handleBackToDashboard = () => {
    setSelectedEmployee(null);
  };

  // If an employee is selected, show the employee detail page
  if (selectedEmployee) {
    return (
      <EmployeeDetail 
        employeeName={selectedEmployee} 
        onBack={handleBackToDashboard}
        onBackToTracker={onBackToTracker}
      />
    );
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active':
        return 'status-badge status-badge--active';
      case 'completed':
        return 'status-badge status-badge--completed';
      case 'inactive':
        return 'status-badge status-badge--inactive';
      default:
        return 'status-badge status-badge--unknown';
    }
  };

  const formatDuration = (minutes) => {
    if (!minutes) return '0m';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (loading) {
    return (
      <div className="admin-dashboard-fullscreen">
        <div className="admin-header-fullscreen">
          <div className="admin-header-content">
            <div>
              <h2 className="admin-title">Admin Dashboard</h2>
              <p className="admin-subtitle">Loading employee data...</p>
            </div>
            <button className="back-to-tracker-btn" onClick={onBackToTracker}>
              ← Back to Tracker
            </button>
          </div>
        </div>
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard-fullscreen">
        <div className="admin-header-fullscreen">
          <div className="admin-header-content">
            <div>
              <h2 className="admin-title">Admin Dashboard</h2>
            </div>
            <button className="back-to-tracker-btn" onClick={onBackToTracker}>
              ← Back to Tracker
            </button>
          </div>
        </div>
        <div className="form-message form-message--error">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-fullscreen">
      <div className="admin-header-fullscreen">
        <div className="admin-header-content">
          <div>
            <h2 className="admin-title">Admin Dashboard</h2>
            <p className="admin-subtitle">Monitor employee work sessions and productivity</p>
          </div>
          <div className="admin-header-controls">
            <div className="form-field">
              <label htmlFor="date-filter" className="form-label">
                Filter by Date
              </label>
              <input
                id="date-filter"
                type="date"
                className="form-control"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <button className="back-to-tracker-btn" onClick={onBackToTracker}>
              ← Back to Tracker
            </button>
          </div>
        </div>
      </div>

      <div className="admin-content">
        <div className="admin-stats">
          <div className="stat-card">
            <div className="stat-value">{employees.filter(emp => emp.status === 'active').length}</div>
            <div className="stat-label">Active Sessions</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{employees.filter(emp => emp.status === 'completed').length}</div>
            <div className="stat-label">Completed Today</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {formatDuration(employees.reduce((total, emp) => total + (emp.productiveMinutes || 0), 0))}
            </div>
            <div className="stat-label">Total Productive Time</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{employees.length}</div>
            <div className="stat-label">Total Employees</div>
          </div>
        </div>

        <div className="employee-list">
          <div className="employee-list-header">
            <h3>Employee Status</h3>
            <button 
              className="refresh-btn"
              onClick={loadEmployeeData}
              disabled={loading}
            >
              Refresh
            </button>
          </div>

          <div className="employee-grid">
            {employees.map((employee) => (
              <div 
                key={employee.name} 
                className="employee-card employee-card--clickable"
                onClick={() => handleEmployeeClick(employee.name)}
              >
                <div className="employee-card-header">
                  <h4 className="employee-name">{employee.name}</h4>
                  <span className={getStatusBadgeClass(employee.status)}>
                    {employee.status || 'No Data'}
                  </span>
                </div>

                <div className="employee-details">
                  {employee.status === 'active' && (
                    <>
                      <div className="detail-row">
                        <span className="detail-label">Login Time:</span>
                        <span className="detail-value">{employee.loginTime || 'N/A'}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Project:</span>
                        <span className="detail-value">{employee.project || 'N/A'}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Movie:</span>
                        <span className="detail-value">{employee.assignedMovie || 'N/A'}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Session Duration:</span>
                        <span className="detail-value">{formatDuration(employee.sessionDuration)}</span>
                      </div>
                    </>
                  )}

                  {employee.status === 'completed' && (
                    <>
                      <div className="detail-row">
                        <span className="detail-label">Work Duration:</span>
                        <span className="detail-value">
                          {employee.loginTime} - {employee.logoutTime}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Productive Time:</span>
                        <span className="detail-value">{formatDuration(employee.productiveMinutes)}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Project:</span>
                        <span className="detail-value">{employee.project || 'N/A'}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Status:</span>
                        <span className="detail-value">{employee.workStatus || 'N/A'}</span>
                      </div>
                    </>
                  )}

                  {!employee.status && (
                    <div className="detail-row">
                      <span className="detail-value">No work entries for selected date</span>
                    </div>
                  )}
                </div>

                <div className="employee-card-footer">
                  <span className="click-hint">Click to view details →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}