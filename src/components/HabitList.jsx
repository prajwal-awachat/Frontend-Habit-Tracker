import React, { useState } from 'react';
import { format } from 'date-fns';
import '../styles/HabitList.css';

const habitIcons = ['🏃', '📚', '💧', '🥗', '😴', '🧘', '✍️', '🎨', '🎸', '🧹'];

const HabitList = ({ habits, toggleHabitCompletion, currentDate, addHabit, deleteHabit }) => {
  const [newHabitName, setNewHabitName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('🏃');
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  // Calculate actual days in the current month
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const daysInMonth = Array.from({ length: getDaysInMonth(currentDate) }, (_, i) => i + 1);
  const currentDay = currentDate.getDate();

  // Dynamic grid template columns - increased first column width
  const gridTemplateColumns = `250px repeat(${daysInMonth.length}, 1fr)`;

  const handleAddHabit = (e) => {
    e.preventDefault();
    if (newHabitName.trim()) {
      addHabit({
        name: newHabitName,
        icon: selectedIcon,
        color: '#4CAF50',
        goal: 30,
        frequency: 'daily'
      });
      setNewHabitName('');
      setShowForm(false);
    }
  };

  const handleDeleteClick = (habitId, habitName) => {
    setDeleteConfirmation({ habitId, habitName });
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirmation) {
      await deleteHabit(deleteConfirmation.habitId);
      setDeleteConfirmation(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmation(null);
  };

  return (
    <div className="habit-list">
      <div className="habit-list-header">
        <h3>My Habits</h3>
        <button onClick={() => setShowForm(!showForm)} className="add-button">
          + Add Habit
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddHabit} className="add-habit-form">
          <input
            type="text"
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            placeholder="Enter habit name"
            className="habit-input"
            autoFocus
          />
          <div className="icon-selector">
            {habitIcons.map(icon => (
              <button
                key={icon}
                type="button"
                className={`icon-button ${selectedIcon === icon ? 'selected' : ''}`}
                onClick={() => setSelectedIcon(icon)}
              >
                {icon}
              </button>
            ))}
          </div>
          <button type="submit" className="submit-button">
            Create Habit
          </button>
        </form>
      )}

      <div className="habits-container">
        <div className="habits-grid">
          <div 
            className="grid-header" 
            style={{ gridTemplateColumns: gridTemplateColumns }}
          >
            <div className="habit-name-header">Habit</div>
            {daysInMonth.map(day => (
              <div key={day} className={`day-header ${day === currentDay ? 'current-day' : ''}`}>
                {day}
              </div>
            ))}
          </div>

          {habits.map(habit => (
            <div 
              key={habit._id} 
              className="habit-row"
              style={{ gridTemplateColumns: gridTemplateColumns }}
            >
              <div className="habit-info">
                <span className="habit-icon" style={{ color: habit.color }}>
                  {habit.icon}
                </span>
                <span className="habit-title" title={habit.name}>
                  {habit.name}
                </span>
                <span className="streak-badge">{habit.streak || 0} days</span>
                <button
                  onClick={() => handleDeleteClick(habit._id, habit.name)}
                  className="delete-habit-button"
                  title="Delete habit"
                >
                  🗑️
                </button>
              </div>
              
              {daysInMonth.map(day => {
                const dateKey = format(
                  new Date(currentDate.getFullYear(), currentDate.getMonth(), day),
                  'yyyy-MM-dd'
                );
                const isCompleted = habit.completed && habit.completed[dateKey];
                
                return (
                  <button
                    key={day}
                    className={`checkbox ${isCompleted ? 'checked' : ''} ${day === currentDay ? 'today' : ''}`}
                    onClick={() => toggleHabitCompletion(habit._id, dateKey)}
                    title={`${format(new Date(currentDate.getFullYear(), currentDate.getMonth(), day), 'MMM d')}`}
                  >
                    {isCompleted ? '✓' : ''}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="delete-confirmation-modal">
          <div className="delete-confirmation-content">
            <h3>Delete Habit</h3>
            <p>Are you sure you want to delete "{deleteConfirmation.habitName}"? This action cannot be undone.</p>
            <div className="delete-confirmation-buttons">
              <button onClick={handleDeleteCancel} className="delete-cancel-button">
                Cancel
              </button>
              <button onClick={handleDeleteConfirm} className="delete-confirm-button">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitList;