import React, { useState } from "react";
import PostCreateTemplate from "../components/templates/PostCreateTemplate";

const PostCreatePage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [postImages, setPostImages] = useState<string[]>([]);
  const [crewId, setCrewId] = useState<number>(0);
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [content, setContent] = useState<string>("");

  const handleImageCropComplete = (
    postImages: string[],
    crewId: number,
    isPublic: boolean,
    content: string
  ) => {
    setPostImages(postImages);
    setCrewId(crewId);
    setIsPublic(isPublic);
    setContent(content);
    setCurrentStep(2);
  };

  const handleEditorFinish = () => {
    setCurrentStep(1);
  };

  return (
    <PostCreateTemplate
      currentStep={currentStep}
      postImages={postImages}
      crewId={crewId}
      isPublic={isPublic}
      content={content}
      onImageCropComplete={handleImageCropComplete}
      onEditorFinish={handleEditorFinish}
      onStepChange={setCurrentStep}
    />
  );
};

export default PostCreatePage;
