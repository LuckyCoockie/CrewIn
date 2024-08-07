import React, { useState, useEffect } from "react";
import BackHeaderMediumOrganism from "../organisms/BackHeaderMediumOrganism";
import CrewinLogo from "../../assets/images/crewinlogo.png";
import { fetchNotifications, NotificationDto } from "../../apis/api/alarm"; // API 함수와 타입 임포트

const AlarmTemplate: React.FC = () => {
  const [alarms, setAlarms] = useState<NotificationDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const response = await fetchNotifications();
        if (response.statusCode === 200) {
          setAlarms(response.data);
        } else {
          setError(response.message);
        }
      } catch (error) {
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
                <div className="flex flex-col">
                  <div className="font-bold">{alarm.senderName}</div>
                  <div className="text-gray-600">{alarm.notificationType}</div>
                  <div className="text-gray-500 text-sm">
                    {new Date(alarm.createdAt).toLocaleString()}
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
