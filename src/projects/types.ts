import type { tOutputSettings } from "@/output/types";
import type { tPackerSettings } from "@/packer/types";

export type tProject = {
  id: string;
  name: string;
  thumbUrl?: string;
  createdAt?: string;
  lastOpenedAt?: string;
  packerSettings?: tPackerSettings;
  outputSettings?: tOutputSettings;
};
