import React from "react";
import { Outlet } from "react-router-dom";

const SessionPage: React.FC = () => {
  return (
    <>
      <Outlet />
    </>
  );
};

export default SessionPage;
