import { useCallback } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { editableProjectAtom } from "./project-editor.atom";

export const useOpenProjectEditor = () => {
  const setId = useSetAtom(editableProjectAtom);
  return useCallback(
    (id: string) => {
      setId(id);
    },
    [setId],
  );
};
export const useCloseProjectEditor = () => {
  const setId = useSetAtom(editableProjectAtom);
  return useCallback(() => {
    setId(null);
  }, [setId]);
};

export const useEditableProject = () => {
  const sprite = useAtomValue(editableProjectAtom);
  return sprite;
};
