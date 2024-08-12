import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./Router";
import "./index.css";
import "pretendard/dist/web/static/pretendard.css";
import { Provider } from "react-redux";
import store from "./modules/index.ts";
import { Flowbite } from "flowbite-react";
import { customTheme } from "./styles/FlowbiteTheme.ts";
import { QueryClient, QueryClientProvider } from "react-query";
import PullToRefresh from "pulltorefreshjs";

const standalone = window.matchMedia("(display-mode: standalone)").matches;

if (standalone) {
  PullToRefresh.init({
    onRefresh() {
      window.location.reload();
    },
  });
}

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Flowbite theme={{ theme: customTheme }}>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </QueryClientProvider>
  </Flowbite>
);
