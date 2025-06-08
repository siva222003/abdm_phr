import { useRoutes } from "raviger";

import RegisterAbha from "@/pages/auth/Register";

import { AppRoutes } from "./types";

const Routes: AppRoutes = {
  "/login": () => <RegisterAbha />,
};

export default function PublicRouter() {
  const pages = useRoutes(Routes) || <h1>404 Not Found</h1>;

  return <>{pages}</>;
}
