import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";

import { MOBILE_NUMBER_REGEX } from "@/lib/validators";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import OtpResendInput from "@/components/common/OtpResendInput";

import { useOtpFlow } from "@/hooks/useOtpFlow";

import { DEFAULT_AUTH_METHOD, OTP_LENGTH } from "@/common/constants";

import {
  AuthFlowTypes,
  AuthModes,
  FormMemory,
  SendOtpRequest,
  VerifyOtpResponse,
} from "@/types/auth";
import { ProfileUpdateAction } from "@/types/profile";

type MobileNumberOtpFlowProps = {
  flowType: AuthFlowTypes;
  transactionId?: string;
  setMemory: Dispatch<SetStateAction<FormMemory>>;
  onVerifyOtpSuccess: (
    data: VerifyOtpResponse,
    sendOtpContext?: SendOtpRequest,
  ) => void;
  action?: ProfileUpdateAction;
};

const MobileNumberOtpFlow = ({
  flowType,
  transactionId,
  setMemory,
  onVerifyOtpSuccess,
  action,
}: MobileNumberOtpFlowProps) => {
  const schema = z.object({
    mobile: z.string().regex(MOBILE_NUMBER_REGEX, {
      error: "Enter a valid 10 digit mobile number",
    }),
    otp: z.string().optional(),
  });

  const {
    otpSent,
    isOtpValid,
    setIsOtpValid,
    resendCountdown,
    resetCountdown,
    sendOtpMutation,
    verifyOtpMutation,
  } = useOtpFlow(flowType, setMemory, onVerifyOtpSuccess);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      mobile: "",
      otp: "",
    },
  });

  const handleResendOtp = () => {
    sendOtpMutation.mutate({
      value: form.getValues("mobile"),
      otp_system: DEFAULT_AUTH_METHOD,
      type: AuthModes.MOBILE_NUMBER,
    });
    resetCountdown();
  };

  const onSubmit = (values: z.infer<typeof schema>) => {
    if (!otpSent) {
      sendOtpMutation.mutate({
        value: values.mobile,
        otp_system: DEFAULT_AUTH_METHOD,
        type: AuthModes.MOBILE_NUMBER,
      });
      resetCountdown();
      return;
    }

    if (!(values.otp?.length === OTP_LENGTH && transactionId)) return;

    setIsOtpValid(true);
    verifyOtpMutation.mutate({
      otp: values.otp,
      transaction_id: transactionId,
      type: AuthModes.MOBILE_NUMBER,
<<<<<<< HEAD
      [flowType === AuthFlowTypes.LOGIN ? "verify_system" : "otp_system"]:
        DEFAULT_AUTH_METHOD,
=======
      [flowType === AuthFlowTypes.ENROLLMENT ? "otp_system" : "verify_system"]:
        DEFAULT_OTP_SYSTEM,
      action,
>>>>>>> 9464494 (updated otp flows for profile specific actions)
    });
  };

  const isSubmitting = sendOtpMutation.isPending || verifyOtpMutation.isPending;
  const otpValue = form.watch("otp");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="mobile"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mobile Number</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter 10 digit mobile number"
                  maxLength={10}
                  disabled={otpSent}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {otpSent && (
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>OTP</FormLabel>
                <FormControl>
                  <OtpResendInput
                    maxLength={OTP_LENGTH}
                    isOtpValid={isOtpValid}
                    otpValue={otpValue}
                    onChange={(value) => {
                      field.onChange(value);
                      setIsOtpValid(true);
                    }}
                    resendCountdown={resendCountdown}
                    onResend={handleResendOtp}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={
            isSubmitting ||
            (!otpSent && !form.formState.isDirty) ||
            (otpSent && (!otpValue || otpValue.length !== OTP_LENGTH))
          }
        >
          {isSubmitting ? (
            <>
              <Loader2Icon className="mr-2 size-4 animate-spin" />
              {otpSent ? "Verifying..." : "Sending..."}
            </>
          ) : otpSent ? (
            "Verify OTP"
          ) : (
            "Send OTP"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default MobileNumberOtpFlow;
