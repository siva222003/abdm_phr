import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import routes from "@/api";
import {
  UserInitLinkingBaseResponse,
  UserInitLinkingCheckStatusResponse,
} from "@/types/linkedFacility";
import { query } from "@/utils/request/request";

interface UseUserInitLinkingFlowOptions<T> {
  onSuccess?: (data: UserInitLinkingCheckStatusResponse) => void;
  mutationFn: (payload: T) => Promise<UserInitLinkingBaseResponse>;
}

export function useUserInitLinkingFlow<T>({
  onSuccess,
  mutationFn,
}: UseUserInitLinkingFlowOptions<T>) {
  const [requestId, setRequestId] = useState<string | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const stopPolling = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setRequestId(null);
    setIsTimerRunning(false);
  }, []);

  const mutation = useMutation({
    mutationFn,
    onSuccess: (data) => {
      setRequestId(data.request_id);
      setIsTimerRunning(true);

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        toast.error(
          "Facility is taking too long to respond. Please try again later.",
        );
        stopPolling();
      }, 10000);
    },
  });

  const checkStatusQuery = useQuery<UserInitLinkingCheckStatusResponse>({
    queryKey: ["checkStatus", requestId],
    queryFn: query(routes.linkedFacility.checkStatus, {
      queryParams: { request_id: requestId },
    }),
    enabled: !!requestId,
    refetchInterval: (query) => {
      if (query.state.data?.status === "pending") return 2000;
      return false;
    },
  });

  useEffect(() => {
    if (checkStatusQuery.isError) {
      stopPolling();
      return;
    }

    if (checkStatusQuery.data?.status === "completed") {
      onSuccess?.(checkStatusQuery.data);
      stopPolling();
    }
  }, [checkStatusQuery.data?.status, checkStatusQuery.isError]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const isLoading =
    mutation.isPending || checkStatusQuery.isLoading || isTimerRunning;

  return {
    mutation,
    isLoading,
    stopPolling,
  };
}
