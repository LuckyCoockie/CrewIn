import api from "../index";

export type CrewDto = {
  crewId: number;
  crewName: string;
  slogan: string;
  area: string;
  crewCount: number;
  captainName: string;
  imageUrl: string;
};

export type GetMyCrewsResponseDto = {
  crews: CrewDto[];
};

export const getMyCrews = async (): Promise<GetMyCrewsResponseDto> => {
  try {
    const response = await api.get("/crew/my-crew");
    return response.data;
  } catch (error) {
    console.error("내 크루 목록 조회 오류:", error);
    throw error;
  }
};
