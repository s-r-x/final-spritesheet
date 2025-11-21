import { useActiveProjectId } from "@/projects/use-active-project-id";
import type { tSprite } from "./types";
import { fileToSprite } from "./sprites.mapper";
import { useHistoryManager } from "@/history/use-history-manager";
import { AddSpritesCommand } from "./add-sprites.command";
import { useMutation } from "#hooks/use-mutation";
import { useCreateUpdateFoldersCommand } from "@/folders/use-update-folders";
import type { Command } from "@/common/commands/command";
import type { tFolder } from "@/folders/types";
import { isEmpty } from "#utils/is-empty";
import { SUPPORTED_SPRITE_MIME_TYPES } from "#config";
import type { tCustomBin } from "#custom-bins/types";
import { useCreateUpdateCustomBinsCommand } from "#custom-bins/use-update-custom-bins";

export const useAddSpritesFromFiles = () => {
  const projectId = useActiveProjectId();
  const historyManager = useHistoryManager();
  const createUpdateFoldersCommand = useCreateUpdateFoldersCommand();
  const createUpdateCustomBinsCommand = useCreateUpdateCustomBinsCommand();
  return async ({
    files,
    folder,
    customBin,
  }: {
    files: File[];
    folder?: tFolder;
    customBin?: tCustomBin;
  }) => {
    files = files.filter((file) =>
      SUPPORTED_SPRITE_MIME_TYPES.includes(file.type),
    );
    if (isEmpty(files)) return;
    if (!projectId) {
      throw new Error("no project id");
    }
    const sprites: tSprite[] = await Promise.all(
      files.map((file) => fileToSprite({ file, projectId })),
    );
    const cmds: Command[] = [new AddSpritesCommand({ sprites })];
    if (folder) {
      const updateFoldersCmd = createUpdateFoldersCommand({
        [folder.id]: {
          folder,
          data: {
            itemIds: folder.itemIds.concat(sprites.map((sprite) => sprite.id)),
          },
        },
      });
      cmds.push(updateFoldersCmd);
    } else if (customBin) {
      const updateCustomBinsCmd = createUpdateCustomBinsCommand({
        [customBin.id]: {
          bin: customBin,
          data: {
            itemIds: customBin.itemIds.concat(
              sprites.map((sprite) => sprite.id),
            ),
          },
        },
      });
      cmds.push(updateCustomBinsCmd);
    }
    await historyManager.execCommand(cmds);
  };
};

export const useAddSpritesFromFilesMutation = () => {
  const addSprites = useAddSpritesFromFiles();
  const mut = useMutation(addSprites);
  return mut;
};
