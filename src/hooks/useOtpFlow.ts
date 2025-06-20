import { useMutation } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";

import { RESEND_OTP_DURATION } from "@/common/constants";

import routes from "@/api";
import {
  AuthFlowTypes,
  FormMemory,
  SendOtpRequest,
  VerifyOtpResponse,
} from "@/types/auth";
import { mutate } from "@/utils/request/request";

import { useAuthContext } from "./useAuth";

export const useOtpFlow = (
  flowType: AuthFlowTypes,
  setMemory: Dispatch<SetStateAction<FormMemory>>,
  onVerifyOtpSuccess: (
    data: VerifyOtpResponse,
    sendOtpContext?: SendOtpRequest,
  ) => void,
) => {
  const [otpSent, setOtpSent] = useState(false);
  const [isOtpValid, setIsOtpValid] = useState(true);
  const [resendCountdown, setResendCountdown] = useState(RESEND_OTP_DURATION);

  const { handleAuthSuccess } = useAuthContext();

  const resetCountdown = () => setResendCountdown(RESEND_OTP_DURATION);

  useEffect(() => {
    if (resendCountdown <= 0) return;
    const interval = setInterval(() => setResendCountdown((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [resendCountdown]);

  const sendOtpMutationFn =
    flowType === AuthFlowTypes.ENROLLMENT
      ? mutate(routes.register.sendOtp)
      : flowType === "login"
        ? mutate(routes.login.sendOtp)
        : mutate(routes.profile.sendOtp);

  const sendOtpMutation = useMutation({
    mutationFn: sendOtpMutationFn,
    onSuccess: (data) => {
      toast.success(data.detail);
      setMemory((prev) => ({
        ...prev,
        transactionId: data.transaction_id,
      }));
      setOtpSent(true);
    },
  });

  const verifyOtpMutationFn =
    flowType === AuthFlowTypes.ENROLLMENT
      ? mutate(routes.register.verifyOtp)
      : flowType === "login"
        ? mutate(routes.login.verifyOtp)
        : mutate(routes.profile.verifyOtp);

  const verifyOtpMutation = useMutation({
    mutationFn: verifyOtpMutationFn,
    onSuccess: (data) => {
      if ("access_token" in data && "refresh_token" in data) {
        toast.success("Otp verified successfully");
        handleAuthSuccess(data);
        return;
      }
      toast.success(data.detail);
      onVerifyOtpSuccess(data, sendOtpMutation.variables);
    },
    onError: () => {
      setIsOtpValid(false);
    },
  });

  return {
    otpSent,
    isOtpValid,
    setIsOtpValid,
    resendCountdown,
    resetCountdown,
    sendOtpMutation,
    verifyOtpMutation,
  };
};
