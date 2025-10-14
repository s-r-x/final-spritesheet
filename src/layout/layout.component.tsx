import { Stack } from "@mantine/core";
import styles from "./layout.module.css";
import { type JSX, memo } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import RightPanelModal from "./right-panel-modal.component";
import { useIsMobileLayout } from "./use-is-mobile-layout";
import LeftPanelModal from "./left-panel-modal.component";

type tProps = {
  appBarSlot?: JSX.Element;
  mainSlot?: JSX.Element;
  toolbarSlot?: JSX.Element;
  leftPanelSlot?: JSX.Element;
  rightPanelSlot?: JSX.Element;
  rightPanelLabel?: string;
};
const AppLayout = memo((props: tProps) => {
  const isMobile = useIsMobileLayout();
  const isDesktop = !isMobile;
  return (
    <div className={styles.root}>
      {isMobile && (
        <header className={styles.header}>{props.appBarSlot}</header>
      )}
      <div className={styles.content}>
        <PanelGroup
          autoSaveId="spritesheet-editor-layout"
          direction="horizontal"
        >
          {isDesktop && (
            <>
              <Panel
                defaultSize={25}
                minSize={1}
                maxSize={50}
                style={{
                  minWidth: "4rem",
                }}
              >
                <Stack p="xs" className={styles.leftPanel}>
                  {props.appBarSlot}
                  <div
                    id="leftPanelScrollable"
                    className={styles.leftPanelContent}
                  >
                    {props.leftPanelSlot}
                  </div>
                </Stack>
              </Panel>
              <PanelResizeHandle className={styles.separator} />
            </>
          )}
          <Panel style={{ display: "flex" }}>
            <main id="canvas-root" className={styles.main}>
              {props.mainSlot}
              {props.toolbarSlot && (
                <div role="toolbar" className={styles.toolbar}>
                  {props.toolbarSlot}
                </div>
              )}
            </main>
          </Panel>
          {props.rightPanelSlot && isDesktop && (
            <div className={styles.rightPanel}>{props.rightPanelSlot}</div>
          )}
        </PanelGroup>
      </div>
      {props.leftPanelSlot && isMobile && (
        <LeftPanelModal>{props.leftPanelSlot}</LeftPanelModal>
      )}
      {props.rightPanelSlot && isMobile && (
        <RightPanelModal title={props.rightPanelLabel}>
          {props.rightPanelSlot}
        </RightPanelModal>
      )}
    </div>
  );
});

export default AppLayout;
