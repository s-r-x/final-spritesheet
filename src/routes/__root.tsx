import { DEV } from "#config";
import type { tDbQueries } from "@/persistence/types";
import type { tProject } from "@/projects/types";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRouteWithContext<{
  loadSprites: tDbQueries["getSpritesByProjectId"];
  loadProjects: tDbQueries["getProjectsList"];
  createNewProject: () => { project: tProject };
}>()({
  component: () => (
    <>
      <Outlet />
      {DEV && <TanStackRouterDevtools />}
    </>
  ),
});
