import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FolderOpen } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

import { EmptyState } from "@/components/ui/empty-state";

import Page from "@/components/common/Page";
import Pagination from "@/components/common/Pagination";
import { NotificationFilters } from "@/components/notifications/NotificationFilters";
import NotificationList from "@/components/notifications/NotificationList";

import { useQueryParams } from "@/hooks/useQueryParams";

import {
  CardGridSkeleton,
  TableSkeleton,
} from "@/common/loaders/SkeletonLoader";

import routes from "@/api";
import { NotificationStatuses } from "@/types/notification";
import { mutate, query } from "@/utils/request/request";

const NOTIFICATION_LIST_LIMIT = 10;

export default function Notifications() {
  const queryClient = useQueryClient();

  const { params, updateQuery } = useQueryParams({
    limit: NOTIFICATION_LIST_LIMIT,
  });

  useEffect(() => {
    if (params.status) return;

    updateQuery({
      status: NotificationStatuses.ALL,
    });
  }, [params.status, updateQuery]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notifications", params],
    queryFn: query(routes.notification.list, {
      queryParams: {
        ...(params.status === NotificationStatuses.READ && {
          is_read: true,
        }),
        ...(params.status === NotificationStatuses.UNREAD && {
          is_read: false,
        }),
        limit: params.limit,
        offset: ((params.page ?? 1) - 1) * params.limit,
      },
    }),
  });

  const { mutate: markAsRead } = useMutation({
    mutationFn: (id: string) =>
      mutate(routes.notification.markAsRead, {
        pathParams: { id },
      })(undefined),
    onSuccess: () => {
      toast.success("Successfully marked as read");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notificationUnreadCount"] });
    },
  });

  const { mutate: markAllAsRead } = useMutation({
    mutationFn: () => mutate(routes.notification.markAllAsRead)(undefined),
    onSuccess: () => {
      toast.success("Successfully marked all as read");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notificationUnreadCount"] });
    },
  });

  const isEmpty = !isLoading && (!data?.results || data.results.length === 0);
  const notifications = data?.results || [];
  const totalCount = data?.count || 0;

  const filterProps = {
    status: params.status,
    onStatusChange: (status: NotificationStatuses) => {
      updateQuery({
        status,
      });
    },
    onMarkAllAsRead: markAllAsRead,
    isMarkAllAsReadDisabled:
      isLoading || isEmpty || isError || notifications.every((e) => e.is_read),
    onRefresh: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Refreshed notifications");
    },
  };

  return (
    <Page title="Notifications" hideTitleOnPage>
      <div className="w-full mx-auto mt-2 space-y-6">
        <NotificationFilters {...filterProps} />

        {isLoading && (
          <>
            <div className="grid gap-4 md:grid-cols-1 md:hidden">
              <CardGridSkeleton count={4} />
            </div>
            <div className="hidden md:block">
              <TableSkeleton count={5} />
            </div>
          </>
        )}

        {(isEmpty || isError) && !isLoading && (
          <EmptyState
            icon={FolderOpen}
            title="No notifications found"
            description={
              params.status === NotificationStatuses.ALL
                ? "You don't have any notifications yet"
                : params.status === NotificationStatuses.UNREAD
                  ? "You don't have any unread notifications"
                  : "You don't have any read notifications"
            }
          />
        )}

        {notifications && notifications.length > 0 && !isLoading && (
          <NotificationList
            notifications={notifications}
            onMarkAsRead={markAsRead}
          />
        )}

        <div className="flex justify-center">
          {!isLoading && totalCount > NOTIFICATION_LIST_LIMIT && (
            <Pagination
              data={{ totalCount }}
              onChange={(page) => {
                updateQuery({
                  page,
                });
              }}
              defaultPerPage={params.limit}
              cPage={params.page}
            />
          )}
        </div>
      </div>
    </Page>
  );
}
