import React from 'react';
import '../styles/AnalysisPanel.css';

const AnalysisPanel = ({ habits, currentDate }) => {
  const calculateHabitProgress = (habit) => {
    const totalDays = 30;
    const completedDays = Object.values(habit.completed || {}).filter(Boolean).length;
    const progress = Math.min(Math.round((completedDays / habit.goal) * 100), 100);
    
    return {
      name: habit.name,
      icon: habit.icon,
      color: habit.color,
      goal: habit.goal,
      actual: completedDays,
      progress: progress
    };
  };

  const habitProgress = habits.map(calculateHabitProgress);
  const totalCompleted = habitProgress.reduce((sum, h) => sum + h.actual, 0);
  const bestStreak = Math.max(...habits.map(h => h.streak || 0));
  const mostConsistent = habitProgress.length > 0 ? habitProgress.reduce((a, b) => a.progress > b.progress ? a : b).name : 'None';

  return (
    <div className="analysis-panel">
      <h3>Goal vs Actual</h3>
      <p className="analysis-subtitle">Monthly performance analysis</p>
      
      <div className="analysis-grid">
        {habitProgress.slice(0, 4).map((habit, index) => (
          <div key={index} className="analysis-item">
            <div className="analysis-header">
              <span className="habit-icon-analysis" style={{ color: habit.color }}>
                {habit.icon}
              </span>
              <span className="habit-name-analysis">{habit.name}</span>
            </div>
            
            <div className="progress-stats-analysis">
              <span className="actual">{habit.actual}</span>
              <span className="divider">/</span>
              <span className="goal">{habit.goal}</span>
              <span className="days-label">days</span>
            </div>
            
            <div className="vertical-progress-container">
              <div 
                className="vertical-progress-bar"
                style={{ 
                  height: `${habit.progress}%`,
                  backgroundColor: habit.color
                }}
              ></div>
              <div className="progress-background"></div>
            </div>
            
            <div className="progress-percentage">
              {habit.progress}%
            </div>
          </div>
        ))}
      </div>
      
      <div className="insights">
        <h4>Monthly Insights</h4>
        {habits.length > 0 ? (
          <ul className="insights-list">
            <li>You've completed <strong>{totalCompleted}</strong> habit days this month</li>
            <li>Your best streak is <strong>{bestStreak}</strong> days</li>
            <li>Most consistent habit: <strong>{mostConsistent}</strong></li>
          </ul>
        ) : (
          <p className="no-data">Add habits to see insights</p>
        )}
      </div>
    </div>
  );
};

export default AnalysisPanel;