import axios from "axios";
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

export const uploadImageToS3 = async (file: File, presignedUrl: string) => {
  await axios.put(presignedUrl, file);
};

export const uploadImage = async (file: File) => {
  const { presignedUrl, imageUrl } = await requestPresignedUrl({
    imageExtension: "png",
  });
  console.log(presignedUrl);
  await uploadImageToS3(file, presignedUrl);
  return imageUrl;
};
