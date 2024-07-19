import React from "react";
import LoginTemplate from "../components/templates/LoginTemplate";
import { LoginApi } from "../apis/api/LoginAPI";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const navigator = useNavigate();

  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    LoginApi({ email: email, password: password })
      .then(() => navigator("/"))
      .catch((error) => {
        throw error;
      });
  };

  return (
    <main>
      <LoginTemplate login={login} />
    </main>
  );
};

export default LoginPage;
