import type { TreeProps } from "react-arborist/dist/module/types/tree-props";
import type { tTreeNodeData } from "./types";
import styles from "./styles.module.css";
import clsx from "clsx";

export const useRowRenderer = () => {
  const renderer: TreeProps<tTreeNodeData>["renderRow"] = (args) => {
    return (
      // biome-ignore lint/a11y/noStaticElementInteractions: <react-arborist>
      // biome-ignore lint/a11y/useAriaPropsSupportedByRole: <react-arborist>
      // biome-ignore lint/a11y/useKeyWithClickEvents: <react-arborist>
      <div
        {...args.attrs}
        className={clsx(
          styles.treeRow,
          args.node.data.nodeProps.isOversized && styles.oversized,
        )}
        data-node-id={args.node.id}
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
