import type { MouseEvent } from "react";
export type tContextMenuItem = {
  id: string | number;
  title: string;
  onClick: () => any;
};
export type tContextMenuState = {
  isOpen: boolean;
  anchorPoint: { x: number; y: number };
  items: tContextMenuItem[];
};
export type tOpenContextMenuArgs = Pick<tContextMenuState, "items"> & {
  event: MouseEvent<Element>;
};
