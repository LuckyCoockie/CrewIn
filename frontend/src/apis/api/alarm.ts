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
    console.log(response);
    return response.data;
  };
