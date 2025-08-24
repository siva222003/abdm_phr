import { SubscriptionCategories } from "./subscription";

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
