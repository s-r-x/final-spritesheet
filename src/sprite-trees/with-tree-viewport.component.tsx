import type { ComponentType } from "react";
import styles from "./styles.module.css";
import { useMeasure } from "#hooks/use-measure";

export type tTreeViewportProps = {
  width: number;
  height: number;
};
export function withTreeViewport<T extends tTreeViewportProps>(
  Component: ComponentType<T>,
) {
  return (props: Omit<T, keyof tTreeViewportProps>) => {
    const { ref, width, height } = useMeasure();
    return (
      <div ref={ref} className={styles.treeRoot}>
        <div className={styles.treeViewport} data-testid="tree-viewport">
          {width > 0 && height > 0 && (
            <Component
              {...(props as T)}
              width={width - 1}
              height={height - 1}
            />
          )}
        </div>
      </div>
    );
  };
}
