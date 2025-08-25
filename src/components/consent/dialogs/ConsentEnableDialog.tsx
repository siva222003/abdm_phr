import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { navigate } from "raviger";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import routes from "@/api";
import { SubscriptionUpdateBaseResponse } from "@/types/subscription";
import { mutate } from "@/utils/request/request";

interface ConsentEnableDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  requestId: string;
}

export default function ConsentEnableDialog({
  open,
  setOpen,
  requestId,
}: ConsentEnableDialogProps) {
  const queryClient = useQueryClient();

  const enableMutation = useMutation({
    mutationFn: mutate(routes.subscription.updateStatus, {
      pathParams: { subscriptionId: requestId },
    }),
    onSuccess: (response: SubscriptionUpdateBaseResponse) => {
      toast.success(response.detail);
      setOpen(false);

      queryClient.invalidateQueries({
        queryKey: ["consents", requestId],
      });
      queryClient.invalidateQueries({
        queryKey: ["subscriptions"],
      });

      navigate("/consents?category=APPROVED&status=GRANTED");
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enable Subscription</DialogTitle>
          <DialogDescription className="space-y-2">
            Are you sure you want to enable this subscription? This will restore
            access to your health information sharing.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            disabled={enableMutation.isPending}
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            disabled={enableMutation.isPending}
            onClick={() => enableMutation.mutate({ enable: true })}
          >
            {enableMutation.isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Enabling...
              </>
            ) : (
              "Enable"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
