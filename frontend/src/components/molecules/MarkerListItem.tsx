import CloseIcon from "../../assets/icons/CloseIcon.svg";
import { Avatar } from "../atoms/Avartar";
import EditableText from "../atoms/EditableText";

export type OwnProps = {
  title: string;
  marker: string;
  first?: boolean;
  last?: boolean;
  onClick?: () => void;
  onChange?: (text: string) => void;
  onDelete?: () => void;
};

export const MarkerListItem = ({
  title,
  marker,
  first,
  last,
  onClick,
  onChange,
  onDelete,
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
          <Avatar img={marker} onClick={onClick} alt={"Neil image"} />
          <div
            className={`h-3 border-l-2 border-dotted ${
              !last && "border-gray-500"
            }`}
          />
        </div>
        <div className="min-w-0 flex-1">
          <EditableText text={title} onChange={onChange} />
        </div>
        <div
          className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white"
          onClick={onDelete}
        >
          <img src={CloseIcon} />
        </div>
      </div>
    </div>
  );
};
