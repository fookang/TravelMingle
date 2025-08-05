import { createContext, useState, useContext, useEffect } from "react";
import { Appearance } from "react-native";
import { Colors } from "../constants/Colors";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // const [colorScheme, setColorScheme] = useState(
  //   Appearance.getColorScheme() ?? "light"
  // );

  // useEffect(() => {
  //   const sub = Appearance.addChangeListener(({ colorScheme }) => {
  //     setColorScheme(colorScheme ?? "light");
  //   });
  //   return () => sub.remove();
  // }, []);

  // const theme = colorScheme === "dark" ? Colors.dark : Colors.light;

  const [colorScheme, setColorScheme] = useState("light");
  const theme = Colors.light;
  return (
    <ThemeContext.Provider
      value={{
        colorScheme,
        setColorScheme,
        theme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
