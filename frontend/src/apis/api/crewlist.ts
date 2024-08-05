import api from "../utils/instance";

export type CrewDto = {
  crewId: number;
  crewName: string;
  slogan: string;
  area: string;
  crewCount: number;
  captainName: string;
  imageUrl: string;
};

export type GetCrewListRequestDto = {
  query?: string;
  pageNo?: string;
};

export type GetCrewListResponseDto = {
  crews: CrewDto[];
  pageNo: number;
  lastPageNo: number;
};

export const getCrewList = async (
  dto: GetCrewListRequestDto
): Promise<GetCrewListResponseDto> => {
  const response = await api.get("/search/crew", { params: dto });
  return response.data;
};
