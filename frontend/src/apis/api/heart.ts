import api from '../index';

export const registerPostHeart = async (postId: number): Promise<void> => {
  try {
    const response = await api.get(`/post/heart/${postId}`);
    if (response.status === 200) {
      console.log("좋아요 등록 성공");
    } else {
      throw new Error(`Error registering post heart: ${response.statusText}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Failed to register post heart:", error.message);
      throw new Error(`Failed to register post heart: ${error.message}`);
    } else {
      console.error("Failed to register post heart:", error);
      throw new Error("Failed to register post heart: An unknown error occurred.");
    }
  }
};
