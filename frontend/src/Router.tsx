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
import CrewDetailPage from "./pages/CrewDetailPage";

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
          { path: "create", element: <SessionCreatePage /> },
          { path: "detail", element: <SessionDetailPage /> },
        ],
      },
      {
        path: "crew",
        element: <CrewPage />,
        children: [
          { path: "create", element: <CrewCreatePage /> },
          { path: "detail", element: <CrewDetailPage /> },
        ],
      },
      { path: "profile", element: <ProfilePage /> },
      { path: "course", element: <CourseCreatePage /> },
      { path: "createcrew", element: <CrewCreatePage /> },
      { path: "post", element: <PostCreatePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "join", element: <JoinPage /> },
    ],
  },
]);
