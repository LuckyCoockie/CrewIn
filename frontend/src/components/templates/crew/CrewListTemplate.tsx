import { CrewDto } from "../../../apis/api/crew";
import CrewListComponent from "../../organisms/CrewListOrganisms";

type OwnProps = {
  fetchData: (page: number) => Promise<CrewDto[]>;
};

const CrewListTemplate: React.FC<OwnProps> = ({ fetchData }: OwnProps) => {
  return <CrewListComponent pageSize={6} fetchData={fetchData} />;
};

export default CrewListTemplate;
