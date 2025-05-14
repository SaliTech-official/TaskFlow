import { FaCheck, FaClock, FaChartLine } from 'react-icons/fa';

const Analytics = ({ tasks }) => {
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

    const completedByCategory = {};
    const pomodorosByTask = {};

    tasks.forEach(task => {
      if (task.completed) {
        completedByPriority[task.priority]++;
        if (task.category) {
          completedByCategory[task.category] = (completedByCategory[task.category] || 0) + 1;
        }
      }
      if (task.pomodoroCount > 0) {
        pomodorosByTask[task.title] = task.pomodoroCount;
      }
    });

    return {
      totalTasks: tasks.length,
      completedTasks: tasks.filter(task => task.completed).length,
      completedByPriority,
      completedByCategory,
      pomodorosByTask,
      totalPomodoros: tasks.reduce((sum, task) => sum + task.pomodoroCount, 0)
    };
  };

  const analytics = getAnalytics();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg">
          <div className="flex items-center space-x-3 mb-4">
            <FaCheck className="text-2xl text-primary" />
            <h3 className="text-xl font-bold">Task Completion</h3>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
            <div
              className="bg-primary h-4 rounded-full transition-all"
              style={{ width: `${getProgress()}%` }}
            />
          </div>
          <p className="text-sm text-primary-dark">
            {analytics.completedTasks} of {analytics.totalTasks} tasks completed
          </p>
        </div>

        <div className="p-6 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg">
          <div className="flex items-center space-x-3 mb-4">
            <FaClock className="text-2xl text-primary" />
            <h3 className="text-xl font-bold">Pomodoro Sessions</h3>
          </div>
          <p className="text-3xl font-bold text-primary">{analytics.totalPomodoros}</p>
          <p className="text-sm text-primary-dark">Total pomodoro sessions completed</p>
        </div>

        <div className="p-6 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg">
          <div className="flex items-center space-x-3 mb-4">
            <FaChartLine className="text-2xl text-primary" />
            <h3 className="text-xl font-bold">Completion by Priority</h3>
          </div>
          <div className="space-y-2">
            {Object.entries(analytics.completedByPriority).map(([priority, count]) => (
              <div key={priority} className="flex justify-between items-center">
                <span className="capitalize">{priority}</span>
                <span className="font-bold">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-4">Completion by Category</h3>
          <div className="space-y-2">
            {Object.entries(analytics.completedByCategory).map(([category, count]) => (
              <div key={category} className="flex justify-between items-center">
                <span>{category}</span>
                <span className="font-bold">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-4">Pomodoros by Task</h3>
          <div className="space-y-2">
            {Object.entries(analytics.pomodorosByTask)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 5)
              .map(([task, count]) => (
                <div key={task} className="flex justify-between items-center">
                  <span className="truncate">{task}</span>
                  <span className="font-bold">{count}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 