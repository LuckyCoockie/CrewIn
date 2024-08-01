import React from "react";
import ImageCropOrganism from "../organisms/ImageCropOrganism";
import ImageEditSaveOrganism from "../organisms/ImageEditSaveOrganism";
import BackHeaderMediumOrganism from "../organisms/BackHeaderMediumOrganism";

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
    <>
      <header>
        <BackHeaderMediumOrganism text="게시글 작성" />
      </header>
      <div className="mx-auto w-full max-w-[550px] pb-10">
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
    </>
  );
};

export default PostCreateTemplate;
