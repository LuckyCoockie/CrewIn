import React from "react";
import { Link } from "react-router-dom";

const LoginMenuOrganism: React.FC = () => {
  return (
    <div className="flex justify-center items-center text-sub font-extralight tracking-tight justify-evenly text-sm">
      <Link to="/find-password" className="hover:underline font-normal">
        비밀번호 찾기
      </Link>
      <Link to="/agreement" className="hover:underline font-normal">
        회원가입
      </Link>
    </div>
  );
};

export default LoginMenuOrganism;
