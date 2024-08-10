import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BackHeaderMediumOrganism from "../organisms/BackHeaderMediumOrganism";
import CrewinLogo from "../../assets/images/crewinlogo.png";
import closeButton from "../../assets/images/closebutton.png";
import { fetchNotifications, NotificationDto } from "../../apis/api/alarm";
import { deleteNotification } from "../../apis/api/alarmdelete";
import { replyToCrewInvitation } from "../../apis/api/crewallowreject";
import { useSelector } from "react-redux";
import { RootState } from "../../modules";

const AlarmTemplate: React.FC = () => {
  const [alarms, setAlarms] = useState<NotificationDto[]>([]);
  const navigate = useNavigate();
  const memberId = useSelector((state: RootState) => state.auth.memberId);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const data = await fetchNotifications();

        if (data) {
          console.log(data);
          setAlarms(data);
        }
      } catch (error) {
        console.error("알림 목록을 가져오는 중 오류가 발생했습니다.", error);
      }
    };

    loadNotifications();
  }, []);

  const handleDelete = async (notificationId: number) => {
    try {
      const response = await deleteNotification(notificationId);
      if (response.status === 204) {
        setAlarms((prevAlarms) =>
          prevAlarms.filter((alarm) => alarm.notificationId !== notificationId)
        );
      } else {
        console.error("Failed to delete notification");
        alert("Failed to delete notification");
      }
    } catch (error) {
      console.error("알림 삭제 요청 중 오류가 발생했습니다:", error);
      alert("알림 삭제 요청 중 오류가 발생했습니다.");
    }
  };

  const handleAccept = async (notification: NotificationDto) => {
    try {
      await replyToCrewInvitation({
        crewId: notification.senderId!,
        replyStatus: true,
      });

      await handleDelete(notification.notificationId);
    } catch (error) {
      console.error("크루 초대 수락 중 오류가 발생했습니다:", error);
      alert("크루 수락 중 오류 발생");
    }
  };

  const handleReject = async (notification: NotificationDto) => {
    try {
      await replyToCrewInvitation({
        crewId: notification.senderId!,
        replyStatus: false,
      });

      await handleDelete(notification.notificationId);
    } catch (error) {
      console.error("크루 초대 거절 중 오류가 발생했습니다:", error);
      alert("크루 초대 거절 중 오류가 발생했습니다.");
    }
  };

  const handleNotificationClick = (notification: NotificationDto) => {
    if (notification.notificationType === "INVITATION") {
      navigate(`/crew/detail/${notification.senderId}`);
    } else if (notification.notificationType === "NOTICE") {
      navigate(
        `/crew/detail/${notification.senderId}/notice/${notification.postId}`
      );
    }
  };

  return (
    <div className="flex flex-col max-w-[550px] mx-auto">
      <header>
        <BackHeaderMediumOrganism text="알림" />
      </header>
      <div>
        <div className="border-b border-gray-400"></div>
        {alarms.length > 0 ? (
          alarms
            .filter((alarm) => alarm.notificationType !== "LIKE" || alarm.senderId !== memberId)
            .slice()
            .reverse()
            .map((alarm) => (
              <div
                key={alarm.notificationId}
                className={`p-4 border-b border-gray-200 flex items-center ${
                  alarm.isChecked && alarm.notificationType !== "INVITATION"
                    ? "bg-gray-100"
                    : ""
                }`}
                onClick={() => handleNotificationClick(alarm)}
              >
                <img
                  src={alarm.senderThumbnail || CrewinLogo}
                  alt={alarm.senderName}
                  className="w-8 h-8 rounded-full mr-2"
                />
                <div className="flex flex-col flex-grow">
                  {alarm.notificationType === "INVITATION" && (
                    <div className="flex justify-between items-center tracking-tighter">
                      <div
                        style={{
                          fontWeight: "bold",
                          maxWidth: "60%",
                          overflow: "visible",
                          textOverflow: "ellipsis",
                          whiteSpace: "break-word",
                        }}
                        className="text-sm"
                      >
                        {alarm.senderName} 크루에 초대되었습니다.
                      </div>
                      <div className="flex space-x-2">
                        <button
                          className="w-12 bg-[#D5D5D9] text-white px-3 py-1 rounded text-xs tracking-tighter"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReject(alarm);
                          }}
                        >
                          거절
                        </button>
                        <button
                          className="w-12 bg-[#2B2F40] text-white px-3 py-1 rounded text-xs tracking-tighter"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAccept(alarm);
                          }}
                        >
                          수락
                        </button>
                      </div>
                    </div>
                  )}
                  {alarm.notificationType === "LIKE" && (
                    <div
                      className={`flex justify-between items-center w-full h-6 tracking-tighter ${
                        alarm.isChecked ? "text-gray-500" : ""
                      }`}
                    >
                      <div className="font-bold text-sm">
                        {alarm.senderName}님이 회원님의 게시글에 좋아요를
                        눌렀습니다.
                      </div>
                      <div className="flex items-center mt-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(alarm.notificationId);
                          }}
                        >
                          <img
                            src={closeButton}
                            alt="Delete"
                            className="w-2 h-2"
                          />
                        </button>
                      </div>
                    </div>
                  )}
                  {alarm.notificationType === "NOTICE" && (
                    <div
                      className={`flex justify-between items-center w-full tracking-tighter ${
                        alarm.isChecked ? "text-gray-500" : ""
                      }`}
                    >
                      <div className="font-bold text-sm">
                        {alarm.senderName} 크루에 공지가 올라왔습니다.
                      </div>
                      <div className="flex items-center mt-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(alarm.notificationId);
                          }}
                        >
                          <img
                            src={closeButton}
                            alt="Delete"
                            className="w-2 h-2"
                          />
                        </button>
                      </div>
                    </div>
                  )}
                  <div
                    className={`text-gray-500 text-xs ${
                      alarm.isChecked && alarm.notificationType === "INVITATION"
                        ? "text-black"
                        : ""
                    }`}
                  >
                    {new Date(alarm.createdAt).toLocaleString()}{" "}
                  </div>
                </div>
              </div>
            ))
        ) : (
          <div className="p-4 text-gray-500">알림이 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default AlarmTemplate;
