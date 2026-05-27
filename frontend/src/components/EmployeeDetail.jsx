import { useEffect, useState } from 'react';
import { fetchEmployeeDetailedStats, fetchEmployeeWorkHistory } from '../utils/adminQueries';
import { getTodayDateString } from '../utils/date';

export default function EmployeeDetail({ employeeName, onBack, onBackToTracker }) {
  const [employeeData, setEmployeeData] = useState(null);
  const [workHistory, setWorkHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState('7'); // days
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState(getTodayDateString());

  useEffect(() => {
    loadEmployeeData();
  }, [employeeName, selectedDateRange, customStartDate, customEndDate]);

  const loadEmployeeData = async () => {
    setLoading(true);
    setError('');

    try {
      // Calculate date range
      const endDate = customEndDate || getTodayDateString();
      let startDate;

      if (selectedDateRange === 'custom') {
        startDate = customStartDate;
      } else {
        const daysBack = parseInt(selectedDateRange);
        const start = new Date();
        start.setDate(start.getDate() - daysBack);
        startDate = start.toISOString().split('T')[0];
      }

      // Fetch employee stats and work history
      const [stats, history] = await Promise.all([
        fetchEmployeeDetailedStats(employeeName, startDate, endDate),
        fetchEmployeeWorkHistory(employeeName, startDate, endDate)
      ]);

      setEmployeeData(stats);
      setWorkHistory(history);
    } catch (err) {
      setError('Failed to load employee data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (minutes) => {
    if (!minutes) return '0m';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Completed':
        return 'status-badge status-badge--completed';
      case 'In Progress':
        return 'status-badge status-badge--active';
      case 'Hold':
        return 'status-badge status-badge--warning';
      default:
        return 'status-badge status-badge--unknown';
    }
  };

  if (loading) {
    return (
      <div className="employee-detail-fullscreen">
        <div className="employee-detail-header">
          <button className="back-button" onClick={onBack}>
            ← Back to Dashboard
          </button>
          <h2 className="employee-detail-title">Loading...</h2>
          <button className="back-to-tracker-btn" onClick={onBackToTracker}>
            ← Back to Tracker
          </button>
        </div>
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="employee-detail-fullscreen">
        <div className="employee-detail-header">
          <button className="back-button" onClick={onBack}>
            ← Back to Dashboard
          </button>
          <h2 className="employee-detail-title">Error</h2>
          <button className="back-to-tracker-btn" onClick={onBackToTracker}>
            ← Back to Tracker
          </button>
        </div>
        <div className="form-message form-message--error">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="employee-detail-fullscreen">
      <div className="employee-detail-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Dashboard
        </button>
        <div className="employee-detail-title-section">
          <h2 className="employee-detail-title">{employeeName}</h2>
          <p className="employee-detail-subtitle">Employee Performance Overview</p>
        </div>
        <button className="back-to-tracker-btn" onClick={onBackToTracker}>
          ← Back to Tracker
        </button>
      </div>

      {/* Date Range Filter */}
      <div className="date-range-filter">
        <div className="filter-group">
          <label className="form-label">Time Period</label>
          <div className="date-range-buttons">
            <button
              className={`date-range-btn ${selectedDateRange === '1' ? 'active' : ''}`}
              onClick={() => setSelectedDateRange('1')}
            >
              Today
            </button>
            <button
              className={`date-range-btn ${selectedDateRange === '7' ? 'active' : ''}`}
              onClick={() => setSelectedDateRange('7')}
            >
              Last 7 Days
            </button>
            <button
              className={`date-range-btn ${selectedDateRange === '30' ? 'active' : ''}`}
              onClick={() => setSelectedDateRange('30')}
            >
              Last 30 Days
            </button>
            <button
              className={`date-range-btn ${selectedDateRange === 'custom' ? 'active' : ''}`}
              onClick={() => setSelectedDateRange('custom')}
            >
              Custom Range
            </button>
          </div>
        </div>

        {selectedDateRange === 'custom' && (
          <div className="custom-date-range">
            <div className="form-field">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                className="form-control"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label className="form-label">End Date</label>
              <input
                type="date"
                className="form-control"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Performance Stats */}
      <div className="employee-stats">
        <div className="stat-card">
          <div className="stat-value">{employeeData.totalDays}</div>
          <div className="stat-label">Working Days</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{formatDuration(employeeData.totalProductiveMinutes)}</div>
          <div className="stat-label">Total Productive Time</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{formatDuration(employeeData.averageProductiveMinutes)}</div>
          <div className="stat-label">Avg. Daily Productive Time</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{employeeData.completedTasks}</div>
          <div className="stat-label">Completed Tasks</div>
        </div>
      </div>

      {/* Current Status */}
      {employeeData.currentStatus && (
        <div className="current-status-card">
          <h3>Current Status</h3>
          <div className="current-status-content">
            <div className="status-info">
              <span className={getStatusBadgeClass(employeeData.currentStatus.session)}>
                {employeeData.currentStatus.session === 'active' ? 'Currently Working' : 'Offline'}
              </span>
              {employeeData.currentStatus.session === 'active' && (
                <div className="active-session-details">
                  <p><strong>Login Time:</strong> {employeeData.currentStatus.loginTime}</p>
                  <p><strong>Project:</strong> {employeeData.currentStatus.project}</p>
                  <p><strong>Movie:</strong> {employeeData.currentStatus.assignedMovie}</p>
                  <p><strong>Session Duration:</strong> {formatDuration(employeeData.currentStatus.sessionDuration)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Work History */}
      <div className="work-history">
        <div className="work-history-header">
          <h3>Work History</h3>
          <span className="history-count">{workHistory.length} entries</span>
        </div>

        {workHistory.length === 0 ? (
          <div className="empty-state">
            <p>No work entries found for the selected time period.</p>
          </div>
        ) : (
          <div className="work-history-list">
            {workHistory.map((entry) => (
              <div key={entry.id} className="work-entry-card">
                <div className="work-entry-header">
                  <div className="work-entry-date">
                    <strong>{formatDate(entry.work_date)}</strong>
                  </div>
                  <div className="work-entry-status">
                    {entry.status && (
                      <span className={getStatusBadgeClass(entry.status)}>
                        {entry.status}
                      </span>
                    )}
                    <span className={`session-badge ${entry.session === 'active' ? 'session-active' : 'session-completed'}`}>
                      {entry.session === 'active' ? 'In Progress' : 'Completed'}
                    </span>
                  </div>
                </div>

                <div className="work-entry-details">
                  <div className="work-entry-row">
                    <div className="work-detail">
                      <span className="detail-label">Project:</span>
                      <span className="detail-value">{entry.project}</span>
                    </div>
                    <div className="work-detail">
                      <span className="detail-label">Movie:</span>
                      <span className="detail-value">{entry.assigned_movie}</span>
                    </div>
                  </div>

                  <div className="work-entry-row">
                    <div className="work-detail">
                      <span className="detail-label">Work Type:</span>
                      <span className="detail-value">{entry.type_of_work}</span>
                    </div>
                    <div className="work-detail">
                      <span className="detail-label">Languages:</span>
                      <span className="detail-value">{entry.languages}</span>
                    </div>
                  </div>

                  <div className="work-entry-row">
                    <div className="work-detail">
                      <span className="detail-label">Time:</span>
                      <span className="detail-value">
                        {entry.login_time} - {entry.logout_time || 'In Progress'}
                      </span>
                    </div>
                    <div className="work-detail">
                      <span className="detail-label">Productive Time:</span>
                      <span className="detail-value productive-time">
                        {formatDuration(entry.productive_minutes)}
                      </span>
                    </div>
                  </div>

                  <div className="work-entry-row">
                    <div className="work-detail">
                      <span className="detail-label">Timecode Range:</span>
                      <span className="detail-value timecode">
                        {entry.start_time_code} - {entry.end_time_code || 'Ongoing'}
                      </span>
                    </div>
                  </div>

                  {entry.remarks && (
                    <div className="work-entry-remarks">
                      <span className="detail-label">Remarks:</span>
                      <p className="remarks-text">{entry.remarks}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}