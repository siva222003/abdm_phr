import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { ControllerRenderProps, useForm } from "react-hook-form";
import { z } from "zod";

import { ABHA_NUMBER_REGEX } from "@/lib/validators";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import OtpInput from "@/components/auth/ui/otp-resend-input";

import { useOtpFlow } from "@/hooks/useOtpFlow";

import { OTP_LENGTH } from "@/common/constants";

import {
  AUTH_FLOW_TYPES,
  AUTH_MODES,
  FlowType,
  FormMemory,
  SendOtpRequest,
  VerifyOtpResponse,
} from "@/types/auth";
import { calculateCursorPosition } from "@/utils";

type AbhaNumberOtpFlowProps = {
  flowType: FlowType;
  transactionId?: string;
  setMemory: Dispatch<SetStateAction<FormMemory>>;
  onVerifyOtpSuccess: (
    data: VerifyOtpResponse,
    sendOtpContext?: SendOtpRequest,
  ) => void;
};

const OTP_METHODS = [
  { id: "abdm", label: "Mobile OTP" },
  { id: "aadhaar", label: "Aadhaar OTP" },
] as const;

const { ABHA_NUMBER } = AUTH_MODES;

const AbhaNumberOtpFlow = ({
  flowType,
  transactionId,
  setMemory,
  onVerifyOtpSuccess,
}: AbhaNumberOtpFlowProps) => {
  const schema = z.object({
    abha: z.string().regex(ABHA_NUMBER_REGEX, {
      message: "Enter a valid 14 digit ABHA number",
    }),
    otpMethod: z.enum(["abdm", "aadhaar"], {
      errorMap: () => ({ message: "Please select an OTP method" }),
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
      abha: "",
      otpMethod: undefined,
      otp: "",
    },
  });

  const formatAbhaNumber = (digits: string): string => {
    const parts = [
      digits.slice(0, 2),
      digits.slice(2, 6),
      digits.slice(6, 10),
      digits.slice(10, 14),
    ].filter(Boolean);
    return parts.join("-");
  };

  const handleAbhaInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps<z.infer<typeof schema>, "abha">,
  ) => {
    const input = e.target;
    const raw = input.value.replace(/\D/g, "").slice(0, 14);
    const formatted = formatAbhaNumber(raw);

    const cursorPos = calculateCursorPosition(
      input.value,
      input.selectionStart ?? 0,
      formatted,
    );

    field.onChange(formatted);

    setTimeout(() => {
      input.setSelectionRange(cursorPos, cursorPos);
    }, 0);
  };

  const handleResendOtp = () => {
    sendOtpMutation.mutate({
      value: form.getValues("abha"),
      type: ABHA_NUMBER,
      otp_system: form.getValues("otpMethod"),
    });
    resetCountdown();
  };

  const onSubmit = (values: z.infer<typeof schema>) => {
    if (!otpSent) {
      sendOtpMutation.mutate({
        value: values.abha,
        type: ABHA_NUMBER,
        otp_system: values.otpMethod!,
      });
      resetCountdown();
      return;
    }

    if (!(values.otp?.length === OTP_LENGTH && transactionId)) return;

    setIsOtpValid(true);

    verifyOtpMutation.mutate({
      transaction_id: transactionId,
      otp: values.otp,
      type: ABHA_NUMBER,
      [flowType === AUTH_FLOW_TYPES.ENROLLMENT
        ? "otp_system"
        : "verify_system"]: values.otpMethod,
    });
  };

  const isSubmitting = sendOtpMutation.isPending || verifyOtpMutation.isPending;
  const otpValue = form.watch("otp");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="abha"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ABHA Number</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter 14 digit ABHA number"
                  maxLength={17}
                  disabled={otpSent}
                  onChange={(e) => handleAbhaInputChange(e, field)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="otpMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Validate using</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={otpSent}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a method" />
                  </SelectTrigger>
                  <SelectContent>
                    {OTP_METHODS.map((method) => (
                      <SelectItem key={method.id} value={method.id}>
                        {method.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

export default AbhaNumberOtpFlow;
