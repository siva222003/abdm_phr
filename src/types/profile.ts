import { GENDERS } from "@/common/constants";

export enum KycStatuses {
  VERIFIED = "VERIFIED",
  PENDING = "PENDING",
}

export type Gender = (typeof GENDERS)[number];
export type BoolString = "true" | "false";
export type KycStatus = KycStatuses;

export interface User {
  abhaAddress: string;
  fullName: string;
  abhaNumber: string;
  status: string;
  kycStatus: KycStatus;
}

interface BasicProfileFields {
  address: string;
  first_name: string;
  middle_name?: string | null;
  last_name?: string | null;
  gender: Gender;
  mobile: string;
  pincode: string;
  email?: string | null;
  district_code: string;
  state_code: string;
  profile_photo?: string | null;
}

export interface PhrEnrolDetails extends BasicProfileFields {
  abha_address: string;
  day_of_birth?: string;
  month_of_birth?: string;
  year_of_birth: string;
  district_name: string;
  state_name: string;
  password: string;
}

export interface PhrProfilePartial extends BasicProfileFields {
  health_id: string | null;
  name: string;
  date_of_birth: string;
  district: string;
  state: string;
}

export interface PhrProfile {
  abhaAddress: string;
  abhaNumber?: string;
  fullName: string;
  firstName: string;
  middleName: string | null;
  lastName: string | null;
  gender: Gender;
  dateOfBirth: string;
  dayOfBirth: string | null;
  monthOfBirth: string | null;
  yearOfBirth: string;
  address: string;
  districtName: string;
  districtCode: string;
  stateName: string;
  stateCode: string;
  pinCode: string;
  mobile: string;
  email: string | null;
  profilePhoto: string | null;
  mobileVerified: BoolString;
  emailVerified: BoolString;
  kycStatus: KycStatus;
  preferredAbhaAddress?: string;
  status: string;
}
