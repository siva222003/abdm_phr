export interface HealthFacility {
  id: string;
  name: string;
  type?: string;
}

export interface CareContext {
  patientReference: string;
  careContextReference: string;
  display: string;
}

export interface LinkedFacility {
  hip: HealthFacility;
  careContexts: CareContext[];
}
