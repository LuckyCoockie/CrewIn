import api from "../utils/instance";

export const deletePostHeart = async (postId: number): Promise<void> => {
  try {
    await api.delete(`/post/heart/${postId}`);
  } catch (error) {
    console.error("좋아요 제거 중 오류가 발생했습니다:", error);
    throw error;
  }
};
