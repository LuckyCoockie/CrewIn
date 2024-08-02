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
import AlarmPage from "./pages/AlarmPage.tsx";
import SessionSearchPage from "./pages/session/SessionSearchPage.tsx";
import CrewSearchPage from "./pages/crew/CrewSearchPage.tsx";
import CrewGallaryListDetailPage from "./pages/CrewGallaryListDetailPage.tsx";
import FindPasswordPage from "./pages/FindPasswordPage.tsx";
import NoticeCreatePage from "./pages/NoticeCreatePage.tsx";
import { ProfileInfoPage } from "./pages/ProfileInfoPage.tsx";
import ProtectedRoute from "./util/router/ProtectedRoute.tsx";
import UnprotectedRoute from "./util/router/UnprotectedRoute.tsx";
import CrewMemberPage from "./pages/CrewMemberPage.tsx";
import CrewMemberSearchPage from "./pages/CrewMemberSearchPage.tsx";
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
      {
        path: "",
        element: <ProtectedRoute />,
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
              {
                path: "gallary/:crewId",
                element: <CrewGallaryListDetailPage />,
              },
              { path: "detail/:crewId", element: <CrewDetailPage /> },
              { path: "noticecreate", element: <NoticeCreatePage /> },
              { path: "member", element: <CrewMemberPage /> },
              { path: "membersearch", element: <CrewMemberSearchPage /> },
            ],
          },
          { path: "profile", element: <ProfilePage /> },
          { path: "info", element: <ProfileInfoPage /> },
          { path: "course", element: <CourseCreatePage /> },
          { path: "post", element: <PostCreatePage /> },
          { path: "searchuser", element: <SearchUserPage /> },
          { path: "alarm", element: <AlarmPage /> },
        ],
      },
      {
        path: "",
        element: <UnprotectedRoute />,
        children: [
          { path: "login", element: <LoginPage /> },
          { path: "join", element: <JoinPage /> },
          { path: "find-password", element: <FindPasswordPage /> },
        ],
      },
    ],
  },
]);
