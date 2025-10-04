import { useAtomValue } from "jotai";
import { loggerAtom } from "./logger.atom";

export const useLogger = () => {
  return useAtomValue(loggerAtom);
};
