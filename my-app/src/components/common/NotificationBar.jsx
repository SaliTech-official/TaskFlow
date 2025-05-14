import { useEffect } from 'react';
import { FaCheck, FaInfo, FaExclamationTriangle, FaTimes } from 'react-icons/fa';

const NotificationBar = ({ message, type = 'info', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheck className="text-white" />;
      case 'error':
        return <FaExclamationTriangle className="text-white" />;
      default:
        return <FaInfo className="text-white" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-primary';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-primary';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`${getBackgroundColor()} text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3 min-w-[300px]`}>
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="flex-grow">
          {message}
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 hover:opacity-80 transition-opacity"
        >
          <FaTimes className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default NotificationBar; 