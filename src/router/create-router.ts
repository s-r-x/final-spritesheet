import {
  createRouter as createTanstackRouter,
  createHashHistory,
} from "@tanstack/react-router";
import { routeTree } from "../routeTree.gen";
//import { BASE_URL } from "#config";

const hashHistory = createHashHistory();
export const createRouter = () => {
  return createTanstackRouter({
    routeTree,
    //basepath: BASE_URL,
    defaultStaleTime: 0,
    defaultGcTime: 0,
    history: hashHistory,
    context: {
      loadSprites: undefined!,
      loadProjects: undefined!,
      loadFolders: undefined!,
      createNewProject: undefined!,
      logger: undefined,
    },
  });
};

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
