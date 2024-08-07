import React, { useState, useEffect } from "react";
import BackHeaderMediumOrganism from "../organisms/BackHeaderMediumOrganism";
import CrewinLogo from "../../assets/images/crewinlogo.png";
import { fetchNotifications, NotificationDto } from "../../apis/api/alarm";

const AlarmTemplate: React.FC = () => {
  const [alarms, setAlarms] = useState<NotificationDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const data = await fetchNotifications();

        if (data) {
          console.log(data);
          setAlarms(data);
        } else {
          setError("데이터를 불러오지 못했습니다.");
        }
      } catch (error) {
        console.error("알림 목록을 가져오는 중 오류가 발생했습니다.", error);
        setError("알림 목록을 가져오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  if (loading) {
    return <p>Loading notifications...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  const handleAccept = (notificationId: number) => {
    console.log(`Accepted invitation for notification ${notificationId}`);
  };

  const handleReject = (notificationId: number) => {
    console.log(`Rejected invitation for notification ${notificationId}`);
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
            .slice()
            .reverse()
            .map((alarm) => (
              <div
                key={alarm.notificationId}
                className="p-4 border-b border-gray-200 flex items-center"
              >
                <img
                  src={alarm.senderThumbnail || CrewinLogo}
                  alt={alarm.senderName}
                  className="w-10 h-10 mr-4"
                />
                <div className="flex flex-col flex-grow">
                  {alarm.notificationType === "INVITATION" && (
                    <div className="flex justify-between items-center w-full">
                      <div className="font-bold">
                        {alarm.senderName} 크루에 초대되었습니다.
                      </div>
                      <div className="flex space-x-2">
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded"
                          onClick={() => handleReject(alarm.notificationId)}
                        >
                          거절
                        </button>
                        <button
                          className="bg-green-500 text-white px-3 py-1 rounded"
                          onClick={() => handleAccept(alarm.notificationId)}
                        >
                          수락
                        </button>
                      </div>
                    </div>
                  )}
                  {alarm.notificationType === "LIKE" && (
                    <div className="font-bold">
                      {alarm.senderName}님이 회원님의 게시글에 좋아요를
                      눌렀습니다.
                    </div>
                  )}
                  {alarm.notificationType === "NOTICE" && (
                    <div className="font-bold">
                      {alarm.senderName} 크루에 공지가 올라왔습니다.
                    </div>
                  )}
                  <div className="text-gray-500 text-sm">
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
