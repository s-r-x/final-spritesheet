import { locationAtom } from "./location.atom";
import { atom } from "jotai";

export const queryParamBindedModalAtom = ({ key }: { key: string }) => {
  return atom<boolean, [boolean], void>(
    (get) => {
      const value = get(locationAtom).searchParams?.get(key);
      return value === "1";
    },
    (get, set, value) => {
      const loc = get(locationAtom);
      if (loc.searchParams?.has(key) && !value) {
        window.history.back();
        return;
      }
      set(locationAtom, (prev) => {
        const searchParams = new URLSearchParams(prev.searchParams);
        searchParams.set(key, "1");
        return {
          ...prev,
          searchParams,
        };
      });
    },
  );
};
