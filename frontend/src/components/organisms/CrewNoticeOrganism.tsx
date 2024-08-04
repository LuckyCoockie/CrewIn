import React, { useState, useEffect } from "react";
import NoticeMolecule from "../molecules/Content/NoticeMolecule";
import FloatingActionButton from "../atoms/Button/FloatingActionButton";
import PaginationMolecule from "../molecules/Pagination/PaginationMolecule";
import { ReactComponent as Plus } from "../../assets/icons/plus.svg";
import { useNavigate, useParams } from "react-router-dom";

type Notice = {
  noticeId: number;
  position: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};

type NoticesProps = {
  notices: Notice[];
};

const CrewNoticeOrganism: React.FC<NoticesProps> = ({ notices }) => {
  const [page, setPage] = useState(1);
  const [currentNotices, setCurrentNotices] = useState<Notice[]>([]);
  const { crewId } = useParams<{ crewId: string }>();
  const itemsPerPage = 5;
  const btnRange = 5;
  const totalItems = Math.ceil(notices.length / itemsPerPage);
  const navigate = useNavigate();
  const handleRouter = () => {
    console.log(crewId);
    
    navigate(`/crew/detail/${crewId}/noticecreate`);
  };

  useEffect(() => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setCurrentNotices(notices.slice(startIndex, endIndex));
  }, [page, notices]);

  return (
    <main>
      {currentNotices.map((notice, index) => (
        <NoticeMolecule
          key={index}
          text={notice.position}
          title={notice.title}
          date={notice.createdAt}
        />
      ))}
      {/* 분리 */}
      <PaginationMolecule
        total={totalItems}
        page={page}
        btn={btnRange}
        setPage={setPage}
      />
      <FloatingActionButton onClick={handleRouter}>
        <Plus />
      </FloatingActionButton>
    </main>
  );
};

export default CrewNoticeOrganism;
