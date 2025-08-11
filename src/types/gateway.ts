export interface HealthFacility {
  id: string;
  name: string;
  type?: string;
}

export interface PatientCareContext {
  patientReference: string;
  careContextReference: string;
  display: string;
}

export interface PatientLink {
  hip: HealthFacility;
  careContexts: PatientCareContext[];
}

export interface Provider {
  identifier: {
    name: string;
    id: string;
  };
  facilityType: string[];
}
