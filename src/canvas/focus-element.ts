import type { Application } from "pixi.js";
import type { Viewport } from "./canvas-viewport";

export const focusElement = ({
  name,
  canvasApp: app,
  viewport,
}: {
  name: string;
  canvasApp: Application;
  viewport: Viewport;
}) => {
  const el = app.stage.getChildByLabel(name, true);
  if (!el) return;
  const pos = viewport.toLocal(el.getGlobalPosition());
  viewport.moveCenter(pos.x + el.width / 2, pos.y + el.height / 2);
  viewport.fit(true, el.width, el.height);
};
