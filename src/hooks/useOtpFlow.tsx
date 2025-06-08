import { useMutation } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";

import routes from "@/api";
import { FormMemory } from "@/types/auth";
import { mutate } from "@/utils/request/request";

import { useOtpTimer } from "./useOtpTimer";

const RESEND_OTP_DURATION = 60;

export const useOtpFlow = (
  flowType: "login" | "enrollment",
  setMemory: Dispatch<SetStateAction<FormMemory>>,
  goTo: (step: string) => void,
) => {
  const [otpSent, setOtpSent] = useState(false);
  const [isOtpValid, setIsOtpValid] = useState(true);
  const { resendCountdown, resetCountdown } = useOtpTimer(RESEND_OTP_DURATION);

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
      setMemory((prev) => ({
        ...prev,
        transactionId: data.transaction_id,
        existingAbhaAddresses: data.users,
        ...(flowType === "enrollment" && {
          phrProfile: {
            ...prev.phrProfile!,
            ...data.abha_number,
            mobile: sendOtpMutation.variables?.value || "",
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
