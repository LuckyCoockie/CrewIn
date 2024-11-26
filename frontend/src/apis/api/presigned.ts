import axios from "axios";
import api from "../utils/instance";
import { convertImageToWebP } from "../../util/webp/convertImageToWebP.ts";

export type PresignedUrlnRequestDto = {
  imageExtension: "webp";
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
  const blob = new Blob([file], { type: file.type });
  const webp = await convertImageToWebP(blob);
  await axios.put(presignedUrl, webp, {
    headers: { "Content-Type": "image/webp" },
  });
};

export const uploadImage = async (file: File) => {
  const { presignedUrl, imageUrl } = await requestPresignedUrl({
    imageExtension: "webp",
  });
  await uploadImageToS3(file, presignedUrl);
  return imageUrl;
};
