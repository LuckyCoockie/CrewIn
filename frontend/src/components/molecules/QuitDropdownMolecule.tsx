import React from "react";

type Props = {
  onQuit: () => void;
};

const QuitDropdownMolecule: React.FC<Props> = ({ onQuit }) => {
  return (
    <button
      onClick={onQuit}
      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
    >
      수정
    </button>
  );
};

export default QuitDropdownMolecule;
