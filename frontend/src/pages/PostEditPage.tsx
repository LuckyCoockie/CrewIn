import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import InputTextAreaNoLimitTypeMolecule from "../components/molecules/Input/InputTextAreaNoLimitTypeMolecule";
import InputRadioTypeMolecule from "../components/molecules/Input/InputRadioTypeMolecule";
import { updatePost, UpdatePostRequestDto } from "../apis/api/postupdate";
import { getPostList, PostDto } from "../apis/api/postlist";
import { getMyCrews, CrewDto } from "../apis/api/mycrew";

const fetchAllPosts = async () => {
  let allPosts: PostDto[] = [];
  let pageNo = 0;
  let hasMorePosts = true;

  while (hasMorePosts) {
    try {
      const {items} = await getPostList(pageNo);
      if (items.length > 0) {
        allPosts = allPosts.concat(items);
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
    <div className="flex flex-col items-center justify-center">
      <main>
        <div className="w-full flex">
          <div className="w-full">
            <InputRadioTypeMolecule
              id="visibility"
              title="공개 범위"
              name="visibility"
              onChange={handleVisibilityChange}
              value={["전체", "크루"]}
              selectedValue={isPublic ? "전체" : "크루"}
              default={isPublic ? "전체" : "크루"}
              hasError={false}
              disabledOptions={isPublic ? ["크루"] : []}
            />
          </div>
        </div>

        <div className="w-full mb-6">
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

        <button
          onClick={handleUpdatePost}
          className="w-full bg-[#2b2f40e6] py-4 px-8 text-center rounded-lg text-white font-bold"
        >
          수정
        </button>
      </main>
    </div>
  );
};

export default PostEditPage;
