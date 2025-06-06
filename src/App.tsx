import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useLocationChange } from "raviger";

import { handleHttpError } from "@/utils/request/error-handler";
import { HTTPError } from "@/utils/request/types";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (
          error.message === "Network Error" ||
          (error instanceof HTTPError && [502, 503, 504].includes(error.status))
        ) {
          return failureCount < 3;
        }
        return false;
      },
      refetchOnWindowFocus: false,
    },
  },
  queryCache: new QueryCache({
    onError: handleHttpError,
  }),
  mutationCache: new MutationCache({
    onError: handleHttpError,
  }),
});

const ScrollToTop = () => {
  useLocationChange(() => {
    window.scrollTo(0, 0);
  });

  return null;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ScrollToTop />
      <h1>ABDM PHR</h1>
    </QueryClientProvider>
  );
}

export default App;
