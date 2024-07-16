import React, { useState } from 'react';
import CropperStep from '../CropperTest';
import EditorStep from '../Html2canvasTest';

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
      {step === 1 && <CropperStep onNext={handleNextStep} />}
      {step === 2 && croppedImage && <EditorStep image={croppedImage} onPrevious={handlePreviousStep} />}
    </div>
  );
};

export default UploadImage;
