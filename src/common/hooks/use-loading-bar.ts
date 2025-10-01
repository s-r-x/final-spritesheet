import { useLoadingBar as useBaseLoadingBar } from "react-top-loading-bar";
export const useLoadingBar = (opts: { color?: string } = {}) => {
  const color = opts?.color || "var(--mantine-primary-color-filled)";
  const bar = useBaseLoadingBar({ color });
  return {
    start: bar.start,
    complete: bar.complete,
  };
};
