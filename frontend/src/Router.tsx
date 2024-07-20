import { createBrowserRouter } from "react-router-dom";

import App from "./App";
import CrewCreatePage from "./pages/CrewCreatePage";
import PostCreatePage from "./pages/PostCreatePage";
import RouteCreatePage from "./pages/RouteCreatePage";
import LoginPage from "./pages/LoginPage";
import SessionCreatePage from "./pages/SessionCreatePage";
import HomePage from "./pages/HomePage";
import SessionPage from "./pages/SessionPage";
import CrewPage from "./pages/CrewPage";
import ProfilePage from "./pages/ProfilePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "maps/",
    element: <RouteCreatePage />,
  },
  {
    path: "createcrew/",
    element: <CrewCreatePage />,
  },
  {
    path: "postcreatepage/",
    element: <PostCreatePage />,
  },
  {
    path: "login/",
    element: <LoginPage />,
  },
  {
    path: "createsession/",
    element: <SessionCreatePage />,
  },
  {
    path: "createsession/",
    element: <HomePage />,
  },
  {
    path: "createsession/",
    element: <SessionPage />,
  },
  {
    path: "createsession/",
    element: <CrewPage />,
  },
  {
    path: "createsession/",
    element: <ProfilePage />,
  },
]);
