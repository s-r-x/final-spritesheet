import { useHistoryManager } from "@/history/use-history-manager";
import { useStore } from "jotai";
import { RemoveCustomBinsCommand } from "./remove-custom-bins.command";
import { isEmpty } from "#utils/is-empty";
import { customBinsAtom } from "./custom-bins.atom";
import type { Command } from "@/common/commands/command";

export const useCreateRemoveCustomBinsCommand = (): ((
  id: string | string[],
) => Maybe<Command>) => {
  const atomsStore = useStore();
  return (id: string | string[]) => {
    const currentBins = atomsStore.get(customBinsAtom);
    const binsToRemove = currentBins.filter((bin) => {
      return Array.isArray(id) ? id.includes(bin.id) : bin.id === id;
    });
    if (isEmpty(binsToRemove)) return null;
    const cmd = new RemoveCustomBinsCommand({ bins: binsToRemove });
    return cmd;
  };
};
export const useRemoveCustomBins = () => {
  const historyManager = useHistoryManager();
  const createRemoveBinsCmd = useCreateRemoveCustomBinsCommand();
  return async (id: string | string[]) => {
    const cmd = createRemoveBinsCmd(id);
    if (cmd) {
      await historyManager.execCommand(cmd);
    }
  };
};
