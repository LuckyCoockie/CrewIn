import { useState } from "react";
import { usePWAInstallPrompt } from "../../util/pwa/usePWAInstallPrompt";
import ModalMolecules from "../molecules/ModalMolecules";
import LargeAbleButton from "../atoms/Button/LargeAbleButton";

export const PWAInstallPrompt = () => {
  const [isInstalled, handleInstallClick] = usePWAInstallPrompt({});
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const handleClose = () => setIsOpen(false);
  console.log(isInstalled, isOpen);
  return (
    !isInstalled &&
    isOpen && (
      <ModalMolecules title="CREW-IN" onClose={handleClose}>
        <p className="pb-3">앱으로 사용하면 더 편하게 사용할 수 있습니다!</p>
        <LargeAbleButton text="설치하기" onClick={handleInstallClick} />
      </ModalMolecules>
    )
  );
};
