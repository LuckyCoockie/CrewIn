import React, { useState, useEffect } from "react";
import crewinbanner from "../../../assets/images/crewinbanner.png";
import { ReactComponent as Attach } from "../../../assets/icons/attach.svg";

type InputImage = {
  id: string;
  name: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  previewUrl?: string;
};

const InputBannermageComponent = React.forwardRef<HTMLInputElement, InputImage>(
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
          <>
            <div className="w-full text-center">
              <img
                src={preview}
                alt="Preview"
                className="border-2 w-60 h-40 object-cover"
              />
              <p className="mt-2 text-sm font-medium text-reverse">
                배너 노출 예시
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="w-full text-center">
              <img
                src={crewinbanner}
                alt="crewinbanner"
                className="border-2 w-60 h-40 object-cover"
              />
            </div>
            <label
              htmlFor={props.id}
              className="text-center block mt-2 text-sm font-medium text-reverse dark:text-white"
            >
              *{props.placeholder}
            </label>
          </>
        )}
        <div className="w-full text-center mb-4">
          <label htmlFor={props.id} className="w-full">
            <div className="flex p-2 border border-gray-300 rounded-lg w-full">
              {fileCount > 0 ? (
                <p className="text-reverse font-semibold ml-1">
                  이미지가 선택되었습니다.
                </p>
              ) : (
                <p className="text-reverse font-semibold ml-1">
                  3:2 비율을 권장합니다.
                </p>
              )}
              <p className="ml-auto">
                <Attach />
              </p>
            </div>
          </label>
          <input
            className="hidden"
            id={props.id}
            type="file"
            name={props.name}
            placeholder={props.placeholder}
            onChange={handleChange}
            ref={ref}
            accept="image/*"
          />
        </div>
      </>
    );
  }
);

export default InputBannermageComponent;
