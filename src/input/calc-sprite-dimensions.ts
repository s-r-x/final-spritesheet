export const calcSpriteDimensions = ({
  width,
  height,
  scale,
}: {
  width: number;
  height: number;
  scale: number;
}): { width: number; height: number } => {
  if (!scale || scale === 1) return { width, height };
  return {
    width: Math.floor(width * scale),
    height: Math.floor(height * scale),
  };
};
