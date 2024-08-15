import React, { useState } from "react";
import { ReactComponent as FileDrop } from "../../../assets/icons/filedrop.svg";

interface ImageUploadDropzoneProps {
  onDrop: (acceptedFiles: File[]) => void;
}

const ImageUploadDropzone: React.FC<ImageUploadDropzoneProps> = ({
  onDrop,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const acceptedFiles = Array.from(event.dataTransfer.files).filter(
        (file) =>
          file.type === "image/png" ||
          file.type === "image/jpeg" ||
          file.type === "image/jpg" ||
          file.type === "image/webp"
      );
      onDrop(acceptedFiles);
      event.dataTransfer.clearData();
    }
  };

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const acceptedFiles = Array.from(files).filter(
        (file) =>
          file.type === "image/png" ||
          file.type === "image/jpeg" ||
          file.type === "image/jpg" ||
          file.type === "image/webp"
      );
      onDrop(acceptedFiles);
    }
  };

  return (
    <section>
      <label
        htmlFor="fileInput"
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{
          width: 360,
          height: 360,
          border: "1px solid #f0f0f0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          backgroundColor: isDragging ? "#e0e0e0" : "#f0f0f0",
        }}
      >
        <input
          type="file"
          onChange={handleFileInputChange}
          style={{ display: "none" }}
          multiple
          accept=".png, .jpg, .jpeg, .webp"
          id="fileInput"
        />
        <FileDrop style={{ fontSize: "3rem" }} />
        <p
          style={{
            color: "#b0b0b0",
            fontSize: "0.7rem",
            fontWeight: "normal",
            marginTop: "0.5rem",
          }}
        >
          *이미지 파일(.png .jpg .jpeg .webp)만 업로드 가능합니다.
        </p>
      </label>
    </section>
  );
};

export default ImageUploadDropzone;
