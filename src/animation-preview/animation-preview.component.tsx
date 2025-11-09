import {
  useAnimationFrames,
  useCloseAnimationPreview,
} from "./use-animation-preview";
import { isEmpty } from "#utils/is-empty";
import { Modal, Slider } from "@mantine/core";
import ErrorBoundary from "#components/error-boundary";
import { useTranslation } from "@/i18n/use-translation";
import type { tSprite } from "@/input/types";
import { type CSSProperties, useEffect, useMemo, useState } from "react";
import { maxBy } from "#utils/max-by";
import styles from "./animation-preview.module.css";
import { useMeasure } from "#hooks/use-measure";
import { usePersistedState } from "#hooks/use-persisted-state";

const i18nNs = "animation_preview.";

const AnimationPreviewModal = () => {
  const frames = useAnimationFrames();
  const hasFrames = !isEmpty(frames);
  const close = useCloseAnimationPreview();
  const { t } = useTranslation();
  const renderContent = () => {
    if (!hasFrames) return null;
    return <AnimationPreview frames={frames} />;
  };
  return (
    <Modal
      size="auto"
      opened={hasFrames}
      onClose={close}
      title={t(i18nNs + "title")}
    >
      <ErrorBoundary onReset={close}>{renderContent()}</ErrorBoundary>
    </Modal>
  );
};

const AnimationPreview = ({ frames }: { frames: tSprite[] }) => {
  const { ref: toolbarRef, height: toolbarHeight } = useMeasure();
  const [activeIndex, setActiveIndex] = useState(0);
  const [fps, setFps] = usePersistedState({
    defaultValue: 1,
    key: "animation-preview-fps",
  });
  const activeFrame = frames[activeIndex];
  const maxDimension = useMemo(() => {
    const width = maxBy(
      frames,
      (sprite) => sprite.originalWidth,
    )!.originalWidth;
    const height = maxBy(
      frames,
      (sprite) => sprite.originalHeight,
    )!.originalHeight;
    return { width, height };
  }, [frames]);
  useEffect(() => {
    const fpsInterval = 1000 / fps;
    let then = performance.now();
    let rafId: number;

    function animate(now: number) {
      rafId = requestAnimationFrame(animate);

      const elapsed = now - then;

      if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);
        setActiveIndex((index) => {
          return index + 1 < frames.length ? index + 1 : 0;
        });
      }
    }

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [frames.length, fps]);

  return (
    <div
      style={
        {
          "--toolbar-height": (toolbarHeight || 35) + "px",
          "--frame-width": maxDimension.width + "px",
          "--frame-height": maxDimension.height + "px",
        } as CSSProperties
      }
      className={styles.root}
      data-testid="folder-animation-preview"
    >
      <div className={styles.framesContainer}>
        {activeFrame && (
          <img
            className={styles.frame}
            src={activeFrame.url}
            alt={activeFrame.name}
          />
        )}
      </div>
      <div ref={toolbarRef} className={styles.toolbar}>
        <Slider
          min={1}
          max={60}
          value={fps}
          onChange={setFps}
          marks={[1, 30, 60].map((value) => ({
            value,
            label: value + "FPS",
          }))}
        />
      </div>
    </div>
  );
};

export default AnimationPreviewModal;
