import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "raviger";
import { useState } from "react";
import { toast } from "sonner";

import { AuthContext } from "@/hooks/useAuth";

import { LocalStorageKeys } from "@/common/constants";

import routes from "@/api";
import { VerifyAuthResponse } from "@/types/auth";
import { mutate } from "@/utils/request/request";

interface Props {
  publicRouter: React.ReactNode;
  privateRouter: React.ReactNode;
}

export default function AuthUserProvider({
  publicRouter,
  privateRouter,
}: Props) {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  const onAuthSuccess = (data: VerifyAuthResponse) => {
    localStorage.setItem(LocalStorageKeys.accessToken, data.access_token);
    localStorage.setItem(LocalStorageKeys.refreshToken, data.refresh_token);

    setUser("TESTUSER");
    navigate("/");
  };

  const verifyUserMutationFn = mutate(routes.login.verifyUser);
  const { mutate: verifyUser, isPending: isVerifyingUser } = useMutation({
    mutationFn: verifyUserMutationFn,
    onSuccess: (data) => {
      toast.success("Verified User successfully!");
      onAuthSuccess(data);
    },
    onError: () => toast.error("Session expired. Please try again."),
  });

  const verifyPasswordMutationFn = mutate(routes.login.verifyPassword);
  const { mutate: verifyPassword, isPending: isVerifyingPassword } =
    useMutation({
      mutationFn: verifyPasswordMutationFn,
      onSuccess: (data) => {
        toast.success("Password verified successfully!");
        onAuthSuccess(data);
      },
      onError: () => toast.error("Failed to verify password."),
    });

  return (
    <AuthContext.Provider
      value={{
        user,
        verifyUser,
        isVerifyingUser,
        verifyPassword,
        isVerifyingPassword,
      }}
    >
      {user ? privateRouter : publicRouter}
    </AuthContext.Provider>
  );
}
