import { login, register } from "@/api/auth";
import { consent } from "@/api/consent";
import { healthLocker } from "@/api/healthLocker";
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
  healthLocker,
} as const;

export default routes;
