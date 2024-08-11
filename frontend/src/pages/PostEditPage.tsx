import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PostEditTemplate from "../components/templates/PostEditTemplate";
import { updatePost, UpdatePostRequestDto } from "../apis/api/postupdate";
import { getPostList, PostDto } from "../apis/api/postlist";
import { getMyCrews, CrewDto } from "../apis/api/mycrew";
import BackHeaderMediumOrganism from "../components/organisms/BackHeaderMediumOrganism";
import Modal from "../components/molecules/ModalMolecules";

const fetchAllPosts = async () => {
  let allPosts: PostDto[] = [];
  let pageNo = 0;
  let lastPageNo = 0;
  try {
    const firstPageData = await getPostList(pageNo);
    allPosts = firstPageData.items;
    lastPageNo = firstPageData.lastPageNo;

    while (pageNo < lastPageNo) {
      pageNo += 1;
      const nextPageData = await getPostList(pageNo);
      allPosts = allPosts.concat(nextPageData.items);
    }
  } catch (error) {
    console.error(`Error fetching posts:`, error);
  }

  return allPosts;
};

const PostEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>();
  const [content, setContent] = useState<string>("");
  const [title] = useState<string>("");
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [postImages, setPostImages] = useState<string[]>([]);
  const [, setCrews] = useState<CrewDto[]>([]);
  const [crewId, setCrewId] = useState<number>(0);
  const [isSubmit, setIsSubmit] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState<string>("");

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
          setIsModalOpen(true);
        }

        const response = await getMyCrews();
        setCrews(response.crews);
        if (response.crews.length > 0) {
          setCrewId(response.crews[0].crewId);
        }
      } catch (error) {
        setIsModalOpen(true);
      }
    })();
  }, [postId]);

  const handleUpdatePost = async () => {
    setIsSubmit(true);
    try {
      const updateData: UpdatePostRequestDto = {
        title,
        content,
        isPublic,
        postImages,
      };
      await updatePost(Number(postId), updateData);
      setModalMessage("게시글이 성공적으로 수정되었습니다.");
      setIsModalOpen(true);
      setIsSubmit(false);
      navigate(`/home`);
    } catch (error) {
      console.error(error);
      setModalMessage("게시글 수정 중 오류가 발생했습니다.");
      setIsSubmit(false);
      setIsModalOpen(true);
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

  const closeModalAndNavigate = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {isModalOpen && (
        <Modal title="알림" onClose={closeModalAndNavigate}>
          <p>{modalMessage}</p>
        </Modal>
      )}
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
          isSubmit={isSubmit}
        />
      </div>
    </>
  );
};

export default PostEditPage;
