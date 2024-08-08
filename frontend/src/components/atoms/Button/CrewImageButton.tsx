import React from "react";
import { useNavigate } from "react-router-dom";

type Image = {
  src: string;
  alt: string;
  // string은 Tab 이동을 의미, number면 crew Id 혹은 session Id를 의미
  router?: string;
  routerId?: number | string;
};

const CrewImageButton: React.FC<Image> = ({ src, alt, router, routerId }) => {
  const navigate = useNavigate();
  const handleClickButton = () => {
    if (routerId === undefined && router) {
      navigate(router);
    } else {
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
      }}
      className="border rounded-full transition-transform duration-300 ease-in-out transform active:scale-90"
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "100%",
          objectFit: "cover",
        }}
      />
    </button>
  );
};

export default CrewImageButton;
