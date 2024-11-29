import React from "react";
import ReactDOM from "react-dom";
import closeButton from "../../assets/images/closebutton.png";

interface ModalProps {
  title?: string;
  children: React.ReactNode;
  titleSize?: string;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({
  title,
  children,
  onClose,
  titleSize,
}) => {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-auto">
      <div className="relative bg-white p-2 rounded-lg shadow-lg max-w-sm w-5/6 max-h-full overflow-y-auto items-center">
        <div className="flex top-3 p-3 pb-0 justify-between items-center">
          <label
            className={`block min-h-[1.5rem] tracking-tighter text-lg ${titleSize}`}
          >
            {title}
          </label>
          <button
            onClick={onClose}
            className="text-sub no-background items-center"
          >
            <img src={closeButton} alt="close button z" className="w-3 h-3" />
          </button>
        </div>
        <div className="p-3">{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
