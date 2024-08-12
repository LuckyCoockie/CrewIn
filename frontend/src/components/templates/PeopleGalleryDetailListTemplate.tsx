import { PeopleGalleryDetailResponseDto } from "../../apis/api/mypage";
import BackHeaderMediumOrganism from "../organisms/BackHeaderMediumOrganism";
import PostListComponent from "../organisms/CrewGalleryDetailListOrganism";

type OwnProps = {
  initPage?: number;
  initPostId?: number;
  fetchData: (pageNo: number) => Promise<PeopleGalleryDetailResponseDto>;
};

const PeopleGalleryDetailListTemplate: React.FC<OwnProps> = ({
  initPage,
  initPostId,
  fetchData,
}: OwnProps) => {
  return (
    <div className="flex flex-col items-center max-w-[550px] mt-4 mb-20">
      <header>
        <BackHeaderMediumOrganism text={"사진첩 상세조회"} />
      </header>
      <PostListComponent
        initPage={initPage}
        initPostId={initPostId}
        fetchData={fetchData}
      />
    </div>
  );
};

export default PeopleGalleryDetailListTemplate;
