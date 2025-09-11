import { useCallback } from "react";
import { useCanvasRefs } from "./canvas-refs";
import { focusElement } from "./focus-element";

export const useFocusElement = () => {
  const canvasRefs = useCanvasRefs();
  return useCallback(
    ({ name }: { name: string }) => {
      const canvasApp = canvasRefs.app;
      const viewport = canvasRefs.viewport;
      if (!canvasApp || !viewport) return;
      focusElement({ name, canvasApp, viewport });
    },
    [canvasRefs],
  );
};
