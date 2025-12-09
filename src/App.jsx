import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CalendarView from './components/CalendarView';
import HabitList from './components/HabitList';
import ProgressBars from './components/ProgressBars';
import AnalysisPanel from './components/AnalysisPanel';
import ConsistencyGraph from './components/ConsistencyGraph';
import ProgressOverview from './components/ProgressOverview';
import Login from './components/Login';
import api from './api/axios';
import './App.css';

// Create a ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await api.get('/api/auth/me');
        setUser(response.data.user);
      }
    } catch (err) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

// Main Dashboard Component
const Dashboard = () => {
  const [habits, setHabits] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await api.get('/api/auth/me');
        setUser(response.data.user);
        fetchHabits();
      } else {
        setLoading(false);
      }
    } catch (err) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setLoading(false);
    }
  };

  const fetchHabits = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/habits');
      setHabits(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching habits:', err);
      if (err.response?.status === 401) {
        handleLogout();
      } else {
        setError('Failed to load habits.');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleHabitCompletion = async (habitId, dateKey) => {
    try {
      const habit = habits.find(h => h._id === habitId);
      const updatedCompleted = { ...habit.completed };
      updatedCompleted[dateKey] = !updatedCompleted[dateKey];
      
      const streak = calculateStreak(updatedCompleted);
      
      const response = await api.patch(`/api/habits/${habitId}`, {
        completed: updatedCompleted,
        streak: streak
      });
      
      setHabits(habits.map(h => h._id === habitId ? response.data : h));
    } catch (err) {
      console.error('Error updating habit:', err);
      if (err.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const addHabit = async (habitData) => {
    try {
      const response = await api.post('/api/habits', habitData);
      setHabits([...habits, response.data]);
    } catch (err) {
      console.error('Error adding habit:', err);
      if (err.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const deleteHabit = async (habitId) => {
    try {
      await api.delete(`/api/habits/${habitId}`);
      setHabits(habits.filter(habit => habit._id !== habitId));
    } catch (err) {
      console.error('Error deleting habit:', err);
      if (err.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const calculateStreak = (completed) => {
    let streak = 0;
    let currentDate = new Date();
    
    for (let i = 0; i < 365; i++) {
      const dateKey = currentDate.toISOString().split('T')[0];
      if (completed[dateKey]) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading habits...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-top">
          <div className="app-title-container">
            <h1 className="app-title">Habit Tracker</h1>
            <p className="app-subtitle">Build better habits, one day at a time</p>
          </div>
          
          <div className="user-profile-section">
            <div className="user-avatar">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="user-info">
              <span className="user-name">{user?.username || 'User'}</span>
              <button onClick={handleLogout} className="logout-button">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
        
        <div className="header-bottom">
          {error && <div className="error-banner">{error}</div>}
        </div>
      </header>

      <div className="dashboard">
        <div className="top-section">
          <div className="calendar-container">
            <CalendarView 
              currentDate={currentDate} 
              setCurrentDate={setCurrentDate}
            />
          </div>
          
          <div className="progress-container">
            <ProgressOverview habits={habits} />
          </div>
        </div>

        <div className="main-content">
          <div className="sidebar">
            <HabitList 
              habits={habits} 
              toggleHabitCompletion={toggleHabitCompletion}
              currentDate={currentDate}
              addHabit={addHabit}
              deleteHabit={deleteHabit}
            />
          </div>

          <div className="analysis-panel">
            <AnalysisPanel habits={habits} currentDate={currentDate} />
          </div>
        </div>

        <div className="graph-section">
          <ConsistencyGraph habits={habits} />
        </div>
      </div>
    </div>
  );
};

// Main App Component with Router
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={(userData) => {
          localStorage.setItem('user', JSON.stringify(userData));
          window.location.href = '/';
        }} />} />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;