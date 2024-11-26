import { ReactComponent as CrewinLogo } from "../../../assets/icons/crewinlogo.svg";

type OwnProps = {
  name: string;
  nickname: string;
  profileUrl: string;
  children?: React.ReactElement;
};

const MemberListItem: React.FC<OwnProps> = ({
  name,
  nickname,
  profileUrl,
  children,
}) => {
  return (
    <div className="flex items-center p-2 border-b">
      <div className="w-12 h-12 flex-shrink-0">
        {profileUrl ? (
          <img
            src={profileUrl}
            alt={name}
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <CrewinLogo className="w-full h-full object-cover rounded-full" />
        )}
      </div>
      <div className="flex-1 ml-3">
        <div className="font-bold">{name}</div>
        <div className="text-gray-600">{nickname}</div>
      </div>
      <div className="flex gap-2">{children}</div>
    </div>
  );
};

export default MemberListItem;
