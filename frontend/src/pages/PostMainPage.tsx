import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { ReactComponent as CrewinLogo } from "../assets/icons/crewinlogo.svg";
import { ReactComponent as Alarmicon } from "../assets/icons/alarm_deactivated.svg";
import { ReactComponent as AlarmOnicon } from "../assets/icons/alarm_activated.svg";
import { ReactComponent as Searchicon } from "../assets/icons/searchicon.svg";
import { ReactComponent as Plus } from "../assets/icons/plus.svg";
import FloatingActionButton from "../components/atoms/Button/FloatingActionButton";
import InfiniteScrollComponent from "../util/paging/component/InfinityScrollComponent";
import PostItemComponent, {
  ItemComponentProps,
} from "../components/templates/PostItemTemplate";
import {
  getPostList,
  GetPostListResponseDto,
  PostDto,
} from "../apis/api/postlist";
import { PWAInstallPrompt } from "../components/templates/pwa/PWAInstallPrompt";
import { fetchNotifications } from "../apis/api/alarm";
import SpinnerComponent from "../components/atoms/SpinnerComponent";
import Modal from "../components/molecules/ModalMolecules";
import useIsMobile from "../util/windowSize/useIsMobile";

const PostMainPage: React.FC = () => {
  const navigate = useNavigate();
  const [hasCheckedNotifications, setHasCheckedNotifications] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const { isMobile } = useIsMobile();

  useEffect(() => {
    const checkNotifications = async () => {
      try {
        const notifications = await fetchNotifications();
        const anyChecked = notifications.some(
          (notification) => notification.isChecked === false
        );
        setHasCheckedNotifications(anyChecked);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    checkNotifications();
  }, []);

  const fetchPostData = useCallback(
    async (page: number): Promise<GetPostListResponseDto> => {
      setIsLoading(true);
      try {
        const postData = await getPostList(page);
        setIsLoading(false);
        return postData;
      } catch (error) {
        console.error("Error fetching post data:", error);
        setIsModalOpen(true);
        setModalMessage(
          "포스트를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요."
        );
        setIsLoading(false);
        return { pageNo: 0, lastPageNo: 0, items: [] };
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

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <div className="flex flex-col items-center max-w-[550px] mt-4 mb-20 relative">
      {isMobile && (
        <div className="flex items-center w-full mb-5 xs:mb-10">
          <div className="flex items-center ms-3">
            <CrewinLogo />
          </div>
          <div className="flex items-center flex-grow justify-end mr-2">
            <Searchicon className="w-6 h-6 mr-4" onClick={handleSearch} />
            {hasCheckedNotifications ? (
              <AlarmOnicon className="w-6 h-6" onClick={handleAlarm} />
            ) : (
              <Alarmicon className="w-6 h-6" onClick={handleAlarm} />
            )}
          </div>
        </div>
      )}
      {isLoading && <SpinnerComponent />}
      <div className="w-full">
        <InfiniteScrollComponent
          fetchKey="postData"
          fetchData={fetchPostData}
          ItemComponent={(props: ItemComponentProps<PostDto>) => (
            <PostItemComponent key={props.data.id} {...props} />
          )}
          className="post-list"
        />
      </div>
      <FloatingActionButton onClick={handlePostCreate}>
        <Plus />
      </FloatingActionButton>
      <PWAInstallPrompt />
      {isModalOpen && (
        <Modal title="오류 발생" onClose={handleModalClose}>
          <p>{modalMessage}</p>
        </Modal>
      )}
    </div>
  );
};

export default PostMainPage;
