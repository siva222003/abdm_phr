import { useMutation } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";

import routes from "@/api";
import { FormMemory } from "@/types/auth";
import { mutate } from "@/utils/request/request";

const RESEND_OTP_DURATION = 60;

export const useOtpFlow = (
  flowType: "login" | "enrollment",
  setMemory: Dispatch<SetStateAction<FormMemory>>,
  goTo: (step: string) => void,
) => {
  const [otpSent, setOtpSent] = useState(false);
  const [isOtpValid, setIsOtpValid] = useState(true);
  const [resendCountdown, setResendCountdown] = useState(RESEND_OTP_DURATION);

  const resetCountdown = () => setResendCountdown(RESEND_OTP_DURATION);

  useEffect(() => {
    if (resendCountdown <= 0) return;
    const interval = setInterval(() => setResendCountdown((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [resendCountdown]);

  const sendOtpMutationFn =
    flowType === "enrollment"
      ? mutate(routes.register.sendOtp)
      : mutate(routes.login.sendOtp);

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
    onError: () => {
      toast.error("Failed to send OTP.");
    },
  });

  const verifyOtpMutationFn =
    flowType === "enrollment"
      ? mutate(routes.register.verifyOtp)
      : mutate(routes.login.verifyOtp);

  const verifyOtpMutation = useMutation({
    mutationFn: verifyOtpMutationFn,
    onSuccess: (data) => {
      const dob = data.abha_number?.date_of_birth ?? "";
      const [year, month, day] = dob.split("-");

      setMemory((prev) => ({
        ...prev,
        transactionId: data.transaction_id,
        existingAbhaAddresses: data.users,
        ...(flowType === "enrollment" &&
          data.abha_number && {
            phrProfile: {
              ...prev.phrProfile!,
              ...data.abha_number,
              abha_address: data.abha_number.health_id ?? "",
              day_of_birth: day ?? "",
              month_of_birth: month ?? "",
              year_of_birth: year ?? "",
              district_name: data.abha_number.district ?? "",
              state_name: data.abha_number.state ?? "",
              mobile: sendOtpMutation.variables?.value ?? "",
              last_name: data.abha_number.last_name ?? "",
              middle_name: data.abha_number.middle_name ?? "",
              email: data.abha_number.email ?? "",
            },
          }),
      }));

      goTo("handle-existing-abha");
    },
    onError: () => {
      toast.error("Otp is invalid or expired. Please try again.");
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
