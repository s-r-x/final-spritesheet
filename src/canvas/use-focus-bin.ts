import { useFocusElement } from "./use-focus-element";

export const useFocusBin = () => {
  const focusElement = useFocusElement();
  return (id: string) => {
    focusElement({
      name: "bin-" + id,
    });
  };
};
