import React, { useRef, useState, useEffect } from "react";
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
  onSelectImage: (imageUrl: string) => void; // 이미지 선택 핸들러 props
};

const SessionAlbumOrganism: React.FC<PropsData> = ({
  sessionId,
  onSelectImage,
}) => {
  const [images, setImages] = useState<GetSessionAlbumDto[]>([]); // 이미지 데이터 상태 추가
  const [fetchKey, setFetchKey] = useState(0); // fetchKey 상태 추가
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 갤러리 데이터 가져오기
  const fetchGallery = async (
    pageNo: number
  ): Promise<PageNationData<GetSessionAlbumDto>> => {
    const data = await getSessionAlbum(pageNo, sessionId);
    if (pageNo === 0) {
      setImages(data.items);
    } else {
      setImages((prevImages) => [...prevImages, ...data.items]);
    }
    return data;
  };

  // 파일 업로드 버튼 클릭 핸들러
  const handleAlbumUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 파일 변경 이벤트 핸들러
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
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

        // 업로드 성공 후 갤러리 갱신
        await refreshGallery(); // 갤러리 갱신 함수 호출
        setFetchKey((prevKey) => prevKey + 1); // fetchKey 갱신
      } catch (error) {
        console.error("Image upload failed", error);
      }
    }
  };

  // 갤러리 갱신 함수
  const refreshGallery = async () => {
    try {
      // 첫 페이지의 데이터를 다시 불러옴
      const updatedData = await getSessionAlbum(0, sessionId);
      setImages(updatedData.items); // 이미지를 다시 설정
    } catch (error) {
      console.error("Failed to refresh gallery", error);
    }
  };

  // 컴포넌트가 마운트될 때 갤러리 데이터를 불러옴
  useEffect(() => {
    refreshGallery();
  }, [sessionId]);

  return (
    <div className="h-[500px] overflow-y-auto">
      {" "}
      {/* 스크롤 가능한 영역 */}
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
          fetchKey={`sessionGallery-${fetchKey}`} // fetchKey에 동적 값 추가
          fetchData={fetchGallery}
          ItemComponent={({ data }) => (
            <div
              className="w-full h-full"
              style={{ position: "relative", paddingBottom: "100%" }}
              onClick={() => onSelectImage(data.imageUrl)}
            >
              <img
                src={data.imageUrl}
                alt={`gallery-item-${data.sessionImageId}`}
                key={`gallery-${data.sessionImageId}`}
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
};

export default SessionAlbumOrganism;
