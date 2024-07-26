import React, { useCallback, useRef, useState } from "react";
import { ReactComponent as Searchbox } from "../../../assets/icons/searchbox.svg";

type OwnProps = {
  hint?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
};

const SearchMolecule: React.FC<OwnProps> = ({ hint, onChange, onSubmit }) => {
  const [value, setValue] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleValueChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setValue(value);
      if (onChange) onChange(value);
    },
    [onChange]
  );

  const handleSubmit = useCallback(() => {
    if (onSubmit) onSubmit(value);
  }, [onSubmit, value]);

  const handleKeyDown = (e: { key: string }) => {
    if (e.key === "Enter") {
      handleSubmit();
      inputRef.current?.blur();
    }
  };

  return (
    <div className="relative text-gray-600 flex-1">
      <input
        className="border-2 border-gray-300 bg-white h-10 px-4 pr-12 rounded-lg text-sm focus:outline-none w-full"
        type="search"
        name="search"
        placeholder={hint}
        onChange={handleValueChange}
        onKeyDown={handleKeyDown}
        ref={inputRef}
      />
      <button
        type="submit"
        className="absolute inset-y-0 right-0 flex items-center pr-4 bg-transparent"
        onClick={handleSubmit}
      >
        <Searchbox className="text-gray-600 h-5 w-5 fill-current" />
      </button>
    </div>
  );
};

export default SearchMolecule;
