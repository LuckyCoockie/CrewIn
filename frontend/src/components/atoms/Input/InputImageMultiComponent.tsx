import React from "react";

type InputImage = {
  id: string;
  name: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const InputImageMultiComponent = React.forwardRef<HTMLInputElement, InputImage>(
  (props, ref) => {
    return (
      <>
        <input
          className="image-file-input focus:ring-0 focus:outline-none focus:border-black"
          id={props.id}
          type="file"
          name={props.name}
          placeholder={props.placeholder}
          onChange={props.onChange}
          ref={ref}
          accept="image/*"
          multiple
        ></input>
      </>
    );
  }
);

export default InputImageMultiComponent;
