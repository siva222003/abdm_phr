import { useEffect, useState } from "react";

export const useOtpTimer = (initial: number = 60) => {
  const [resendCountdown, setResendCountdown] = useState(initial);

  useEffect(() => {
    if (resendCountdown <= 0) return;
    const interval = setInterval(() => setResendCountdown((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [resendCountdown]);

  const resetCountdown = () => setResendCountdown(initial);

  return { resetCountdown, resendCountdown };
};
