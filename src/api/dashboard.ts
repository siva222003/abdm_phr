import { PhrHealthRecord } from "@/types/dashboard";
import { API } from "@/utils/request/api";

export const dashboard = {
  getPhrHealthRecord: API<PhrHealthRecord>("GET /phr/health_records/{id}"),
};
