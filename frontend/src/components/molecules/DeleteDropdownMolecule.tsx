import React from "react";

type Props = {
  onDelete: () => void;
};

const DeleteDropdownMolecule: React.FC<Props> = ({ onDelete }) => {
  return (
    <button
      onClick={onDelete}
      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
    >
      삭제
    </button>
  );
};

export default DeleteDropdownMolecule;
