import React, { useState, useEffect } from "react";
import crewinlogo from "../../../assets/images/crewinlogo.png";
import { ReactComponent as Attach } from "../../../assets/icons/attach.svg";

type InputImage = {
  id: string;
  name: string;
  placeholder: string;
  text?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  previewUrl?: string; // 추가
};

const InputImageComponent = React.forwardRef<HTMLInputElement, InputImage>(
  (props, ref) => {
    const [preview, setPreview] = useState<string | null>(
      props.previewUrl || null
    );
    const [fileCount, setFileCount] = useState(0);
    useEffect(() => {
      if (props.previewUrl) {
        setPreview(props.previewUrl);
      }
    }, [props.previewUrl]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      setFileCount(files ? files.length : 0);

      if (files && files[0]) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(files[0]);
      } else {
        setPreview(null);
      }
      props.onChange(e);
    };

    return (
      <>
        {preview ? (
          <div className="w-full text-center mb-4">
            <img
              src={preview}
              alt="Preview"
              className="mx-auto border-2 w-32 h-32 sm:w-48 sm:h-48 rounded-full object-cover"
            />
            <p className="mt-2 text-sm font-medium text-gray-500">
              이미지 노출 예시
            </p>
          </div>
        ) : (
          <div className="w-full text-center mb-4">
            <img
              src={crewinlogo}
              alt="crewinlogo"
              className="mx-auto border-2 w-32 h-32 sm:w-48 sm:h-48 rounded-full object-cover"
            />
            <label
              htmlFor={props.id}
              className="text-center block mt-2 text-sm font-medium text-gray-500 dark:text-white"
            >
              *{props.placeholder}
            </label>
          </div>
        )}
        <div className="flex flex-col items-center w-full">
          <label htmlFor={props.id} className="w-full mb-1">
            <div className="flex p-2 border border-gray-300 rounded-lg w-full text-end">
              {fileCount > 0 ? (
                <p className="text-gray-500 font-semibold ml-1">
                  이미지가 선택되었습니다.
                </p>
              ) : (
                <p className="text-gray-500 font-semibold ml-1">{props.text}</p>
              )}
              <p className="ml-auto">
                <Attach />
              </p>
            </div>
          </label>
          <input
            id={props.id}
            type="file"
            name={props.name}
            onChange={handleChange}
            ref={ref}
            accept="image/*"
            aria-describedby={`${props.id}-description`}
            className="hidden"
          />
        </div>
      </>
    );
  }
);

export default InputImageComponent;
