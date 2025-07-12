import { login, register } from "@/api/auth";
import { consent } from "@/api/consent";
import { profile } from "@/api/profile";
import { subscription } from "@/api/subscription";
import { utility } from "@/api/utility";

const routes = {
  register,
  login,
  profile,
  utility,
  consent,
  subscription,
} as const;

export default routes;
