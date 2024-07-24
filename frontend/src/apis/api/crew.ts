import api from "../utils/instance";

export type CrewDto = {
  id: number;
  name: string;
  slogan: string;
  area: string;
  crewCount: number;
  captainName: string;
  imageUrl: string;
};

export type GetCrewListRequestDto = {
  pageNo: number;
};

export type GetCrewListResponseDto = {
  crews: CrewDto[];
  pageNo: number;
  lastPageNo: number;
};

export const getCrewList = async (
  dto: GetCrewListRequestDto
): Promise<GetCrewListResponseDto> => {
  const response = await api.get("/crew", { params: dto });
  return response.data;
};
