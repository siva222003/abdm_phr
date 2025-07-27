import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import Page from "@/components/common/Page";
import {
  ConsentBasicDetails,
  ConsentDurationDetails,
  ConsentHIPDetails,
  ConsentHITypeDetails,
  SubscriptionCategoryDetails,
} from "@/components/consent/ConsentViewDetails";
import EditConsentSheet from "@/components/consent/EditConsentSheet";
import ConsentApproveDialog, {
  buildSubscriptionPayload,
} from "@/components/consent/dialogs/ConsentApproveDialog";
import ConsentDenyDialog from "@/components/consent/dialogs/ConsentDenyDialog";
import ConsentEnableDialog from "@/components/consent/dialogs/ConsentEnableDialog";
import ConsentRevokeDialog from "@/components/consent/dialogs/ConsentRevokeDialog";

import { useConsentDetail } from "@/hooks/useConsentData";
import { useNavigation } from "@/hooks/useNavigation";

import routes from "@/api";
import {
  CONSENT_STATUS_VARIANTS,
  CONSENT_TYPE_VARIANTS,
  ConsentBase,
  ConsentStatuses,
  ConsentTypes,
  isSubscription,
} from "@/types/consent";
import { toTitleCase } from "@/utils";
import { mutate } from "@/utils/request/request";

interface ConsentDetailProps {
  id: string;
  type: ConsentTypes;
}

interface ConsentActions {
  canEdit: boolean;
  canApprove: boolean;
  canDeny: boolean;
  canRevoke: boolean;
  canEnable: boolean;
}

const getVisibleActions = (consent: ConsentBase): ConsentActions => {
  const isSubscriptionType = isSubscription(consent.type);

  return {
    canEdit:
      consent.status === ConsentStatuses.REQUESTED ||
      (consent.status === ConsentStatuses.GRANTED && isSubscriptionType),
    canApprove: consent.status === ConsentStatuses.REQUESTED,
    canDeny: consent.status === ConsentStatuses.REQUESTED,
    canRevoke: consent.status === ConsentStatuses.GRANTED,
    canEnable: consent.status === ConsentStatuses.REVOKED && isSubscriptionType,
  };
};

const getConsentTypeDisplay = (type: ConsentTypes) => {
  return isSubscription(type) ? "Subscription" : "Consent";
};

function LoadingSkeleton() {
  return (
    <div className="container mx-auto max-w-4xl space-y-6">
      <div className="h-8 w-24 animate-pulse rounded-md bg-muted" />
      <div className="h-10 w-64 animate-pulse rounded-md bg-muted" />

      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border p-6 space-y-4">
            <div className="h-6 w-40 animate-pulse rounded-md bg-muted" />
            <div className="space-y-2">
              <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
              <div className="h-4 w-3/4 animate-pulse rounded-md bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ErrorFallback() {
  const { goBack } = useNavigation();

  return (
    <div className="container mx-auto max-w-4xl py-12 text-center space-y-6">
      <div className="space-y-3">
        <h1 className="text-2xl font-bold text-foreground">
          Unable to Load Consent
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          We couldn't retrieve the consent details. This might be due to a
          network issue or the consent may no longer exist.
        </p>
      </div>

      <Button variant="outline" onClick={() => goBack("/consents")}>
        <ArrowLeft className="size-4 mr-2" />
        Back to Consents
      </Button>
    </div>
  );
}

function ConsentHeader({
  consent,
  onEdit,
  canEdit,
}: {
  consent: ConsentBase;
  onEdit: () => void;
  canEdit: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-start sm:justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-bold text-foreground">
              {getConsentTypeDisplay(consent.type)} Details
            </h1>
            <div className="flex items-center gap-2">
              <Badge variant={CONSENT_TYPE_VARIANTS[consent.type]}>
                {getConsentTypeDisplay(consent.type)}
              </Badge>
              <Badge variant={CONSENT_STATUS_VARIANTS[consent.status]}>
                {toTitleCase(consent.status)}
              </Badge>
            </div>
          </div>
          <p className="text-muted-foreground">
            Request from {consent.requester}
          </p>
        </div>

        {canEdit && (
          <Button variant="outline" onClick={onEdit}>
            Edit
          </Button>
        )}
      </div>

      <Separator />
    </div>
  );
}

function ConsentActionButtons({
  actions,
  onApprove,
  onDeny,
  onRevoke,
  onEnable,
  consentType,
}: {
  actions: ConsentActions;
  onApprove: () => void;
  onDeny: () => void;
  onRevoke: () => void;
  onEnable: () => void;
  consentType: ConsentTypes;
}) {
  const hasActions =
    actions.canApprove ||
    actions.canDeny ||
    actions.canRevoke ||
    actions.canEnable;

  if (!hasActions) return null;

  return (
    <div className="border-t pt-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-end gap-3">
        {actions.canApprove && (
          <Button size="lg" className="sm:w-auto" onClick={onApprove}>
            Approve {getConsentTypeDisplay(consentType)}
          </Button>
        )}

        {actions.canDeny && (
          <Button
            variant="outline"
            size="lg"
            className="sm:w-auto border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
            onClick={onDeny}
          >
            Deny {getConsentTypeDisplay(consentType)}
          </Button>
        )}

        {actions.canRevoke && (
          <Button
            variant="destructive"
            size="lg"
            className="sm:w-auto"
            onClick={onRevoke}
          >
            Revoke {getConsentTypeDisplay(consentType)}
          </Button>
        )}

        {actions.canEnable && (
          <Button
            variant="default"
            size="lg"
            className="sm:w-auto"
            onClick={onEnable}
          >
            Enable Subscription
          </Button>
        )}
      </div>
    </div>
  );
}

export default function ConsentDetail({ id, type }: ConsentDetailProps) {
  const queryClient = useQueryClient();
  const { goBack } = useNavigation();

  const [editedData, setEditedData] = useState<ConsentBase | null>(null);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [denyDialogOpen, setDenyDialogOpen] = useState(false);
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);
  const [enableDialogOpen, setEnableDialogOpen] = useState(false);

  const { data, isLoading, isError } = useConsentDetail({
    id,
    requestType: type,
  });

  const finalData = editedData || data;
  const actions = finalData ? getVisibleActions(finalData) : null;
  const isSubscriptionType = finalData ? isSubscription(finalData.type) : false;

  const editSubscriptionMutationFn = mutate(routes.subscription.edit, {
    pathParams: { subscriptionId: id },
  });

  const editSubscriptionMutation = useMutation({
    mutationFn: editSubscriptionMutationFn,
    onSuccess: (response) => {
      toast.success(response.detail);
      setIsEditSheetOpen(false);
      queryClient.invalidateQueries({ queryKey: ["consents", id] });
    },
  });

  useEffect(() => {
    if (data) {
      setEditedData(data);
    }
  }, [data]);

  const handleConsentUpdate = (updatedData: ConsentBase) => {
    if (
      isSubscription(finalData!.type) &&
      finalData!.status === ConsentStatuses.GRANTED
    ) {
      editSubscriptionMutation.mutate({
        hiuId: finalData!.hiu.id,
        subscription: buildSubscriptionPayload(updatedData),
      });
    } else {
      setEditedData(updatedData);
      toast.success("Consent updated successfully");
    }
  };

  if (isLoading) {
    return (
      <Page title="Loading..." hideTitleOnPage>
        <LoadingSkeleton />
      </Page>
    );
  }

  if (isError || !finalData) {
    return (
      <Page title="Error" hideTitleOnPage>
        <ErrorFallback />
      </Page>
    );
  }

  return (
    <Page
      title={`${getConsentTypeDisplay(finalData.type)} Details`}
      hideTitleOnPage
    >
      <div className="container mx-auto max-w-4xl space-y-8">
        {/* Back button */}
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => goBack("/consents")}
        >
          <ArrowLeft className="size-4 mr-2" />
          Back to Consents
        </Button>

        {/* Header */}
        <ConsentHeader
          consent={finalData}
          onEdit={() => setIsEditSheetOpen(true)}
          canEdit={actions?.canEdit ?? false}
        />

        {/* Content sections */}
        <div className="grid gap-6">
          <ConsentBasicDetails
            requester={finalData.requester}
            purpose={finalData.purpose.text}
            requestType={getConsentTypeDisplay(finalData.type)}
          />

          <ConsentDurationDetails
            fromDate={finalData.fromDate}
            toDate={finalData.toDate}
            dataEraseAt={finalData.dataEraseAt}
          />

          {finalData.hiTypes.length > 0 && (
            <ConsentHITypeDetails types={finalData.hiTypes} />
          )}

          {isSubscriptionType && finalData.subscriptionCategories && (
            <SubscriptionCategoryDetails
              categories={finalData.subscriptionCategories}
            />
          )}

          {finalData.links.length > 0 && (
            <ConsentHIPDetails
              hips={finalData.links}
              showContexts={!isSubscriptionType}
            />
          )}
        </div>

        {/* Action buttons */}
        {actions && (
          <ConsentActionButtons
            actions={actions}
            onApprove={() => setApproveDialogOpen(true)}
            onDeny={() => setDenyDialogOpen(true)}
            onRevoke={() => setRevokeDialogOpen(true)}
            onEnable={() => setEnableDialogOpen(true)}
            consentType={finalData.type}
          />
        )}
      </div>

      {/* Dialogs */}
      <EditConsentSheet
        open={isEditSheetOpen}
        setOpen={setIsEditSheetOpen}
        data={finalData}
        onUpdate={handleConsentUpdate}
        isLoading={editSubscriptionMutation.isPending}
      />

      <ConsentApproveDialog
        data={finalData}
        requestId={finalData.id}
        open={approveDialogOpen}
        setOpen={setApproveDialogOpen}
        isSubscription={isSubscriptionType}
      />

      <ConsentDenyDialog
        requestId={finalData.id}
        open={denyDialogOpen}
        setOpen={setDenyDialogOpen}
        isSubscription={isSubscriptionType}
      />

      <ConsentRevokeDialog
        requestId={finalData.id}
        open={revokeDialogOpen}
        setOpen={setRevokeDialogOpen}
        isSubscription={isSubscriptionType}
      />

      <ConsentEnableDialog
        requestId={finalData.id}
        open={enableDialogOpen}
        setOpen={setEnableDialogOpen}
      />
    </Page>
  );
}
