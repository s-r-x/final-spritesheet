import { useFocusElement } from "./use-focus-element";

export const useFocusSprite = () => {
  const focusElement = useFocusElement();
  return (id: string) => {
    focusElement({
      name: "sprite-" + id,
    });
  };
};
