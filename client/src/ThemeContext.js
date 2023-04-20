import { createContext, useState } from "react";
import { lightTheme, darkTheme } from "./themes";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const currentTheme = theme === "light" ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ toggleTheme, theme: currentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
