import { useState, useEffect } from 'react';
import { FaTasks, FaCheckCircle, FaClock, FaChartLine } from 'react-icons/fa';

const Analytics = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
    setLoading(false);
  }, []);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const highPriorityTasks = tasks.filter(task => task.priority === 'high').length;
  const mediumPriorityTasks = tasks.filter(task => task.priority === 'medium').length;
  const lowPriorityTasks = tasks.filter(task => task.priority === 'low').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-color dark:bg-dark-bg transition-colors duration-300">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="loading text-4xl text-primary">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-color dark:bg-dark-bg transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h1 className="text-4xl font-bold text-primary-black dark:text-dark-text mb-4 sm:mb-0">Analytics Dashboard</h1>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="analytics-container transform hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <FaTasks className="text-2xl text-blue-600 dark:text-blue-300" />
                </div>
                <div>
                  <div className="analytics-label">Total Tasks</div>
                  <div className="analytics-value">{totalTasks}</div>
                </div>
              </div>
            </div>

            <div className="analytics-container transform hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                  <FaCheckCircle className="text-2xl text-green-600 dark:text-green-300" />
                </div>
                <div>
                  <div className="analytics-label">Completed Tasks</div>
                  <div className="analytics-value">{completedTasks}</div>
                </div>
              </div>
            </div>

            <div className="analytics-container transform hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                  <FaClock className="text-2xl text-yellow-600 dark:text-yellow-300" />
                </div>
                <div>
                  <div className="analytics-label">Pending Tasks</div>
                  <div className="analytics-value">{pendingTasks}</div>
                </div>
              </div>
            </div>

            <div className="analytics-container transform hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <FaChartLine className="text-2xl text-purple-600 dark:text-purple-300" />
                </div>
                <div>
                  <div className="analytics-label">Completion Rate</div>
                  <div className="analytics-value">{completionRate}%</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="analytics-container">
              <h2 className="text-xl font-semibold mb-4 text-primary-black dark:text-dark-text">Task Completion Progress</h2>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                <div
                  className="bg-primary h-4 rounded-full transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {completionRate}% of tasks completed
              </div>
            </div>

            <div className="analytics-container">
              <h2 className="text-xl font-semibold mb-4 text-primary-black dark:text-dark-text">Priority Distribution</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-red-600 dark:text-red-400">High Priority</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{highPriorityTasks} tasks</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: `${(highPriorityTasks / totalTasks) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Medium Priority</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{mediumPriorityTasks} tasks</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{ width: `${(mediumPriorityTasks / totalTasks) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">Low Priority</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{lowPriorityTasks} tasks</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(lowPriorityTasks / totalTasks) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;