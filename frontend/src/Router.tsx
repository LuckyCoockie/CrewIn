import { createBrowserRouter } from "react-router-dom";

import App from "./App";
import CrewCreatePage from "./pages/CrewCreatePage";
import PostCreatePage from "./pages/PostCreatePage";
import RouteCreatePage from "./pages/RouteCreatePage";
import LoginPage from "./pages/LoginPage";
import SessionCreatePage from "./pages/SessionCreatePage";

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
]);
