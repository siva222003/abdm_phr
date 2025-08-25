import { createContext, useContext } from "react";

interface NavigationContextType {
  goBack: (fallbackPath: string) => void;
}

export const NavigationContext = createContext<NavigationContextType | null>(
  null,
);

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within NavigationProvider");
  }
  return context;
}
