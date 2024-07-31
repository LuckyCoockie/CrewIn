import api from "../utils/instance";

// 내 코스 목록 조회(세션 생성 시)

export type MapListDto = {
    id: number
    name: string
    thumnailImage: string
}

export type GetMapListRequestDto = {
    id: number
}

export type GetMapListResponseDto = MapListDto[]

export const getMapList = async (
): Promise<GetMapListResponseDto> => {
    const response = await api.get(`/course`,);
    return response.data
}