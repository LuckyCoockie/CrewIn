import { createBrowserRouter } from "react-router-dom";

import ImageEditor from "./components/Html2canvasTest";
import App from "./App";
import { CreateRoutePage } from "./pages/RouteCreatePage";
import UploadImage from "./pages/UploadImage";
import CrewCreatePage from "./pages/CrewCreatePage";

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
    path: "/maps",
    element: <CreateRoutePage />,
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
