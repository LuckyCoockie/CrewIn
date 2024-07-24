import React from "react";
import { useLocation } from "react-router-dom";
import SessionDetailTemplate from "../components/templates/SessionDetailTemplate";

const SessionDetailPage: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  // detail 페이지 id 확인
  const id = params.get("id");
  console.log(id);

  return <SessionDetailTemplate />;
};

export default SessionDetailPage;
