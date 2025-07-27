import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Loader2 } from "lucide-react";
import { navigate } from "raviger";
import { toast } from "sonner";

import { Alert, AlertDescription } from "@/components/ui/alert";
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

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface ConsentRevokeDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  requestId: string;
  isSubscription: boolean;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Dialog for revoking a granted consent or subscription
 * Handles different API calls based on consent type
 */
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
        // For subscriptions: disable via status update
        return mutate(routes.subscription.updateStatus, {
          pathParams: { subscriptionId: requestId },
        })({ enable: false });
      } else {
        // For consents: revoke via consent array
        return mutate(routes.consent.revoke, {
          pathParams: { requestId },
        })({ consents: [requestId] });
      }
    },
    onSuccess: (response) => {
      toast.success(response.detail);
      setOpen(false);

      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: ["consents", requestId],
      });
      queryClient.invalidateQueries({
        queryKey: [isSubscription ? "subscriptions" : "consents"],
      });

      // Navigate to revoked consents
      navigate("/consents?category=APPROVED&status=REVOKED");
    },
    onError: (error) => {
      toast.error(
        `Failed to revoke ${isSubscription ? "subscription" : "consent"}. Please try again.`,
      );
      console.error("Revoke error:", error);
    },
  });

  const handleRevoke = () => {
    revokeMutation.mutate();
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const entityType = isSubscription ? "subscription" : "consent";
  const entityTypeCapitalized = isSubscription ? "Subscription" : "Consent";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="size-5 text-destructive" />
            Revoke {entityTypeCapitalized}
          </DialogTitle>
          <DialogDescription className="space-y-3">
            <p>
              Are you sure you want to revoke this {entityType}? This will
              immediately stop all data sharing and cannot be undone.
            </p>
            {isSubscription && (
              <p className="text-sm text-muted-foreground">
                You can re-enable this subscription later if needed.
              </p>
            )}
          </DialogDescription>
        </DialogHeader>

        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertDescription>
            <strong>Warning:</strong> Revoking this {entityType} will
            immediately stop all health information sharing. This action cannot
            be undone.
          </AlertDescription>
        </Alert>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            disabled={revokeMutation.isPending}
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={revokeMutation.isPending}
            onClick={handleRevoke}
          >
            {revokeMutation.isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Revoking...
              </>
            ) : (
              `Revoke ${entityTypeCapitalized}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
