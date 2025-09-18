import { StrictMode } from "react";
import UiFrameworkProvider from "./common/providers/ui-framework.provider";
import { RouterProvider } from "@tanstack/react-router";
import { AtomsProvider } from "./common/providers/atoms.provider";
import { createRouter } from "./create-router";
import type { tDbMutations, tDbQueries } from "./persistence/types";
import { useCreateProject } from "./projects/use-create-project";
import { useHydrateAtoms } from "jotai/utils";
import { dbMutationsAtom, dbQueriesAtom } from "./persistence/db.atom";

type tProps = {
  dbQueries: tDbQueries;
  dbMutations: tDbMutations;
};

const router = createRouter();
const App = ({ dbQueries, dbMutations }: tProps) => {
  const createProject = useCreateProject();
  useHydrateAtoms([
    [dbMutationsAtom, dbMutations],
    [dbQueriesAtom, dbQueries],
  ] as const);
  return (
    <RouterProvider
      router={router}
      context={{
        loadProjects: dbQueries.getProjectsList.bind(dbQueries),
        loadSprites: dbQueries.getSpritesByProjectId.bind(dbQueries),
        createNewProject: createProject,
      }}
    />
  );
};
const AppWithProviders = (props: tProps) => {
  return (
    <StrictMode>
      <AtomsProvider>
        <UiFrameworkProvider>
          <App {...props} />
        </UiFrameworkProvider>
      </AtomsProvider>
    </StrictMode>
  );
};

export default AppWithProviders;
