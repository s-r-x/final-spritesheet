import { createRouter as createTanstackRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { BASE_URL } from "#config";

export const createRouter = () => {
  return createTanstackRouter({
    routeTree,
    basepath: BASE_URL,
    defaultStaleTime: 0,
    defaultGcTime: 0,
    context: {
      loadSprites: undefined!,
      loadProjects: undefined!,
      createNewProject: undefined!,
    },
  });
};

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
