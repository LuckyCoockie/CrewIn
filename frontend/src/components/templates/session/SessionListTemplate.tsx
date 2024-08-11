import {
  GetMySessionRequestDto,
  SessionDto,
  SessionType,
  sessionTypeToLabel,
} from "../../../apis/api/session";
import { useCallback, useState } from "react";

import qs from "query-string";
import DropdownTypeComponent from "../../atoms/Input/DropdownItemComponent";
import InfiniteScrollComponent from "../../../util/paging/component/InfinityScrollComponent";
import SessionListItemMolecules from "../../molecules/SessionListItemMolecules";
import { PageNationData } from "../../../util/paging/type";
import BackHeaderMediumOrganism from "../../organisms/BackHeaderMediumOrganism";
import { ReactComponent as InfoIcon } from "../../../assets/icons/info_icon.svg";
import Modal from "../../molecules/ModalMolecules";

type OwnProps = {
  title: string;
  onSearch: (dto: GetMySessionRequestDto) => Promise<void>;
  fetchData: (
    dto: GetMySessionRequestDto
  ) => Promise<PageNationData<SessionDto>>;
  onSessionItemClick: (sessionId: number) => Promise<void>;
};

const SessionListTemplate: React.FC<OwnProps> = ({
  title,
  onSearch,
  fetchData,
  onSessionItemClick,
}) => {
  const query = qs.parse(location.search);

  const [type, setType] = useState<SessionType>(query.sessionType);

  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  const handelTypeChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const value = event.target.value as SessionType;
      setType(value);
      onSearch({ sessionType: value });
    },
    [onSearch]
  );

  const handleFetchData = useCallback(
    async (page: number) => {
      return fetchData({ sessionType: type, pageNo: page.toString() });
    },
    [fetchData, type]
  );

  const handleClickInfoModalConfirm = useCallback(() => {
    setIsInfoModalOpen(true);
  }, []);

  return (
    <>
      <header>
        <BackHeaderMediumOrganism text={title} />
        <InfoIcon onClick={handleClickInfoModalConfirm} className="ml-2" />
      </header>
      <main>
        <div className="flex flex-col items-center max-w-[550px] mt-4 mb-20 relative">
          <div className="mb-3 xs:mb-5 flex items-center bg-white w-full">
            <DropdownTypeComponent
              id="sessionpaceminutes"
              options={[
                { label: "전체", value: undefined },
                ...Object.values(SessionType).map((type) => ({
                  label: sessionTypeToLabel(type),
                  value: type,
                })),
              ]}
              value={type}
              onChange={handelTypeChange}
              className="border rounded-md text-white bg-primary"
            />
          </div>
          <InfiniteScrollComponent
            className="grid grid-cols-2 gap-2 xs:gap-4 mb-2 xs:mb-4 w-full"
            fetchKey={[
              "mypage/session",
              query.type ?? "",
              query.sessionType ?? "",
            ]}
            fetchData={handleFetchData}
            initPage={parseInt(query.pageNo ?? "0")}
            ItemComponent={({ data }) => (
              <div
                key={data.sessionId}
                onClick={() => onSessionItemClick(data.sessionId)}
              >
                <SessionListItemMolecules
                  crewName={data.crewName ?? data.sessionName}
                  area={data.area}
                  date={data.startAt}
                  imageUrl={data.sessionThumbnail}
                  title={data.sessionName}
                />
              </div>
            )}
          />
        </div>
      </main>
      {isInfoModalOpen && (
        <Modal
          title={"세션"}
          onClose={() => setIsInfoModalOpen(false)}
          titleSize="text-xl"
        >
          <div className="pb-4">
            <label className="block min-h-[2rem] tracking-tighter text-gray-900 text-lg">
              {"번개런"}
            </label>
            <p>
              {
                "크루에서 정기적으로 진행되는 세션입니다. 크루원들만을 위한 세션입니다."
              }
            </p>
          </div>
          <div className="pb-4">
            <label className="block min-h-[2rem] tracking-tighter text-gray-900 text-lg">
              {"정규런"}
            </label>
            <p>
              {
                "크루에서 개최하는 세션이며 비 크루원도 자유롭게 참가 할 수 있는 이벤트 세션입니다."
              }
            </p>
          </div>
          <div>
            <label className="block min-h-[2rem] tracking-tighter text-gray-900 text-lg">
              {"오픈런"}
            </label>
            <p>{"누구나 자유롭게 생성하고 참가할 수 있는 세션입니다."}</p>
          </div>
        </Modal>
      )}
    </>
  );
};

export default SessionListTemplate;
