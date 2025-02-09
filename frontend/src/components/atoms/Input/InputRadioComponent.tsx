import React from "react";

type InputData = {
  id: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  hasError?: boolean;
  value: string;
  checked: boolean;
  disabled?: boolean; // disabled 속성 추가
};

const InputRadioComponent = React.forwardRef<HTMLInputElement, InputData>(
  (props, ref) => {
    return (
      <div className="flex items-center">
        <input
          id={props.id}
          type="radio"
          onChange={props.onChange}
          name={props.name}
          className="hidden" // 라디오 버튼 숨기기
          ref={ref}
          value={props.value}
          disabled={props.disabled}
        />
        <label
          htmlFor={props.id}
          className={`py-2 px-4 rounded-md border ${
            props.checked
              ? "button-color"
              : "bg-white text-gray-500 font-normal border-gray-300"
          } transition duration-150 ease-in-out ${
            props.disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {props.value}
        </label>
      </div>
    );
  }
);

export default InputRadioComponent;
