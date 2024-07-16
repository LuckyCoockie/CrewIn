import { createBrowserRouter } from "react-router-dom";

import ImageEditor from "./components/Html2canvasTest";
import App from "./App";
import { CreateRoutePage } from "./pages/CreateRoutePage";

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
]);
