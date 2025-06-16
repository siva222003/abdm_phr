import { API } from "@/utils/request/api";

export const utility = {
  states: API<{ state_name: string; state_code: number }[]>(
    "GET /utility/states/",
    true,
  ),
  districts: API<{ district_name: string; district_code: number }[]>(
    "GET /utility/states/{stateCode}/districts/",
    true,
  ),
};
