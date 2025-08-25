import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { Dispatch, FC, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";

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
import { ProfileUpdateActions } from "@/types/profile";

type EmailOtpFlowProps = {
  flowType: AuthFlowTypes;
  transactionId?: string;
  setMemory: Dispatch<SetStateAction<FormMemory>>;
  onVerifyOtpSuccess: (
    data: VerifyOtpResponse,
    sendOtpContext?: SendOtpRequest,
  ) => void;
  action?: ProfileUpdateActions;
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
    email: z.email({ error: "Invalid email address" }),
    otp: z.string().optional(),
  });

  const form = useForm({
    resolver: zodResolver(baseSchema),
    defaultValues: {
      email: undefined,
      otp: "",
    },
  });

  const handleResendOtp = () => {
    sendOtpMutation.mutate({
      value: form.getValues("email"),
      otp_system: DEFAULT_AUTH_METHOD,
      type: AuthModes.EMAIL,
    });
    resetCountdown();
  };

  const onSubmit = (values: z.infer<typeof baseSchema>) => {
    if (!otpSent) {
      sendOtpMutation.mutate({
        value: values.email,
        otp_system: DEFAULT_AUTH_METHOD,
        type: AuthModes.EMAIL,
      });
      resetCountdown();
      return;
    }

    if (!(values.otp?.length === OTP_LENGTH && transactionId)) return;

    setIsOtpValid(true);
    verifyOtpMutation.mutate({
      otp: values.otp,
      transaction_id: transactionId,
      type: AuthModes.EMAIL,
      [flowType === AuthFlowTypes.LOGIN ? "verify_system" : "otp_system"]:
        DEFAULT_AUTH_METHOD,
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

export default EmailOtpFlow;
