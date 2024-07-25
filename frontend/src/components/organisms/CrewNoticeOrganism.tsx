import React from "react";
import NoticeMolecule from "../molecules/Content/NoticeMolecule";
import FloatingActionButton from "../atoms/Button/FloatingActionButton";

type Notice = {
  role: string;
  title: string;
  date: string;
};

type NoticesProps = {
  notices: Notice[];
};

const CrewNoticeOrganism: React.FC<NoticesProps> = ({ notices }) => {
  return (
    <main className="mt-0">
      {notices.map((notice, index) => (
        <NoticeMolecule
          key={index}
          text={notice.role}
          title={notice.title}
          date={notice.date}
        />
      ))}
      <FloatingActionButton />
    </main>
  );
};

export default CrewNoticeOrganism;
