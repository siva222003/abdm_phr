import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";

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

import OtpResendInput from "@/components/common/OtpResendInput";

import { useAuthContext } from "@/hooks/useAuth";
import { useOtpFlow } from "@/hooks/useOtpFlow";

import {
  AUTH_METHODS,
  AUTH_METHOD_CHOICES,
  DOMAIN,
  OTP_LENGTH,
} from "@/common/constants";

import routes from "@/api";
import {
  AuthFlowTypes,
  AuthModes,
  FormMemory,
  SendOtpRequest,
  VerifyOtpResponse,
} from "@/types/auth";
import { mutate } from "@/utils/request/request";

type AbhaAddressFlowProps = {
  flowType: AuthFlowTypes;
  transactionId?: string;
  setMemory: Dispatch<SetStateAction<FormMemory>>;
  onVerifyOtpSuccess: (
    data: VerifyOtpResponse,
    sendOtpContext?: SendOtpRequest,
  ) => void;
};

const AbhaAddressFlow = ({
  flowType,
  transactionId,
  setMemory,
  onVerifyOtpSuccess,
}: AbhaAddressFlowProps) => {
  const schema = z
    .object({
      abhaAddress: z.string().regex(ABHA_ADDRESS_REGEX, {
        error: "Enter a valid ABHA address",
      }),
      otpMethod: z.enum(AUTH_METHODS, {
        error: "Please select a method to validate",
      }),
      otp: z.string().optional(),
      password: z.string().trim().optional(),
    })
    .refine(
      (data) =>
        data.otpMethod !== "password" ||
        PASSWORD_REGEX.test(data.password || ""),
      {
        error:
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
      type: AuthModes.ABHA_ADDRESS,
      otp_system: form.getValues("otpMethod"),
    });
    resetCountdown();
  };

  const checkAuthMethodsMutation = useMutation({
    mutationFn: mutate(routes.login.chechAuthMethods),
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    const selectedMethod = values.otpMethod;

    try {
      await checkAuthMethodsMutation.mutateAsync({
        abha_address: values.abhaAddress,
        verify_system: selectedMethod,
      });
    } catch {
      return;
    }

    if (selectedMethod === "password") {
      if (!values.password) return;

      verifyPassword({
        password: values.password,
        abha_address: values.abhaAddress,
        type: AuthModes.ABHA_ADDRESS,
        verify_system: selectedMethod,
      });
      return;
    }

    if (!otpSent) {
      sendOtpMutation.mutate({
        value: values.abhaAddress,
        type: AuthModes.ABHA_ADDRESS,
        otp_system: selectedMethod,
      });
      resetCountdown();
      return;
    }

    if (!(values.otp?.length === OTP_LENGTH && transactionId)) return;

    setIsOtpValid(true);
    verifyOtpMutation.mutate({
      transaction_id: transactionId,
      otp: values.otp,
      type: AuthModes.ABHA_ADDRESS,
      verify_system: selectedMethod,
    });
  };

  const isSubmitting =
    sendOtpMutation.isPending ||
    verifyOtpMutation.isPending ||
    checkAuthMethodsMutation.isPending ||
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
                  onValueChange={(value) => {
                    field.onChange(value);
                    form.resetField("password");
                  }}
                  value={field.value}
                  disabled={otpSent}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a method" />
                  </SelectTrigger>
                  <SelectContent>
                    {AUTH_METHOD_CHOICES.map((choice) => (
                      <SelectItem key={choice.id} value={choice.id}>
                        {choice.label}
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
