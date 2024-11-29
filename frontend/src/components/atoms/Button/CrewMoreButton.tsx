import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ReactComponent as MoreHorizontalIcon } from "../../../assets/icons/more_horiz.svg";

type Image = {
  // string은 Tab 이동을 의미, number면 crew Id 혹은 session Id를 의미
  router?: string;
  routerId?: number | string;
};

const CrewMoreButton: React.FC<Image> = ({ router, routerId }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClickButton = () => {
    if (routerId === undefined && router) {
      navigate(router);
    } else {
      if (location.pathname === `/${router}/${routerId}`) return;
      navigate(`/${router}/${routerId}`);
    }
  };
  return (
    <button
      onClick={handleClickButton}
      style={{
        width: "50px",
        height: "50px",
        padding: 0,
        background: "none",
        cursor: "pointer",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      className="border rounded-full transition-transform duration-300 ease-in-out transform active:scale-90"
    >
      <MoreHorizontalIcon className="fill-primary" />
    </button>
  );
};

export default CrewMoreButton;
