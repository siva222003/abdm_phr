import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { Dispatch, FC, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

import OtpInput from "@/components/auth/ui/otp-resend-input";

import { useOtpFlow } from "@/hooks/useOtpFlow";

import { DEFAULT_OTP_SYSTEM, OTP_LENGTH } from "@/common/constants";

import {
  AuthFlowType,
  AuthFlowTypes,
  FormMemory,
  SendOtpRequest,
  VerifyOtpResponse,
} from "@/types/auth";
import { ProfileUpdateAction } from "@/types/profile";

type EmailOtpFlowProps = {
  flowType: AuthFlowType;
  transactionId?: string;
  setMemory: Dispatch<SetStateAction<FormMemory>>;
  onVerifyOtpSuccess: (
    data: VerifyOtpResponse,
    sendOtpContext?: SendOtpRequest,
  ) => void;
  action?: ProfileUpdateAction;
};

const EmailOtpFlow: FC<EmailOtpFlowProps> = ({
  flowType,
  transactionId,
  setMemory,
  onVerifyOtpSuccess,
  action,
}) => {
  const {
    otpSent,
    isOtpValid,
    setIsOtpValid,
    resendCountdown,
    resetCountdown,
    sendOtpMutation,
    verifyOtpMutation,
  } = useOtpFlow(flowType, setMemory, onVerifyOtpSuccess);

  const baseSchema = z.object({
    email: z.string().email({
      message: "Invalid email address",
    }),
    otp: z.string().optional(),
  });

  const form = useForm({
    resolver: zodResolver(baseSchema),
    defaultValues: {
      email: "",
      otp: "",
    },
  });

  const handleResendOtp = () => {
    sendOtpMutation.mutate({
      value: form.getValues("email"),
      otp_system: DEFAULT_OTP_SYSTEM,
      type: "email",
    });
    resetCountdown();
  };

  const onSubmit = (values: z.infer<typeof baseSchema>) => {
    if (!otpSent) {
      sendOtpMutation.mutate({
        value: values.email,
        otp_system: DEFAULT_OTP_SYSTEM,
        type: "email",
      });
      resetCountdown();
      return;
    }

    if (!(values.otp?.length === OTP_LENGTH && transactionId)) return;

    setIsOtpValid(true);
    verifyOtpMutation.mutate({
      otp: values.otp,
      transaction_id: transactionId,
      type: "email",
      [flowType === AuthFlowTypes.ENROLLMENT ? "otp_system" : "verify_system"]:
        DEFAULT_OTP_SYSTEM,
      action,
    });
  };

  const isSubmitting = sendOtpMutation.isPending || verifyOtpMutation.isPending;
  const otpValue = form.watch("otp");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="john@example.com"
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
                  <OtpInput
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

export default EmailOtpFlow;
