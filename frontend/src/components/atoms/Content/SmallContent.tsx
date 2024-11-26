import React from "react";

type ContentData = {
  data?: string | null;
};

const SmallContent: React.FC<ContentData> = (props) => {
  return (
    <>
      <p className="font-medium" style={{ whiteSpace: "pre-line" }}>
        {props.data}
      </p>
    </>
  );
};

export default SmallContent;
