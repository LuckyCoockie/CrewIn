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

const fetchPostData = async (page: number): Promise<any[]> => {
  const storedPostData = localStorage.getItem("postData");
  if (storedPostData) {
    const parsedData = JSON.parse(storedPostData);
    if (Array.isArray(parsedData)) {
      const pageSize = 10;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      return parsedData.slice(startIndex, endIndex);
    } else {
      console.error("Parsed data is not an array");
      return [];
    }
  } else {
    console.error("No post data found in localStorage");
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
          ItemComponent={(props: ItemComponentProps<any>) => (
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
