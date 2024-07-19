import React, { useState } from "react";

type InputImage = {
  id: string;
  name: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const InputImageMultiComponent = React.forwardRef<HTMLInputElement, InputImage>(
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
          multiple
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
        ) : null}
      </>
    );
  }
);

export default InputImageMultiComponent;
