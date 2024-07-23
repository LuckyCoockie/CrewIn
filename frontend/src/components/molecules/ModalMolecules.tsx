import React from 'react';
import ReactDOM from 'react-dom';
import closeButton from "../../assets/images/closebutton.png";

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-auto">
      <div className="relative bg-white p-2 rounded-lg shadow-lg max-w-sm w-5/6 max-h-full overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 no-background w-3 h-3"
        >
          <img src={closeButton} alt="close button" />
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;