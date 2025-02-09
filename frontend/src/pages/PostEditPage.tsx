import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PostEditTemplate from "../components/templates/PostEditTemplate";
import { updatePost, UpdatePostRequestDto } from "../apis/api/postupdate";
import { getPostDetail } from "../apis/api/postdetail";
import { getMyCrews, CrewDto } from "../apis/api/mycrew";
import BackHeaderMediumOrganism from "../components/organisms/BackHeaderMediumOrganism";
import SpinnerComponent from "../components/atoms/SpinnerComponent";
import ErrorText from "../components/atoms/ErrorText";

const PostEditPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [postImages, setPostImages] = useState<string[]>([]);
  const [, setCrews] = useState<CrewDto[]>([]);
  const [crewId, setCrewId] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (postId) {
      (async () => {
        try {
          const post = await getPostDetail(Number(postId));
          if (post) {
            setPostImages(post.postImages);
            setContent(post.content);
            setTitle(post.title);
            setIsPublic(post.isPublic);

            const response = await getMyCrews();
            setCrews(response.crews);
            if (response.crews.length > 0) {
              setCrewId(response.crews[0].crewId);
            }
          } else {
            setError("게시글을 찾을 수 없습니다.");
          }
        } catch (error) {
          setError("데이터 조회 오류");
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [postId]);

  const handleUpdatePost = async () => {
    try {
      const updateData: UpdatePostRequestDto = {
        title,
        content,
        isPublic,
        postImages,
      };
      await updatePost(Number(postId), updateData);
      navigate("/home");
    } catch (error) {
      alert("수정 실패");
    }
  };

  const handleVisibilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "전체" && crewId === 1) {
      setIsPublic(true);
    } else if (value === "크루" && crewId !== 0 && !isPublic) {
      setIsPublic(false);
    }
  };

  if (loading) {
    return <SpinnerComponent />;
  }

  if (error) {
    return <ErrorText text="데이터를 로드하는데 오류가 발생했습니다." />;
  }

  return (
    <>
      <header className="mb-10">
        <BackHeaderMediumOrganism text="게시글 수정" />
      </header>
      <div className="mx-auto w-full max-w-[500px] pb-10">
        <PostEditTemplate
          content={content}
          isPublic={isPublic}
          postImages={postImages}
          crewId={crewId}
          onContentChange={(e) => setContent(e.target.value)}
          onVisibilityChange={handleVisibilityChange}
          onUpdatePost={handleUpdatePost}
        />
      </div>
    </>
  );
};

export default PostEditPage;
