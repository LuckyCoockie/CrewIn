import React, { useState } from "react";
import crewinlogo from "../../../assets/images/crewinlogo.png";

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
        ></input>
        {preview ? (
          <>
            <div className="w-full text-center">
              <img
                src={preview}
                alt="Preview"
                className="mx-auto border-2 w-32 h-32 rounded-full object-cover"
              />
            </div>
          </>
        ) : (
          <>
            <div className="w-full text-center">
              <img
                src={crewinlogo}
                alt="crewinlogo"
                className="mx-auto border-2 w-32 h-32 rounded-full object-cover"
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
