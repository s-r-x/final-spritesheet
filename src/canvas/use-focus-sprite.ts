import { useCallback } from "react";
import { useCanvasRefs } from "./canvas-refs";

export const useFocusSprite = () => {
  const canvasRefs = useCanvasRefs();
  return useCallback(
    (id: string) => {
      const pixiApp = canvasRefs.app;
      const pixiViewport = canvasRefs.viewport;
      if (!pixiApp || !pixiViewport) return;
      const el = pixiApp.stage.getChildByLabel("sprite-" + id, true);
      if (!el) return;
      const pos = pixiViewport.toLocal(el.getGlobalPosition());
      pixiViewport.moveCenter(pos.x + el.width / 2, pos.y + el.height / 2);
      pixiViewport.fit(true, el.width, el.height);
    },
    [canvasRefs],
  );
};
