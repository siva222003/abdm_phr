import {
  NotificationResponse,
  NotificationUnreadCountResponse,
} from "@/types/notification";
import { API } from "@/utils/request/api";

export const notification = {
  list: API<NotificationResponse>("GET /phr/notification/"),
  unreadCount: API<NotificationUnreadCountResponse>(
    "GET /phr/notification/unread_count",
  ),
  markAsRead: API<void>("POST /phr/notification/{id}/mark_read"),
  markAllAsRead: API<void>("POST /phr/notification/mark_all_read"),
};
