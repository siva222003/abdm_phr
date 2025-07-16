import { ArrowLeftIcon } from "lucide-react";
import { navigate } from "raviger";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import Page from "@/components/common/Page";
import {
  ConsentBasicDetails,
  ConsentDurationDetails,
  ConsentHIPs,
  ConsentHealthInformationTypes,
  SubscriptionCategories,
} from "@/components/consent/ConsentViewDetails";
import EditConsentSheet from "@/components/consent/EditConsentSheet";

import { useConsentDetail } from "@/hooks/useConsentData";

import { ConsentType, ConsentTypes } from "@/types/consent";

interface Props {
  id: string;
  type: ConsentType;
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

  console.log(id, type);
  const { isLoading } = useConsentDetail({
    id,
    requestType: type,
  });

  if (isLoading) {
    return (
      <Page title="Loading">
        <LoadingSkeleton />
      </Page>
    );
  }

  //   if (isError || !product) {
  //     return (
  //       <Page title={t("error")}>
  //         <div className="container mx-auto max-w-3xl py-8">
  //           <Alert variant="destructive">
  //             <CareIcon icon="l-exclamation-triangle" className="size-4" />
  //             <AlertTitle>{t("error_loading_product")}</AlertTitle>
  //             <AlertDescription>{t("product_not_found")}</AlertDescription>
  //           </Alert>
  //           <Button
  //             variant="outline"
  //             className="mt-4"
  //             onClick={() => navigate(`/facility/${facilityId}/settings/product`)}
  //           >
  //             <CareIcon icon="l-arrow-left" className="mr-2 size-4" />
  //             {t("back_to_list")}
  //           </Button>
  //         </div>
  //       </Page>
  //     );
  //   }

  return (
    <Page title="Consent Request" hideTitleOnPage>
      <div className="container mx-auto max-w-3xl space-y-6">
        <EditConsentSheet open={open} setOpen={setOpen} consentType={type} />
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
              {/* <Badge variant={PRODUCT_STATUS_COLORS[1]}>1</Badge> */}
            </div>
          </div>
          <Button variant="outline" onClick={() => setOpen(true)}>
            Edit
          </Button>
        </div>
        <ConsentBasicDetails />
        <ConsentDurationDetails />
        <ConsentHealthInformationTypes />
        {type === ConsentTypes.SUBSCRIPTION && <SubscriptionCategories />}
        <ConsentHIPs />
      </div>
    </Page>
  );
}
