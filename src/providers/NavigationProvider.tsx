import { navigate, useLocationChange } from "raviger";
import { ReactNode, useState } from "react";

import { NavigationContext } from "@/hooks/useNavigation";

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<string[]>([]);

  useLocationChange(
    (newLocation) => {
      const currentPath = newLocation.fullPath + newLocation.search;

      setHistory((prev) => {
        if (prev.length && prev[0] === currentPath) return prev;

        if (prev.length > 1 && prev[1] === currentPath) return prev.slice(1);

        return [currentPath, ...prev];
      });
    },
    {
      onInitial: true,
    },
  );

  const goBack = (fallbackPath: string) => {
    if (history.length > 1) {
      navigate(history[1]);
    } else {
      navigate(fallbackPath);
    }
  };

  return (
    <NavigationContext.Provider value={{ goBack }}>
      {children}
    </NavigationContext.Provider>
  );
}
