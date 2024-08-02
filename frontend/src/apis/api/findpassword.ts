import api from "../utils/instance";

export type temporarilyPasswordDto = {
  email: string;
  name: string;
};

export const temporarilyPassword = async (
  dto: temporarilyPasswordDto
): Promise<void> => {
  const response = await api.post(`/member/password`, dto);
  return response.data;
};
