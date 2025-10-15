import { useLayoutEffect } from "@tanstack/react-router";
import { useState } from "react";
import { useResizeObserver } from "@mantine/hooks";

type tRect = Omit<DOMRectReadOnly, "toJSON">;
const defaultState: tRect = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
};
export function useMeasure<T extends HTMLElement = any>() {
  const [rect, setRect] = useState(defaultState);
  const [ref, observedRect] = useResizeObserver<T>();
  useLayoutEffect(() => {
    const $el = ref.current;
    if ($el) {
      const rect = $el.getBoundingClientRect();
      setRect(rect);
    }
  }, [ref.current]);
  return {
    ref,
    width: observedRect.width || rect.width,
    height: observedRect.height || rect.height,
  };
}
