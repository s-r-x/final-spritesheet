import { useFocusElement } from "./use-focus-element";

export const useFocusProject = () => {
  const focusElement = useFocusElement();
  return () => {
    focusElement({
      name: "bins-root",
    });
  };
};
