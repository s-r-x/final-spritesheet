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
  const elGlobalPos = el.getGlobalPosition();
  if (isNaN(elGlobalPos.x) || isNaN(elGlobalPos.y)) {
    return;
  }
  const pos = viewport.toLocal(elGlobalPos);
  viewport.moveCenter(pos.x + el.width / 2, pos.y + el.height / 2);
  viewport.fit(true, el.width, el.height);
};
