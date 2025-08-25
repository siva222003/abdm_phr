import {
  HealthLocker,
  PatientLocker,
  PatientLockerBasic,
} from "@/types/healthLocker";
import { API } from "@/utils/request/api";

export const healthLocker = {
  listPatientLockers: API<PatientLockerBasic[]>(
    "GET /phr/subscription/patient_lockers",
  ),
  getPatientLocker: API<PatientLocker>(
    "GET /phr/subscription/patient_locker/{lockerId}",
  ),
  listHealthLockers: API<HealthLocker[]>("GET /phr/gateway/health_lockers"),
};
