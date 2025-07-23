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
      })({});
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

      navigate("/consents?category=REQUESTS&status=DENIED");
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Deny {isSubscription ? "Subscription" : "Consent"}
          </DialogTitle>
          <DialogDescription className="space-y-2 pb-4">
            Do you really want to deny this{" "}
            {isSubscription ? "subscription" : "consent"}? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
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
                <Loader2Icon className="mr-2 size-4 animate-spin" />
                Denying...
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
