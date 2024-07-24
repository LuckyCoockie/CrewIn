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
  return {
    pageNo: 0,
    lastPageNo: 10,
    crews: [
      {
        id: 0,
        name: "Crew In",
        slogan: "같이의 가치",
        area: "서울특별시 강남구",
        crewCount: 5,
        captainName: "박준식",
        imageUrl:
          "https://crewin-bucket.s3.ap-northeast-2.amazonaws.com/crewin/2a72ccf3-7b42-4be8-a1ca-9aa65bba1f7f.png",
      },
      {
        id: 1,
        name: "Crew In",
        slogan: "같이의 가치",
        area: "서울특별시 강남구",
        crewCount: 5,
        captainName: "박준식",
        imageUrl:
          "https://crewin-bucket.s3.ap-northeast-2.amazonaws.com/crewin/2a72ccf3-7b42-4be8-a1ca-9aa65bba1f7f.png",
      },
      {
        id: 2,
        name: "Crew In",
        slogan: "같이의 가치",
        area: "서울특별시 강남구",
        crewCount: 5,
        captainName: "박준식",
        imageUrl:
          "https://crewin-bucket.s3.ap-northeast-2.amazonaws.com/crewin/2a72ccf3-7b42-4be8-a1ca-9aa65bba1f7f.png",
      },
      {
        id: 3,
        name: "Crew In",
        slogan: "같이의 가치",
        area: "서울특별시 강남구",
        crewCount: 5,
        captainName: "박준식",
        imageUrl:
          "https://crewin-bucket.s3.ap-northeast-2.amazonaws.com/crewin/2a72ccf3-7b42-4be8-a1ca-9aa65bba1f7f.png",
      },
      {
        id: 4,
        name: "Crew In",
        slogan: "같이의 가치",
        area: "서울특별시 강남구",
        crewCount: 5,
        captainName: "박준식",
        imageUrl:
          "https://crewin-bucket.s3.ap-northeast-2.amazonaws.com/crewin/2a72ccf3-7b42-4be8-a1ca-9aa65bba1f7f.png",
      },
      {
        id: 5,
        name: "Crew In",
        slogan: "같이의 가치",
        area: "서울특별시 강남구",
        crewCount: 5,
        captainName: "박준식",
        imageUrl:
          "https://crewin-bucket.s3.ap-northeast-2.amazonaws.com/crewin/2a72ccf3-7b42-4be8-a1ca-9aa65bba1f7f.png",
      },
    ],
  };

  const response = await api.get("/crew", { params: dto });
  return response.data;
};
