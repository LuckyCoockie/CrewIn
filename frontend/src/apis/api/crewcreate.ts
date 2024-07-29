import api from "../utils/instance";

export type CrewCreateDto = {
  crew_name : string;
  slogan: string;
  area: string;
  introduction: string;
  main_logo: string;
  sub_logo: string;
  banner: string;
  crew_birth: string;
};

export type GetCrewCreateRequestDto = CrewCreateDto;

export const postCreateCrew = async (
  dto: GetCrewCreateRequestDto
): Promise<void> => {
  const response = await api.post(`/crew`, dto);
  return response.data;
};
