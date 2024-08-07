import React from "react";

type InnerText = {
  text: string;
};

const ErrorText: React.FC<InnerText> = ({ text }) => {
  return <div className="text-red-300 text-normal text-center">{text}</div>;
};

export default ErrorText;
