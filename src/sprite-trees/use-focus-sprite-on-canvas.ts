import { useFocusSprite } from "@/canvas/use-focus-sprite";
import { useIsMobileLayout } from "@/layout/use-is-mobile-layout";
import { useCloseLeftPanelModal } from "@/layout/use-left-panel-modal";
export const useFocusSpriteOnCanvas = () => {
  const closeLeftPanel = useCloseLeftPanelModal();
  const isInsideModal = useIsMobileLayout();
  const focusSprite_ = useFocusSprite();
  const focusSprite = (id: string) => {
    focusSprite_(id);
    if (isInsideModal) {
      closeLeftPanel();
    }
  };
  return focusSprite;
};
