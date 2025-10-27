import { Application, extend } from "@pixi/react";
import { Container, Graphics, Sprite, Text } from "pixi.js";
import { useEffect, useState, useCallback, memo } from "react";
import { Viewport } from "./canvas-viewport";
import { useCanvasRefs } from "./canvas-refs";
import type { tPackedBin } from "@/packer/types";
import { useComputedColorScheme, useMantineTheme } from "@mantine/core";
import { usePackedSprites } from "@/packer/use-packed-sprites";
import { debounce } from "#utils/debounce";
import { useActiveProjectId } from "@/projects/use-active-project-id";
import { useFocusProject } from "./use-focus-project";
import { isEmpty } from "#utils/is-empty";
import { useSpritesMap } from "@/input/use-sprites-map";
import { useTranslation } from "@/i18n/use-translation";
import { isDefaultBin } from "#custom-bins/is-default-bin";

extend({
  Container,
  Graphics,
  Sprite,
  Viewport,
  Text,
});

const Canvas = () => {
  const canvasRefs = useCanvasRefs();
  const [shouldRender, setShouldRender] = useState(false);
  useHandleCanvasContainerResize(shouldRender);
  return (
    <Application
      autoStart
      resolution={window.devicePixelRatio}
      resizeTo={getRootDomElement()!}
      backgroundAlpha={0}
      autoDensity
      onInit={(app) => {
        canvasRefs.app = app;
        setShouldRender(true);
      }}
    >
      {shouldRender && (
        <pixiViewport
          ref={(val) => {
            canvasRefs.viewport = val;
          }}
        >
          <Bins />
        </pixiViewport>
      )}
    </Application>
  );
};
const useHandleCanvasContainerResize = (isRendered: boolean) => {
  const canvasRefs = useCanvasRefs();
  useEffect(() => {
    if (isRendered) {
      const onResize = debounce(
        { delay: 100 },
        ([entry]: ResizeObserverEntry[]) => {
          const pixiApp = canvasRefs.app;
          const { width, height } = entry.contentRect;
          if (pixiApp) {
            pixiApp.renderer.resize(width, height);
          }
          if (canvasRefs.viewport) {
            canvasRefs.viewport.screenWidth = width;
            canvasRefs.viewport.screenHeight = height;
          }
        },
      );
      const $el = getRootDomElement();
      if ($el) {
        const resizeObserver = new ResizeObserver(onResize);
        resizeObserver.observe($el);
        return () => resizeObserver.disconnect();
      }
    }
  }, [isRendered, canvasRefs]);
};

const BIN_GAP = 10;
const Bins = () => {
  const { bins: packedBins } = usePackedSprites();
  const projectId = useActiveProjectId();
  const focusProject = useFocusProject();
  const hasBins = !isEmpty(packedBins);
  useEffect(() => {
    if (hasBins) {
      focusProject();
    }
  }, [projectId, hasBins]);
  let offsetX = 0;
  if (!hasBins) return null;
  return (
    <pixiContainer label="bins-root">
      {packedBins.map((bin) => {
        const jsx = (
          <pixiContainer key={bin.id} x={offsetX}>
            <Bin bin={bin} />
          </pixiContainer>
        );
        offsetX += bin.maxWidth + BIN_GAP;
        return jsx;
      })}
    </pixiContainer>
  );
};

type tBinProps = {
  bin: tPackedBin;
};
const Bin = ({ bin }: tBinProps) => {
  const spritesMap = useSpritesMap();
  const { t } = useTranslation();
  const { maxWidth, maxHeight, width, height } = bin;
  const bgColor = useMantineTheme().colors.gray[1];
  const drawBg = useCallback(
    (graphics: Graphics) => {
      graphics
        .clear()
        .setFillStyle({ color: bgColor })
        .rect(0, 0, maxWidth, maxHeight)
        .fill();
      //graphics.roundRect(0, 0, maxWidth, maxHeight, 25);
    },
    [maxWidth, maxHeight, bgColor],
  );

  const ROTATED_ANCHOR = {
    x: 0,
    y: 1,
  };
  const drawDimensions = useCallback(
    (graphics: Graphics) => {
      graphics.clear();
      graphics.rect(0, 0, width, height);
      graphics.fill();
    },
    [width, height],
  );
  let binName: string;
  if (bin.name) {
    binName = isDefaultBin(bin.id) ? t("default_custom_bin_name") : bin.name;
  } else {
    binName = t("packed_bin_with_id", { id: (Number(bin.id) || 0) + 1 });
  }
  return (
    <pixiContainer>
      <pixiGraphics draw={drawBg} />
      <BinName name={binName} />
      <pixiContainer label={`bin-${bin.id}`}>
        <pixiGraphics alpha={0} draw={drawDimensions} />
        {bin.sprites.map(({ id, x, y, rotated }) => {
          const sprite = spritesMap[id];
          if (!sprite) return null;
          return (
            <pixiSprite
              scale={sprite.scale}
              label={"sprite-" + id}
              key={id}
              texture={sprite.texture}
              rotation={rotated ? 1.5708 : 0}
              anchor={rotated ? ROTATED_ANCHOR : 0}
              x={x}
              //x={rotated ? x + texture.height : x}
              y={y}
            />
          );
        })}
      </pixiContainer>
    </pixiContainer>
  );
};
const BinName = ({ name }: { name: string }) => {
  const colorScheme = useComputedColorScheme();
  const theme = useMantineTheme();
  const color = colorScheme === "dark" ? theme.white : theme.black;
  const [y, setY] = useState(0);
  return (
    <pixiText
      y={y}
      text={name}
      resolution={window.devicePixelRatio}
      style={{
        fill: color,
        fontSize: 32,
        fontFamily: "sans-serif",
      }}
      ref={(text) => {
        if (text) {
          setY(-text.height);
        }
      }}
    />
  );
};

const getRootDomElement = () => document.getElementById("canvas-root");

export default memo(Canvas);
