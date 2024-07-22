import api from "../utils/instance";

export type PresignedUrlnRequestDto = {
  imageExtension: "jpg" | "jpeg" | "png";
};
export type PresignedUrlnResponseDto = {
  presignedUrl: string;
  imageUrl: string;
};

export const requestPresignedUrl = async (
  dto: PresignedUrlnRequestDto
): Promise<PresignedUrlnResponseDto> => {
  const response = await api.post<PresignedUrlnResponseDto>(`/presigned`, dto);
  return response.data;
};
