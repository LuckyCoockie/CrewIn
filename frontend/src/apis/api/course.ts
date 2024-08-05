import api from "../index";

export type CreateCourseRequestDto = {
  info: string;
  name: string;
  length: number;
  area: string;
  thumbnailImage: string;
};

export type CourseInfoDto = {
  waypoints: number[][];
  polylines: number[][];
};

export const createCourse = async (
  dto: CreateCourseRequestDto
): Promise<void> => {
  const response = await api.post<void>("/course", dto);
  return response.data;
};

export const updateCourse = async (dto: {
  id: number;
  value: CreateCourseRequestDto;
}): Promise<void> => {
  const response = await api.put<void>(`/course/${dto.id}`, dto.value);
  return response.data;
};

export const getCourseDetail = async (dto: {
  id: number;
}): Promise<CreateCourseRequestDto> => {
  const response = await api.get<CreateCourseRequestDto>(`/course/${dto.id}`);
  return response.data;
};
