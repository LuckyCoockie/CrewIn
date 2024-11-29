import React from "react";
import ReactDOM from "react-dom";
import closeButton from "../../assets/images/closebutton.png";

interface ModalProps {
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
  onConfirm?: () => void; 
  type?: "delete" | "default";
}

const ModalConfirm: React.FC<ModalProps> = ({
  title,
  children,
  onClose,
  onConfirm,
  type = "default", // 기본값은 "default"
}) => {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-auto">
      <div className="relative bg-white p-2 rounded-lg shadow-lg max-w-sm w-5/6 max-h-full overflow-y-auto items-center">
        <div className="flex top-3 p-3 pb-0 justify-between items-center">
          <label
            className={`block min-h-[1.5rem] tracking-tighter text-lg ${
              type === "delete" ? "text-red-600" : ""
            }`}
          >
            {title}
          </label>
          <button
            onClick={onClose}
            className="text-sub no-background items-center"
          >
            <img src={closeButton} alt="close button" className="w-3 h-3" />
          </button>
        </div>
        <div className="p-3">{children}</div>
        <div className="flex justify-end space-x-4 p-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary-500 rounded-md hover:bg-primary-500"
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
