import type { TreeProps } from "react-arborist/dist/module/types/tree-props";
import type { tTreeNodeData } from "./types";
import styles from "./styles.module.css";
import clsx from "clsx";

export const useRowRenderer = () => {
  const renderer: TreeProps<tTreeNodeData>["renderRow"] = (args) => {
    const data = args.node.data.nodeProps;
    return (
      // biome-ignore lint/a11y/noStaticElementInteractions: <react-arborist>
      // biome-ignore lint/a11y/useAriaPropsSupportedByRole: <react-arborist>
      // biome-ignore lint/a11y/useKeyWithClickEvents: <react-arborist>
      <div
        {...args.attrs}
        className={clsx(styles.treeRow, data.isOversized && styles.oversized)}
        data-node-id={args.node.id}
        data-kind={data.kind}
        data-parent-bin={
          (data.kind === "folder" || data.kind === "item") && data.binId
        }
        data-parent-folder={data.kind === "item" && data.folderId}
        aria-label={args.node.data.name}
        ref={args.innerRef}
        onFocus={(e) => e.stopPropagation()}
        onClick={args.node.handleClick}
      >
        {args.children}
      </div>
    );
  };
  return renderer;
};
