import { createContext, useContext } from "react";

import {
  VerifyAuthResponse,
  VerifyPasswordBody,
  VerifyUserBody,
} from "@/types/auth";

interface AuthContextType {
  user: any;
  switchProfileEnabled: boolean;
  verifyUser: (payload: VerifyUserBody) => void;
  isVerifyingUser: boolean;
  verifyPassword: (payload: VerifyPasswordBody) => void;
  isVerifyingPassword: boolean;
  handleAuthSuccess: (data: VerifyAuthResponse) => void;
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
