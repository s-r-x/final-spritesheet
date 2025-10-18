import {
  useSearchParams,
  useSetSearchParams,
} from "@/router/use-search-params";
import { useGoBack } from "@/router/use-go-back";
import { useCallback, useMemo } from "react";
import { useProjectsList } from "./use-projects-list";

const QUERY_PARAMS_KEY = "editable_project";
export const useOpenProjectEditor = () => {
  const setParams = useSetSearchParams();
  return useCallback(
    (id: string) => {
      setParams((old) => ({ ...old, [QUERY_PARAMS_KEY]: id }));
    },
    [setParams],
  );
};
export const useCloseProjectEditor = () => {
  return useGoBack();
};

export const useEditableProject = () => {
  const searchParams = useSearchParams();
  const id = searchParams[QUERY_PARAMS_KEY];
  const projectsList = useProjectsList();
  return useMemo(() => {
    if (!id) return null;
    if (id === "new") return "new";
    return projectsList.find((p) => p.id === id) || null;
  }, [projectsList, id]);
};
