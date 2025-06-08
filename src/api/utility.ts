import { API } from "@/utils/request/api";

export const utility = {
  states: API<{ state_name: string; state_code: number }[]>(
    "GET /api/abdm/v3/utility/states/",
  ),
  districts: API<{ district_name: string; district_code: number }[]>(
    "GET /api/abdm/v3/utility/states/{stateCode}/districts/",
  ),
};
