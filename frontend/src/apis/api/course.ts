import api from "../index";

export type CreateCourseRequestDto = {
  info: string;
  name: string;
  length: number;
};

export type CourseInfoDto = {
  waypoints: number[][];
  polylines: number[][];
};

export const createCourse = async (
  dto: CreateCourseRequestDto
): Promise<void> => {
  const response = await api.post<void>("/mypage/course", dto);
  return response.data;
};
