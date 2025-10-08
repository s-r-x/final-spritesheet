import { useAtomValue, useStore } from "jotai";
import { dbImportExportAtom, dbMutationsAtom } from "./db.atom";
import { useCallback } from "react";
import { downloadFile } from "#utils/download-file";
import type { tDbBackupFormat } from "./types";
import { useFileDialog } from "@mantine/hooks";
import { useMutation } from "@/common/hooks/use-mutation";
import { useTranslation } from "@/i18n/use-translation";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { projectsInitStateAtom } from "@/projects/projects.atom";
import { resetHistoryStackAtom } from "@/history/history.atom";
import { clearPersistenceCommandsAtom } from "./persistence.atom";

export const useImportDb = () => {
  const { t } = useTranslation();
  const atomsStore = useStore();
  const navigate = useNavigate();
  const router = useRouter();
  const service = useAtomValue(dbImportExportAtom);
  const importDbMut = useMutation(
    (data: tDbBackupFormat) => {
      atomsStore.set(resetHistoryStackAtom);
      atomsStore.set(clearPersistenceCommandsAtom);
      return service.importDb(data);
    },
    {
      showLoadingBar: true,
      confirm: true,
      confirmMessage: t("backup.restore_confirm"),
      successNotification: () => t("backup.restore_success"),
      async onSuccess() {
        atomsStore.set(projectsInitStateAtom, false);
        try {
          await navigate({
            to: "/projects/{-$projectId}",
            params: { projectId: undefined },
          });
          await router.invalidate();
        } catch (e) {
          console.error(e);
          window.location.reload();
        }
      },
    },
  );
  const fileDialog = useFileDialog({
    multiple: false,
    resetOnOpen: true,
    onChange(files) {
      const backup = files?.[0];
      if (backup) {
        importDbMut.mutate(backup);
      }
    },
  });
  return {
    mutation: importDbMut,
    upload: fileDialog.open,
  };
};
export const useExportDb = () => {
  const service = useAtomValue(dbImportExportAtom);
  return useCallback(async () => {
    const data = await service.exportDb();
    downloadFile(data, "final-spritesheet.backup");
  }, [service]);
};
export const useDbMutations = () => {
  return useAtomValue(dbMutationsAtom);
};
