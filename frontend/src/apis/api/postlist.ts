import { PageNationData } from "../../util/paging/type";
import api from "../index";

export type commentsDto ={
  id: number;
  authorId: number;
  authorName: string;
  content: string;
  createdAt : string;
  updateAt : string;
}

export type PostDto = {
  id: number;
  authorName: string; //닉네임
  authorId: number;
  content: string;
  heartCount: number;
  isHearted: boolean;
  isPublic: boolean;
  postType: "STANDARD" | "NOTICE";
  title: string;
  comments: commentsDto[];
  createdAt: string;
  updatedAt: string;
  profileImage: string;
  postImages: string[];
};

export type GetPostListResponseDto = PageNationData<PostDto>;

export const getPostList = async (
  pageNo: number
): Promise<GetPostListResponseDto> => {
  const response = await api.get("/post/home", {
    params: { "page-no": pageNo },
  });
  return response.data;
};
