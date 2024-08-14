import api from "../utils/instance";

export type NotificationDto = {
  notificationId: number;
  isChecked: boolean;
  notificationType: string;
  senderId: number;
  postId: number | null;
  createdAt: string;
  senderName: string;
  senderThumbnail: string | null;
};

export type FetchNotificationsResponseDto = NotificationDto[];

export const fetchNotifications =
  async (): Promise<FetchNotificationsResponseDto> => {
    const response = await api.get("/notification");
    return response.data;
  };

export type CheckNotificationsResponseDto = {
  exist: boolean;
};

export const checkNotificationsExist =
  async (): Promise<CheckNotificationsResponseDto> => {
    const response = await api.get("/notification/exist");
    return response.data;
  };
