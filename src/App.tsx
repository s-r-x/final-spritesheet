import { StrictMode } from "react";
import UiFrameworkProvider from "./common/providers/ui-framework.provider";
import { RouterProvider } from "@tanstack/react-router";
import { AtomsProvider } from "./common/providers/atoms.provider";
import { createRouter } from "./router/create-router";
import type {
  tDbImportExport,
  tDbMutations,
  tDbQueries,
} from "./persistence/types";
import { useCreateProject } from "./projects/use-create-project";
import { useHydrateAtoms } from "jotai/utils";
import {
  dbImportExportAtom,
  dbMutationsAtom,
  dbQueriesAtom,
} from "./persistence/db.atom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { tLogger } from "./logger/types";
import { loggerAtom } from "./logger/logger.atom";
import ErrorBoundary from "#components/error-boundary";

type tProps = {
  dbQueries: tDbQueries;
  dbMutations: tDbMutations;
  dbImportExport: tDbImportExport;
  logger: tLogger;
};

const router = createRouter();
const App = ({ dbQueries, dbMutations, dbImportExport, logger }: tProps) => {
  useHydrateAtoms([
    [dbMutationsAtom, dbMutations],
    [dbQueriesAtom, dbQueries],
    [dbImportExportAtom, dbImportExport],
    [loggerAtom, logger],
  ] as const);
  const createProject = useCreateProject();
  return (
    <RouterProvider
      router={router}
      context={{
        dbQueries: dbQueries,
        createNewProject: createProject,
        logger,
      }}
    />
  );
};

// we don't use react-query here
// the client exists only in order to useMutation to work
const queryClient = new QueryClient();
const AppWithProviders = (props: tProps) => {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AtomsProvider>
          <UiFrameworkProvider>
            <ErrorBoundary
              centerFallbackInViewport
              onReset={() => {
                alert("Unfortunately, there is nothing to do");
              }}
            >
              <App {...props} />
            </ErrorBoundary>
          </UiFrameworkProvider>
        </AtomsProvider>
      </QueryClientProvider>
    </StrictMode>
  );
};

export default AppWithProviders;
