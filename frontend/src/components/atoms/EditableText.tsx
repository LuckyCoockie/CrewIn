import { useRef, useState } from "react";

type OwnProps = {
  text?: string;
  onChange?: (text: string) => void;
};

const EditableText = ({ text, onChange }: OwnProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(text);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleTextClick = () => {
    setIsEditing(true);
  };

  const handleBlur = (e) => {
    setIsEditing(false);
    if (onChange) onChange(e.target.value);
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      inputRef.current?.blur();
    }
  };

  return (
    <div>
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
    </div>
  );
};

export default EditableText;
