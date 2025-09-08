import { createContext, useContext } from "react";
import type { Application } from "pixi.js";
import type { Viewport } from "./canvas-viewport";

export type tCanvasRefs = {
  app: Maybe<Application>;
  viewport: Maybe<Viewport>;
};
export const canvasRefs: tCanvasRefs = {
  app: null,
  viewport: null,
};

const CanvasRefsCtx = createContext(canvasRefs);

export const CanvasRefsProvider = (props: { children: any }) => {
  return <CanvasRefsCtx value={canvasRefs}>{props.children}</CanvasRefsCtx>;
};

export const useCanvasRefs = () => {
  return useContext(CanvasRefsCtx);
};
