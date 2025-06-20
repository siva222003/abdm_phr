import { createContext, useContext } from "react";

import {
  VerifyAuthResponse,
  VerifyPasswordRequest,
  VerifyUserRequest,
} from "@/types/auth";
import { PhrProfile } from "@/types/profile";

interface AuthContextType {
  user: PhrProfile | undefined;
  switchProfileEnabled: boolean;
  verifyUser: (payload: VerifyUserRequest) => void;
  isVerifyingUser: boolean;
  verifyPassword: (payload: VerifyPasswordRequest) => void;
  isVerifyingPassword: boolean;
  handleAuthSuccess: (data: VerifyAuthResponse) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("'useAuthContext' must be used within 'AuthProvider' only");
  }
  return ctx;
};

export default function useAuth() {
  const user = useAuthContext().user;
  if (!user) {
    throw new Error("'useAuth' must be used within 'PrivateRouter' only");
  }
  return user;
}
