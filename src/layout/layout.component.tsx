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
            <Panel
              defaultSize={25}
              minSize={1}
              maxSize={50}
              className={styles.panelWrap}
              style={{ paddingInlineEnd: 0 }}
            >
              <div className={styles.leftPanel}>
                <header>{props.appBarSlot}</header>
                <div
                  id="leftPanelScrollable"
                  className={styles.leftPanelContent}
                >
                  {props.leftPanelSlot}
                </div>
                <PanelResizeHandle className={styles.separator} />
              </div>
            </Panel>
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
            <div className={styles.panelWrap} style={{ paddingInlineStart: 0 }}>
              <div className={styles.rightPanel}>{props.rightPanelSlot}</div>
            </div>
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
