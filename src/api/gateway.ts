import { PatientLink, Provider } from "@/types/gateway";
import { API } from "@/utils/request/api";

export const gateway = {
  listPatientLinks: API<PatientLink[]>("GET /phr/gateway/patient/links"),
  listGovtPrograms: API<Provider[]>("GET /phr/gateway/govt_programs"),
  listProviders: API<Provider[]>("GET /phr/gateway/providers"),
  getProvider: API<Provider>("GET /phr/gateway/provider/{providerId}"),
};
