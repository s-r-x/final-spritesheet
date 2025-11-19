import { useCanRedo, useRedo } from "@/history/use-redo";
import { useCanUndo, useUndo } from "@/history/use-undo";
import { useRouter } from "@tanstack/react-router";
import type { PropsWithChildren } from "react";
import BaseErrorBoundary from "@/common/components/error-boundary";

const SharedErrorBoundary = (
  props: PropsWithChildren<{ isCentered?: boolean }>,
) => {
  const undo = useUndo();
  const redo = useRedo();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();
  const router = useRouter();
  return (
    <BaseErrorBoundary
      centerFallbackInViewport={props.isCentered}
      onReset={async () => {
        if (canUndo) {
          await undo();
        } else if (canRedo) {
          await redo();
        } else {
          await router.invalidate();
        }
      }}
    >
      {props.children}
    </BaseErrorBoundary>
  );
};

export default SharedErrorBoundary;
