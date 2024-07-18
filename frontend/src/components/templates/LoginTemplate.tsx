import React from "react";
import LoginTitleOrganism from "../organisms/LoginTitleOrganism";
import LoginOrganism from "../organisms/LoginOrganism";

const LoginTemplate: React.FC = () => {
  return (
    <>
      <div className="mx-auto w-full max-w-[550px] pt-4 pb-10">
        <div className="pt-8 pb-12">
          <LoginTitleOrganism />
        </div>
        <div className="flex items-center justify-center">
          <LoginOrganism />
        </div>
      </div>
    </>
  );
};

export default LoginTemplate;
