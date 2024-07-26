import { GetSessionListRequestDto } from "../../../apis/api/session";
import SessionSearchOrganism from "../../organisms/SessionSearchOrganism";

type OwnProps = {
  fetchData: (dto: GetSessionListRequestDto) => Promise<void>;
};

const SessionListTemplate: React.FC<OwnProps> = ({ fetchData }) => {
  return <SessionSearchOrganism onSearch={fetchData} />;
};

export default SessionListTemplate;
