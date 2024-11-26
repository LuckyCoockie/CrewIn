import React from "react";
import InputTextAreaNoLimitTypeMolecule from "../molecules/Input/InputTextAreaNoLimitTypeMolecule";
import InputRadioTypeMolecule from "../molecules/Input/InputRadioTypeMolecule";
import SpinnerComponent from "../atoms/SpinnerComponent";

interface PostEditTemplateProps {
  content: string;
  isPublic: boolean;
  postImages: string[];
  crewId: number;
  onContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onVisibilityChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUpdatePost: () => void;
  isSubmit?: boolean;
}

const PostEditTemplate: React.FC<PostEditTemplateProps> = ({
  content,
  isPublic,
  onContentChange,
  onVisibilityChange,
  onUpdatePost,
  isSubmit,
}) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <main>
        <div className="w-full flex">
          <div className="w-full">
            <InputRadioTypeMolecule
              id="visibility"
              title="공개 범위"
              name="visibility"
              onChange={onVisibilityChange}
              value={["전체", "크루"]}
              selectedValue={isPublic ? "전체" : "크루"}
              default={isPublic ? "전체" : "크루"}
              hasError={false}
              disabledOptions={isPublic ? ["크루"] : []}
            />
          </div>
        </div>

        <div className="w-full mb-6">
          <InputTextAreaNoLimitTypeMolecule
            id="content"
            title="내용"
            name="content"
            value={content}
            onChange={onContentChange}
            placeholder="내용을 입력하세요"
            hasError={false}
          />
        </div>

        <button
          onClick={onUpdatePost}
          className="w-full bg-[#2b2f40e6] py-4 px-8 text-center rounded-lg text-white font-bold"
        >
          {isSubmit ? <SpinnerComponent /> : "수정"}
        </button>
      </main>
    </div>
  );
};

export default PostEditTemplate;
