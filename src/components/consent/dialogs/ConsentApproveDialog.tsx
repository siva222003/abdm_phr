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
import {
  ConsentApproveRequest,
  ConsentBase,
  ConsentLinks,
} from "@/types/consent";
import { SubscriptionApproveRequest } from "@/types/subscription";
import { mutate } from "@/utils/request/request";

type ConsentApproveDialogProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  requestId: string;
  data: ConsentBase;
  isSubscription: boolean;
};

const buildConsentPayload = (data: ConsentBase): ConsentApproveRequest => ({
  consents: data.links.map((link) => ({
    hip: link.hip,
    careContexts: link.careContexts!,
    hiTypes: data.hiTypes,
    permission: {
      ...data.rawPermission!,
      dateRange: {
        from: data.fromDate,
        to: data.toDate,
      },
    },
  })),
});

export const buildSubscriptionPayload = (
  data: ConsentBase,
): SubscriptionApproveRequest => {
  const isAllHIPs = data.availableLinks?.length === data.links.length;

  const sourcePayload = (link: ConsentLinks | null) => ({
    hip: link ? link.hip : null,
    categories: data.subscriptionCategories!,
    hiTypes: data.hiTypes,
    period: {
      from: data.fromDate,
      to: data.toDate,
    },
    purpose: data.purpose,
  });

  return {
    isApplicableForAllHIPs: isAllHIPs,
    includedSources: isAllHIPs
      ? [sourcePayload(null)]
      : data.links.map(sourcePayload),
    excludedSources: isAllHIPs
      ? []
      : data.availableLinks
          ?.filter(({ hip }) => !data.links.some((l) => l.hip.id === hip.id))
          .map(sourcePayload),
  };
};

const ConsentApproveDialog = ({
  open,
  setOpen,
  requestId,
  data,
  isSubscription,
}: ConsentApproveDialogProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => {
      const payload = isSubscription
        ? buildSubscriptionPayload(data)
        : buildConsentPayload(data);

      return mutate(
        isSubscription ? routes.subscription.approve : routes.consent.approve,
        {
          pathParams: { requestId },
        },
      )(payload);
    },
    onSuccess: (data) => {
      toast.success(data.detail);
      setOpen(false);

      queryClient.invalidateQueries({ queryKey: ["consents", requestId] });
      queryClient.invalidateQueries({
        queryKey: [isSubscription ? "subscriptions" : "consents"],
      });

      navigate("/consents?category=APPROVED&status=GRANTED");
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Approve Consent</DialogTitle>
          <DialogDescription>
            Are you sure you want to approve this consent?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <Loader2Icon className="mr-2 size-4 animate-spin" />
                Approving...
              </>
            ) : (
              "Confirm"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConsentApproveDialog;
