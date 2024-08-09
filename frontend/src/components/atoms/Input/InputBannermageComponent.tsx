import React, { useState } from "react";
import crewinbanner from "../../../assets/images/crewinbanner.png";

type InputImage = {
  id: string;
  name: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const InputIBannermageComponent = React.forwardRef<
  HTMLInputElement,
  InputImage
>((props, ref) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileCount, setFileCount] = useState(0);

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
      <div className="w-full text-center mb-3">
        <label htmlFor={props.id} className="w-full">
          <div className="flex p-2 border border-gray-300 rounded-lg w-full">
            <p className="ml-1">🔗</p>
            {fileCount > 0 ? (
              <p className="text-gray-600 font-semibold ml-1">
                이미지가 선택되었습니다.
              </p>
            ) : (
              <p className="text-gray-600 font-semibold ml-1">
                크루 상세페이지에 노출됩니다.
              </p>
            )}
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
      {preview ? (
        <>
          <div className="w-full text-center">
            <img
              src={preview}
              alt="Preview"
              className="border-2 w-60 h-40 object-cover"
            />
            <p className="mt-2 text-sm font-medium text-gray-500">
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
            className="text-center block mt-2 text-sm font-medium text-gray-500 dark:text-white"
          >
            *{props.placeholder}
          </label>
        </>
      )}
    </>
  );
});

export default InputIBannermageComponent;
