import { Drawer } from "@mantine/core";
import {
  useCloseLeftPanelModal,
  useLeftPanelModalVisibilityState,
} from "./use-left-panel-modal";
import type { JSX } from "react";

type tProps = {
  title?: string;
  children: JSX.Element;
};
const LeftPanelModal = (props: tProps) => {
  const isOpen = useLeftPanelModalVisibilityState();
  const onClose = useCloseLeftPanelModal();
  return (
    <Drawer
      position="left"
      opened={isOpen}
      onClose={onClose}
      title={props.title}
    >
      {props.children}
    </Drawer>
  );
};

export default LeftPanelModal;
