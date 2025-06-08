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
import { PasswordInput } from "@/components/ui/input-password";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import OtpInput from "@/components/auth/ui/otp-resend-input";

import { useOtpFlow } from "@/hooks/useOtpFlow";

import { FormMemory } from "@/types/auth";

const OTP_LENGTH = 6;
const DOMAIN = "@sbx";

type AbhaAddressFlowProps = {
  flowType: "login" | "enrollment";
  transactionId?: string;
  setMemory: Dispatch<SetStateAction<FormMemory>>;
  goTo: (step: string) => void;
};

const AbhaAddressFlow: FC<AbhaAddressFlowProps> = ({
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

  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$^-])[A-Za-z\d!@#$%^&*-]{8,}$/;

  const baseSchema = z
    .object({
      abhaAddress: z.string().regex(/^(?![\d.])[a-zA-Z0-9._]{4,}(?<!\.)$/, {
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
        passwordRegex.test(data.password || ""),
      {
        message:
          "Password must be 8+ characters, 1 uppercase, 1 number, 1 special char",
        path: ["password"],
      },
    );

  const form = useForm({
    resolver: zodResolver(baseSchema),
    defaultValues: {
      abhaAddress: "",
      otpMethod: undefined,
      otp: "",
    },
  });

  const onSubmit = (values: z.infer<typeof baseSchema>) => {
    if (values.otpMethod === "password") {
      //TODO: CHECK AUTH METHODS
      if (!values.password) return;
      verifyOtpMutation.mutate({
        password: values.password,
        abha_address: values.abhaAddress,
        type: "abha-address",
        verify_system: values.otpMethod,
      });
      return;
    }

    if (!otpSent) {
      sendOtpMutation.mutate({
        value: values.abhaAddress,
        type: "abha-address",
        otp_system: values.otpMethod,
      });
      resetCountdown();
      return;
    }

    if (!(values.otp?.length === OTP_LENGTH && !!transactionId)) return;

    setIsOtpValid(true);
    verifyOtpMutation.mutate({
      transaction_id: transactionId,
      otp: values.otp,
      type: "abha-address",
      verify_system: values.otpMethod,
    });
  };

  const isSubmitting = sendOtpMutation.isPending || verifyOtpMutation.isPending;
  const otpValue = form.watch("otp");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-2 space-y-4">
        <FormField
          control={form.control}
          name="abhaAddress"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Abha Address</FormLabel>
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
            );
          }}
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
                  defaultValue={field.value}
                  disabled={otpSent}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a method" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {[
                      { id: "abdm", label: "Mobile OTP" },
                      { id: "aadhaar", label: "Aadhaar OTP" },
                      { id: "password", label: "Password" },
                    ].map((otpMethod) => (
                      <SelectItem key={otpMethod.id} value={otpMethod.id}>
                        {otpMethod.label}
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
                    onResend={() => {
                      sendOtpMutation.mutate({
                        value: form.watch("abhaAddress"),
                        type: "abha-address",
                        otp_system: form.watch("otpMethod") as
                          | "abdm"
                          | "aadhaar",
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
        {form.watch("otpMethod") === "password" && (
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
            <LoaderCircleIcon className="text-white" />
          ) : otpSent ? (
            "Verify OTP"
          ) : form.watch("otpMethod") === "password" ? (
            "Verify Password"
          ) : (
            "Send OTP"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default AbhaAddressFlow;
