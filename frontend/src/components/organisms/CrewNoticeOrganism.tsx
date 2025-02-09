import React, { useState } from "react";
import { useQuery } from "react-query";
import NoticeMolecule from "../molecules/Content/NoticeMolecule";
import FloatingActionButton from "../atoms/Button/FloatingActionButton";
import PaginationMolecule from "../molecules/Pagination/PaginationMolecule";
import { ReactComponent as Plus } from "../../assets/icons/plus.svg";
import { useNavigate } from "react-router-dom";
import { getCrewNoticeList } from "../../apis/api/crewdetail";
import SpinnerComponent from "../atoms/SpinnerComponent";
import ErrorText from "../atoms/ErrorText";


type CrewNoticeOrganismProps = {
  crewId: number;
  isUserCrewMember: boolean;
  userPosition?: string;
};

const CrewNoticeOrganism: React.FC<CrewNoticeOrganismProps> = ({
  crewId,
  isUserCrewMember,
  userPosition,
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

  const handleNoticeDetail = (noticeId: number) => {
    navigate(`/crew/detail/${crewId}/notice/${noticeId}`);
  };

  if (isLoading) {
    return <SpinnerComponent/>
  }

  if (error) {
    return <ErrorText text="데이터를 로드하는데 오류가 발생했습니다."/>;
  }

  const totalPages = (noticeData?.lastPageNo ?? 0) + 1;
  const dataConvert = (date: string) => {
    return date.slice(0, 10);
  };

  return (
    <main>
      {noticeData?.items.length === 0 ? (
        <div className="text-gray-300 w-full text-center mt-4">
          등록된 공지사항이 없습니다.
        </div>
      ) : (
        <>
          {noticeData?.items.map((notice, index) => (
            <div
              key={index}
              className="flex justify-center items-center border-b"
            >
              <NoticeMolecule
                text={notice.position}
                title={notice.title}
                date={dataConvert(notice.createdAt)}
                onClick={() => handleNoticeDetail(notice.noticeId)}
              />
            </div>
          ))}
          <PaginationMolecule
            total={totalPages}
            page={page}
            btn={5}
            setPage={setPage}
          />
        </>
      )}
      {isUserCrewMember && userPosition !== "MEMBER" && (
        <FloatingActionButton onClick={handleRouter}>
          <Plus />
        </FloatingActionButton>
      )}
    </main>
  );
};

export default CrewNoticeOrganism;
