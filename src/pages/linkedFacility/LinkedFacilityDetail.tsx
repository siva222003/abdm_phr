import { ArrowLeft, Link2 } from "lucide-react";
import { navigate } from "raviger";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import Page from "@/components/common/Page";

import { usePatientLinks } from "@/hooks/usePatientLinks";

import { CardListSkeleton } from "@/common/loaders/SkeletonLoader";

import { PatientCareContext } from "@/types/gateway";

function LinkedFacilityDetailHeader({
  title = "Linked Facility",
}: {
  title?: string;
}) {
  return (
    <div className="space-y-4">
      <Button variant="ghost" onClick={() => navigate("/linked-facilities")}>
        <ArrowLeft className="size-4 mr-2" />
        Back to Facilities
      </Button>
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View and manage your care contexts
        </p>
      </div>
    </div>
  );
}

function LinkedFacilityDetailCard({
  careContext,
}: {
  careContext: PatientCareContext;
}) {
  return (
    <Card className="transition-all duration-200 rounded-lg hover:border-primary/50 hover:shadow-sm py-0">
      <CardContent className="flex items-start gap-3 p-3">
        <div className="rounded-sm p-3 flex items-center justify-center bg-primary-100">
          <Link2 className="size-4" />
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <h3 className="text-foreground text-sm sm:text-base">
            {careContext.display}
          </h3>
          <p className="text-xs text-muted-foreground">
            {careContext.careContextReference}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function ErrorFallback() {
  return (
    <div className="text-center space-y-6 py-12">
      <div className="space-y-3">
        <h1 className="text-2xl font-bold text-foreground">
          Unable to Load Linked Facility
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          We couldn't retrieve the linked facility details. This might be due to
          a network issue or the linked facility may no longer exist.
        </p>
      </div>
      <Button variant="outline" onClick={() => navigate("/linked-facilities")}>
        <ArrowLeft className="size-4 mr-2" />
        Back to Linked Facilities
      </Button>
    </div>
  );
}

export default function LinkedFacilityDetail({ id }: { id: string }) {
  const { patientLinks, isLoading, isError } = usePatientLinks();

  const data = patientLinks?.find((link) => link.hip.id === id);

  if (isLoading) {
    return (
      <Page title="Loading..." hideTitleOnPage>
        <div className="container mx-auto max-w-4xl space-y-6">
          <LinkedFacilityDetailHeader />
          <CardListSkeleton count={4} />
        </div>
      </Page>
    );
  }

  if (isError || !data) {
    return (
      <Page title="Error" hideTitleOnPage>
        <div className="container mx-auto max-w-4xl space-y-6">
          <LinkedFacilityDetailHeader />
          <ErrorFallback />
        </div>
      </Page>
    );
  }

  return (
    <Page title={data.hip.name} hideTitleOnPage>
      <div className="container mx-auto max-w-4xl space-y-6">
        <LinkedFacilityDetailHeader title={data?.hip.name} />

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            Care Contexts
          </h2>
          <div className="space-y-2">
            {data.careContexts.map((careContext) => (
              <LinkedFacilityDetailCard
                key={careContext.careContextReference}
                careContext={careContext}
              />
            ))}
          </div>
        </div>
      </div>
    </Page>
  );
}
