import { useState } from 'react';
import WorkTrackerForm from './components/WorkTrackerForm';
import AdminDashboard from './components/AdminDashboard';
import './index.css';

const App = () => {
  const [currentView, setCurrentView] = useState('tracker'); // 'tracker' or 'admin'

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Daily Dubbing Work Tracker</h1>
        <p className="app-subtitle">
          {currentView === 'tracker' 
            ? 'Log your daily dubbing work entries.' 
            : 'Monitor employee work sessions and productivity.'
          }
        </p>
      </header>

      <nav className="app-navigation">
        <button
          className={`nav-button ${currentView === 'tracker' ? 'nav-button--active' : ''}`}
          onClick={() => setCurrentView('tracker')}
        >
          Employee Tracker
        </button>
        <button
          className={`nav-button ${currentView === 'admin' ? 'nav-button--active' : ''}`}
          onClick={() => setCurrentView('admin')}
        >
          Admin Dashboard
        </button>
      </nav>

      {currentView === 'tracker' ? <WorkTrackerForm /> : <AdminDashboard />}
    </div>
  );
};

export default App;
