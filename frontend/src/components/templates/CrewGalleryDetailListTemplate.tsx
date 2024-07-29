import {
  GetCrewGalleryListDetailReqeustParams,
  PostDto,
} from "../../apis/api/crewPostList";
import CrewGallaryListDetailComponent from "../organisms/CrewGalleryDetailListOrganism";

type OwnProps = {
  postId: number;
  fetchData: (dto: GetCrewGalleryListDetailReqeustParams) => Promise<PostDto[]>;
};

const CrewGallaryListDetailTemplate: React.FC<OwnProps> = ({
  postId,
  fetchData,
}: OwnProps) => {
  return (
    <div className="flex flex-col items-center max-w-[550px] mt-4 mb-20">
      <CrewGallaryListDetailComponent postId={postId} fetchData={fetchData} />
    </div>
  );
};

export default CrewGallaryListDetailTemplate;
