import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { ReactComponent as CrewinLogo } from "../assets/icons/crewinlogo.svg";
import { ReactComponent as Alarmicon } from "../assets/icons/alarm_deactivated.svg";
import { ReactComponent as Searchicon } from "../assets/icons/searchicon.svg";
import { ReactComponent as Postcreateicon } from "../assets/icons/postcreateicon.svg";
import FloatingActionButton from "../components/atoms/Button/FloatingActionButton";
import InfiniteScrollComponent from "../components/molecules/InfinityScrollMolecules";
import PostItemComponent, {
  ItemComponentProps,
} from "../components/templates/PostItemTemplate";
import api from "../apis";
import { PostDto } from "../apis/api/postlist";
import { PWAInstallPrompt } from "../components/templates/PWAInstallPrompt";

const PostMainPage: React.FC = () => {
  const navigate = useNavigate();

  const fetchPostData = useCallback(
    async (page: number): Promise<PostDto[]> => {
      try {
        const result = await api.get(`/post/home?pageNo=${page - 1}`);
        console.log("Fetched post data:", result.data.postItemList);
        return result.data.postItemList;
      } catch (error) {
        console.error("게시글 데이터를 가져오는 중 오류 발생:", error);
        return [];
      }
    },
    []
  );

  const handlePostCreate = useCallback(() => {
    navigate("/post");
  }, [navigate]);

  const handleSearch = useCallback(() => {
    navigate("/searchuser");
  }, [navigate]);

  const handleAlarm = useCallback(() => {
    navigate("/alarm");
  }, [navigate]);

  return (
    <div className="flex flex-col items-center max-w-[550px] mt-4 mb-20 relative">
      <div className="flex items-center w-full mb-10">
        <div className="flex items-center">
          <CrewinLogo />
        </div>
        <div className="flex items-center flex-grow justify-end mr-2">
          <Searchicon className="w-6 h-6 mr-4" onClick={handleSearch} />
          <Alarmicon className="w-6 h-6" onClick={handleAlarm} />
        </div>
      </div>
      <div>
        <InfiniteScrollComponent
          fetchKey="postData"
          pageSize={10}
          fetchData={fetchPostData}
          ItemComponent={(props: ItemComponentProps<PostDto>) => (
            <PostItemComponent {...props} />
          )}
          className="post-list"
        />
      </div>
      <FloatingActionButton onClick={handlePostCreate}>
        <Postcreateicon />
      </FloatingActionButton>
      <PWAInstallPrompt />
    </div>
  );
};

export default PostMainPage;
