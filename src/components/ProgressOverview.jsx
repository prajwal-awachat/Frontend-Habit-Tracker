import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import '../styles/ProgressOverview.css';

const ProgressOverview = ({ habits }) => {
  // Helper function to get mood color based on percentage
  const getMoodColor = (percentage) => {
    if (percentage >= 90) return '#10B981'; // Green
    if (percentage >= 75) return '#3B82F6';  // Blue
    if (percentage >= 50) return '#F59E0B';  // Amber
    if (percentage >= 25) return '#F97316';  // Orange
    return '#EF4444'; // Red
  };

  const calculateMonthlyProgress = () => {
    const today = new Date();
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);
    const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    let monthlyCompletions = 0;
    let monthlyPossible = 0;
    
    habits.forEach(habit => {
      monthDays.forEach(day => {
        const dateKey = format(day, 'yyyy-MM-dd');
        if (habit.completed && habit.completed[dateKey]) {
          monthlyCompletions++;
        }
        monthlyPossible++;
      });
    });
    
    return monthlyPossible > 0 ? Math.round((monthlyCompletions / monthlyPossible) * 100) : 0;
  };

  const calculateCurrentMood = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const completedToday = habits.filter(habit => 
      habit.completed && habit.completed[today]
    ).length;
    
    const completionRate = habits.length > 0 
      ? Math.round((completedToday / habits.length) * 100) 
      : 0;
    
    let moodEmoji = '😐';
    let moodLabel = 'Neutral';
    let moodColor = getMoodColor(completionRate);
    
    if (completionRate >= 90) {
      moodEmoji = '😊';
      moodLabel = 'Excellent!';
    } else if (completionRate >= 75) {
      moodEmoji = '🙂';
      moodLabel = 'Good';
    } else if (completionRate >= 50) {
      moodEmoji = '😐';
      moodLabel = 'Okay';
    } else if (completionRate >= 25) {
      moodEmoji = '😕';
      moodLabel = 'Could be better';
    } else {
      moodEmoji = '😞';
      moodLabel = 'Needs improvement';
    }
    
    return {
      emoji: moodEmoji,
      label: moodLabel,
      percentage: completionRate,
      color: moodColor
    };
  };

  const calculateBestStreak = () => {
    return habits.length > 0 
      ? Math.max(...habits.map(h => h.streak || 0))
      : 0;
  };

  const monthlyProgress = calculateMonthlyProgress();
  const currentMood = calculateCurrentMood();
  const bestStreak = calculateBestStreak();

  return (
    <div className="progress-overview">
      <h3>Progress Overview</h3>
      <p className="overview-subtitle">Monthly performance & current mood</p>
      
      <div className="overview-grid">
        {/* Monthly Progress Circle */}
        <div className="circular-progress-card">
          <div className="progress-circle-wrapper">
            <div className="progress-circle">
              <svg viewBox="0 0 100 100">
                <circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  fill="none" 
                  stroke="#f3f4f6" 
                  strokeWidth="8"
                />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  fill="none" 
                  stroke="#10B981" 
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${monthlyProgress * 2.83} 283`}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="progress-text">
                <span className="progress-percentage">{monthlyProgress}%</span>
                <span className="progress-label">Monthly</span>
              </div>
            </div>
          </div>
          <div className="progress-details">
            <div className="progress-stat">
              <span className="stat-label">Completed</span>
              <span className="stat-value">{habits.length} habits</span>
            </div>
            <div className="progress-stat">
              <span className="stat-label">Best Streak</span>
              <span className="stat-value">{bestStreak} days</span>
            </div>
          </div>
        </div>
        
        {/* Current Mood Circle */}
        <div className="mood-card">
          <div className="mood-indicator">
            <div className="mood-percentage-circle">
              <svg viewBox="0 0 100 100" className="mood-svg">
                <circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  fill="none" 
                  stroke="#f3f4f6" 
                  strokeWidth="8"
                />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  fill="none" 
                  stroke={currentMood.color} 
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${currentMood.percentage * 2.83} 283`}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="mood-percent-text">{currentMood.percentage}%</div>
            </div>
            <div className="mood-emoji-large">
              {currentMood.emoji}
            </div>
          </div>
          <div className="mood-details">
            <h4>Today's Mood</h4>
            <p className="mood-label">{currentMood.label}</p>
            <div className="mood-scale">
              <div className="scale-item">
                <span className="scale-emoji">😞</span>
                <span className="scale-label">0-25%</span>
              </div>
              <div className="scale-item">
                <span className="scale-emoji">😕</span>
                <span className="scale-label">26-50%</span>
              </div>
              <div className="scale-item">
                <span className="scale-emoji">😐</span>
                <span className="scale-label">51-75%</span>
              </div>
              <div className="scale-item">
                <span className="scale-emoji">🙂</span>
                <span className="scale-label">76-90%</span>
              </div>
              <div className="scale-item">
                <span className="scale-emoji">😊</span>
                <span className="scale-label">91-100%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressOverview;