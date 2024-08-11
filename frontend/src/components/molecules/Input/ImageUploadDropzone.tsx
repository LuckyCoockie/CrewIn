import React from "react";
import Dropzone from "react-dropzone";
import { ReactComponent as FileDrop } from "../../../assets/icons/filedrop.svg";

interface ImageUploadDropzoneProps {
  onDrop: (acceptedFiles: File[]) => void;
}

const ImageUploadDropzone: React.FC<ImageUploadDropzoneProps> = ({
  onDrop,
}) => {
  return (
    <Dropzone onDrop={onDrop}>
      {({ getRootProps, getInputProps }) => (
        <section>
          <div
            {...getRootProps()}
            style={{
              width: 360,
              height: 360,
              border: "1px solid #f0f0f0",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              backgroundColor: "#f0f0f0",
            }}
          >
            <input {...getInputProps()} />
            <FileDrop style={{ fontSize: "3rem" }} />
            <p
              style={{
                color: "#b0b0b0",
                fontSize: "0.875rem",
                marginTop: "0.5rem",
              }}
            >
              * 이미지 파일(.png .jpg .jpeg .webp)만 업로드 가능합니다.
            </p>
          </div>
        </section>
      )}
    </Dropzone>
  );
};

export default ImageUploadDropzone;
