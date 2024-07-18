import { createBrowserRouter } from "react-router-dom";

import App from "./App";
import UploadImage from "./components/pages/UploadImage";
import CrewCreatePage from "./components/pages/CrewCreatePage";
import PostCreatePage from "./components/pages/PostCreatePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "uploadImage/",
    element: <UploadImage />,
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