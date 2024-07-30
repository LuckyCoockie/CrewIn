import api from "../utils/instance";

export type CrewCreateDto = {
  name: string;
  slogan: string;
  area: string;
  introduction: string;
  mainLogo: string;
  subLogo: string;
  banner: string;
  crewBirth: string;
};

export type GetCrewCreateRequestDto = CrewCreateDto;

export const postCreateCrew = async (
  dto: GetCrewCreateRequestDto
): Promise<void> => {
  const response = await api.post(`/crew`, dto);
  return response.data;
};
