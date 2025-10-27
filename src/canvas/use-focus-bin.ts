import { useCallback } from "react";
import { useFocusElement } from "./use-focus-element";

export const useFocusBin = () => {
  const focusElement = useFocusElement();
  return useCallback(
    (id: string) => {
      focusElement({
        name: "bin-" + id,
      });
    },
    [focusElement],
  );
};
