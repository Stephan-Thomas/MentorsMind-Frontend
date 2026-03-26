import { useThemeContext } from '../contexts/ThemeContext';

/**
 * useTheme
 *
 * Convenience hook that exposes the current theme and helpers.
 *
 * Usage:
 *   const { theme, toggleTheme, isDark } = useTheme();
 */
const useTheme = () => {
  const { theme, toggleTheme, setTheme } = useThemeContext();

  return {
    /** 'light' | 'dark' */
    theme,
    /** true when dark mode is active */
    isDark: theme === 'dark',
    /** Flip between light and dark */
    toggleTheme,
    /** Explicitly set a theme */
    setTheme,
  };
};

export default useTheme;