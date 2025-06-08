import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircleIcon } from "lucide-react";
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

import { OTP_LENGTH } from "@/common/constants";

import { FormMemory } from "@/types/auth";

type MobileNumberOtpFlowProps = {
  flowType: "login" | "enrollment";
  transactionId?: string;
  setMemory: Dispatch<SetStateAction<FormMemory>>;
  goTo: (step: string) => void;
};

const MobileNumberOtpFlow: FC<MobileNumberOtpFlowProps> = ({
  flowType,
  transactionId,
  setMemory,
  goTo,
}) => {
  const {
    otpSent,
    isOtpValid,
    setIsOtpValid,
    resendCountdown,
    resetCountdown,
    sendOtpMutation,
    verifyOtpMutation,
  } = useOtpFlow(flowType, setMemory, goTo);

  const baseSchema = z.object({
    mobile: z.string().regex(/^[1-9][0-9]{9}$/, {
      message: "Enter a valid 10 digit mobile number",
    }),

    otp: z.string().optional(),
  });

  const form = useForm({
    resolver: zodResolver(baseSchema),
    defaultValues: {
      mobile: "",
      otp: "",
    },
  });

  const onSubmit = (values: z.infer<typeof baseSchema>) => {
    if (!otpSent) {
      sendOtpMutation.mutate({
        value: values.mobile,
        otp_system: "abdm",
        type: "mobile-number",
      });
      resetCountdown();
      return;
    }

    if (!(values.otp?.length === OTP_LENGTH && !!transactionId)) return;

    setIsOtpValid(true);
    verifyOtpMutation.mutate({
      otp: values.otp,
      transaction_id: transactionId,
      verify_system: "abdm",
      type: "mobile-number",
    });
  };

  const isSubmitting = sendOtpMutation.isPending || verifyOtpMutation.isPending;
  const otpValue = form.watch("otp");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-2 space-y-4">
        <FormField
          control={form.control}
          name="mobile"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mobile Number</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter 10 digit mobile number"
                  maxLength={10}
                  disabled={otpSent}
                  {...field}
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
                    onResend={() => {
                      sendOtpMutation.mutate({
                        value: form.getValues("mobile"),
                        otp_system: "abdm",
                        type: "mobile-number",
                      });
                      resetCountdown();
                    }}
                    disabled={isSubmitting}
                  />
                </FormControl>
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
            <LoaderCircleIcon className="text-white" />
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
