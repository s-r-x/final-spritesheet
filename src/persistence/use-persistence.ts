import { useAtomValue, useStore } from "jotai";
import {
  clearPersistenceCommandsAtom,
  hasPersistenceCommandsAtom,
  isPersistingAtom,
  persistenceCommandsAtom,
} from "./persistence.atom";
import { useLogger } from "@/logger/use-logger";
import { activeProjectIdAtom } from "@/projects/projects.atom";
import { dbMutationsAtom } from "./db.atom";
import { packerSettingsAtom } from "@/packer/settings.atom";
import { outputSettingsAtom } from "@/output/output-settings.atom";

export const useIsPersisting = () => {
  return useAtomValue(isPersistingAtom);
};
export const useHasUnsavedChanges = () => {
  return useAtomValue(hasPersistenceCommandsAtom);
};
export const usePersistChanges = () => {
  const atomsStore = useStore();
  const logger = useLogger();
  return async () => {
    if (atomsStore.get(isPersistingAtom)) return;
    atomsStore.set(isPersistingAtom, true);
    const commands = atomsStore.get(persistenceCommandsAtom);
    try {
      // TODO:: batch
      // packer and output settings - DONE
      // folders - TODO
      let shouldBatchProjectUpdates = false;
      for (const cmd of commands) {
        if (!cmd.isPersisted) {
          switch (cmd.label) {
            case "update-packer-settings":
            case "update-output-settings":
              shouldBatchProjectUpdates = true;
              await cmd.persist({ dryRun: true });
              break;
            default:
              await cmd.persist();
          }
        }
      }
      if (shouldBatchProjectUpdates) {
        logger?.debug({
          layer: "app",
          label: "projectUpdatesBatched",
        });
        const dbMutations = atomsStore.get(dbMutationsAtom);
        const projectId = atomsStore.get(activeProjectIdAtom)!;
        const packerSettings = atomsStore.get(packerSettingsAtom);
        const outputSettings = atomsStore.get(outputSettingsAtom);
        await dbMutations.updateProject(projectId, {
          ...packerSettings,
          ...outputSettings,
        });
      }
    } finally {
      atomsStore.set(isPersistingAtom, false);
    }
    atomsStore.set(clearPersistenceCommandsAtom);
    logger?.debug({
      layer: "app",
      label: "allChangesPersisted",
    });
  };
};
