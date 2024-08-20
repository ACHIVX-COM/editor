import React from "react";
import { ThemeProvider } from "styled-components";
import { theme } from "./system/theme";
import styles from "./system/styles.css";

export const EditorThemeProvider = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <style>{styles}</style>
      {children}
    </ThemeProvider>
  );
};
