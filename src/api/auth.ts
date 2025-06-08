import {
  PhrAbhaAddressSuggestionsBody,
  PhrAbhaAddressSuggestionsResponse,
  PhrSendOtpBody,
  PhrSendOtpResponse,
  PhrVerifyOtpBody,
  PhrVerifyOtpResponse,
  PhrVerifyUserBody,
} from "@/types/auth";
import { API } from "@/utils/request/api";

// Register API routes
export const register = {
  sendOtp: API<PhrSendOtpResponse, PhrSendOtpBody>(
    "POST /api/abdm/v3/phr/health_id/create/send_otp/",
  ),
  verifyOtp: API<PhrVerifyOtpResponse, PhrVerifyOtpBody>(
    "POST /api/abdm/v3/phr/health_id/create/verify_otp/",
  ),
  abhaAddressSuggestions: API<
    PhrAbhaAddressSuggestionsResponse,
    PhrAbhaAddressSuggestionsBody
  >("POST /api/abdm/v3/phr/health_id/create/abha_address_suggestion/"),
  checkAbhaExists: API<{ exists: boolean }, { abha_address: string }>(
    "POST /api/abdm/v3/phr/health_id/create/abha_address_exists/",
  ),
};

// Login API routes
export const login = {
  sendOtp: API<PhrSendOtpResponse, PhrSendOtpBody>(
    "POST /api/abdm/v3/phr/health_id/login/send_otp/",
  ),
  verifyOtp: API<PhrVerifyOtpResponse, PhrVerifyOtpBody>(
    "POST /api/abdm/v3/phr/health_id/login/verify/",
  ),
  verifyUser: API<any, PhrVerifyUserBody>(
    "POST /api/abdm/v3/phr/health_id/login/verify_user/",
  ),
};
