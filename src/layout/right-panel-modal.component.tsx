import { Drawer } from "@mantine/core";
import {
  useCloseRightPanelModal,
  useRightPanelModalVisibilityState,
} from "./use-right-panel-modal";
import type { JSX } from "react";

type tProps = {
  title?: string;
  children: JSX.Element;
};
const RightPanelModal = (props: tProps) => {
  const isOpen = useRightPanelModalVisibilityState();
  const onClose = useCloseRightPanelModal();
  return (
    <Drawer
      position="bottom"
      zIndex={100}
      opened={isOpen}
      onClose={onClose}
      title={props.title}
    >
      {props.children}
    </Drawer>
  );
};

export default RightPanelModal;
