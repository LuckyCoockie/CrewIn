import api from "../utils/instance";

export const deletePostHeart = async (postId: number): Promise<void> => {
  await api.delete(`/post/heart/${postId}`);
};
