import {
  AbhaAddressEnrolRequest,
  AbhaAddressExistsRequest,
  AbhaAddressExistsResponse,
  AbhaAddressSuggestionsRequest,
  AbhaAddressSuggestionsResponse,
  CheckAuthMethodsRequest,
  CheckAuthMethodsResponse,
  RefreshAccessTokenRequest,
  RefreshAccessTokenResponse,
  SendOtpRequest,
  SendOtpResponse,
  VerifyAuthResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  VerifyPasswordRequest,
  VerifyUserRequest,
} from "@/types/auth";
import { API } from "@/utils/request/api";

export const register = {
  sendOtp: API<SendOtpResponse, SendOtpRequest>(
    "POST /phr/health_id/create/send_otp/",
    true,
  ),
  verifyOtp: API<VerifyOtpResponse, VerifyOtpRequest>(
    "POST /phr/health_id/create/verify_otp/",
    true,
  ),
  abhaAddressSuggestions: API<
    AbhaAddressSuggestionsResponse,
    AbhaAddressSuggestionsRequest
  >("POST /phr/health_id/create/abha_address_suggestion/", true),
  checkAbhaExists: API<AbhaAddressExistsResponse, AbhaAddressExistsRequest>(
    "POST /phr/health_id/create/abha_address_exists/",
    true,
  ),
  enrolAbhaAddress: API<VerifyAuthResponse, AbhaAddressEnrolRequest>(
    "POST /phr/health_id/create/enrol_abha_address/",
    true,
  ),
};

export const login = {
  sendOtp: API<SendOtpResponse, SendOtpRequest>(
    "POST /phr/health_id/login/send_otp/",
    true,
  ),
  verifyOtp: API<VerifyOtpResponse | VerifyAuthResponse, VerifyOtpRequest>(
    "POST /phr/health_id/login/verify/",
    true,
  ),
  verifyPassword: API<VerifyAuthResponse, VerifyPasswordRequest>(
    "POST /phr/health_id/login/verify/",
    true,
  ),
  verifyUser: API<VerifyAuthResponse, VerifyUserRequest>(
    "POST /phr/health_id/login/verify_user/",
    true,
  ),
  chechAuthMethods: API<CheckAuthMethodsResponse, CheckAuthMethodsRequest>(
    "POST /phr/health_id/login/check_auth_methods/",
    true,
  ),
  refreshAccessToken: API<
    RefreshAccessTokenResponse,
    RefreshAccessTokenRequest
  >("POST /phr/health_id/refresh_token/", true),
};
