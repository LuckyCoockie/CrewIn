import { ReactComponent as CloseIcon } from "../../assets/icons/CloseIcon.svg";
import { Avatar } from "../atoms/Avartar";
import EditableText from "../atoms/EditableText";

export type OwnProps = {
  title: string;
  marker: React.ReactElement;
  first?: boolean;
  last?: boolean;
  onClick?: () => void;
  onChange?: (text: string) => void;
  onDelete?: () => void;
  editable?: boolean;
};

export const MarkerListItem = ({
  title,
  marker,
  first,
  last,
  onClick,
  onChange,
  onDelete,
  editable,
}: OwnProps) => {
  return (
    <div>
      <div className="flex items-center space-x-4 rtl:space-x-reverse">
        {/* TODO : 점선 밖으로 뺄지 고민해보기 */}
        <div className="flex flex-col justify-center items-center">
          <div
            className={`h-3 border-l-2 border-dotted ${
              !first && "border-gray-500"
            }`}
          />
          <Avatar img={marker} onClick={onClick} />
          <div
            className={`h-3 border-l-2 border-dotted ${
              !last && "border-gray-500"
            }`}
          />
        </div>
        <div className="min-w-0 flex-1">
          <EditableText text={title} onChange={onChange} editable={editable} />
        </div>
        {editable && <CloseIcon onClick={onDelete} />}
      </div>
    </div>
  );
};
