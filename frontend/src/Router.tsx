import { createBrowserRouter } from "react-router-dom";

import App from "./App";
import CrewCreatePage from "./pages/CrewCreatePage";
import PostCreatePage from "./pages/PostCreatePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "crewcreatepage/",
    element: <CrewCreatePage />,
  },
  {
    path: "postcreatepage/",
    element: <PostCreatePage />,
  },
]);