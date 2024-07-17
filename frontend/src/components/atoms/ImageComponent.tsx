import React from "react";

type InputImage = {
  id: string;
  name: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const ImageComponent = React.forwardRef<HTMLInputElement, InputImage>(
  (props, ref) => {
    return (
      <>
        <input
          className="image-file-input"
          id={props.id}
          type="file"
          name={props.name}
          placeholder={props.placeholder}
          onChange={props.onChange}
          ref={ref}
        ></input>
      </>
    );
  }
);

export default ImageComponent;
