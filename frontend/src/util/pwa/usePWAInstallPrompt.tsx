import { useEffect, useMemo, useState } from "react";

type OwnProps = {
  onAccepted?: () => void;
  onReject?: () => void;
};

export const usePWAInstallPrompt = ({ onAccepted, onReject }: OwnProps) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const isInstalled = useMemo(() => deferredPrompt === null, [deferredPrompt]);

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleBeforeInstallPrompt = (event: Event) => {
    event.preventDefault();
    setDeferredPrompt(event);
  };

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();

      deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === "accepted") {
          if (onAccepted) onAccepted();
        } else {
          if (onReject) onReject();
        }
        setDeferredPrompt(null);
      });
    }
  };

  return [isInstalled, handleInstallClick] as const;
};
