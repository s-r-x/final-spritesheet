import { useCallback } from "react";
import { useCanvasRefs } from "./canvas-refs";

export const useFocusBin = () => {
  const canvasRefs = useCanvasRefs();
  return useCallback(
    (index: number) => {
      const pixiApp = canvasRefs.app;
      const pixiViewport = canvasRefs.viewport;
      if (!pixiApp || !pixiViewport) return;
      const el = pixiApp.stage.getChildByLabel("bin-" + index, true);
      if (!el) return;
      const pos = pixiViewport.toLocal(el.getGlobalPosition());
      pixiViewport.moveCenter(pos.x + el.width / 2, pos.y + el.height / 2);
      pixiViewport.fit(true, el.width, el.height);
    },
    [canvasRefs],
  );
};
