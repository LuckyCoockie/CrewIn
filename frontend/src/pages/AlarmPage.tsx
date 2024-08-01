import React, { useState, useEffect } from "react";
import BackHeaderMediumOrganism from "../components/organisms/BackHeaderMediumOrganism";
import CrewinLogo from "../assets/images/crewinlogo.png";

const AlarmPage: React.FC = () => {
  const [alarms, setAlarms] = useState<string[]>([]);

  useEffect(() => {
    const storedAlarms = JSON.parse(localStorage.getItem("alarms") || "[]");
    setAlarms(storedAlarms);
  }, []);

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
            .map((alarm, index) => (
              <div
                key={index}
                className="p-4 border-b border-gray-200 flex items-center"
              >
                <img
                  src={CrewinLogo}
                  alt="crew logo"
                  className="w-10 h-10 mr-4"
                />
                {alarm}
              </div>
            ))
        ) : (
          <div className="p-4 text-gray-500">알림이 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default AlarmPage;
