import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaSun, FaMoon } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import TaskItem from '../components/tasks/TaskItem';
import PomodoroTimer from '../components/timer/PomodoroTimer';
import NotificationBar from '../components/common/NotificationBar';

const Tasks = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');
  const [loading, setLoading] = useState(true);
  const [selectedTaskForPomodoro, setSelectedTaskForPomodoro] = useState(null);
  const [notification, setNotification] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
  };

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      setDarkMode(savedMode === 'true');
      document.documentElement.classList.toggle('dark', savedMode === 'true');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setDarkMode(!darkMode);
      document.documentElement.classList.toggle('dark');
      localStorage.setItem('darkMode', (!darkMode).toString());
      setIsAnimating(false);
    }, 300);
  };

  const getNextDueDate = (currentDate, recurrence) => {
    if (!currentDate) return null;
    
    try {
      const date = new Date(currentDate);
      if (isNaN(date.getTime())) return null;

      switch (recurrence) {
        case 'daily':
          date.setDate(date.getDate() + 1);
          break;
        case 'weekly':
          date.setDate(date.getDate() + 7);
          break;
        case 'monthly':
          date.setMonth(date.getMonth() + 1);
          break;
        default:
          return currentDate;
      }
      
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error('Error calculating next due date:', error);
      return null;
    }
  };

  const toggleComplete = (id) => {
    setTasks(prevTasks => {
      return prevTasks.map(task => {
        if (task.id === id) {
          const updatedTask = { ...task, completed: !task.completed };
          
          if (updatedTask.completed && updatedTask.recurrence !== 'none') {
            const nextDueDate = getNextDueDate(updatedTask.dueDate, updatedTask.recurrence);
            if (nextDueDate) {
              const nextTask = {
                ...updatedTask,
                id: Date.now(),
                completed: false,
                dueDate: nextDueDate
              };
              showNotification(`Task "${task.title}" completed and next task created`, 'success');
              return [updatedTask, nextTask];
            }
          }
          showNotification(`Task "${task.title}" ${updatedTask.completed ? 'completed' : 'marked as incomplete'}`, 'success');
          return updatedTask;
        }
        return task;
      }).flat();
    });
  };

  const startPomodoro = (task) => {
    setSelectedTaskForPomodoro(task);
    showNotification(`Starting Pomodoro for "${task.title}"`, 'info');
  };

  const handlePomodoroComplete = () => {
    if (selectedTaskForPomodoro) {
      setTasks(prev => prev.map(task => 
        task.id === selectedTaskForPomodoro.id 
          ? { ...task, pomodoroCount: (task.pomodoroCount || 0) + 1 }
          : task
      ));
      showNotification(`Pomodoro completed for "${selectedTaskForPomodoro.title}"`, 'success');
      setSelectedTaskForPomodoro(null);
    }
  };

  const cloneTask = (task) => {
    const clonedTask = {
      ...task,
      id: Date.now(),
      completed: false,
      title: `${task.title} (Copy)`
    };
    setTasks([...tasks, clonedTask]);
    showNotification(`Task "${task.title}" cloned successfully`, 'success');
  };

  const editTask = (task) => {
    navigate(`/edit/${task.id}`, { state: { task } });
  };

  const deleteTask = (id) => {
    const taskToDelete = tasks.find(task => task.id === id);
    setTasks(tasks.filter(task => task.id !== id));
    showNotification(`Task "${taskToDelete.title}" deleted successfully`, 'success');
  };

  const clearCompleted = () => {
    const completedCount = tasks.filter(task => task.completed).length;
    setTasks(tasks.filter(task => !task.completed));
    showNotification(`${completedCount} completed tasks cleared`, 'success');
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'dueDate') {
      const dateA = a.dueDate ? new Date(a.dueDate) : new Date(0);
      const dateB = b.dueDate ? new Date(b.dueDate) : new Date(0);
      return dateA - dateB;
    }
    if (sortBy === 'priority') {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return b.id - a.id;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  return (
    <div className="min-h-screen bg-bg-color dark:bg-dark-bg transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        {notification && (
          <NotificationBar
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h1 className="text-4xl font-bold text-primary-black dark:text-dark-text mb-4 sm:mb-0">Tasks</h1>
          <div className="flex items-center space-x-4 w-full sm:w-auto">
            <motion.button
              onClick={() => navigate('/add')}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all w-full sm:w-auto"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaPlus />
              <span>Add Task</span>
            </motion.button>
          </div>
        </div>

        {selectedTaskForPomodoro && (
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <PomodoroTimer
              task={selectedTaskForPomodoro}
              onComplete={handlePomodoroComplete}
            />
          </motion.div>
        )}

        <div className="flex flex-col sm:flex-row justify-between mb-4 space-y-4 sm:space-y-0">
          <div className="flex flex-wrap gap-2">
            <motion.button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg border transition-all duration-200
                ${filter === 'all' 
                  ? 'bg-primary border-primary text-white dark:text-white' 
                  : 'bg-white dark:bg-dark-card border-border-color text-primary-black dark:text-dark-text hover:bg-hover-bg dark:hover:bg-dark-hover'
                }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              All
            </motion.button>
            <motion.button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg border transition-all duration-200
                ${filter === 'pending' 
                  ? 'bg-primary border-primary text-white dark:text-white' 
                  : 'bg-white dark:bg-dark-card border-border-color text-primary-black dark:text-dark-text hover:bg-hover-bg dark:hover:bg-dark-hover'
                }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Pending
            </motion.button>
            <motion.button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg border transition-all duration-200
                ${filter === 'completed' 
                  ? 'bg-primary border-primary text-white dark:text-white' 
                  : 'bg-white dark:bg-dark-card border-border-color text-primary-black dark:text-dark-text hover:bg-hover-bg dark:hover:bg-dark-hover'
                }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Completed
            </motion.button>
          </div>
          <motion.select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2 rounded-lg border border-primary-light focus:outline-none focus:ring-2 focus:ring-primary bg-card-bg dark:bg-dark-card text-primary-black dark:text-dark-text w-full sm:w-auto"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <option value="dueDate">Sort by Due Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="created">Sort by Creation Date</option>
          </motion.select>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="loading text-4xl text-primary">Loading...</div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={filter}
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {sortedTasks.map((task) => (
                <motion.div
                  key={task.id}
                  variants={itemVariants}
                  layout
                >
                  <TaskItem
                    task={task}
                    onToggleComplete={toggleComplete}
                    onStartPomodoro={startPomodoro}
                    onClone={cloneTask}
                    onEdit={editTask}
                    onDelete={deleteTask}
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {tasks.some(task => task.completed) && (
          <motion.button
            onClick={clearCompleted}
            className="mt-4 px-4 py-2 bg-primary-dark text-white rounded-lg hover:bg-primary-darker transition-all transform hover:scale-[1.02]"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Clear Completed Tasks
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default Tasks; 