import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPostList } from "../apis/api/postlist";
import { updatePost, UpdatePostRequestDto } from "../apis/api/postupdate";
import InputTextAreaNoLimitTypeMolecule from "../components/molecules/Input/InputTextAreaNoLimitTypeMolecule";
import InputRadioTypeMolecule from "../components/molecules/Input/InputRadioTypeMolecule";
import { PostDto } from "../apis/api/postlist";

const PostEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<PostDto | null>(null);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [isPublic, setIsPublic] = useState<boolean>(true);

  useEffect(() => {
    if (postId) {
      (async () => {
        try {
          const result = await getPostList({ pageNo: 1 }); // 게시글 리스트 API 호출
          const foundPost = result.items.find((p) => p.id === Number(postId));
          if (foundPost) {
            setPost(foundPost);
            setTitle(foundPost.title);
            setContent(foundPost.content);
            setIsPublic(foundPost.isPublic);
          }
        } catch (error) {
          console.error("게시글 로딩 오류:", error);
        }
      })();
    }
  }, [postId]);

  const handleSubmit = async () => {
    if (postId) {
      const updateData: UpdatePostRequestDto = {
        title,
        content,
        isPublic,
        postType: post?.postType || "",
        postImages: post?.postImages || [],
      };
      try {
        const response = await updatePost(Number(postId), updateData);
        if (response.statusCode === 200) {
          alert("게시글이 수정되었습니다.");
          navigate(`/post/${postId}`);
        } else {
          alert("게시글 수정에 실패했습니다.");
        }
      } catch (error) {
        console.error("게시글 수정 오류:", error);
      }
    }
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">게시글 수정</h1>
      <div className="mb-4">
        <InputTextAreaNoLimitTypeMolecule
          id="title"
          title="제목"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          hasError={false}
        />
      </div>
      <div className="mb-4">
        <InputTextAreaNoLimitTypeMolecule
          id="content"
          title="내용"
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용을 입력하세요"
          hasError={false}
        />
      </div>
      <div className="mb-4">
        <InputRadioTypeMolecule
          id="visibility"
          title="공개 범위"
          name="visibility"
          onChange={(e) => setIsPublic(e.target.value === "전체")}
          value={["전체", "크루"]}
          default={isPublic ? "전체" : "크루"}
          hasError={false}
        />
      </div>
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white py-2 px-4 rounded"
      >
        수정 완료
      </button>
    </div>
  );
};

export default PostEditPage;
