import { createBrowserRouter } from "react-router-dom";

import ImageEditor from "./components/Html2canvasTest";
import App from "./App";
import UploadImage from "./components/pages/UploadImage";
import CrewCreatePage from "./components/pages/CrewCreatePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        path: "",
        element: <ImageEditor />,
      },
    ],
  },
  {
    path: "uploadImage/",
    element: <UploadImage />,
  },
  {
    path: "crewcreatepage/",
    element: <CrewCreatePage />,
  },
]);
