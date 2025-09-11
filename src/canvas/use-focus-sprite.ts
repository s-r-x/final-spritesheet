import { useCallback } from "react";
import { useFocusElement } from "./use-focus-element";

export const useFocusSprite = () => {
  const focusElement = useFocusElement();
  return useCallback(
    (id: string) => {
      focusElement({
        name: "sprite-" + id,
      });
    },
    [focusElement],
  );
};
