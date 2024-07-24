import React, { useState } from "react";
import PostCreateTemplate from "../components/templates/PostCreateTemplate.tsx";

const PostCreatePage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [croppedImages, setCroppedImages] = useState<string[]>([]);
  const [crewName, setCrewName] = useState<string>("");
  const [visibility, setVisibility] = useState<string>("전체");
  const [content, setContent] = useState<string>("");

  const handleImageCropComplete = (
    croppedImages: string[],
    crewName: string,
    visibility: string,
    content: string
  ) => {
    setCroppedImages(croppedImages);
    setCrewName(crewName);
    setVisibility(visibility);
    setContent(content);
    setCurrentStep(2);
  };

  const handleEditorFinish = () => {
    setCurrentStep(1);
  };

  return (
    <PostCreateTemplate
      currentStep={currentStep}
      croppedImages={croppedImages}
      crewName={crewName}
      visibility={visibility}
      content={content}
      onImageCropComplete={handleImageCropComplete}
      onEditorFinish={handleEditorFinish}
      onStepChange={setCurrentStep}
    />
  );
};

export default PostCreatePage;
