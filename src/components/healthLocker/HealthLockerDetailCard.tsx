import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface HealthLockerDetailCardProps {
  isActive: boolean;
  onClick: () => void;
  icon: React.ElementType;
  isSubscription?: boolean;
}

const HealthLockerDetailCard = ({
  isActive,
  onClick,
  icon: Icon,
  isSubscription = false,
}: HealthLockerDetailCardProps) => {
  return (
    <Card className="transition-all duration-200 rounded-lg hover:border-primary/50 hover:shadow-sm py-0">
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
};
export default HealthLockerDetailCard;
