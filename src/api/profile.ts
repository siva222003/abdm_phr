import {
  SendOtpRequest,
  SendOtpResponse,
  VerifyAuthResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
} from "@/types/auth";
import "@/types/profile";
import {
  LogoutRequest,
  LogoutResponse,
  PasswordUpdateRequest,
  PasswordUpdateResponse,
  PhrProfile,
  ProfileSwitchResponse,
  ProfileSwitchVerifyRequest,
  ProfileUpdateRequest,
} from "@/types/profile";
import { API } from "@/utils/request/api";

export const profile = {
  getProfile: API<PhrProfile>("GET /phr/profile/get_profile"),
  abhaCard: API<Blob>("GET /phr/profile/phr_card/"),
  sendOtp: API<SendOtpResponse, SendOtpRequest>(
    "POST /phr/profile/request_otp/",
  ),
  verifyOtp: API<VerifyOtpResponse, VerifyOtpRequest>(
    "POST /phr/profile/verify_otp/",
  ),
  phrProfiles: API<ProfileSwitchResponse>("GET /phr/profile/switch"),
  switchProfileVerify: API<VerifyAuthResponse, ProfileSwitchVerifyRequest>(
    "POST /phr/profile/switch/verify_user",
  ),
  updateProfile: API<void, ProfileUpdateRequest>("POST /phr/profile/update/"),
  updatePassword: API<PasswordUpdateResponse, PasswordUpdateRequest>(
    "POST /phr/profile/reset_password/",
  ),
  logout: API<LogoutResponse, LogoutRequest>("POST /phr/profile/logout/"),
};
