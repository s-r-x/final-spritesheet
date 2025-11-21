import {
  useSearchParams,
  useSetSearchParams,
} from "@/router/use-search-params";
import { useGoBack } from "@/router/use-go-back";
import { useFoldersList } from "./use-folders";

const QUERY_PARAMS_KEY = "editable_folder";
export const useOpenFolderEditor = () => {
  const setParams = useSetSearchParams();
  return (id: string) => {
    setParams((old) => ({ ...old, [QUERY_PARAMS_KEY]: id }));
  };
};
export const useCloseFolderEditor = () => {
  return useGoBack();
};

export const useEditableFolder = () => {
  const searchParams = useSearchParams();
  const id = searchParams[QUERY_PARAMS_KEY];
  const foldersList = useFoldersList();
  if (!id) return null;
  if (id === "new") return "new";
  return foldersList.find((f) => f.id === id) || null;
};
