import React from "react";

type Props = {
  onEdit: () => void
}

const EditDropdownMolecule: React.FC<Props> = ({ onEdit }) => {
  return (
    <button
      onClick={onEdit}
      className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-500 w-full text-left"
    >
      수정
    </button>
  );
};

export default EditDropdownMolecule;
