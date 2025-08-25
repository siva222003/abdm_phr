import { Bell, BellDot, Inbox } from "lucide-react";

import { SubscriptionCategories } from "./subscription";

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

export const NOTIFICATION_ICONS: Record<
  NotificationStatuses,
  React.ElementType
> = {
  [NotificationStatuses.ALL]: Inbox,
  [NotificationStatuses.READ]: Bell,
  [NotificationStatuses.UNREAD]: BellDot,
};

export interface Notification {
  id: string;
  event_id: string;
  category: SubscriptionCategories;
  subscription_id: string;
  published_at: string;

  abha_address: string;
  hip_id: string;
  contexts: any; // TODO: Add type

  title: string;
  description: string;

  is_read: boolean;
  raw_event_data: any; // TODO: Add type
}

export interface NotificationResponse {
  count: number;
  results: Notification[];
}

export interface NotificationUnreadCountResponse {
  unread_count: number;
}

export interface NotificationMarkAllAsReadResponse {
  detail: string;
}
