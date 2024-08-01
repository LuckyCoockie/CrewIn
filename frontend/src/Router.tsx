import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import CrewCreatePage from "./pages/CrewCreatePage";
import PostCreatePage from "./pages/PostCreatePage";
import CourseCreatePage from "./pages/CourseCreatePage";
import LoginPage from "./pages/LoginPage";
import SessionCreatePage from "./pages/SessionCreatePage";
import SessionPage from "./pages/SessionPage";
import CrewPage from "./pages/CrewPage";
import ProfilePage from "./pages/ProfilePage";
import JoinPage from "./pages/JoinPage";
import SessionDetailPage from "./pages/SessionDetailPage";
import PostMainPage from "./pages/PostMainPage";
import SearchUserPage from "./pages/SearchUserPage";
import CrewDetailPage from "./pages/CrewDetailPage";
import AlarmPage from "./pages/AlarmPage";
import SessionSearchPage from "./pages/SessionSearchPage";
import CrewSearchPage from "./pages/CrewSearchPage";
import FindPasswordPage from "./pages/FindPasswordPage";
import NoticeCreatePage from "./pages/NoticeCreatePage";
import { ProfileInfoPage } from "./pages/ProfileInfoPage";
import MemberSearchPage from "./pages/MemberSearchPage";
import { getMyCrews } from "./apis/api/mycrew";

const loader = async () => {
  const response = await getMyCrews();
  if (response.crews.length > 0) {
    return <Navigate to={`/crew/detail/${response.crews[0].crewId}`} />;
  } else {
    return <CrewSearchPage />;
  }
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "home", element: <PostMainPage /> },
      {
        path: "session",
        element: <SessionPage />,
        children: [
          { path: "", element: <SessionSearchPage /> },
          { path: "create", element: <SessionCreatePage /> },
          { path: "detail/:sessionId", element: <SessionDetailPage /> },
        ],
      },
      {
        path: "crew",
        element: <CrewPage />,
        children: [
          { path: "", element: <CrewSearchPage />, loader }, // 조건부 로더 설정
          { path: "create", element: <CrewCreatePage /> },
          { path: "detail/:crewId", element: <CrewDetailPage /> },
          { path: "noticecreate", element: <NoticeCreatePage /> },
          { path: "membersearch", element: <MemberSearchPage /> },
        ],
      },
      { path: "profile", element: <ProfilePage /> },
      { path: "info", element: <ProfileInfoPage /> },
      { path: "course", element: <CourseCreatePage /> },
      { path: "post", element: <PostCreatePage /> },
      { path: "searchuser", element: <SearchUserPage /> },
      { path: "alarm", element: <AlarmPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "join", element: <JoinPage /> },
      { path: "find-password", element: <FindPasswordPage /> },
    ],
  },
]);
