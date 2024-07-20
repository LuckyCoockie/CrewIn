import React, { useState } from "react";
import crewinbanner from "../../../assets/images/crewinbanner.png"

type InputImage = {
  id: string;
  name: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const InputImageComponent = React.forwardRef<HTMLInputElement, InputImage>(
  (props, ref) => {
    const [preview, setPreview] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
      props.onChange(e);
    };

    return (
      <>
        <input
          className="image-file-input mb-3"
          id={props.id}
          type="file"
          name={props.name}
          placeholder={props.placeholder}
          onChange={handleChange}
          ref={ref}
          accept="image/*"
        ></input>
        {preview ? (
          <>
            <div className="w-full text-center">
              <img
                src={preview}
                alt="Preview"
                className="border-2 w-60 h-40
               mx-auto"
              />
            </div>
          </>
        ) : (
          <>
            <div className="w-full text-center">
              <img
                src={crewinbanner}
                alt="crewinbanner"
                className="border-2 w-60 h-40
                 mx-auto"
              />
              <p className="mt-2 font-bold text-gray-color">예시</p>
            </div>
          </>
        )}
      </>
    );
  }
);

export default InputImageComponent;
