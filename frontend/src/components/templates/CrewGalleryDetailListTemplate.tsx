import { GetCrewGalleryListDetailResponseDto } from "../../apis/api/crewGallaryList";
import BackHeaderMediumOrganism from "../organisms/BackHeaderMediumOrganism";
import CrewGalleryListDetailComponent from "../organisms/CrewGalleryDetailListOrganism";

type OwnProps = {
  initPage: number;
  fetchData: (pageNo: number) => Promise<GetCrewGalleryListDetailResponseDto>;
};

const CrewGalleryListDetailTemplate: React.FC<OwnProps> = ({
  initPage,
  fetchData,
}: OwnProps) => {
  return (
    <div className="flex flex-col items-center max-w-[550px] mt-4 mb-20">
      <header>
        <BackHeaderMediumOrganism text={"사진첩 상세조회"} />
      </header>
      <CrewGalleryListDetailComponent
        initPage={initPage}
        fetchData={fetchData}
      />
    </div>
  );
};

export default CrewGalleryListDetailTemplate;
