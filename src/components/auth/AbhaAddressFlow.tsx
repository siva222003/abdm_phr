import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ABHA_ADDRESS_REGEX, PASSWORD_REGEX } from "@/lib/validators";

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
import { PasswordInput } from "@/components/ui/input-password";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import OtpInput from "@/components/auth/ui/otp-resend-input";

import { useAuthContext } from "@/hooks/useAuth";
import { useOtpFlow } from "@/hooks/useOtpFlow";

import { DOMAIN, OTP_LENGTH } from "@/common/constants";

import {
  AUTH_MODES,
  FlowType,
  FormMemory,
  SendOtpRequest,
  VerifyOtpResponse,
} from "@/types/auth";

type AbhaAddressFlowProps = {
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
  { id: "password", label: "Password" },
] as const;

const { ABHA_ADDRESS } = AUTH_MODES;

const AbhaAddressFlow = ({
  flowType,
  transactionId,
  setMemory,
  onVerifyOtpSuccess,
}: AbhaAddressFlowProps) => {
  const schema = z
    .object({
      abhaAddress: z.string().regex(ABHA_ADDRESS_REGEX, {
        message: "Enter a valid ABHA address",
      }),
      otpMethod: z.enum(["abdm", "aadhaar", "password"], {
        errorMap: () => ({ message: "Please select an OTP method" }),
      }),
      otp: z.string().optional(),
      password: z.string().optional(),
    })
    .refine(
      (data) =>
        data.otpMethod !== "password" ||
        PASSWORD_REGEX.test(data.password || ""),
      {
        message:
          "Password must be 8+ characters, 1 uppercase, 1 number, 1 special char",
        path: ["password"],
      },
    );

  const {
    otpSent,
    isOtpValid,
    setIsOtpValid,
    resendCountdown,
    resetCountdown,
    sendOtpMutation,
    verifyOtpMutation,
  } = useOtpFlow(flowType, setMemory, onVerifyOtpSuccess);

  const { verifyPassword, isVerifyingPassword } = useAuthContext();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      abhaAddress: "",
      otpMethod: undefined,
      otp: "",
      password: "",
    },
  });

  const handleResendOtp = () => {
    sendOtpMutation.mutate({
      value: form.getValues("abhaAddress"),
      type: ABHA_ADDRESS,
      otp_system: form.getValues("otpMethod") as "abdm" | "aadhaar",
    });
    resetCountdown();
  };

  const onSubmit = (values: z.infer<typeof schema>) => {
    if (values.otpMethod === "password") {
      if (!values.password) return;

      verifyPassword({
        password: values.password,
        abha_address: values.abhaAddress,
        type: ABHA_ADDRESS,
        verify_system: values.otpMethod,
      });
      return;
    }

    if (!otpSent) {
      sendOtpMutation.mutate({
        value: values.abhaAddress,
        type: ABHA_ADDRESS,
        otp_system: values.otpMethod,
      });
      resetCountdown();
      return;
    }

    if (!(values.otp?.length === OTP_LENGTH && transactionId)) return;

    setIsOtpValid(true);
    verifyOtpMutation.mutate({
      transaction_id: transactionId,
      otp: values.otp,
      type: ABHA_ADDRESS,
      verify_system: values.otpMethod,
    });
  };

  const isSubmitting =
    sendOtpMutation.isPending ||
    verifyOtpMutation.isPending ||
    isVerifyingPassword;

  const otpValue = form.watch("otp");
  const selectedOtpMethod = form.watch("otpMethod");

  const getButtonText = () => {
    if (isSubmitting) {
      if (selectedOtpMethod === "password") return "Verifying...";
      return otpSent ? "Verifying..." : "Sending...";
    }

    if (otpSent) return "Verify OTP";
    if (selectedOtpMethod === "password") return "Verify Password";
    return "Send OTP";
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="abhaAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ABHA Address</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter your ABHA Address"
                    className="pr-16"
                    disabled={otpSent}
                  />
                </FormControl>
                <span className="absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground pointer-events-none">
                  {DOMAIN}
                </span>
              </div>
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

        {selectedOtpMethod === "password" && (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    {...field}
                    placeholder="Enter password"
                    autoComplete="new-password"
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
              {getButtonText()}
            </>
          ) : (
            getButtonText()
          )}
        </Button>
      </form>
    </Form>
  );
};

export default AbhaAddressFlow;
