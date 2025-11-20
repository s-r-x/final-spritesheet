import {
  createFileRoute,
  Link,
  notFound,
  redirect,
  useBlocker,
} from "@tanstack/react-router";
import Layout from "@/layout/layout.component";
import Canvas from "@/canvas/canvas.component";
import CanvasDropzone from "@/canvas/canvas-dropzone.component";
import Toolbar from "@/widgets/toolbar.component";
import { CanvasRefsProvider } from "@/canvas/canvas-refs";
import SpriteEditor from "@/input/sprite-editor.component";
import ProjectEditor from "@/projects/project-editor.component";
import FolderEditor from "@/folders/folder-editor.component";
import CustomBinEditor from "#custom-bins/custom-bin-editor.component";
import AnimationPreview from "@/animation-preview/animation-preview.component";
import { List, Center, Title, Button, Stack } from "@mantine/core";
import { useHandleSpritesPasteEvent } from "@/input/use-handle-sprites-paste-event";
import { atomsStore } from "@/common/atoms/atoms-store";
import { setSpritesAtom } from "@/input/sprites.atom";
import { Loader } from "@mantine/core";
import {
  activeProjectIdAtom,
  projectsInitStateAtom,
  projectsListAtom,
} from "@/projects/projects.atom";
import PackerAppBar from "@/widgets/app-bar.component";
import { persistedToSprite } from "@/input/sprites.mapper";
import { isEmpty } from "#utils/is-empty";
import { persistedToProject } from "@/projects/projects.mapper";
import { useProjectsList } from "@/projects/use-projects-list";
import { useTranslation } from "@/i18n/use-translation";
import { useDocumentTitle } from "@mantine/hooks";
import { useActiveProjectName } from "@/projects/use-active-project-name";
import { resetHistoryStackAtom } from "@/history/history.atom";
import { useListenShortcuts } from "@/shortcuts/use-listen-shortcuts";
import { clearPersistenceCommandsAtom } from "@/persistence/persistence.atom";
import {
  useHasUnsavedChanges,
  useIsPersisting,
} from "@/persistence/use-persistence";
import { foldersAtom } from "@/folders/folders.atom";
import { Plus as PlusIcon } from "lucide-react";
import { useEffect, useEffectEvent } from "react";
import { useOpenProjectEditor } from "@/projects/use-project-editor";
import { customBinsAtom } from "#custom-bins/custom-bins.atom";
import { persistedToCustomBin } from "#custom-bins/custom-bins.mapper";
import { sortBy } from "#utils/sort-by";
import { useActiveProjectId } from "@/projects/use-active-project-id";
import { useUpdateProject } from "@/projects/use-update-project";
import PackedSpritesAndFolders from "./-packed-sprites-and-folders.component";
import SharedErrorBoundary from "./-shared-error-boundary";
import PackerAndOutputSettings from "./-packer-and-output-settings.component";

export const Route = createFileRoute("/(app)/projects/{-$projectId}")({
  component: Project,
  pendingComponent: () => (
    <Loader
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
      }}
    />
  ),
  shouldReload() {
    return false;
  },
  async loader(ctx) {
    const { logger, dbQueries } = ctx.context;
    const projectId = ctx.params.projectId;
    logger?.debug({
      layer: "router",
      label: "loaderStarted",
      data: { projectId },
    });
    let loadedProjects = atomsStore.get(projectsListAtom);
    const wasProjectsLoaded = atomsStore.get(projectsInitStateAtom);
    if (wasProjectsLoaded) {
      logger?.debug({
        layer: "router",
        label: "projectsLoadingSkipped",
      });
    } else {
      logger?.debug({
        layer: "router",
        label: "projectsLoadingStarted",
      });
      const { projects } = await dbQueries.getProjectsList();
      logger?.debug({
        layer: "router",
        label: "projectsLoaded",
        data: { projects },
      });
      loadedProjects = projects.map(persistedToProject);
      atomsStore.set(projectsListAtom, loadedProjects);
      atomsStore.set(projectsInitStateAtom, true);
    }
    if (!projectId) {
      let projectIdToRedirect: Maybe<string> = null;
      if (isEmpty(loadedProjects)) {
        logger?.debug({
          layer: "router",
          label: "noProjectIdAndProjects",
          data: "No project id and no loaded projects. Creating a new project",
        });
        const { project: newProject } = await ctx.context.createNewProject();
        projectIdToRedirect = newProject.id;
      } else {
        projectIdToRedirect = sortBy(
          loadedProjects,
          (project) => project.lastOpenedAt || "",
          "desc",
        )[0].id;

        loadedProjects[0].id;
      }
      logger?.debug({
        layer: "router",
        label: "redirectToProject",
        data: { projectId: projectIdToRedirect },
      });
      throw redirect({
        to: "/projects/{-$projectId}",
        params: {
          projectId: projectIdToRedirect,
        },
      });
    }
    const project = loadedProjects.find((p) => p.id === projectId);
    if (!project) {
      logger?.debug({
        layer: "router",
        label: "projectNotFound",
        data: { projectId },
      });
      throw notFound();
    }
    logger?.debug({
      layer: "router",
      label: "projectRelatedDataLoadingStarted",
    });
    const [{ sprites }, { folders }, bins] = await Promise.all([
      dbQueries.getSpritesByProjectId(projectId),
      dbQueries.getFoldersByProjectId(projectId),
      dbQueries
        .getCustomBinsByProjectId(projectId)
        .then(({ bins }) => bins.map(persistedToCustomBin)),
    ]);
    logger?.debug({
      layer: "router",
      label: "projectRelatedDataLoaded",
    });
    const normalizedSprites = await Promise.all(sprites.map(persistedToSprite));
    atomsStore.set(activeProjectIdAtom, projectId);
    atomsStore.set(setSpritesAtom, normalizedSprites);
    atomsStore.set(foldersAtom, folders);
    atomsStore.set(resetHistoryStackAtom);
    atomsStore.set(clearPersistenceCommandsAtom);
    atomsStore.set(customBinsAtom, bins);
    logger?.debug({
      layer: "router",
      label: "loaderCompleted",
      data: { projectId },
    });
  },
  notFoundComponent: ProjectNotFound,
});

function ProjectNotFound() {
  const i18nNs = "project_not_found_screen.";
  const { t } = useTranslation();
  const projects = useProjectsList();
  const hasProjects = isEmpty(projects);
  const openProjectEditor = useOpenProjectEditor();
  return (
    <>
      <ProjectEditor />
      <Center mih={"100dvh"} miw={"100dvw"}>
        <Stack gap="lg" align="flex-start">
          <Title order={1} size={"h2"}>
            {t(i18nNs + "message")}
          </Title>
          {!hasProjects && (
            <Stack gap="xs">
              <Title order={2} size="h4">
                {t(i18nNs + "projects_list")}
              </Title>
              <List spacing="xs" size="md" center>
                {projects.map((project) => (
                  <List.Item key={project.id}>
                    <Link
                      to="/projects/{-$projectId}"
                      params={{ projectId: project.id }}
                    >
                      {project.name}
                    </Link>
                  </List.Item>
                ))}
              </List>
            </Stack>
          )}
          <Button
            leftSection={<PlusIcon />}
            onClick={() => openProjectEditor("new")}
          >
            {t(i18nNs + "new_project")}
          </Button>
        </Stack>
      </Center>
    </>
  );
}

function Project() {
  useHandleSpritesPasteEvent();
  const { t } = useTranslation();
  return (
    <SharedErrorBoundary isCentered>
      <CanvasRefsProvider>
        <RouteSideEffects />
        <Layout
          rightPanelLabel={t("settings")}
          appBarSlot={<PackerAppBar />}
          leftPanelSlot={<PackedSpritesAndFolders />}
          mainSlot={
            <SharedErrorBoundary>
              <Canvas />
              <CanvasDropzone />
            </SharedErrorBoundary>
          }
          rightPanelSlot={<PackerAndOutputSettings />}
          toolbarSlot={<Toolbar />}
        />
        <SpriteEditor />
        <ProjectEditor />
        <FolderEditor />
        <CustomBinEditor />
        <AnimationPreview />
      </CanvasRefsProvider>
    </SharedErrorBoundary>
  );
}

const RouteSideEffects = () => {
  const { t } = useTranslation();
  const projectName = useActiveProjectName();
  useDocumentTitle(projectName || "Final spritesheet");
  useListenShortcuts();
  const projectId = useActiveProjectId();
  const updateProject = useUpdateProject();
  const onProjectChanged = useEffectEvent(() => {
    if (projectId) {
      updateProject(projectId, { lastOpenedAt: new Date().toISOString() });
    }
  });
  useEffect(() => {
    const updateDelay = 250;
    const timeout = setTimeout(() => {
      onProjectChanged();
    }, updateDelay);
    return () => clearTimeout(timeout);
  }, [projectId]);
  const hasUnsavedChanges = useHasUnsavedChanges();
  const isPersisting = useIsPersisting();
  const shouldBlockRouteChange = hasUnsavedChanges || isPersisting;
  useBlocker({
    shouldBlockFn({ current, next }) {
      // this thing is also triggered when changing the search params
      // which we don't care about in this context
      if (current.pathname === next.pathname) {
        return false;
      }
      if (!shouldBlockRouteChange) {
        return false;
      }
      const yes = window.confirm(t("unsaved_changes_warn"));
      return !yes;
    },
    enableBeforeUnload: shouldBlockRouteChange,
  });
  return null;
};
