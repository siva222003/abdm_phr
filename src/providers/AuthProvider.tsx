import { useState } from "react";

import { AuthUserContext } from "@/hooks/useAuthUser";

interface Props {
  publicRouter: React.ReactNode;
  privateRouter: React.ReactNode;
}

export default function AuthUserProvider({
  publicRouter,
  privateRouter,
}: Props) {
  const [user, _] = useState<any>(null);

  return (
    <AuthUserContext.Provider
      value={{
        user,
      }}
    >
      {user ? privateRouter : publicRouter}
    </AuthUserContext.Provider>
  );
}
