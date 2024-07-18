import React, { useState } from "react";
import ImageCrop from "../components/ImageCrop";
import ImageEditSave from "../components/ImageEditSave";

const PostCreatePage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [croppedImages, setCroppedImages] = useState<string[]>([]);
  const [crewName, setCrewName] = useState<string>('');
  const [visibility, setVisibility] = useState<string>('전체');
  const [content, setContent] = useState<string>('');

  const handleImageCropComplete = (croppedImages: string[], crewName: string, visibility: string, content: string) => {
    setCroppedImages(croppedImages);
    setCrewName(crewName);
    setVisibility(visibility);
    setContent(content);
    setCurrentStep(2);
  };

  const handleEditorFinish = (finalImage: string) => {
    setCurrentStep(1);
  };

  return (
    <main className="flex items-center justify-center">
      <div className="max-w-4xl mx-auto p-6">
        {currentStep === 1 && <ImageCrop onComplete={handleImageCropComplete} />}
        {currentStep === 2 && croppedImages.length > 0 && (
          <ImageEditSave
            images={croppedImages}
            crewName={crewName}
            visibility={visibility}
            content={content}
            onPrevious={() => setCurrentStep(1)}
            onFinish={handleEditorFinish}
          />
        )}
      </div>
    </main>
  );
};

export default PostCreatePage;
