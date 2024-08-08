import React from "react";

type Props = {
  onClick: () => void;
};

const MemberPlusDropdownMolecule: React.FC<Props> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
    >
      멤버 초대
    </button>
  );
};

export default MemberPlusDropdownMolecule;
