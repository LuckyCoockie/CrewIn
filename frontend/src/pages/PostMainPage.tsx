import React from "react";
import { useNavigate } from "react-router-dom";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { ReactComponent as CrewinLogo } from "../assets/icons/crewinlogo.svg";
import { ReactComponent as Alarmicon } from "../assets/icons/alarm_deactivated.svg";
// import { ReactComponent as AlarmOnicon } from "../assets/icons/alarm_activated.svg";
import { ReactComponent as Searchicon } from "../assets/icons/searchicon.svg";
import { ReactComponent as Postcreateicon } from "../assets/icons/postcreateicon.svg";
import FloatingActionButton from "../components/atoms/Button/FloatingActionButton";
import InfiniteScrollComponent from "../components/molecules/InfinityScrollMolecules";
import PostItemComponent, {
  ItemComponentProps,
} from "../components/templates/PostItemTemplate";
import api from "../apis";
import { PostDto } from "../apis/api/postlist";

const fetchPostData = async (page: number): Promise<PostDto[]> => {
  try {
    const result = await api.get(`/post?page=${page}`);
    console.log(result.data); // 서버에서 받아온 데이터 확인
    return result.data;
  } catch (error) {
    console.error("게시글 데이터를 가져오는 중 오류 발생:", error);
    return [];
  }
};

const PostMainPage: React.FC = () => {
  const navigate = useNavigate();

  const handlePostCreate = () => {
    navigate("/post");
  };

  const handleSearch = () => {
    navigate("/searchuser");
  };

  const handleAlarm = () => {
    navigate("/alarm");
  };

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
      <div className="post-main-page">
        <InfiniteScrollComponent
          fetchKey="postData"
          fetchData={fetchPostData}
          ItemComponent={(props: ItemComponentProps<PostDto>) => (
            <PostItemComponent {...props} />
          )}
          className="post-list"
        />
      </div>
      <FloatingActionButton icon={Postcreateicon} onClick={handlePostCreate} />
    </div>
  );
};

export default PostMainPage;
  