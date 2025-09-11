import { useCallback } from "react";
import { useFocusElement } from "./use-focus-element";

export const useFocusBin = () => {
  const focusElement = useFocusElement();
  return useCallback(
    (index: number) => {
      focusElement({
        name: "bin-" + index,
      });
    },
    [focusElement],
  );
};
