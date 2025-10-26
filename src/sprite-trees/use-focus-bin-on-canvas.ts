import { useIsMobileLayout } from "@/layout/use-is-mobile-layout";
import { useCloseLeftPanelModal } from "@/layout/use-left-panel-modal";
import { useFocusBin } from "@/canvas/use-focus-bin";
export const useFocusBinOnCanvas = () => {
  const closeLeftPanel = useCloseLeftPanelModal();
  const isInsideModal = useIsMobileLayout();
  const focusBin_ = useFocusBin();
  const focusBin = (idx: number) => {
    focusBin_(idx);
    if (isInsideModal) {
      closeLeftPanel();
    }
  };
  return focusBin;
};
