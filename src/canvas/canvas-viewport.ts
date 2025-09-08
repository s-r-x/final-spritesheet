import { Viewport as BaseViewport, type IViewportOptions } from "pixi-viewport";
import { canvasRefs } from "./canvas-refs";

export class Viewport extends BaseViewport {
  constructor(options: Omit<IViewportOptions, "events"> = {}) {
    if (!canvasRefs.app) throw new Error("no pixi app");
    super({
      ...options,
      screenWidth: canvasRefs.app.screen.width,
      screenHeight: canvasRefs.app.screen.height,
      events: canvasRefs.app.renderer.events,
    });
    this.drag().pinch().wheel().decelerate();
  }
}
