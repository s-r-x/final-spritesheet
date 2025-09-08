import { type Viewport } from "@/canvas/canvas-viewport";
import { type PixiReactElementProps } from "@pixi/react";

declare global {
  type Maybe<T> = T | null;
  namespace React {
    namespace JSX {
      interface IntrinsicElements extends PixiElements {
        pixiViewport: PixiReactElementProps<typeof Viewport>;
      }
    }
  }
}
