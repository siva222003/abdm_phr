import {
  SendOtpBody,
  SendOtpResponse,
  VerifyOtpBody,
  VerifyOtpResponse,
} from "@/types/auth";
import "@/types/profile";
import { PhrProfile } from "@/types/profile";
import { API } from "@/utils/request/api";

export const profile = {
  getProfile: API<PhrProfile>("GET /phr/profile/get_profile"),
  sendOtp: API<SendOtpResponse, SendOtpBody>(
    "POST /phr/health_id/profile/request_otp/",
  ),
  verifyOtp: API<VerifyOtpResponse, VerifyOtpBody>(
    "POST /phr/health_id/profile/verify_otp/",
  ),
  abhaCard: API<Blob>("GET /phr/health_id/profile/phr_card/"),
};
