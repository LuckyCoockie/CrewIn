import {
  GetCrewGalleryListDetailReqeustParams,
  PostDto,
} from "../../apis/api/crewGallaryList";
import CrewGalleryListDetailComponent from "../organisms/CrewGalleryDetailListOrganism";

type OwnProps = {
  postId: number;
  fetchData: (dto: GetCrewGalleryListDetailReqeustParams) => Promise<PostDto[]>;
};

const CrewGalleryListDetailTemplate: React.FC<OwnProps> = ({
  postId,
  fetchData,
}: OwnProps) => {
  return (
    <div className="flex flex-col items-center max-w-[550px] mt-4 mb-20">
      <CrewGalleryListDetailComponent postId={postId} fetchData={fetchData} />
    </div>
  );
};

export default CrewGalleryListDetailTemplate;
