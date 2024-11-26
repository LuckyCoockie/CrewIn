import React from "react";
import { Outlet } from "react-router-dom";
import { ThemeProvider } from "./util/theme/useTheme";

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Outlet />
    </ThemeProvider>
  );
};

export default App;
