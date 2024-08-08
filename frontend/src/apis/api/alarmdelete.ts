import api from "../utils/instance";

export const deleteNotification = async (notificationId: number) => {
  try {
    const response = await api.delete(`/notification/${notificationId}`);
    return response;
  } catch (error) {
    throw error;
  }
};
