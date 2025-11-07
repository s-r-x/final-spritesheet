import { Drawer } from "@mantine/core";
import {
  useCloseLeftPanelModal,
  useLeftPanelModalVisibilityState,
} from "./use-left-panel-modal";
import type { JSX } from "react";
import styles from "./layout.module.css";

type tProps = {
  title?: string;
  children: JSX.Element;
};
const LeftPanelModal = (props: tProps) => {
  const isOpen = useLeftPanelModalVisibilityState();
  const onClose = useCloseLeftPanelModal();
  return (
    <Drawer
      zIndex={100}
      position="left"
      opened={isOpen}
      onClose={onClose}
      title={props.title}
      className={styles.leftPanel}
    >
      {props.children}
    </Drawer>
  );
};

export default LeftPanelModal;
