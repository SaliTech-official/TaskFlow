import { useState, useEffect } from 'react';
import { FaPlay, FaPause, FaStop } from 'react-icons/fa';

const PomodoroTimer = ({ task, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let timer;

    if (isActive && !isPaused && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      onComplete();
    }

    return () => clearInterval(timer);
  }, [isActive, isPaused, timeLeft, onComplete]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleStop = () => {
    setIsActive(false);
    setTimeLeft(25 * 60);
  };

  return (
    <div className="p-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg">
      <div className="text-center">
        <h3 className="text-xl font-bold mb-2">Pomodoro Timer</h3>
        {task && (
          <p className="text-primary-dark mb-4">
            Current Task: {task.title}
          </p>
        )}
        <div className="text-4xl font-mono mb-4">{formatTime(timeLeft)}</div>
        <div className="flex justify-center space-x-4">
          {!isActive ? (
            <button
              onClick={handleStart}
              className="p-3 bg-primary text-white rounded-full hover:bg-primary-dark transition-all"
              title="Start Timer"
            >
              <FaPlay />
            </button>
          ) : isPaused ? (
            <button
              onClick={handleResume}
              className="p-3 bg-primary text-white rounded-full hover:bg-primary-dark transition-all"
              title="Resume Timer"
            >
              <FaPlay />
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="p-3 bg-primary text-white rounded-full hover:bg-primary-dark transition-all"
              title="Pause Timer"
            >
              <FaPause />
            </button>
          )}
          <button
            onClick={handleStop}
            className="p-3 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-all"
            title="Stop Timer"
          >
            <FaStop />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer; 