import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackHeaderMediumOrganism from "../organisms/BackHeaderMediumOrganism";
import CrewinLogo from "../../assets/images/crewinlogo.png";
import closeButton from "../../assets/images/closebutton.png";
import { fetchNotifications, NotificationDto } from "../../apis/api/alarm";
import { deleteNotification } from "../../apis/api/alarmdelete";
import { replyToCrewInvitation } from "../../apis/api/crewallowreject";
import { useSelector } from "react-redux";
import { RootState } from "../../modules";
import Modal from "../molecules/ModalMolecules";
import { useQuery } from "react-query";

const AlarmTemplate: React.FC = () => {
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const memberId = useSelector((state: RootState) => state.auth.memberId);

  const {
    data: alarms,
    isLoading: isAlarmLoading,
    refetch: refetchAlarms,
  } = useQuery<NotificationDto[]>(["alarms"], fetchNotifications);

  const handleDelete = async (notificationId: number) => {
    try {
      const response = await deleteNotification(notificationId);
      if (response.status === 204) {
        refetchAlarms();
      } else {
        setModalMessage("알림 삭제에 실패했습니다.");
      }
    } catch (error) {
      setModalMessage("알림 삭제 요청 중 오류가 발생했습니다.");
    }
  };

  const handleAccept = async (notification: NotificationDto) => {
    try {
      await replyToCrewInvitation({
        crewId: notification.senderId!,
        noticeId: notification.notificationId,
        replyStatus: true,
      });
      setModalMessage("크루 초대를 수락했습니다.");
      refetchAlarms();
    } catch (error) {
      setModalMessage("크루 초대 수락 중 오류가 발생했습니다.");
    }
  };

  const handleReject = async (notification: NotificationDto) => {
    try {
      await replyToCrewInvitation({
        crewId: notification.senderId!,
        noticeId: notification.notificationId,
        replyStatus: false,
      });

      await handleDelete(notification.notificationId);
      setModalMessage("크루 초대를 거절했습니다.");
      refetchAlarms();
    } catch (error) {
      setModalMessage("크루 초대 거절 중 오류가 발생했습니다.");
    }
  };

  const handleNotificationClick = (notification: NotificationDto) => {
    if (notification.notificationType === "INVITATION") {
      navigate(`/crew/detail/${notification.senderId}`);
    } else if (notification.notificationType === "NOTICE") {
      navigate(`/crew/detail/${notification.senderId}/notice/${notification.postId}`);
    } else if (notification.notificationType === "LIKE") {
      navigate(`/post/${notification.postId}`);
    }
  };

  const handleProfileClick = (notification: NotificationDto) => {
    if (notification.notificationType === "LIKE") {
      navigate(`/profile/${notification.senderId}`);
    } else if (notification.notificationType === "INVITATION" || notification.notificationType === "NOTICE") {
      navigate(`/crew/detail/${notification.senderId}`);
    }
  };

  if (!alarms || isAlarmLoading) return null;

  return (
    <div className="flex flex-col max-w-[500px] mx-auto">
      <header>
        <BackHeaderMediumOrganism text="알림" />
      </header>
      <div>
        <div className="border-b border-gray-400"></div>
        {alarms.length > 0 ? (
          alarms
            .filter(
              (alarm) =>
                alarm.notificationType !== "LIKE" || alarm.senderId !== memberId
            )
            .slice()
            .reverse()
            .map((alarm) => {
              console.log('Alarm:', alarm); // 각 알람 항목에 대한 로그 출력

              return (
                <div
                  key={alarm.notificationId}
                  className={`p-4 border-b border-gray-200 flex items-center ${
                    alarm.isChecked && alarm.notificationType !== "INVITATION"
                      ? "bg-primary-500"
                      : ""
                  }`}
                >
                  <img
                    src={alarm.senderThumbnail || CrewinLogo}
                    alt={alarm.senderName}
                    className="w-8 h-8 rounded-full mr-2 border cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation(); // 클릭 이벤트가 상위 div로 전파되지 않도록
                      handleProfileClick(alarm);
                    }}
                  />
                  <div
                    className="flex flex-col flex-grow cursor-pointer"
                    onClick={() => handleNotificationClick(alarm)}
                  >
                    {alarm.notificationType === "INVITATION" && (
                      <div className="flex justify-between items-center tracking-tighter">
                        <div
                          style={{
                            maxWidth: "60%",
                            overflow: "visible",
                            textOverflow: "ellipsis",
                            whiteSpace: "break-word",
                          }}
                          className="text-sm"
                        >
                          <span className="font-bold">{alarm.senderName}</span> 크루에 초대되었습니다.
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
                          alarm.isChecked ? "text-sub" : ""
                        }`}
                      >
                        <div className="text-sm">
                          <span className="font-bold">{alarm.senderName}</span>님이 회원님의 게시글에 좋아요를 눌렀습니다.
                        </div>
                        <div className="flex items-center mt-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(alarm.notificationId);
                            }}
                            className="bg-transparent"
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
                        className={`flex justify-between items-center w-full h-6 tracking-tighter ${
                          alarm.isChecked ? "text-sub" : ""
                        }`}
                      >
                        <div className="text-sm">
                          <span className="font-bold">{alarm.senderName}</span> 크루에 공지가 올라왔습니다.
                        </div>
                        <div className="flex items-center mt-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(alarm.notificationId);
                            }}
                            className="bg-transparent"
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
                      className={`text-sub text-xs ${
                        alarm.isChecked && alarm.notificationType === "INVITATION"
                          ? "text-black"
                          : ""
                      }`}
                    >
                      {new Date(alarm.createdAt).toLocaleString()}{" "}
                    </div>
                  </div>
                </div>
              );
            })
        ) : (
          <div className="p-4 text-sub">알림이 없습니다.</div>
        )}
      </div>
      {modalMessage && (
        <Modal title="알림" onClose={() => setModalMessage(null)}>
          <p>{modalMessage}</p>
        </Modal>
      )}
    </div>
  );
};

export default AlarmTemplate;
