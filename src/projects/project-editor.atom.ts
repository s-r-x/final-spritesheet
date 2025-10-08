import { locationAtom } from "@/common/atoms/location.atom";
import { atom } from "jotai";
import type { tProject } from "./types";
import { activeProjectAtom } from "./projects.atom";

const QUERY_PARAMS_KEY = "editable_project";
export const editableProjectAtom = atom<Maybe<tProject>, [Maybe<string>], void>(
  (get) => {
    const id = get(locationAtom).searchParams?.get(QUERY_PARAMS_KEY);
    if (!id) return null;
    const project = get(activeProjectAtom);
    if (project?.id !== id) return null;
    return project;
  },
  (get, set, id) => {
    const loc = get(locationAtom);
    if (loc.searchParams?.has(QUERY_PARAMS_KEY) && !id) {
      window.history.back();
      return;
    }
    set(locationAtom, (prev) => {
      const searchParams = new URLSearchParams(prev.searchParams);
      if (id) {
        searchParams.set(QUERY_PARAMS_KEY, id);
      }
      return {
        ...prev,
        searchParams,
      };
    });
  },
);
