import { createBrowserRouter } from "react-router-dom";

// import ImageEditor from "./components/Html2canvasTest";
import App from "./App";
import { RouteCreatePage } from "./pages/RouteCreatePage";
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
        element: <RouteCreatePage />,
      },
    ],
  },
  {
    path: "/maps",
    element: <RouteCreatePage />,
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
