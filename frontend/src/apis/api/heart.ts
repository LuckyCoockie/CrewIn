import api from "../index";

export const registerPostHeart = async (postId: number): Promise<void> => {
  try {
    const response = await api.get(`/post/heart/${postId}`);
    if (response.status === 200) {
      /* empty */
    } else {
      throw new Error(`Error registering post heart: ${response.statusText}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to register post heart: ${error.message}`);
    } else {
      throw new Error(
        "Failed to register post heart: An unknown error occurred."
      );
    }
  }
};
