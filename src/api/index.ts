import { login, register } from "@/api/auth";
import { profile } from "@/api/profile";
import { utility } from "@/api/utility";

const routes = {
  register,
  login,
  profile,
  utility,
  profile,
} as const;

export default routes;
