import { useState, useEffect } from 'react';
import { FaSun, FaMoon, FaPlus, FaTrash, FaCheck, FaEdit, FaClone, FaClock, FaChartBar } from 'react-icons/fa';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const PRIORITY_COLORS = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800'
};

const RECURRENCE_TYPES = {
  none: 'None',
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly'
};

const SortableTask = ({ task, index, onToggleComplete, onStartPomodoro, onClone, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`task-card p-4 rounded-lg border bg-white/90 backdrop-blur-sm ${
        task.completed ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onToggleComplete(task.id)}
            className={`p-2 rounded-full transition-all ${
              task.completed 
                ? 'bg-primary text-white task-complete' 
                : 'bg-primary-lightest text-transparent hover:bg-primary-light'
            }`}
          >
            <FaCheck className={task.completed ? 'text-white' : 'text-transparent'} />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className={`font-bold text-primary-black ${task.completed ? 'line-through' : ''}`}>
                {task.title}
              </h3>
              <span className={`px-2 py-1 rounded-full text-sm ${PRIORITY_COLORS[task.priority]}`}>
                {task.priority}
              </span>
            </div>
            {task.description && (
              <p className="text-sm text-primary-dark">{task.description}</p>
            )}
            <div className="flex space-x-4 mt-2 text-sm">
              {task.category && (
                <span className="px-2 py-1 bg-primary-lightest text-primary-black rounded-full">
                  {task.category}
                </span>
              )}
              {task.dueDate && (
                <span className="text-primary-dark">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </span>
              )}
              {task.recurrence !== 'none' && (
                <span className="text-primary-dark">
                  Repeats: {RECURRENCE_TYPES[task.recurrence]}
                </span>
              )}
              {task.pomodoroCount > 0 && (
                <span className="text-primary-dark">
                  Pomodoros: {task.pomodoroCount}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onStartPomodoro(task)}
            className="p-2 text-primary hover:bg-primary-lightest rounded-lg transition-all"
            title="Start Pomodoro"
          >
            <FaClock />
          </button>
          <button
            onClick={() => onClone(task)}
            className="p-2 text-primary hover:bg-primary-lightest rounded-lg transition-all"
            title="Clone Task"
          >
            <FaClone />
          </button>
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-primary hover:bg-primary-lightest rounded-lg transition-all"
            title="Edit Task"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="delete-button p-2 text-primary-dark hover:bg-primary-lightest rounded-lg transition-all"
            title="Delete Task"
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );
};

const Todo = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    category: '',
    dueDate: '',
    priority: 'medium',
    recurrence: 'none',
    completed: false,
    pomodoroCount: 0
  });
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60); // 25 minutes in seconds
  const [isPomodoroActive, setIsPomodoroActive] = useState(false);
  const [selectedTaskForPomodoro, setSelectedTaskForPomodoro] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px de movimiento antes de activar el arrastre
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
    let timer;
    if (isPomodoroActive && pomodoroTime > 0) {
      timer = setInterval(() => {
        setPomodoroTime(prev => prev - 1);
      }, 1000);
    } else if (pomodoroTime === 0) {
      setIsPomodoroActive(false);
      if (selectedTaskForPomodoro) {
        setTasks(prev => prev.map(task => 
          task.id === selectedTaskForPomodoro.id 
            ? { ...task, pomodoroCount: task.pomodoroCount + 1 }
            : task
        ));
      }
    }
    return () => clearInterval(timer);
  }, [isPomodoroActive, pomodoroTime, selectedTaskForPomodoro]);

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    
    if (editingTask !== null) {
      setTasks(tasks.map(task => 
        task.id === editingTask.id ? { ...newTask, id: task.id } : task
      ));
      setEditingTask(null);
    } else {
      setTasks([...tasks, { ...newTask, id: Date.now() }]);
    }
    setNewTask({
      title: '',
      description: '',
      category: '',
      dueDate: '',
      priority: 'medium',
      recurrence: 'none',
      completed: false,
      pomodoroCount: 0
    });
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const updatedTask = { ...task, completed: !task.completed };
        if (updatedTask.completed && updatedTask.recurrence !== 'none') {
          // Create a new task for the next occurrence
          const nextTask = {
            ...updatedTask,
            id: Date.now(),
            completed: false,
            dueDate: getNextDueDate(updatedTask.dueDate, updatedTask.recurrence)
          };
          return [updatedTask, nextTask];
        }
        return updatedTask;
      }
      return task;
    }).flat());
  };

  const getNextDueDate = (currentDate, recurrence) => {
    const date = new Date(currentDate);
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
  };

  const cloneTask = (task) => {
    const clonedTask = {
      ...task,
      id: Date.now(),
      completed: false,
      title: `${task.title} (Copy)`
    };
    setTasks([...tasks, clonedTask]);
  };

  const startPomodoro = (task) => {
    setSelectedTaskForPomodoro(task);
    setPomodoroTime(25 * 60);
    setIsPomodoroActive(true);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over?.id) {
      setTasks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleDragStart = (event) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) {
      document.body.style.cursor = 'grabbing';
    }
  };

  const handleDragCancel = () => {
    document.body.style.cursor = '';
  };

  const getProgress = () => {
    const completed = tasks.filter(task => task.completed).length;
    return (completed / tasks.length) * 100 || 0;
  };

  const getAnalytics = () => {
    const completedByPriority = {
      low: 0,
      medium: 0,
      high: 0
    };

    tasks.forEach(task => {
      if (task.completed) {
        completedByPriority[task.priority]++;
      }
    });

    return {
      totalTasks: tasks.length,
      completedTasks: tasks.filter(task => task.completed).length,
      completedByPriority,
      totalPomodoros: tasks.reduce((sum, task) => sum + task.pomodoroCount, 0)
    };
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'dueDate') {
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    if (sortBy === 'priority') {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return b.id - a.id;
  });

  const analytics = getAnalytics();

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-primary-black">Todo List</h1>
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="p-2 text-primary hover:bg-primary-lightest rounded-lg transition-all"
          >
            <FaChartBar />
          </button>
        </div>

        {showAnalytics && (
          <div className="mb-8 p-6 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Analytics</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Task Completion</h3>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-primary h-4 rounded-full transition-all"
                    style={{ width: `${getProgress()}%` }}
                  />
                </div>
                <p className="text-sm mt-2">
                  {analytics.completedTasks} of {analytics.totalTasks} tasks completed
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Pomodoro Sessions</h3>
                <p className="text-2xl font-bold">{analytics.totalPomodoros}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={addTask} className="form-container mb-8 space-y-4 p-6 rounded-lg">
          <input
            type="text"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            placeholder="Task Title"
            className="w-full p-3 rounded-lg border border-primary-light focus:outline-none focus:ring-2 focus:ring-primary bg-white/80"
          />
          <input
            type="text"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            placeholder="Description (optional)"
            className="w-full p-3 rounded-lg border border-primary-light focus:outline-none focus:ring-2 focus:ring-primary bg-white/80"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              value={newTask.category}
              onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
              placeholder="Category"
              className="p-3 rounded-lg border border-primary-light focus:outline-none focus:ring-2 focus:ring-primary bg-white/80"
            />
            <input
              type="date"
              value={newTask.dueDate}
              onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
              className="p-3 rounded-lg border border-primary-light focus:outline-none focus:ring-2 focus:ring-primary bg-white/80"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <select
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
              className="p-3 rounded-lg border border-primary-light focus:outline-none focus:ring-2 focus:ring-primary bg-white/80"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <select
              value={newTask.recurrence}
              onChange={(e) => setNewTask({ ...newTask, recurrence: e.target.value })}
              className="p-3 rounded-lg border border-primary-light focus:outline-none focus:ring-2 focus:ring-primary bg-white/80"
            >
              {Object.entries(RECURRENCE_TYPES).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white p-3 rounded-lg hover:bg-primary-dark transition-all transform hover:scale-[1.02]"
          >
            {editingTask ? 'Edit Task' : 'Add Task'}
          </button>
        </form>

        <div className="flex justify-between mb-4">
          <div className="space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`filter-button px-4 py-2 rounded-lg transition-all ${
                filter === 'all' 
                  ? 'bg-primary text-white' 
                  : 'bg-white text-primary-black hover:bg-primary-lightest'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`filter-button px-4 py-2 rounded-lg transition-all ${
                filter === 'pending' 
                  ? 'bg-primary text-white' 
                  : 'bg-white text-primary-black hover:bg-primary-lightest'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`filter-button px-4 py-2 rounded-lg transition-all ${
                filter === 'completed' 
                  ? 'bg-primary text-white' 
                  : 'bg-white text-primary-black hover:bg-primary-lightest'
              }`}
            >
              Completed
            </button>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2 rounded-lg border border-primary-light focus:outline-none focus:ring-2 focus:ring-primary bg-white/80"
          >
            <option value="dueDate">Sort by Due Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="created">Sort by Creation Date</option>
          </select>
        </div>

        {isPomodoroActive && (
          <div className="mb-4 p-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-bold mb-2">Pomodoro Timer</h3>
            <p className="text-3xl font-mono mb-2">{formatTime(pomodoroTime)}</p>
            <button
              onClick={() => setIsPomodoroActive(false)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all"
            >
              Stop Timer
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="loading text-4xl text-primary">Loading...</div>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
            onDragCancel={handleDragCancel}
          >
            <SortableContext
              items={sortedTasks.map(task => task.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {sortedTasks.map((task, index) => (
                  <SortableTask
                    key={task.id}
                    task={task}
                    index={index}
                    onToggleComplete={toggleComplete}
                    onStartPomodoro={startPomodoro}
                    onClone={cloneTask}
                    onEdit={editTask}
                    onDelete={deleteTask}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {tasks.some(task => task.completed) && (
          <button
            onClick={clearCompleted}
            className="mt-4 px-4 py-2 bg-primary-dark text-white rounded-lg hover:bg-primary-darker transition-all transform hover:scale-[1.02]"
          >
            Clear Completed Tasks
          </button>
        )}
      </div>
    </div>
  );
};

export default Todo;