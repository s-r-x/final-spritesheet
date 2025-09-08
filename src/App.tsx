import { StrictMode } from "react";
import UiFrameworkProvider from "./common/providers/ui-framework.provider";
import { RouterProvider } from "@tanstack/react-router";
import { AtomsProvider } from "./common/providers/atoms.provider";
import { createRouter } from "./create-router";
import type { tDbQueries } from "./persistence/types";
import { useCreateProject } from "./projects/use-create-project";

type tProps = {
  dbQueries: tDbQueries;
};

const router = createRouter();
const App = ({ dbQueries }: tProps) => {
  const createProject = useCreateProject();
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
