import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./Router";
import "./index.css";

import { Provider } from "react-redux";
import { createStore } from "redux";
import rootReducer from "./modules/index.ts";

const store = createStore(rootReducer);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
