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
  PhrProfile,
  ProfileSwitchResponse,
  ProfileSwitchVerifyRequest,
  UpdatePasswordResponse,
} from "@/types/profile";
import { API } from "@/utils/request/api";

export const profile = {
  getProfile: API<PhrProfile>("GET /phr/profile/get_profile"),
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
  updatePassword: API<UpdatePasswordResponse, UpdatePasswordResponse>(
    "POST /phr/profile/reset_password/",
  ),
  abhaCard: API<Blob>("GET /phr/profile/phr_card/"),
  logout: API<LogoutResponse, LogoutRequest>("POST /phr/profile/logout/"),
};
