import api from "../utils/instance";

export type NotificationDto = {
  notificationId: number;
  isChecked: boolean;
  notificationType: "INVITATION" | "MESSAGE" | "ALERT";
  senderId: number;
  postId: number | null;
  createdAt: string;
  senderName: string;
  senderThumbnail: string | null;
};

export type NotificationResponseDto = {
  statusCode: number;
  message: string;
  data: NotificationDto[];
};

export const fetchNotifications =
  async (): Promise<NotificationResponseDto> => {
    try {
      const response = await api.get("/notification");
      return response.data;
    } catch (error) {
      console.error("알림 목록 조회 오류:", error);
      throw error;
    }
  };
