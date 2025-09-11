import { useCallback } from "react";
import { useFocusElement } from "./use-focus-element";

export const useFocusProject = () => {
  const focusElement = useFocusElement();
  return useCallback(() => {
    focusElement({
      name: "bins-root",
    });
  }, [focusElement]);
};
