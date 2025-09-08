import { Provider } from "jotai";
import { atomsStore } from "../atoms/atoms-store";
import type { ReactNode } from "react";

export const AtomsProvider: React.FC<{ children: ReactNode }> = (props) => {
  return <Provider store={atomsStore}>{props.children}</Provider>;
};
