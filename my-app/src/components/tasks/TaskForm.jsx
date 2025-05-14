import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RECURRENCE_TYPES = {
  none: 'None',
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly'
};

const TaskForm = ({ initialData, onSubmit, onCancel }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    dueDate: '',
    priority: 'medium',
    recurrence: 'none',
    completed: false,
    pomodoroCount: 0
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-dark-card border border-border-color rounded-xl p-6 shadow">
      <div className="mb-5 w-full">
        <label htmlFor="title" className="block mb-2 font-medium text-gray-700 dark:text-gray-200 text-sm">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-border-color rounded-xl bg-white dark:bg-dark-card text-gray-900 dark:text-gray-100 transition text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary"
          required
          placeholder="Enter task title"
        />
      </div>

      <div className="mb-5 w-full">
        <label htmlFor="description" className="block mb-2 font-medium text-gray-700 dark:text-gray-200 text-sm">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-border-color rounded-xl bg-white dark:bg-dark-card text-gray-900 dark:text-gray-100 transition text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary min-h-[100px]"
          placeholder="Enter task description"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="mb-5 w-full">
          <label htmlFor="category" className="block mb-2 font-medium text-gray-700 dark:text-gray-200 text-sm">Category</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-border-color rounded-xl bg-white dark:bg-dark-card text-gray-900 dark:text-gray-100 transition text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary"
            placeholder="Enter category"
          />
        </div>

        <div className="mb-5 w-full">
          <label htmlFor="dueDate" className="block mb-2 font-medium text-gray-700 dark:text-gray-200 text-sm">Due Date</label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-border-color rounded-xl bg-white dark:bg-dark-card text-gray-900 dark:text-gray-100 transition text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="mb-5 w-full">
          <label htmlFor="priority" className="block mb-2 font-medium text-gray-700 dark:text-gray-200 text-sm">Priority</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-border-color rounded-xl bg-white dark:bg-dark-card text-gray-900 dark:text-gray-100 transition text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="mb-5 w-full">
          <label htmlFor="recurrence" className="block mb-2 font-medium text-gray-700 dark:text-gray-200 text-sm">Recurrence</label>
          <select
            id="recurrence"
            name="recurrence"
            value={formData.recurrence}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-border-color rounded-xl bg-white dark:bg-dark-card text-gray-900 dark:text-gray-100 transition text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary"
          >
            {Object.entries(RECURRENCE_TYPES).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row-reverse justify-end space-y-4 sm:space-y-0 sm:space-x-4">
        <button
          type="submit"
          className="px-5 py-2 rounded-xl font-medium transition shadow text-center bg-primary text-white hover:bg-primary-dark w-full sm:w-auto"
        >
          {initialData ? 'Update Task' : 'Add Task'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 rounded-xl font-medium transition shadow text-center bg-primary-light text-white hover:bg-primary-darker w-full sm:w-auto"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default TaskForm; 