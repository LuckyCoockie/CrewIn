import { useRef, useState } from "react";

type OwnProps = {
  text?: string;
  onChange?: (text: string) => void;
  children?: React.ReactNode;
};

const EditableText = ({ text, onChange, children }: OwnProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(text);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleTextClick = () => {
    setIsEditing(true);
  };

  const handleBlur: React.FocusEventHandler<HTMLInputElement> = (e) => {
    setIsEditing(false);
    if (onChange) onChange(e.target.value);
  };

  const handleChange: React.FocusEventHandler<HTMLInputElement> = (e) => {
    setValue(e.target.value);
  };

  const handleKeyDown = (e: { key: string }) => {
    if (e.key === "Enter") {
      inputRef.current?.blur();
    }
  };

  return (
    <div className="flex min-w-10 items-center">
      {isEditing ? (
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          autoFocus
          className="border rounded px-2 py-1"
          ref={inputRef}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <p onClick={handleTextClick} className="cursor-pointer px-2 py-1">
          {value}
        </p>
      )}
      <div onClick={() => setIsEditing(true)}>{children}</div>
    </div>
  );
};

export default EditableText;
