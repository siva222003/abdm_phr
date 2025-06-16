import {
  AbhaAddressExistsBody,
  AbhaAddressExistsResponse,
  AbhaAddressSuggestionsBody,
  AbhaAddressSuggestionsResponse,
  CheckAuthMethodsBody,
  CheckAuthMethodsResponse,
  EnrolAddressBody,
  RefreshAccessTokenBody,
  RefreshAccessTokenResponse,
  SendOtpBody,
  SendOtpResponse,
  VerifyAuthResponse,
  VerifyOtpBody,
  VerifyOtpResponse,
  VerifyPasswordBody,
  VerifyUserBody,
} from "@/types/auth";
import { API } from "@/utils/request/api";

// Register API routes
export const register = {
  sendOtp: API<SendOtpResponse, SendOtpBody>(
    "POST /phr/health_id/create/send_otp/",
    true,
  ),
  verifyOtp: API<VerifyOtpResponse, VerifyOtpBody>(
    "POST /phr/health_id/create/verify_otp/",
    true,
  ),
  abhaAddressSuggestions: API<
    AbhaAddressSuggestionsResponse,
    AbhaAddressSuggestionsBody
  >("POST /phr/health_id/create/abha_address_suggestion/", true),
  checkAbhaExists: API<AbhaAddressExistsResponse, AbhaAddressExistsBody>(
    "POST /phr/health_id/create/abha_address_exists/",
    true,
  ),
  enrolAbhaAddress: API<VerifyAuthResponse, EnrolAddressBody>(
    "POST /phr/health_id/create/enrol_abha_address/",
    true,
  ),
};

// Login API routes
export const login = {
  sendOtp: API<SendOtpResponse, SendOtpBody>(
    "POST /phr/health_id/login/send_otp/",
    true,
  ),
  verifyOtp: API<VerifyOtpResponse | VerifyAuthResponse, VerifyOtpBody>(
    "POST /phr/health_id/login/verify/",
    true,
  ),
  verifyPassword: API<VerifyAuthResponse, VerifyPasswordBody>(
    "POST /phr/health_id/login/verify/",
    true,
  ),
  verifyUser: API<VerifyAuthResponse, VerifyUserBody>(
    "POST /phr/health_id/login/verify_user/",
    true,
  ),
  chechAuthMethods: API<CheckAuthMethodsResponse, CheckAuthMethodsBody>(
    "POST /phr/health_id/login/check_auth_methods/",
    true,
  ),
  refreshAccessToken: API<RefreshAccessTokenResponse, RefreshAccessTokenBody>(
    "POST /phr/health_id/refresh_token/",
    true,
  ),
};
