import { login, register } from "@/api/auth";
import { consent } from "@/api/consent";
import { gateway } from "@/api/gateway";
import { healthLocker } from "@/api/healthLocker";
import { linkedFacility } from "@/api/linkedFacility";
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
  gateway,
  linkedFacility,
} as const;

export default routes;
