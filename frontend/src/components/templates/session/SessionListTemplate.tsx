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

  return (
    <>
      <header>
        <BackHeaderMediumOrganism text={title} />
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
    </>
  );
};

export default SessionListTemplate;
