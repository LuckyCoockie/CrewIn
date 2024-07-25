import React, { useState, useEffect } from "react";
import NoticeMolecule from "../molecules/Content/NoticeMolecule";
import FloatingActionButton from "../atoms/Button/FloatingActionButton";
import PaginationMolecule from "../molecules/Pagination/PaginationMolecule";

type Notice = {
  role: string;
  title: string;
  date: string;
};

type NoticesProps = {
  notices: Notice[];
};

const CrewNoticeOrganism: React.FC<NoticesProps> = ({ notices }) => {
  const [page, setPage] = useState(1);
  const [currentNotices, setCurrentNotices] = useState<Notice[]>([]);

  const itemsPerPage = 5;
  const btnRange = 5;
  const totalItems = Math.ceil(notices.length / itemsPerPage);

  useEffect(() => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setCurrentNotices(notices.slice(startIndex, endIndex));
  }, [page, notices]);

  return (
    <main className="mt-0">
      {currentNotices.map((notice, index) => (
        <NoticeMolecule
          key={index}
          text={notice.role}
          title={notice.title}
          date={notice.date}
        />
      ))}
      {/* 분리 */}
      <PaginationMolecule
        total={totalItems}
        page={page}
        btn={btnRange}
        setPage={setPage}
      />
      <FloatingActionButton />
    </main>
  );
};

export default CrewNoticeOrganism;
