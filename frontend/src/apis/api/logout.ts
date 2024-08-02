import api from "../utils/instance";

export const logout = async (): Promise<void> => {
  const response = await api.post(`member/logout`);
  return response.data;
};
