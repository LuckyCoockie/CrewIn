import React from "react";
import ReactDOM from "react-dom";
import closeButton from "../../assets/images/closebutton.png";

interface ModalProps {
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
  onConfirm?: () => void; // 확인 버튼을 위한 핸들러 추가
}

const ModalConfirm: React.FC<ModalProps> = ({
  title,
  children,
  onClose,
  onConfirm,
}) => {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-auto">
      <div className="relative bg-white p-2 rounded-lg shadow-lg max-w-sm w-5/6 max-h-full overflow-y-auto items-center">
        <div className="flex top-3 p-3 pb-0 justify-between items-center">
          <label className="block min-h-[1.5rem] tracking-tighter text-lg">
            {title}
          </label>
          <button
            onClick={onClose}
            className="text-gray-600 no-background items-center"
          >
            <img src={closeButton} alt="close button" className="w-3 h-3" />
          </button>
        </div>
        <div className="p-3">{children}</div>
        <div className="flex justify-end space-x-4 p-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 button-color text-white rounded-md"
          >
            확인
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ModalConfirm;
