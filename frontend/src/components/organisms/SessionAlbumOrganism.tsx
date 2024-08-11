import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from "react";
import {
  GetSessionAlbumDto,
  getSessionAlbum,
  uploadSessionImages,
  UploadSessionImageRequestDto,
} from "../../apis/api/sessiondetail";
import InfiniteScrollComponent from "../../util/paging/component/InfinityScrollComponent";
import { PageNationData } from "../../util/paging/type";
import { ReactComponent as PlusIcon } from "../../assets/icons/plus.svg";
import FloatingActionButton from "../atoms/Button/FloatingActionButton";
import { uploadImage } from "../../apis/api/presigned";

type PropsData = {
  sessionId: number;
  onSelectImage: (imageUrl: string, imageId: number) => void;
};

const SessionAlbumOrganism = forwardRef(({ sessionId, onSelectImage }: PropsData, ref) => {
  const [images, setImages] = useState<GetSessionAlbumDto[]>([]);
  const [fetchKey, setFetchKey] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    refreshGallery();
  }, [sessionId]);

  const fetchGallery = async (pageNo: number): Promise<PageNationData<GetSessionAlbumDto>> => {
    const data = await getSessionAlbum(pageNo, sessionId);
    if (pageNo === 0) {
      setImages(data.items);
    } else {
      setImages((prevImages) => [...prevImages, ...data.items]);
    }
    return data;
  };

  const handleAlbumUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      try {
        const uploadedUrls = await Promise.all(
          Array.from(files).map((file) => uploadImage(file))
        );

        const uploadDto: UploadSessionImageRequestDto = {
          sessionId: sessionId,
          sessionImageUrls: uploadedUrls,
        };
        await uploadSessionImages(uploadDto);

        await refreshGallery();
        setFetchKey((prevKey) => prevKey + 1);
      } catch (error) {
        console.error("Image upload failed", error);
      }
    }
  };

  const refreshGallery = async () => {
    try {
      const updatedData = await getSessionAlbum(0, sessionId);
      setImages(updatedData.items);
    } catch (error) {
      console.error("Failed to refresh gallery", error);
    }
  };

  const removeImageFromState = (imageId: number) => {
    setImages((prevImages) =>
      prevImages.filter((image) => image.sessionImageId !== imageId)
    );
  };

  useImperativeHandle(ref, () => ({
    refreshGallery,
    removeImageFromState,
  }));

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
      <FloatingActionButton onClick={handleAlbumUpload}>
        <PlusIcon />
      </FloatingActionButton>
      {images.length === 0 ? (
        <div className="text-gray-300 w-full text-center mt-4">
          등록된 사진이 없습니다.
        </div>
      ) : (
        <InfiniteScrollComponent
          fetchKey={`sessionGallery-${fetchKey}`}
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
        />
      )}
    </div>
  );
});

export default SessionAlbumOrganism;
