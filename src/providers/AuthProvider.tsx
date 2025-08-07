import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { navigate } from "raviger";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { AuthContext } from "@/hooks/useAuth";

import { REFRESH_TOKEN_REFETCH_INTERVAL } from "@/common/constants";
import GlobalLoader from "@/common/loaders/GlobalLoader";

import routes from "@/api";
import { VerifyAuthResponse } from "@/types/auth";
import { TokenStorage } from "@/utils";
import { mutate, query } from "@/utils/request/request";

interface Props {
  publicRouter: React.ReactNode;
  privateRouter: React.ReactNode;
}

export default function AuthUserProvider({
  publicRouter,
  privateRouter,
}: Props) {
  const queryClient = useQueryClient();

  const [switchProfileEnabled, setSwitchProfileEnabled] = useState(
    TokenStorage.getSwitchProfileEnabled(),
  );

  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: query(routes.profile.getProfile, { silent: true }),
    retry: false,
    enabled: !!TokenStorage.getAccessToken(),
  });

  const tokenRefreshQuery = useQuery({
    queryKey: ["refresh-token"],
    queryFn: ({ signal }) => {
      const refreshToken = TokenStorage.getRefreshToken();
      if (!refreshToken) {
        return;
      }
      return query(routes.login.refreshAccessToken, {
        body: { refresh: refreshToken || "" },
      })({ signal });
    },
    refetchIntervalInBackground: true,
    refetchInterval: REFRESH_TOKEN_REFETCH_INTERVAL,
    enabled: !!TokenStorage.getRefreshToken() && !!user,
  });

  useEffect(() => {
    if (tokenRefreshQuery.isError) {
      TokenStorage.clear();
      return;
    }

    if (tokenRefreshQuery.data) {
      const { access_token, refresh_token } = tokenRefreshQuery.data;
      TokenStorage.setTokens(access_token, refresh_token);
    }
  }, [tokenRefreshQuery.data, tokenRefreshQuery.isError]);

  const handleAuthSuccess = useCallback(
    async (data: VerifyAuthResponse) => {
      const { access_token, refresh_token } = data;
      TokenStorage.setTokens(access_token, refresh_token);
      TokenStorage.setSwitchProfileEnabled(data.switchProfileEnabled);

      setSwitchProfileEnabled(data.switchProfileEnabled);

      await queryClient.invalidateQueries({ queryKey: ["user"] });

      navigate("/");
    },
    [setSwitchProfileEnabled, queryClient, navigate],
  );

  const verifyUserMutationFn = mutate(routes.login.verifyUser);
  const { mutate: verifyUser, isPending: isVerifyingUser } = useMutation({
    mutationFn: verifyUserMutationFn,
    onSuccess: (data) => {
      toast.success("User Verified successfully!");
      handleAuthSuccess(data);
    },
  });

  const verifyPasswordMutationFn = mutate(routes.login.verifyPassword);
  const { mutate: verifyPassword, isPending: isVerifyingPassword } =
    useMutation({
      mutationFn: verifyPasswordMutationFn,
      onSuccess: (data) => {
        toast.success("Password verified successfully!");
        handleAuthSuccess(data);
      },
    });

  if (isLoading) {
    return <GlobalLoader />;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        switchProfileEnabled,
        verifyUser,
        isVerifyingUser,
        verifyPassword,
        isVerifyingPassword,
        handleAuthSuccess,
      }}
    >
      {user ? privateRouter : publicRouter}
    </AuthContext.Provider>
  );
}
