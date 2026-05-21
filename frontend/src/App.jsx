import WorkTrackerForm from './components/WorkTrackerForm';
import './index.css';

const App = () => {
  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Daily Dubbing Work Tracker</h1>
        <p className="app-subtitle">Log your daily dubbing work entries.</p>
      </header>
      <WorkTrackerForm />
    </div>
  );
};

export default App;
