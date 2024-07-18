import React, { useState } from "react";
import ImageCrop from "../components/ImageCrop";
import ImageEditSave from "../components/ImageEditSave";

const UploadImage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);

  const handleNextStep = (image: string | null) => {
    setCroppedImage(image);
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  return (
    <div className="App">
      {step === 1 && <ImageCrop onNext={handleNextStep} />}
      {step === 2 && croppedImage && (
        <ImageEditSave image={croppedImage} onPrevious={handlePreviousStep} />
      )}
    </div>
  );
};

export default UploadImage;
