import React, { useRef, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import InfiniteScrollComponent, {
  ItemComponentProps,
} from "../organisms/InfiniteScrollOrganism";

import FloatingActionButton from "../atoms/Button/FloatingActionButton";
import { ReactComponent as PlusIcon } from "../../assets/icons/plus.svg";
import { uploadImage } from "../../apis/api/presigned";
import {
  uploadSessionImages,
  UploadSessionImageRequestDto,
  GetSessionAlbumDto,
} from "../../apis/api/sessiondetail";
import { PageNationData } from "../../util/paging/type";

type SessionAlbumOrganismProps = {
  fetchAlbumData: (page: number) => Promise<PageNationData<GetSessionAlbumDto>>;
  sessionId: number;
};

const SessionAlbumOrganism: React.FC<SessionAlbumOrganismProps> = ({
  fetchAlbumData,
  sessionId,
}) => {
  const [totalImageCount, setTotalImageCount] = useState<number>(0);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const handleAlbumUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const uploadImageMutation = useMutation(uploadImage, {
    onSuccess: (data) => {
      setUploadedImages((prevImages) => [data, ...prevImages]);
      setTotalImageCount((prevCount) => prevCount + 1);
    },
  });

  const uploadSessionImagesMutation = useMutation(
    (dto: UploadSessionImageRequestDto) => uploadSessionImages(dto),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("sessionAlbum");
      },
    }
  );

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);

      const uploadPromises = files.map(async (file) => {
        const imageUrl = await uploadImageMutation.mutateAsync(file);
        return imageUrl;
      });

      const uploadedImageUrls = await Promise.all(uploadPromises);
      const uploadSessionImageRequestDto: UploadSessionImageRequestDto = {
        sessionId,
        sessionImageUrls: uploadedImageUrls,
      };
      await uploadSessionImagesMutation.mutateAsync(
        uploadSessionImageRequestDto
      );
    }
  };

  const PhotoItem = ({
    data,
  }: ItemComponentProps<string>): React.ReactElement => (
    <img
      src={data}
      alt="Session Album"
      className="photo-item"
      style={{ border: "1px solid rgba(255, 0, 0, 0)" }}
    />
  );

  return (
    <>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
        ref={fileInputRef}
        className="hidden"
      />
      <FloatingActionButton onClick={handleAlbumUpload}>
        <PlusIcon />
      </FloatingActionButton>
      {totalImageCount === 0 ? (
        <div className="text-gray-300 w-full text-center mt-4">
          등록된 사진이 없습니다.
        </div>
      ) : (
        <InfiniteScrollComponent
          fetchKey="sessionAlbum"
          fetchData={async (page: number) => {
            const fetchedData = (await fetchAlbumData(page)).items;
            const imageUrls = fetchedData.map((item) => item.imageUrl);
            return [...uploadedImages, ...imageUrls];
          }}
          ItemComponent={({ data }: ItemComponentProps<string>) => (
            <React.Fragment>
              <PhotoItem data={data} />
            </React.Fragment>
          )}
          className="photo-grid"
          pageSize={12}
        />
      )}
    </>
  );
};

export default SessionAlbumOrganism;
