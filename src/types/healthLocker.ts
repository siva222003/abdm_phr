import {
  SubscriptionApproveRequest,
  SubscriptionArtefact,
} from "./subscription";

export interface HealthLockerIdentifier {
  id: string;
  name: string;
}

export interface HealthLockerEndpoint {
  use: "registration" | "data-upload";
  connectionType: "HTTP" | "HTTPS";
  address: string;
}

export interface PatientLockerBasic {
  id: number;
  lockerId: string;
  lockerName: string;
  patientId: string;
  dateCreated: string;
  dateModified: string;
  isActive: boolean;
}

export interface AutoApproval {
  id: number;
  autoApprovalId: string;
  hiuId: string;
  patientId: string;
  dateCreated: string;
  dateModified: string;
  isActive: boolean;
  policy: SubscriptionApproveRequest;
}

export interface PatientLocker {
  lockerId: string;
  lockerName: string;
  dateCreated: string;
  active: boolean;
  subscriptions: SubscriptionArtefact[];
  autoApprovals: AutoApproval[];
}

export interface HealthLockerEndpoints {
  healthLockerEndpoints: HealthLockerEndpoint[];
}

export interface HealthLocker {
  identifier: HealthLockerIdentifier;
  endpoints: HealthLockerEndpoints;
}
