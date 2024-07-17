import { Avatar } from "flowbite-react";

import CloseIcon from "../../assets/icons/CloseIcon.svg";

export type OwnProps = {
  title: string;
  marker: string;
  onClick: () => void;
  onDelete: () => void;
};

export const MarkerListItem = ({
  title,
  marker,
  onClick,
  onDelete,
}: OwnProps) => {
  return (
    <div className="flex items-center space-x-4 rtl:space-x-reverse">
      <Avatar
        img={marker}
        alt="Neil image"
        rounded
        size="sm"
        onClick={onClick}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
          {title}
        </p>
      </div>
      <div
        className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white"
        onClick={onDelete}
      >
        <img src={CloseIcon} />
      </div>
    </div>
  );
};
