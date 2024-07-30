import React from "react";
import ImageCropOrganism from "../organisms/ImageCropOrganism";
import ImageEditSaveOrganism from "../organisms/ImageEditSaveOrganism";

interface PostCreateTemplateProps {
  currentStep: number;
  postImages: string[];
  crewId: number;
  isPublic: boolean;
  content: string;
  onImageCropComplete: (
    postImages: string[],
    crewId: number,
    isPublic: boolean,
    content: string
  ) => void;
  onEditorFinish: (finalImage: string) => void;
  onStepChange: (step: number) => void;
}

const PostCreateTemplate: React.FC<PostCreateTemplateProps> = ({
  currentStep,
  postImages,
  crewId,
  isPublic,
  content,
  onImageCropComplete,
  onEditorFinish,
}) => {
  return (
    <main className="p-4">
      <div className="mx-auto w-full max-w-[550px] pt-4 pb-10">
        {currentStep === 1 && (
          <ImageCropOrganism onComplete={onImageCropComplete} />
        )}
        {currentStep === 2 && postImages.length > 0 && (
          <ImageEditSaveOrganism
            postImages={postImages}
            crewId={crewId}
            isPublic={isPublic}
            content={content}
            onFinish={onEditorFinish}
          />
        )}
      </div>
    </main>
  );
};

export default PostCreateTemplate;
