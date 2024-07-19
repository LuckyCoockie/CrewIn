import React from "react";
import { Outlet } from "react-router-dom";

const App: React.FC = () => {
  return (
      <div className="App">
        <h1>Crew-In</h1>
        <Outlet />
      </div>
  );
};

export default App;
