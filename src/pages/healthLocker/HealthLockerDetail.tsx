import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Podcast, ShieldCheck } from "lucide-react";
import { navigate } from "raviger";
import { useState } from "react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import Page from "@/components/common/Page";
import AutoApprovalConfirmDialog from "@/components/healthLocker/AutoApprovalConfirmDialog";

import { CardListSkeleton } from "@/common/loaders/SkeletonLoader";

import routes from "@/api";
import { query } from "@/utils/request/request";

interface HealthLockerDetailCardProps {
  isActive: boolean;
  onClick: () => void;
  icon: React.ElementType;
  isSubscription: boolean;
}

interface AutoApprovalState {
  autoApprovalId: string;
  isEnable: boolean;
}

function HealthLockerDetailHeader({
  title = "Health Locker",
}: {
  title?: string;
}) {
  return (
    <div className="space-y-4">
      <Button variant="ghost" onClick={() => navigate("/health-lockers")}>
        <ArrowLeft className="size-4 mr-2" />
        Back to Health Lockers
      </Button>
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View and manage your health locker settings
        </p>
      </div>
    </div>
  );
}

function HealthLockerDetailCard({
  isActive,
  onClick,
  icon: Icon,
  isSubscription,
}: HealthLockerDetailCardProps) {
  return (
    <Card className="transition-all duration-200 hover:border-primary/50 hover:shadow-sm py-0">
      <CardContent className="flex items-start gap-3 p-3">
        <div
          className={cn(
            "rounded-sm p-3 flex items-center justify-center",
            isActive ? "bg-green-100" : "bg-red-100",
          )}
        >
          <Icon className="size-4" />
        </div>

        <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold truncate text-foreground text-base">
              {isSubscription ? "Subscription" : "Auto Approval"}
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {isActive ? "Approved" : "Revoked"}
            </p>
          </div>

          <Button
            onClick={onClick}
            variant="outline"
            size="sm"
            className="shrink-0 w-full sm:w-auto text-xs"
          >
            {isSubscription
              ? "View Subscription"
              : isActive
                ? "Disable Auto Approval"
                : "Enable Auto Approval"}
            <ArrowRight className="size-3 ml-1" />
          </Button>
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
          Unable to Load Health Locker
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          We couldn't retrieve the health locker details. This might be due to a
          network issue or the health locker may no longer exist.
        </p>
      </div>
      <Button variant="outline" onClick={() => navigate("/health-lockers")}>
        <ArrowLeft className="size-4 mr-2" />
        Back to Health Lockers
      </Button>
    </div>
  );
}

export default function HealthLockerDetail({ id }: { id: string }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAutoApproval, setSelectedAutoApproval] =
    useState<AutoApprovalState | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["patientLocker", id],
    queryFn: query(routes.healthLocker.getPatientLocker, {
      pathParams: { lockerId: id },
    }),
  });

  const handleAutoApprovalClick = (
    autoApprovalId: string,
    isActive: boolean,
  ) => {
    setSelectedAutoApproval({
      autoApprovalId,
      isEnable: !isActive,
    });
    setDialogOpen(true);
  };

  const handleSubscriptionClick = (subscriptionId: string) => {
    navigate(`/consents/${subscriptionId}/subscription-artefact`);
  };

  if (isLoading) {
    return (
      <Page title="Loading..." hideTitleOnPage>
        <div className="container mx-auto max-w-4xl space-y-6">
          <HealthLockerDetailHeader />
          <CardListSkeleton count={4} />
        </div>
      </Page>
    );
  }

  if (isError || !data) {
    return (
      <Page title="Error" hideTitleOnPage>
        <div className="container mx-auto max-w-4xl space-y-6">
          <HealthLockerDetailHeader />
          <ErrorFallback />
        </div>
      </Page>
    );
  }

  return (
    <Page title={data.lockerName} hideTitleOnPage>
      <div className="container mx-auto max-w-4xl space-y-6">
        <HealthLockerDetailHeader title={data.lockerName} />

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            Subscriptions
          </h2>
          <div className="space-y-2">
            {data.subscriptions.map((subscription) => (
              <HealthLockerDetailCard
                key={subscription.subscriptionId}
                isActive={subscription.status === "GRANTED"}
                onClick={() =>
                  handleSubscriptionClick(subscription.subscriptionId)
                }
                icon={Podcast}
                isSubscription
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            Auto Approvals
          </h2>
          <div className="space-y-2">
            {data.autoApprovals.map((autoApproval) => (
              <HealthLockerDetailCard
                key={autoApproval.autoApprovalId}
                isActive={autoApproval.isActive}
                onClick={() =>
                  handleAutoApprovalClick(
                    autoApproval.autoApprovalId,
                    autoApproval.isActive,
                  )
                }
                icon={ShieldCheck}
                isSubscription={false}
              />
            ))}
          </div>
        </div>

        {selectedAutoApproval && (
          <AutoApprovalConfirmDialog
            open={dialogOpen}
            setOpen={setDialogOpen}
            autoApprovalId={selectedAutoApproval.autoApprovalId}
            lockerId={id}
            isEnable={selectedAutoApproval.isEnable}
          />
        )}
      </div>
    </Page>
  );
}
