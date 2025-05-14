import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTasks, FaPlus, FaChartBar, FaSun, FaMoon, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Add state for closing menu on backdrop click
  const handleCloseMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className="bg-card-bg dark:bg-dark-card shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 w-full">
            {/* Site name always on the left */}
            <Link to="/" className="text-2xl font-bold text-primary dark:text-primary-light flex-shrink-0">
              TaskFlow
            </Link>
            {/* Desktop Menu (center/right on large screens) */}
            <div className="hidden lg:flex items-center space-x-4">
              <Link
                to="/"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  isActive('/')
                    ? 'bg-primary text-white'
                    : 'text-primary-black dark:text-dark-text hover:bg-hover-bg dark:hover:bg-dark-hover'
                }`}
              >
                <FaTasks />
                <span>Tasks</span>
              </Link>
              <Link
                to="/add"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  isActive('/add')
                    ? 'bg-primary text-white'
                    : 'text-primary-black dark:text-dark-text hover:bg-hover-bg dark:hover:bg-dark-hover'
                }`}
              >
                <FaPlus />
                <span>Add Task</span>
              </Link>
              <Link
                to="/analytics"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  isActive('/analytics')
                    ? 'bg-primary text-white'
                    : 'text-primary-black dark:text-dark-text hover:bg-hover-bg dark:hover:bg-dark-hover'
                }`}
              >
                <FaChartBar />
                <span>Analytics</span>
              </Link>
              <button
                onClick={toggleDarkMode}
                className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
                  darkMode ? 'bg-primary-dark' : 'bg-primary-light'
                }`}
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                <div
                  className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all duration-300 flex items-center justify-center ${
                    darkMode ? 'left-7' : 'left-1'
                  } ${isAnimating ? 'animate-bounce' : ''}`}
                >
                  {darkMode ? (
                    <FaSun className="text-yellow-500 text-sm" />
                  ) : (
                    <FaMoon className="text-primary-dark text-sm" />
                  )}
                </div>
              </button>
            </div>
            {/* Hamburger always on the far right on mobile/tablet */}
            <button
              className="lg:hidden flex items-center text-2xl p-2 ml-2 focus:outline-none justify-center"
              style={{ minWidth: '44px', minHeight: '44px' }}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </nav>
      {/* Mobile/Tablet Sidebar Menu - OUTSIDE nav/container for correct fixed positioning */}
      {menuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-40"
            onClick={handleCloseMenu}
            aria-label="Close menu backdrop"
          />
          {/* Sidebar */}
          <div
            className="fixed top-0 right-0 h-full w-72 max-w-full bg-card-bg dark:bg-dark-card shadow-2xl z-50 flex flex-col p-0 animate-slide-in rounded-l-2xl border-l border-border-color"
            style={{ minWidth: '260px' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border-color">
              <span className="text-xl font-bold text-primary dark:text-primary-light tracking-tight">TaskFlow</span>
              <button
                className="text-2xl p-2 rounded-full hover:bg-hover-bg dark:hover:bg-dark-hover transition-colors focus:outline-none"
                onClick={handleCloseMenu}
                aria-label="Close menu"
              >
                <FaTimes />
              </button>
            </div>
            {/* Navigation */}
            <nav className="flex-1 flex flex-col gap-1 px-4 py-4">
              <Link
                to="/"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-base transition-all mb-1 ${
                  isActive('/')
                    ? 'bg-primary text-white shadow-md' : 'text-primary-black dark:text-dark-text hover:bg-hover-bg dark:hover:bg-dark-hover'
                }`}
                onClick={handleCloseMenu}
              >
                <FaTasks className="text-lg text-primary dark:text-primary-light" />
                <span>Tasks</span>
              </Link>
              <Link
                to="/add"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-base transition-all mb-1 ${
                  isActive('/add')
                    ? 'bg-primary text-white shadow-md' : 'text-primary-black dark:text-dark-text hover:bg-hover-bg dark:hover:bg-dark-hover'
                }`}
                onClick={handleCloseMenu}
              >
                <FaPlus className="text-lg text-green-600 dark:text-green-400" />
                <span>Add Task</span>
              </Link>
              <Link
                to="/analytics"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-base transition-all mb-1 ${
                  isActive('/analytics')
                    ? 'bg-primary text-white shadow-md' : 'text-primary-black dark:text-dark-text hover:bg-hover-bg dark:hover:bg-dark-hover'
                }`}
                onClick={handleCloseMenu}
              >
                <FaChartBar className="text-lg text-blue-600 dark:text-blue-400" />
                <span>Analytics</span>
              </Link>
              <div className="my-3 border-t border-border-color" />
              <button
                onClick={() => { toggleDarkMode(); handleCloseMenu(); }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-base transition-all mt-1 ${
                  darkMode ? 'bg-primary-dark text-white' : 'bg-primary-light text-white'
                }`}
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {darkMode ? (
                  <FaSun className="text-lg text-yellow-400" />
                ) : (
                  <FaMoon className="text-lg text-primary-dark" />
                )}
                <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
            </nav>
            {/* Footer (optional) */}
            <div className="px-6 py-3 text-xs text-text-secondary text-center border-t border-border-color">
              &copy; {new Date().getFullYear()} TaskFlow
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar; 