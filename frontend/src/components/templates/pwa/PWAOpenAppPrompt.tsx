import { useState } from "react";
import { usePWAPrompt } from "../../../util/pwa/usePWAPrompt";
import ModalMolecules from "../../molecules/ModalMolecules";
import LargeAbleButton from "../../atoms/Button/LargeAbleButton";

export const PWAOpenAppPrompt = () => {
  const [isInstalled,, handleOpenAppClick] = usePWAPrompt({});
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const handleClose = () => setIsOpen(false);
  return (
    isInstalled &&
    isOpen && (
      <ModalMolecules title="CREW-IN" onClose={handleClose}>
        <p className="pb-3">앱으로 사용하면 더 편하게 사용할 수 있습니다!</p>
        <LargeAbleButton text="실행하기" onClick={handleOpenAppClick} />
      </ModalMolecules>
    )
  );
};
