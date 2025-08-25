import { CheckCheck, RotateCw } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import {
  NOTIFICATION_ICONS,
  NOTIFICATION_STATUS_LABELS,
  NotificationStatuses,
} from "@/types/notification";

interface NotificationFiltersProps {
  status: NotificationStatuses;
  onStatusChange: (status: NotificationStatuses) => void;
  onMarkAllAsRead: () => void;
  onRefresh: () => void;
  isMarkAllAsReadDisabled: boolean;
}

export const NotificationFilters = ({
  status,
  onStatusChange,
  onMarkAllAsRead,
  onRefresh,
  isMarkAllAsReadDisabled,
}: NotificationFiltersProps) => {
  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-700 mb-2">Notifications</h1>
        <p className="text-gray-600 text-sm">
          View and manage your notifications
        </p>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="inline-flex items-center rounded-xl border bg-muted p-1">
          {Object.entries(NOTIFICATION_STATUS_LABELS).map(([key, label]) => {
            const k = key as NotificationStatuses;
            const Icon = NOTIFICATION_ICONS[k];
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
        <div className="inline-flex rounded-md shadow-sm">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            className="rounded-r-none border-r-0 flex items-center gap-1.5"
          >
            <RotateCw className="size-4" />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onMarkAllAsRead}
            className="rounded-l-none flex items-center gap-1.5"
            disabled={isMarkAllAsReadDisabled}
          >
            <CheckCheck className="size-4" />
            Mark all as read
          </Button>
        </div>
      </div>
    </div>
  );
};
