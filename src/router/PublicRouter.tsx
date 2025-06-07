import { useRoutes } from "raviger";

import { AppRoutes } from "./types";

const Routes: AppRoutes = {
  "/login": () => <h1>Login Page</h1>,
};

export default function PublicRouter() {
  const pages = useRoutes(Routes) || <h1>404 Not Found</h1>;

  return <>{pages}</>;
}
