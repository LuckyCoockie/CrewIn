import React from "react";
import RoleChip from "../../atoms/Chip/RoleChip";
import BarTitle from "../../atoms/Title/BarTitle";
import BarContent from "../../atoms/Content/BarContent";

type NoticeInfo = {
  text: string;
  title: string;
  date: string;
};

const NoticeMolecule: React.FC<NoticeInfo> = ({ text, title, date }) => {
  return (
    <>
      <div className="flex w-full items-center py-2">
        <div className="flex w-3/12 justify-center">
          <RoleChip text={text} />
        </div>
        <div className="ms-4 w-8/12">
          <BarTitle title={title} />
          <BarContent content={date} />
        </div>
      </div>
    </>
  );
};

export default NoticeMolecule;
