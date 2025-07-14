import { REGEXP_ONLY_DIGITS } from "input-otp";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface OtpResendInputProps {
  maxLength?: number;
  isOtpValid: boolean;
  otpValue: string | undefined;
  onChange: (value: string) => void;
  resendCountdown: number;
  onResend: () => void;
  disabled?: boolean;
}

const OtpResendInput = ({
  maxLength = 6,
  isOtpValid,
  otpValue = "",
  onChange,
  resendCountdown,
  onResend,
  disabled,
}: OtpResendInputProps) => (
  <>
    <InputOTP
      maxLength={maxLength}
      pattern={REGEXP_ONLY_DIGITS}
      autoComplete="one-time-code"
      autoFocus
      value={otpValue}
      onChange={onChange}
      disabled={disabled}
    >
      <InputOTPGroup>
        {Array.from({ length: 6 }).map((_, i) => (
          <InputOTPSlot
            key={i}
            index={i}
            className={cn(
              "xs:size-10 size-8.5",
              !isOtpValid && "border-red-500 focus-visible:ring-red-500",
            )}
          />
        ))}
      </InputOTPGroup>
    </InputOTP>
    {resendCountdown <= 0 ? (
      <Button
        variant="link"
        type="button"
        className="h-auto p-0 mr-auto text-gray-900"
        onClick={onResend}
        disabled={disabled}
      >
        Resend OTP
      </Button>
    ) : (
      <p className="text-sm text-gray-500">
        Resend OTP in{" "}
        <span className="font-semibold text-gray-500">{resendCountdown}s</span>
      </p>
    )}
  </>
);

export default OtpResendInput;
