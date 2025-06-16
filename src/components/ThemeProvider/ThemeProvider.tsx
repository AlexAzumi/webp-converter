import { FC, PropsWithChildren } from 'react';

interface ThemeProviderProps extends PropsWithChildren {
  theme: 'light' | 'dark';
}

const ThemeProvider: FC<ThemeProviderProps> = ({ theme, children }) => {
  return <div className={theme}>{children}</div>;
};

export default ThemeProvider;
