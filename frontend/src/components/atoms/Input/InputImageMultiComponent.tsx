import React, { useState } from "react";
import { ReactComponent as Attach } from "../../../assets/icons/attach.svg";

type InputImage = {
  id: string;
  name: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  text?: string;
};

const InputImageMultiComponent = React.forwardRef<HTMLInputElement, InputImage>(
  (props, ref) => {
    const [fileCount, setFileCount] = useState(0);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      setFileCount(files ? files.length : 0);
      props.onChange(e); // 부모 컴포넌트로 이벤트 전달
    };

    return (
      <>
        <label htmlFor={props.id} className="w-full">
          <div className="flex p-2 border border-gray-300 rounded-lg w-full text-end">
            {fileCount > 0 ? (
              <p className="text-gray-600 font-semibold ml-1">
                {fileCount}개의 이미지 선택
              </p>
            ) : (
              <p className="text-gray-500 font-normal ml-1">{props.text}</p>
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
          aria-describedby={`${props.id}-description`}
          accept="image/*"
          multiple
        ></input>
      </>
    );
  }
);

export default InputImageMultiComponent;
