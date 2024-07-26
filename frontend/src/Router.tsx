import { createBrowserRouter } from "react-router-dom";
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
import CrewSearchPage from "./pages/CrewSearchPage.tsx";
import SessionListPage from "./pages/session/SessionListPage.tsx";

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
          {
            path: "",
            element: <SessionSearchPage />,
            children: [{ path: "search", element: <SessionListPage /> }],
          },
          { path: "create", element: <SessionCreatePage /> },
          { path: "detail", element: <SessionDetailPage /> },
        ],
      },
      {
        path: "crew",
        element: <CrewPage />,
        children: [
          { path: "", element: <CrewSearchPage /> },
          { path: "create", element: <CrewCreatePage /> },
          { path: "detail", element: <CrewDetailPage /> },
        ],
      },
      { path: "profile", element: <ProfilePage /> },
      { path: "course", element: <CourseCreatePage /> },
      { path: "createcrew", element: <CrewCreatePage /> },
      { path: "post", element: <PostCreatePage /> },
      { path: "searchuser", element: <SearchUserPage /> },
      { path: "alarm", element: <AlarmPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "join", element: <JoinPage /> },
    ],
  },
]);
