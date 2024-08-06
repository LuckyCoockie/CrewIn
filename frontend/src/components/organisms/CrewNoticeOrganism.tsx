import React, { useState } from "react";
import { useQuery } from "react-query";
import NoticeMolecule from "../molecules/Content/NoticeMolecule";
import FloatingActionButton from "../atoms/Button/FloatingActionButton";
import PaginationMolecule from "../molecules/Pagination/PaginationMolecule";
import { ReactComponent as Plus } from "../../assets/icons/plus.svg";
import { useNavigate } from "react-router-dom";
import { getCrewNoticeList } from "../../apis/api/crewdetail";

type CrewNoticeOrganismProps = {
  crewId: number;
  isUserCrewMember: boolean;
};

const CrewNoticeOrganism: React.FC<CrewNoticeOrganismProps> = ({
  crewId,
  isUserCrewMember,
}) => {
  const [page, setPage] = useState(1);

  const {
    data: noticeData,
    isLoading,
    error,
  } = useQuery(
    ["crewNotice", { crewId, pageNo: page - 1 }],
    () => getCrewNoticeList({ crewId, pageNo: page - 1 }),
    {
      keepPreviousData: true, // 이전 데이터를 유지하며 로딩 상태 표시
    }
  );

  const navigate = useNavigate();

  const handleRouter = () => {
    navigate(`/crew/detail/${crewId}/noticecreate`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading data</div>;
  }

  const totalPages = (noticeData?.lastPageNo ?? 0) + 1;

  return (
    <main>
      {noticeData?.items.map((notice, index) => (
        <div key={index} className="flex justify-center items-center">
          <NoticeMolecule
            text={notice.position}
            title={notice.title}
            date={notice.createdAt}
          />
          <div>123</div>
        </div>
      ))}
      <PaginationMolecule
        total={totalPages}
        page={page}
        btn={5}
        setPage={setPage}
      />
      {isUserCrewMember && (
        <FloatingActionButton onClick={handleRouter}>
          <Plus />
        </FloatingActionButton>
      )}
    </main>
  );
};

export default CrewNoticeOrganism;
