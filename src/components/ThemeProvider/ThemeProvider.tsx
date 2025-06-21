import { FC, PropsWithChildren } from 'react';

interface ThemeProviderProps extends PropsWithChildren {
  theme: 'light' | 'dark';
}

const ThemeProvider: FC<ThemeProviderProps> = ({ theme, children }) => {
  return <div className={`flex flex-col h-full ${theme}`}>{children}</div>;
};

export default ThemeProvider;
