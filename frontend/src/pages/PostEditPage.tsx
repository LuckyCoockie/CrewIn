import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PostEditTemplate from "../components/templates/PostEditTemplate";
import { updatePost, UpdatePostRequestDto } from "../apis/api/postupdate";
import { getPostList, PostDto } from "../apis/api/postlist";
import { getMyCrews, CrewDto } from "../apis/api/mycrew";
import BackHeaderMediumOrganism from "../components/organisms/BackHeaderMediumOrganism";

const fetchAllPosts = async () => {
  let allPosts: PostDto[] = [];
  let pageNo = 0;
  let hasMorePosts = true;

  while (hasMorePosts) {
    try {
      const posts = await getPostList(pageNo);
      if (posts.length > 0) {
        allPosts = allPosts.concat(posts);
        pageNo += 1;
      } else {
        hasMorePosts = false;
      }
    } catch (error) {
      console.error(`Error fetching page ${pageNo}:`, error);
      hasMorePosts = false;
    }
  }

  return allPosts;
};

const PostEditPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState<string>("");
  const [title] = useState<string>("");
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [postImages, setPostImages] = useState<string[]>([]);
  const [, setCrews] = useState<CrewDto[]>([]);
  const [crewId, setCrewId] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const posts = await fetchAllPosts();
        const post = posts.find((p) => p.id === Number(postId));
        if (post) {
          setPostImages(post.postImages);
          setContent(post.content);
          setIsPublic(post.isPublic);
        } else {
          setError("게시글을 찾을 수 없습니다.");
        }

        const response = await getMyCrews();
        setCrews(response.crews);
        if (response.crews.length > 0) {
          setCrewId(response.crews[0].crewId);
        }
      } catch (error) {
        setError("데이터 조회 오류");
      } finally {
        setLoading(false);
      }
    })();
  }, [postId]);

  const handleUpdatePost = async () => {
    try {
      const updateData: UpdatePostRequestDto = {
        title,
        content,
        isPublic,
        postImages,
      };

      const response = await updatePost(Number(postId), updateData);
      if (response.statusCode === 200) {
        navigate("/home");
      } else {
        alert(response.message);
      }
    } catch (error) {
      navigate("/home");
      console.error("게시글 수정 오류:", error);
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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <header className="mb-10">
        <BackHeaderMediumOrganism text="게시글 수정" />
      </header>
      <div className="mx-auto w-full max-w-[550px] pb-10">
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
