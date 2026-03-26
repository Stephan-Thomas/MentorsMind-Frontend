import React from 'react';
import useTheme from '../../hooks/useTheme';

interface ThemeToggleProps {
  /** Additional CSS classes for the button wrapper */
  className?: string;
  /** Show a text label beside the icon */
  showLabel?: boolean;
}

/**
 * ThemeToggle
 *
 * A fully accessible button that switches between light and dark mode.
 * Drop it into the navbar or the settings page — both are supported.
 *
 * Usage:
 *   <ThemeToggle />
 *   <ThemeToggle showLabel className="ml-4" />
 */
const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', showLabel = false }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={[
        // Layout
        'relative inline-flex items-center gap-2 rounded-full',
        'px-3 py-1.5',
        // Colours — light mode
        'bg-gray-100 text-gray-700 hover:bg-gray-200',
        // Colours — dark mode
        'dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700',
        // Smooth transition between themes
        'transition-colors duration-300 ease-in-out',
        // Focus ring for accessibility
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
        className,
      ].join(' ')}
    >
      {/* Animated icon swap */}
      <span className="relative h-5 w-5 shrink-0" aria-hidden="true">
        {/* Sun icon — visible in dark mode (click → light) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={[
            'absolute inset-0 h-5 w-5 transition-all duration-300',
            isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50',
          ].join(' ')}
        >
          <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.592-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.592z" />
        </svg>

        {/* Moon icon — visible in light mode (click → dark) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={[
            'absolute inset-0 h-5 w-5 transition-all duration-300',
            isDark ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100',
          ].join(' ')}
        >
          <path
            fillRule="evenodd"
            d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
            clipRule="evenodd"
          />
        </svg>
      </span>

      {/* Optional text label */}
      {showLabel && (
        <span className="text-sm font-medium select-none">
          {isDark ? 'Light mode' : 'Dark mode'}
        </span>
      )}
    </button>
  );
};

export default ThemeToggle;