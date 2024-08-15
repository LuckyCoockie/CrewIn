import React, { useRef } from "react";
import {
  GetSessionAlbumDto,
  getSessionAlbum,
} from "../../apis/api/sessiondetail";
import InfiniteScrollComponent from "../../util/paging/component/InfinityScrollComponent";
import { PageNationData } from "../../util/paging/type";
import { ReactComponent as PlusIcon } from "../../assets/icons/plus.svg";
import FloatingActionButton from "../atoms/Button/FloatingActionButton";

type PropsData = {
  sessionId: number;
  onSelectImage: (imageUrl: string | null, imageId: number | null) => void;
  onUpload: (files: FileList) => Promise<void>;
};

const SessionAlbumOrganism = ({
  sessionId,
  onSelectImage,
  onUpload,
}: PropsData) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchGallery = async (
    pageNo: number
  ): Promise<PageNationData<GetSessionAlbumDto>> => {
    const data = await getSessionAlbum(pageNo, sessionId);
    if (data.items.length > 0) {
      // 첫 번째 이미지를 선택
      onSelectImage(data.items[0].imageUrl, data.items[0].sessionImageId);
    } else {
      onSelectImage(null, null);
    }
    return data;
  };

  const handleAlbumUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files) onUpload(files);
  };

  return (
    <div className="h-[500px] overflow-y-auto">
      <input
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <FloatingActionButton onClick={handleAlbumUpload} className="z-50">
        <PlusIcon />
      </FloatingActionButton>
      <InfiniteScrollComponent
        fetchKey={[`sessionGallery`, `${sessionId}`]}
        fetchData={fetchGallery}
        ItemComponent={({ data }) => (
          <div
            key={data.sessionImageId}
            className="w-full h-full"
            style={{ position: "relative", paddingBottom: "100%" }}
            onClick={() => onSelectImage(data.imageUrl, data.sessionImageId)}
          >
            <img
              src={data.imageUrl}
              alt={`gallery-item-${data.sessionImageId}`}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                border: "1px solid rgba(255, 0, 0, 0)",
              }}
            />
          </div>
        )}
        className="grid grid-cols-3"
        EmptyComponent={
          <div className="text-gray-300 w-full text-center mt-4">
            등록된 사진이 없습니다.
          </div>
        }
      />
    </div>
  );
};

export default SessionAlbumOrganism;
