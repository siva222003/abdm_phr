import { ArrowLeftIcon } from "lucide-react";
import { navigate } from "raviger";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import Page from "@/components/common/Page";
import ConsentConfirmDialog from "@/components/consent/ConsentConfirmDialog";
import {
  ConsentBasicDetails,
  ConsentDurationDetails,
  ConsentHIPDetails,
  ConsentHITypesDetails,
  SubscriptionCategoriesDetails,
} from "@/components/consent/ConsentViewDetails";
import EditConsentSheet from "@/components/consent/EditConsentSheet";

import { useConsentDetail } from "@/hooks/useConsentData";

import {
  CONSENT_STATUS_VARIANTS,
  ConsentBase,
  ConsentTypes,
  isSubscription,
} from "@/types/consent";
import { toTitleCase } from "@/utils";

interface Props {
  id: string;
  type: ConsentTypes;
}

function LoadingSkeleton() {
  return (
    <div className="container mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-48 animate-pulse rounded-md bg-gray-200" />
          <div className="h-4 w-32 animate-pulse rounded-md bg-gray-200" />
        </div>
      </div>
      <div className="space-y-6">
        <div className="rounded-lg border border-gray-200 p-6">
          <div className="space-y-4">
            <div className="h-6 w-32 animate-pulse rounded-md bg-gray-200" />
            <div className="space-y-2">
              <div className="h-4 w-full animate-pulse rounded-md bg-gray-200" />
              <div className="h-4 w-3/4 animate-pulse rounded-md bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConsentDetail({ id, type }: Props) {
  const [open, setOpen] = useState(false);
  const [isDenyModalOpen, setIsDenyModalOpen] = useState(false);
  const [editedData, setEditedData] = useState<ConsentBase | null>(null);

  const { data, isLoading, isError } = useConsentDetail({
    id,
    requestType: type,
  });

  useEffect(() => {
    if (data) {
      setEditedData(data);
    }
  }, [data]);

  if (isLoading) {
    return (
      <Page title="Loading">
        <LoadingSkeleton />
      </Page>
    );
  }

  if (isError || !data) {
    return (
      <Page title="Error">
        <div className="container mx-auto max-w-3xl py-8">
          <h1>Error</h1>
        </div>
      </Page>
    );
  }

  const finalData = editedData || data;

  // const handleConsentDeny = () => {
  //   console.log("Consent denied");
  // };

  const handleConsentUpdate = (updatedData: ConsentBase) => {
    setEditedData(updatedData);
    console.log("Consent updated locally:", updatedData);
  };

  return (
    <Page title={toTitleCase(type)} hideTitleOnPage>
      <div className="container mx-auto max-w-3xl space-y-6">
        <EditConsentSheet
          open={open}
          setOpen={setOpen}
          consentType={type}
          data={finalData}
          onUpdate={handleConsentUpdate}
        />
        <Button
          variant="outline"
          className="mb-2"
          onClick={() => navigate("/consents")}
        >
          <ArrowLeftIcon className="size-4" />
          Back
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">Consent Details</h1>
              <Badge variant={CONSENT_STATUS_VARIANTS[finalData.status]}>
                {toTitleCase(finalData.status)}
              </Badge>
            </div>
          </div>
          <Button variant="outline" onClick={() => setOpen(true)}>
            Edit
          </Button>
        </div>
        <ConsentBasicDetails
          requester={finalData.requester}
          purpose={finalData.purpose}
          requestType={isSubscription(type) ? "Subscription" : "Consent"}
        />
        <ConsentDurationDetails
          fromDate={finalData.fromDate}
          toDate={finalData.toDate}
          dataEraseAt={finalData.dataEraseAt}
        />
        {finalData.hiTypes.length > 0 && (
          <ConsentHITypesDetails types={finalData.hiTypes} />
        )}
        {isSubscription(type) && finalData.subscriptionCategories && (
          <SubscriptionCategoriesDetails
            categories={finalData.subscriptionCategories}
          />
        )}
        {finalData.links.length > 0 && (
          <ConsentHIPDetails
            hips={finalData.links}
            showContexts={!isSubscription(type)}
          />
        )}
        <div className="flex items-center justify-end gap-2">
          <Button variant="primary" onClick={() => {}}>
            Approve
          </Button>
          <Button
            variant="warning"
            className="border-red-500 text-red-500"
            onClick={() => setIsDenyModalOpen(true)}
          >
            Deny
          </Button>
        </div>
      </div>
      <ConsentConfirmDialog
        requestId={finalData.id}
        open={isDenyModalOpen}
        setOpen={setIsDenyModalOpen}
      />
    </Page>
  );
}
