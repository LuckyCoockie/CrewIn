import React from "react";
import LoginTitleOrganism from "../organisms/LoginTitleOrganism";
import LoginOrganism from "../organisms/LoginOrganism";
import LoginMenuOrganism from "../organisms/LoginMenuOrganism";

const LoginTemplate: React.FC = () => {
  return (
    <>
      <div className="mx-auto w-full max-w-[500px] pb-10">
        <div className="pt-16 pb-12">
          <LoginTitleOrganism />
        </div>
        <div className="flex items-center justify-center">
          <LoginOrganism />
        </div>
        <LoginMenuOrganism />
      </div>
    </>
  );
};

export default LoginTemplate;
