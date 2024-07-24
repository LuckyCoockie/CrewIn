import React from "react";

type Image = {
  src: string;
  alt: string;
};

const ImageButton: React.FC<Image> = ({ src, alt }) => {
  const handleClickButton = () => {
    console.log(`${alt}버튼 클릭`);
  };
  return (
    <button
      onClick={handleClickButton}
      style={{
        width: "50px",
        height: "50px",
        padding: 0,
        border: "none",
        background: "none",
        cursor: "pointer",
      }}
      className="transition-transform duration-300 ease-in-out transform active:scale-90" 
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "10px",
          objectFit: "cover",
        }}
      />
    </button>
  );
};

export default ImageButton;
