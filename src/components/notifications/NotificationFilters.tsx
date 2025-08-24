import { Bell, BellDot, Inbox } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

export enum NotificationStatuses {
  ALL = "all",
  READ = "read",
  UNREAD = "unread",
}

export const NOTIFICATION_STATUS_LABELS: Record<NotificationStatuses, string> =
  {
    [NotificationStatuses.ALL]: "All",
    [NotificationStatuses.READ]: "Read",
    [NotificationStatuses.UNREAD]: "Unread",
  };

const ICONS: Record<NotificationStatuses, React.ElementType> = {
  [NotificationStatuses.ALL]: Inbox,
  [NotificationStatuses.READ]: Bell,
  [NotificationStatuses.UNREAD]: BellDot,
};

interface NotificationFiltersProps {
  status: NotificationStatuses;
  onStatusChange: (status: NotificationStatuses) => void;
}

export const NotificationFilters = ({
  status,
  onStatusChange,
}: NotificationFiltersProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Notifications</h1>
        <p className="text-sm text-muted-foreground">
          View and manage your notifications
        </p>
      </div>

      <div className="inline-flex items-center rounded-xl border bg-muted p-1">
        {Object.entries(NOTIFICATION_STATUS_LABELS).map(([key, label]) => {
          const k = key as NotificationStatuses;
          const Icon = ICONS[k];
          return (
            <Button
              key={key}
              variant="ghost"
              size="sm"
              onClick={() => onStatusChange(k)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 transition-all",
                status === k
                  ? "bg-background text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="size-4" />
              {label}
            </Button>
          );
        })}
      </div>
    </div>
  );
};
