import { useState } from 'react';
import WorkTrackerForm from './components/WorkTrackerForm';
import AdminDashboard from './components/AdminDashboard';
import './index.css';

const App = () => {
  const [currentView, setCurrentView] = useState('tracker'); // 'tracker' or 'admin'

  if (currentView === 'admin') {
    return <AdminDashboard onBackToTracker={() => setCurrentView('tracker')} />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-text">
            <h1 className="app-title">Daily Dubbing Work Tracker</h1>
            <p className="app-subtitle">Log your daily dubbing work entries.</p>
          </div>
          <button
            className="admin-button"
            onClick={() => setCurrentView('admin')}
          >
            Admin Dashboard
          </button>
        </div>
      </header>

      <WorkTrackerForm />
    </div>
  );
};

export default App;
