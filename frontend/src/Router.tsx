import { createBrowserRouter } from "react-router-dom";

import App from "./App";
import CrewCreatePage from "./pages/CrewCreatePage";
import PostCreatePage from "./pages/PostCreatePage";
import RouteCreatePage from "./pages/RouteCreatePage";
import LoginPage from "./pages/LoginPage";

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
    path: "crewcreatepage/",
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
]);
