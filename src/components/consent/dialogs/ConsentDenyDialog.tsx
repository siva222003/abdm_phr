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
import { mutate } from "@/utils/request/request";

interface ConsentDenyDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  requestId: string;
  isSubscription: boolean;
}

export default function ConsentDenyDialog({
  open,
  setOpen,
  requestId,
  isSubscription,
}: ConsentDenyDialogProps) {
  const queryClient = useQueryClient();

  const denyMutation = useMutation({
    mutationFn: () => {
      const route = isSubscription
        ? routes.subscription.deny
        : routes.consent.deny;

      return mutate(route, {
        pathParams: { requestId },
      })({
        reason: "Request denied by user",
      });
    },
    onSuccess: (response) => {
      toast.success(response.detail);
      setOpen(false);

      queryClient.invalidateQueries({
        queryKey: ["consents", requestId],
      });
      queryClient.invalidateQueries({
        queryKey: [isSubscription ? "subscriptions" : "consents"],
      });

      navigate("/consents?category=REQUESTS&status=DENIED");
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="space-y-1">
          <DialogTitle className="flex items-center gap-2">
            Deny {isSubscription ? "Subscription" : "Consent"} Request
          </DialogTitle>
          <DialogDescription className="space-y-3">
            <p>
              Are you sure you want to deny this{" "}
              {isSubscription ? "subscription" : "consent"} request? This will
              permanently reject the request for health information sharing.
            </p>
            <p className="text-sm text-muted-foreground">
              The requester will be notified that their request has been denied.
            </p>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            disabled={denyMutation.isPending}
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={denyMutation.isPending}
            onClick={() => denyMutation.mutate()}
          >
            {denyMutation.isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Denying...
              </>
            ) : (
              "Deny"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
