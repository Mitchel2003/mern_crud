import { ThemeContext, Theme as TypeTheme } from '@/interfaces/context.interface';
import { createContext, useContext, useState, useEffect } from 'react';
import { Props } from '@/interfaces/props.interface';

const Theme = createContext<ThemeContext>(undefined)

export const useThemeContext = () => {
  const context = useContext(Theme)
  if (!context) throw new Error('Error to try use themeContext')
  return context
}

export const ThemeProvider = ({ children }: Props) => {
  const [theme, setTheme] = useState<TypeTheme>(useStorage());

  useEffect(() => { setStorage(theme) }, [theme]);

  const toggleTheme = () => setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light')

  return (
    <Theme.Provider value={{ theme, toggleTheme }}>
      {children}
    </Theme.Provider>
  )
}

function useStorage() {
  const savedTheme = localStorage.getItem('theme');
  return (savedTheme || 'light') as TypeTheme;
}
function setStorage(theme: TypeTheme) {
  localStorage.setItem('theme', theme);
  document.documentElement.classList.toggle('dark', theme === 'dark');
}