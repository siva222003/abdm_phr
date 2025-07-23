import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
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

  const mutationFn = mutate(routes.subscription.updateStatus, {
    pathParams: { subscriptionId: requestId },
  });
  const enableMutation = useMutation({
    mutationFn,
    onSuccess: (data) => {
      toast.success(data.detail);
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
          <DialogDescription className="space-y-2 pb-4">
            Do you really want to enable this subscription?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
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
                <Loader2Icon className="mr-2 size-4 animate-spin" />
                Enabling...
              </>
            ) : (
              "Confirm"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
