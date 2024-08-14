import api from "../index";

export type CrewDto = {
  crewId: number;
  crewName: string;
  slogan: string;
  area: string;
  crewCount: number;
  captainName: string;
  mainLogo: string;
  subLogo: string;
  banner: string;
  position: string;
};

export type GetMyCrewsResponseDto = {
  crews: CrewDto[];
};

export const getMyCrews = async (): Promise<GetMyCrewsResponseDto> => {
  const response = await api.get("/crew/my-crew");
  return response.data;
};
