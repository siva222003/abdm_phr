import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
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

import { OTP_LENGTH } from "@/common/constants";

import {
  FlowType,
  FormMemory,
  SendOtpRequest,
  VerifyOtpResponse,
} from "@/types/auth";

type MobileNumberOtpFlowProps = {
  flowType: FlowType;
  transactionId?: string;
  setMemory: Dispatch<SetStateAction<FormMemory>>;
  onVerifyOtpSuccess: (
    data: VerifyOtpResponse,
    sendOtpContext?: SendOtpRequest,
  ) => void;
};

const MobileNumberOtpFlow = ({
  flowType,
  transactionId,
  setMemory,
  onVerifyOtpSuccess,
}: MobileNumberOtpFlowProps) => {
  const schema = z.object({
    mobile: z.string().regex(/^[1-9][0-9]{9}$/, {
      message: "Enter a valid 10 digit mobile number",
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
      otp_system: "abdm",
      type: "mobile-number",
    });
    resetCountdown();
  };

  const onSubmit = (values: z.infer<typeof schema>) => {
    if (!otpSent) {
      sendOtpMutation.mutate({
        value: values.mobile,
        otp_system: "abdm",
        type: "mobile-number",
      });
      resetCountdown();
      return;
    }

    if (!(values.otp?.length === OTP_LENGTH && transactionId)) return;

    setIsOtpValid(true);
    verifyOtpMutation.mutate({
      otp: values.otp,
      transaction_id: transactionId,
      type: "mobile-number",
      [flowType === "enrollment" ? "otp_system" : "verify_system"]: "abdm",
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
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
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
