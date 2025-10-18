import { DEV } from "#config";
import type { tLogger } from "@/logger/types";
import type { tDbQueries } from "@/persistence/types";
import type { tProject } from "@/projects/types";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRouteWithContext<{
  loadSprites: tDbQueries["getSpritesByProjectId"];
  loadProjects: tDbQueries["getProjectsList"];
  loadFolders: tDbQueries["getFoldersByProjectId"];
  createNewProject: () => Promise<{ project: tProject }>;
  logger?: tLogger;
}>()({
  validateSearch: (params) => params as Record<string, string>,
  component: () => (
    <>
      <Outlet />
      {DEV && <TanStackRouterDevtools />}
    </>
  ),
});
