import React, { useState } from 'react';
import { FaCheck, FaClock, FaClone, FaEdit, FaTrash, FaEllipsisV, FaSquare } from 'react-icons/fa';

const PRIORITY_COLORS = {
  low: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
  medium: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
  high: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
};

const RECURRENCE_TYPES = {
  none: 'None',
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly'
};

const TaskItem = ({ 
  task, 
  onToggleComplete, 
  onStartPomodoro, 
  onClone, 
  onEdit, 
  onDelete 
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleToggleComplete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleComplete(task.id);
  };

  const handleAction = (e, action) => {
    e.preventDefault();
    e.stopPropagation();
    action();
    setMenuOpen(false);
  };

  // Close menu on outside click
  React.useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e) => {
      if (!e.target.closest('.three-dots-menu') && !e.target.closest('.three-dots-dropdown')) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  return (
    <div 
      className={`bg-white dark:bg-dark-card border border-border-color rounded-xl p-5 mb-4 shadow transition relative ${task.completed ? 'opacity-80' : ''}`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={handleToggleComplete}
            className={`flex items-center p-2 md:px-4 md:py-2 rounded-xl transition select-none border border-border-color bg-white dark:bg-dark-card shadow-sm hover:bg-primary-lightest/30 dark:hover:bg-primary-lightest/10 text-primary md:text-primary-black dark:text-dark-text font-medium md:space-x-2 ${task.completed ? 'bg-primary text-white border-primary' : ''}`}
            aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
          >
            {task.completed && <FaCheck className="text-lg md:text-base text-primary dark:text-white pointer-events-none" />}
            <span className={`ml-2 hidden md:inline ${!task.completed && 'text-primary'}`}>{task.completed ? 'Completed' : 'Complete'}</span>
          </button>
          <div className="flex-grow">
            <div className="flex items-center space-x-2">
              <h3 className={`font-bold text-primary-black dark:text-dark-text ${task.completed ? 'line-through opacity-60' : ''}`}>
                {task.title}
              </h3>
              <span className={`px-2 py-1 rounded-full text-sm ${PRIORITY_COLORS[task.priority]}`}>
                {task.priority}
              </span>
            </div>
            {task.description && (
              <p className="text-sm text-text-secondary mt-1">{task.description}</p>
            )}
            <div className="flex flex-wrap gap-2 mt-2 text-sm">
              {task.category && (
                <span className="px-2 py-1 bg-primary-lightest/20 text-primary-black dark:text-dark-text rounded-full">
                  {task.category}
                </span>
              )}
              {task.dueDate && (
                <span className="text-text-secondary">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </span>
              )}
              {task.recurrence !== 'none' && (
                <span className="text-text-secondary">
                  Repeats: {RECURRENCE_TYPES[task.recurrence]}
                </span>
              )}
              {task.pomodoroCount > 0 && (
                <span className="text-text-secondary">
                  Pomodoros: {task.pomodoroCount}
                </span>
              )}
            </div>
          </div>
        </div>
        {/* Desktop actions */}
        <div className="hidden md:flex space-x-2">
          <button
            type="button"
            onClick={(e) => handleAction(e, () => onStartPomodoro(task))}
            className="p-2 text-primary hover:bg-primary-lightest/20 dark:hover:bg-primary-lightest/10 rounded-lg transition-all"
            title="Start Pomodoro"
          >
            <FaClock className="pointer-events-none" />
          </button>
          <button
            type="button"
            onClick={(e) => handleAction(e, () => onClone(task))}
            className="p-2 text-primary hover:bg-primary-lightest/20 dark:hover:bg-primary-lightest/10 rounded-lg transition-all"
            title="Clone Task"
          >
            <FaClone className="pointer-events-none" />
          </button>
          <button
            type="button"
            onClick={(e) => handleAction(e, () => onEdit(task))}
            className="p-2 text-primary hover:bg-primary-lightest/20 dark:hover:bg-primary-lightest/10 rounded-lg transition-all"
            title="Edit Task"
          >
            <FaEdit className="pointer-events-none" />
          </button>
          <button
            type="button"
            onClick={(e) => handleAction(e, () => onDelete(task.id))}
            className="p-2 text-primary-dark hover:bg-primary-lightest/20 dark:hover:bg-primary-lightest/10 rounded-lg transition-all"
            title="Delete Task"
          >
            <FaTrash className="pointer-events-none" />
          </button>
        </div>
        {/* Mobile/Tablet three-dots menu */}
        <div className="md:hidden flex items-center">
          <button
            type="button"
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            aria-label="Task actions"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <FaEllipsisV />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-10 min-w-[160px] bg-white dark:bg-dark-card border border-border-color rounded-xl shadow-xl py-2 z-50 flex flex-col gap-1 animate-fade-in">
              <div className="absolute -top-2 right-4 w-3 h-3 bg-white dark:bg-dark-card border-t border-l border-border-color rotate-45 z-10"></div>
              <button onClick={(e) => handleAction(e, () => onStartPomodoro(task))} className="flex items-center gap-2 px-4 py-2 text-primary hover:bg-primary/10 dark:hover:bg-primary/20 rounded-lg transition-all">
                <FaClock className="text-base" /> Pomodoro
              </button>
              <button onClick={(e) => handleAction(e, () => onClone(task))} className="flex items-center gap-2 px-4 py-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-all">
                <FaClone className="text-base" /> Clone
              </button>
              <button onClick={(e) => handleAction(e, () => onEdit(task))} className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-all">
                <FaEdit className="text-base" /> Edit
              </button>
              <button onClick={(e) => handleAction(e, () => onDelete(task.id))} className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all">
                <FaTrash className="text-base" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskItem; 