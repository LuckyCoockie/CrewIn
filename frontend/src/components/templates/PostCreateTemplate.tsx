import React from "react";
import ImageCropOrganism from "../organisms/ImageCropOrganism";
import ImageEditSaveOrganism from "../organisms/ImageEditSaveOrganism";

interface PostCreateTemplateProps {
    currentStep: number;
    croppedImages: string[];
    crewName: string;
    visibility: string;
    content: string;
    onImageCropComplete: (croppedImages: string[], crewName: string, visibility: string, content: string) => void;
    onEditorFinish: (finalImage: string) => void;
    onStepChange: (step: number) => void;
}

const PostCreateTemplate: React.FC<PostCreateTemplateProps> = ({
    currentStep,
    croppedImages,
    crewName,
    visibility,
    content,
    onImageCropComplete,
    onEditorFinish,
    onStepChange
}) => {
    return (
        <main className="p-4">
            <div className="mx-auto w-full max-w-[550px] pt-4 pb-10">
                {currentStep === 1 && (
                    <ImageCropOrganism
                        onComplete={onImageCropComplete}
                    />
                )}
                {currentStep === 2 && croppedImages.length > 0 && (
                    <ImageEditSaveOrganism
                        images={croppedImages}
                        crewName={crewName}
                        visibility={visibility}
                        content={content}
                        onPrevious={() => onStepChange(1)}
                        onFinish={onEditorFinish}
                    />
                )}
            </div>
        </main>
    );
};

export default PostCreateTemplate;
