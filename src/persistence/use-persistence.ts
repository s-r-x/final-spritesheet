import { useAtomValue, useStore } from "jotai";
import {
  clearPersistenceCommandsAtom,
  hasPersistenceCommandsAtom,
  isPersistingAtom,
  persistenceCommandsAtom,
} from "./persistence.atom";
import { useCallback } from "react";
import { useLogger } from "@/logger/use-logger";

export const useIsPersisting = () => {
  return useAtomValue(isPersistingAtom);
};
export const useHasUnsavedChanges = () => {
  return useAtomValue(hasPersistenceCommandsAtom);
};
export const usePersistChanges = () => {
  const atomsStore = useStore();
  const logger = useLogger();
  return useCallback(async () => {
    if (atomsStore.get(isPersistingAtom)) return;
    atomsStore.set(isPersistingAtom, true);
    const commands = atomsStore.get(persistenceCommandsAtom);
    try {
      // TODO:: batch
      // packer and output settings are some good candidates to begin with
      for (const cmd of commands) {
        if (!cmd.isPersisted) {
          await cmd.persist();
        }
      }
    } finally {
      atomsStore.set(isPersistingAtom, false);
    }
    atomsStore.set(clearPersistenceCommandsAtom);
    logger?.debug({
      layer: "app",
      label: "allChangesPersisted",
    });
  }, [atomsStore, logger]);
};
