import React, { useRef, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import InfiniteScrollComponent, {
  ItemComponentProps,
} from "../molecules/InfinityScrollMolecules";

import FloatingActionButton from "../atoms/Button/FloatingActionButton";
import { ReactComponent as PlusIcon } from "../../assets/icons/plus.svg";
import { uploadImage } from "../../apis/api/presigned";
import {
  uploadSessionImages,
  UploadSessionImageRequestDto,
  GetSessionAlbumDto,
} from "../../apis/api/sessiondetail";

type SessionAlbumOrganismProps = {
  fetchAlbumData: (page: number) => Promise<GetSessionAlbumDto[]>;
  sessionId: number;
};

const SessionAlbumOrganism: React.FC<SessionAlbumOrganismProps> = ({
  fetchAlbumData,
  sessionId,
}) => {
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
    <img src={data} alt="Session Album" className="photo-item" />
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
      <InfiniteScrollComponent
        fetchKey="sessionAlbum"
        fetchData={async (page: number) => {
          const fetchedData = await fetchAlbumData(page);
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
    </>
  );
};

export default SessionAlbumOrganism;
