import { ArrowLeftIcon } from "lucide-react";
import { navigate } from "raviger";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import Page from "@/components/common/Page";
import {
  ConsentBasicDetails,
  ConsentDurationDetails,
  ConsentHIPDetails,
  ConsentHITypesDetails,
  SubscriptionCategoriesDetails,
} from "@/components/consent/ConsentViewDetails";
import EditConsentSheet from "@/components/consent/EditConsentSheet";
import ConsentApproveDialog from "@/components/consent/dialogs/ConsentApproveDialog";
import ConsentDenyDialog from "@/components/consent/dialogs/ConsentDenyDialog";
import ConsentEnableDialog from "@/components/consent/dialogs/ConsentEnableDialog";
import ConsentRevokeDialog from "@/components/consent/dialogs/ConsentRevokeDialog";

import { useConsentDetail } from "@/hooks/useConsentData";

import {
  CONSENT_STATUS_VARIANTS,
  ConsentBase,
  ConsentStatuses,
  ConsentTypes,
  isSubscription,
} from "@/types/consent";
import { toTitleCase } from "@/utils";

interface ConsentDetailProps {
  id: string;
  type: ConsentTypes;
}

const getVisibleActions = (consent: ConsentBase) => {
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

function LoadingSkeleton() {
  return (
    <div className="container mx-auto max-w-3xl space-y-6">
      <div className="h-8 w-48 animate-pulse rounded-md bg-gray-200" />
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-lg border p-6">
            <div className="h-6 w-32 animate-pulse rounded-md bg-gray-200 mb-4" />
            <div className="space-y-2">
              <div className="h-4 w-full animate-pulse rounded-md bg-gray-200" />
              <div className="h-4 w-3/4 animate-pulse rounded-md bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ErrorFallback() {
  return (
    <div className="container mx-auto max-w-3xl py-8 text-center space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Something went wrong</h1>
      <p className="text-gray-600">
        Unable to load consent details. Please try again later.
      </p>
      <Button variant="outline" onClick={() => navigate("/consents")}>
        <ArrowLeftIcon className="size-4 mr-2" />
        Back to Consents
      </Button>
    </div>
  );
}

export default function ConsentDetail({ id, type }: ConsentDetailProps) {
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

  useEffect(() => {
    if (data) {
      setEditedData(data);
    }
  }, [data]);

  const handleConsentUpdate = (updatedData: ConsentBase) => {
    setEditedData(updatedData);
  };

  if (isLoading) {
    return (
      <Page title="Loading">
        <LoadingSkeleton />
      </Page>
    );
  }

  if (isError || !finalData) {
    return (
      <Page title="Error">
        <ErrorFallback />
      </Page>
    );
  }

  const isSubscriptionType = isSubscription(finalData.type);

  return (
    <Page title={toTitleCase(finalData.type)} hideTitleOnPage>
      {/* Main Content */}
      <div className="container mx-auto max-w-3xl space-y-6">
        <Button
          variant="outline"
          className="mb-2"
          onClick={() => navigate("/consents")}
        >
          <ArrowLeftIcon className="size-4" />
          Back
        </Button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">Consent Details</h1>
            <Badge variant={CONSENT_STATUS_VARIANTS[finalData.status]}>
              {toTitleCase(finalData.status)}
            </Badge>
          </div>
          {actions?.canEdit && (
            <Button variant="outline" onClick={() => setIsEditSheetOpen(true)}>
              Edit
            </Button>
          )}
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          <ConsentBasicDetails
            requester={finalData.requester}
            purpose={finalData.purpose}
            requestType={isSubscriptionType ? "Subscription" : "Consent"}
          />

          <ConsentDurationDetails
            fromDate={finalData.fromDate}
            toDate={finalData.toDate}
            dataEraseAt={finalData.dataEraseAt}
          />

          {finalData.hiTypes.length > 0 && (
            <ConsentHITypesDetails types={finalData.hiTypes} />
          )}

          {isSubscriptionType && finalData.subscriptionCategories && (
            <SubscriptionCategoriesDetails
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

        {/* Action Buttons */}
        {actions &&
          (actions.canApprove ||
            actions.canDeny ||
            actions.canRevoke ||
            actions.canEnable) && (
            <div className="flex flex-col sm:flex-row items-center sm:justify-end gap-3 mt-4">
              {actions.canApprove && (
                <Button
                  variant="default"
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white px-6 py-2 transition"
                  onClick={() => setApproveDialogOpen(true)}
                >
                  Approve
                </Button>
              )}

              {actions.canDeny && (
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border border-red-500 text-red-500 hover:bg-red-50 px-6 py-2 transition"
                  onClick={() => setDenyDialogOpen(true)}
                >
                  Deny
                </Button>
              )}

              {actions.canRevoke && (
                <Button
                  variant="destructive"
                  className="w-full sm:w-auto"
                  onClick={() => setRevokeDialogOpen(true)}
                >
                  Revoke
                </Button>
              )}

              {actions.canEnable && (
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => setEnableDialogOpen(true)}
                >
                  Enable
                </Button>
              )}
            </div>
          )}
      </div>

      {/* Dialogs */}
      <EditConsentSheet
        open={isEditSheetOpen}
        setOpen={setIsEditSheetOpen}
        consentType={finalData.type}
        data={finalData}
        onUpdate={handleConsentUpdate}
      />

      <ConsentApproveDialog
        requestId={finalData.id}
        open={approveDialogOpen}
        closeModal={() => setApproveDialogOpen(false)}
      />

      <ConsentDenyDialog
        requestId={finalData.id}
        open={denyDialogOpen}
        closeModal={() => setDenyDialogOpen(false)}
      />

      <ConsentRevokeDialog
        requestId={finalData.id}
        open={revokeDialogOpen}
        closeModal={() => setRevokeDialogOpen(false)}
      />

      <ConsentEnableDialog
        requestId={finalData.id}
        open={enableDialogOpen}
        closeModal={() => setEnableDialogOpen(false)}
      />
    </Page>
  );
}
