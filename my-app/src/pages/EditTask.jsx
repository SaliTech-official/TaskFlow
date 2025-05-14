import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import TaskForm from '../components/tasks/TaskForm';
import NotificationBar from '../components/common/NotificationBar';

const EditTask = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [notification, setNotification] = useState(null);
  const task = location.state?.task;

  if (!task) {
    navigate('/');
    return null;
  }

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
  };

  const handleSubmit = (taskData) => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const updatedTasks = savedTasks.map(t => 
      t.id === task.id ? { ...t, ...taskData } : t
    );
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    showNotification(`Task "${taskData.title}" updated successfully`, 'success');
    setTimeout(() => {
      navigate('/');
    }, 1000);
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
          <h1 className="text-4xl font-bold text-primary-black dark:text-dark-text mb-4 sm:mb-0">Edit Task</h1>
        </div>

        <div className="form-container max-w-2xl mx-auto">
          <TaskForm 
            initialData={task}
            onSubmit={handleSubmit} 
            onCancel={() => navigate('/')} 
          />
        </div>
      </div>
    </div>
  );
};

export default EditTask; 