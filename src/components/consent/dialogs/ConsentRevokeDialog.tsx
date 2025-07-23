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

interface ConsentRevokeDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  requestId: string;
  isSubscription: boolean;
}

export default function ConsentRevokeDialog({
  open,
  setOpen,
  requestId,
  isSubscription,
}: ConsentRevokeDialogProps) {
  const queryClient = useQueryClient();

  const revokeMutation = useMutation({
    mutationFn: () => {
      if (isSubscription) {
        return mutate(routes.subscription.updateStatus, {
          pathParams: { subscriptionId: requestId },
        })({ enable: false });
      } else {
        return mutate(routes.consent.revoke, {
          pathParams: { requestId },
        })({ consents: [requestId] });
      }
    },
    onSuccess: (data) => {
      toast.success(data.detail);
      setOpen(false);

      queryClient.invalidateQueries({
        queryKey: ["consents", requestId],
      });
      queryClient.invalidateQueries({
        queryKey: [isSubscription ? "subscriptions" : "consents"],
      });

      navigate("/consents?category=APPROVED&status=REVOKED");
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Revoke {isSubscription ? "Subscription" : "Consent"}
          </DialogTitle>
          <DialogDescription className="space-y-2 pb-4">
            Do you really want to revoke this{" "}
            {isSubscription ? "subscription" : "consent"}? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            disabled={revokeMutation.isPending}
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={revokeMutation.isPending}
            onClick={() => revokeMutation.mutate()}
          >
            {revokeMutation.isPending ? (
              <>
                <Loader2Icon className="mr-2 size-4 animate-spin" />
                Revoking...
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
