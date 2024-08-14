import React, { useEffect, useState } from "react";
import { ReactComponent as Alarmicon } from "../../../assets/icons/alarm_deactivated.svg";
import { ReactComponent as AlarmDeselcted } from "../../../assets/icons/alarm_deactivated_deselected.svg";
import { ReactComponent as AlarmOnicon } from "../../../assets/icons/alarm_activated.svg";
import { ReactComponent as AlarmOnDeselected } from "../../../assets/icons/alarm_activated_deselected.svg";
import { checkNotificationsExist } from "../../../apis/api/alarm";

type Name = {
  name: string;
  tab: boolean;
  onClick: () => void;
};

const AlarmTabMolecule: React.FC<Name> = (props) => {
  const [hasCheckedNotifications, setHasCheckedNotifications] = useState(false);

  useEffect(() => {
    const checkNotifications = async () => {
      const { exist } = await checkNotificationsExist();
      setHasCheckedNotifications(exist);
    };

    checkNotifications();
  });

  return (
    <>
      <div
        className="p-7 lg:pr-10 flex flex-col lg:flex-row items-center py-2 lg:py-4 hover:scale-105 transform active:scale-90 transition cursor-pointer button"
        onClick={props.onClick}
      >
        {props.tab ? (
          <>
            {hasCheckedNotifications ? <AlarmOnicon /> : <Alarmicon />}
            <p className="text-center text-xs lg:text-base font-bold lg:pl-2">
              {props.name}
            </p>
          </>
        ) : (
          <>
            {hasCheckedNotifications ? (
              <AlarmOnDeselected />
            ) : (
              <AlarmDeselcted />
            )}
            <p className="text-center text-xs lg:text-base text-gray-500 lg:pl-2">
              {props.name}
            </p>
          </>
        )}
      </div>
    </>
  );
};

export default AlarmTabMolecule;
