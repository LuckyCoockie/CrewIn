import api from "../utils/instance";
import { AxiosError } from "axios";
export type ErrorResponseDto = {
  timeStamp: string;
  errorCode: string;
  message: string;
};

// 댓글 등록
export type CreateCommentDto = {
  postId: number;
  content: string;
};

export type CreateCommentResponseDto = {
  statusCode: number;
  message: string;
};


export const postCreateComment = async (
  dto: CreateCommentDto
): Promise<CreateCommentResponseDto> => {
  try {
    const response = await api.post(`/post/comment`, dto);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        throw error.response.data as ErrorResponseDto; 
      }
    }
    throw new Error("Unhandled error occurred");
  }
};

// 댓글 수정
export type UpdateCommentDto = {
  postId: number;
  content: string;
};

export type UpdateCommentResponseDto = {
  statusCode: number;
  message: string;
};


export const putUpdateComment = async (
  commentId: number,
  dto: UpdateCommentDto
): Promise<UpdateCommentResponseDto> => {
  try {
    const response = await api.put(`/post/comment/${commentId}`, dto);
    return response.data; 
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        throw error.response.data as ErrorResponseDto;
      }
    }
    throw new Error("Unhandled error occurred");
  }
};

// 댓글 삭제
export type DeleteCommentResponseDto = {
  statusCode: number;
  message: string;
};

export const deleteComment = async (
  commentId: number
): Promise<DeleteCommentResponseDto> => {
  try {
    const response = await api.delete(`/post/comment/${commentId}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        throw error.response.data as ErrorResponseDto;
      }
    }
    throw new Error("Unhandled error occurred");
  }
};
