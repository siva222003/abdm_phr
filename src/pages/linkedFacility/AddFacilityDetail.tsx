import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { navigate } from "raviger";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import Page from "@/components/common/Page";
import DiscoverRecordsStep from "@/components/linkedFacility/DiscoverRecordsStep";
import LinkFacilitySuccessStep from "@/components/linkedFacility/LinkFacilitySuccessStep";
import OtpVerificationStep from "@/components/linkedFacility/OtpVerificationStep";
import SearchRecordsStep from "@/components/linkedFacility/SearchRecordsStep";
import StepIndicator from "@/components/linkedFacility/StepIndicator";

import { CardListSkeleton } from "@/common/loaders/SkeletonLoader";

import routes from "@/api";
import {
  UserInitLinkingDiscoverResponse,
  UserInitLinkingInitResponse,
} from "@/types/linkedFacility";
import { query } from "@/utils/request/request";

function AddFacilityDetailHeader({
  title = "Linked Facility",
}: {
  title?: string;
}) {
  return (
    <div className="space-y-4">
      <Button
        variant="ghost"
        onClick={() => navigate("/linked-facilities/add")}
      >
        <ArrowLeft className="size-4 mr-2" />
        Back to Facilities
      </Button>
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Complete the steps below to link this facility to your account.
        </p>
      </div>
    </div>
  );
}

function ErrorFallback() {
  return (
    <div className="text-center space-y-6 py-12">
      <div className="space-y-3">
        <h1 className="text-2xl font-bold text-foreground">
          Unable to Load Facility
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          We couldn't retrieve the facility details. This might be due to a
          network issue or the facility may no longer exist.
        </p>
      </div>
      <Button
        variant="outline"
        onClick={() => navigate("/linked-facilities/add")}
      >
        <ArrowLeft className="size-4 mr-2" />
        Back to Facilities
      </Button>
    </div>
  );
}

export default function AddFacilityDetail({ id }: { id: string }) {
  const [step, setStep] = useState(3);

  const [secondStepData, setSecondStepData] =
    useState<UserInitLinkingDiscoverResponse | null>(null);
  const [thirdStepData, setThirdStepData] =
    useState<UserInitLinkingInitResponse | null>({
      transactionId: "f901b782-bfdf-4224-9f8d-da2cadc20c0d",
      link: {
        referenceNumber: "d353b782-bfdf-4224-9f8d-da2cadc20c0d",
        authenticationType: "DIRECT",
        meta: {
          communicationMedium: "MOBILE",
          communicationHint: "OTP",
          communicationExpiry: "2024-05-01T05:22:34.123Z",
        },
      },
    });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["provider", id],
    queryFn: query(routes.gateway.getProvider, {
      pathParams: {
        providerId: id,
      },
    }),
  });

  if (isLoading) {
    return (
      <Page title="Loading..." hideTitleOnPage>
        <div className="container mx-auto max-w-4xl space-y-6">
          <AddFacilityDetailHeader />
          <CardListSkeleton count={4} />
        </div>
      </Page>
    );
  }

  if (isError || !data) {
    return (
      <Page title="Error" hideTitleOnPage>
        <div className="container mx-auto max-w-4xl space-y-6">
          <AddFacilityDetailHeader />
          <ErrorFallback />
        </div>
      </Page>
    );
  }

  return (
    <Page title={data.identifier.name} hideTitleOnPage>
      <div className="container mx-auto max-w-4xl space-y-6">
        <AddFacilityDetailHeader title={data.identifier.name} />

        <Card className="min-h-[400px]">
          <StepIndicator step={step} />
          {step === 1 && (
            <SearchRecordsStep
              hip={data.identifier}
              setStep={setStep}
              setSecondStepData={setSecondStepData}
            />
          )}
          {step === 2 && (
            <DiscoverRecordsStep
              hip={data.identifier}
              setStep={setStep}
              secondStepData={secondStepData}
              setThirdStepData={setThirdStepData}
            />
          )}
          {step === 3 && (
            <OtpVerificationStep
              hip={data.identifier}
              setStep={setStep}
              thirdStepData={thirdStepData}
            />
          )}
          {step === 4 && <LinkFacilitySuccessStep />}
        </Card>
      </div>
    </Page>
  );
}
