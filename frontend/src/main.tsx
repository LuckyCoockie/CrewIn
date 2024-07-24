import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./Router";
import "./index.css";
import 'pretendard/dist/web/static/pretendard.css';
import { Provider } from "react-redux";
import { createStore } from "redux";
import rootReducer from "./modules/index.ts";
import { Flowbite } from "flowbite-react";
import { customTheme } from "./styles/FlowbiteTheme.ts";

const store = createStore(rootReducer);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Flowbite theme={{ theme: customTheme }}>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </Flowbite>
);
