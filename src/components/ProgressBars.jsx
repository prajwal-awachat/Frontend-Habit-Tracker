import React from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import '../styles/ProgressBars.css';

const ProgressBars = ({ habits, currentDate }) => {
  const calculateOverallProgress = () => {
    if (habits.length === 0) return 0;
    
    let totalCompletions = 0;
    let totalPossible = 0;
    
    habits.forEach(habit => {
      Object.values(habit.completed || {}).forEach(isCompleted => {
        if (isCompleted) totalCompletions++;
        totalPossible++;
      });
    });
    
    return totalPossible > 0 ? Math.round((totalCompletions / totalPossible) * 100) : 0;
  };

  const calculateDailyProgress = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const todaysHabits = habits.filter(habit => habit.frequency === 'daily' || !habit.frequency).length;
    
    const completedToday = habits.filter(habit => 
      habit.completed && habit.completed[today]
    ).length;
    
    return todaysHabits > 0 ? Math.round((completedToday / todaysHabits) * 100) : 0;
  };

  const calculateWeeklyProgress = () => {
    const weekStart = startOfWeek(new Date());
    const weekEnd = endOfWeek(new Date());
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
    
    let weeklyCompletions = 0;
    let weeklyPossible = 0;
    
    habits.forEach(habit => {
      weekDays.forEach(day => {
        const dateKey = format(day, 'yyyy-MM-dd');
        if (habit.completed && habit.completed[dateKey]) {
          weeklyCompletions++;
        }
        weeklyPossible++;
      });
    });
    
    return weeklyPossible > 0 ? Math.round((weeklyCompletions / weeklyPossible) * 100) : 0;
  };

  const overallProgress = calculateOverallProgress();
  const dailyProgress = calculateDailyProgress();
  const weeklyProgress = calculateWeeklyProgress();

  return (
    <div className="progress-bars">
      <h3>Progress Overview</h3>
      
      <div className="progress-item">
        <div className="progress-header">
          <span className="progress-label">Overall Completion</span>
          <span className="progress-value">{overallProgress}%</span>
        </div>
        <div className="progress-bar-container">
          <div 
            className="progress-bar" 
            style={{ width: `${overallProgress}%`, backgroundColor: '#4CAF50' }}
          ></div>
        </div>
      </div>
      
      <div className="progress-item">
        <div className="progress-header">
          <span className="progress-label">Today's Progress</span>
          <span className="progress-value">{dailyProgress}%</span>
        </div>
        <div className="progress-bar-container">
          <div 
            className="progress-bar" 
            style={{ width: `${dailyProgress}%`, backgroundColor: '#2196F3' }}
          ></div>
        </div>
        <div className="progress-stats">
          {habits.filter(h => h.completed && h.completed[format(new Date(), 'yyyy-MM-dd')]).length} of {habits.length} completed
        </div>
      </div>
      
      <div className="progress-item">
        <div className="progress-header">
          <span className="progress-label">Weekly Progress</span>
          <span className="progress-value">{weeklyProgress}%</span>
        </div>
        <div className="progress-bar-container">
          <div 
            className="progress-bar" 
            style={{ width: `${weeklyProgress}%`, backgroundColor: '#FF9800' }}
          ></div>
        </div>
      </div>
      
      <div className="streak-section">
        <h4>Current Streaks</h4>
        <div className="streaks-grid">
          {habits.slice(0, 4).map(habit => (
            <div key={habit._id || habit.id} className="streak-item">
              <span className="streak-icon" style={{ color: habit.color }}>
                {habit.icon}
              </span>
              <div className="streak-info">
                <span className="streak-name">{habit.name}</span>
                <span className="streak-days">{habit.streak || 0} days</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressBars;