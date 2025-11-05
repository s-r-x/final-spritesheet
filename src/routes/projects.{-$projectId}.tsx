import {
  createFileRoute,
  Link,
  notFound,
  redirect,
  useBlocker,
  useRouter,
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
import {
  List,
  Center,
  Title,
  Button,
  Stack,
  Mark,
  Tabs,
  Accordion,
  type MantineColor,
} from "@mantine/core";
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
import { Translation } from "@/i18n/translation.component";
import { resetHistoryStackAtom } from "@/history/history.atom";
import { useListenShortcuts } from "@/shortcuts/use-listen-shortcuts";
import { clearPersistenceCommandsAtom } from "@/persistence/persistence.atom";
import {
  useHasUnsavedChanges,
  useIsPersisting,
} from "@/persistence/use-persistence";
import { foldersAtom } from "@/folders/folders.atom";
import {
  Plus as PlusIcon,
  Package as PackedSpritesIcon,
  PackageX as PackedSpritesFailIcon,
  PackageCheck as PackedSpritesOkIcon,
  Folder as FoldersIcon,
} from "lucide-react";
import { usePersistedState } from "#hooks/use-persisted-state";
import FoldersList from "@/folders/folders-list.component";
import PackedSpritesList from "@/packer/packed-sprites-list.component";
import PackerSettings from "@/packer/packer-settings.component";
import OutputSettings from "@/output/output-settings.component";
import type { CSSProperties, PropsWithChildren } from "react";
import { useOpenProjectEditor } from "@/projects/use-project-editor";
import BaseErrorBoundary from "#components/error-boundary";
import { useCanUndo, useUndo } from "@/history/use-undo";
import { useCanRedo, useRedo } from "@/history/use-redo";
import { customBinsAtom } from "#custom-bins/custom-bins.atom";
import { persistedToCustomBin } from "#custom-bins/custom-bins.mapper";
import { usePackerStatus } from "@/packer/use-packed-sprites";

export const Route = createFileRoute("/projects/{-$projectId}")({
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
        projectIdToRedirect = loadedProjects[0].id;
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
  const { projectId } = Route.useParams();
  const projects = useProjectsList();
  const hasProjects = isEmpty(projects);
  const openProjectEditor = useOpenProjectEditor();
  return (
    <>
      <ProjectEditor />
      <Center mih={"100dvh"} miw={"100dvw"}>
        <Stack gap="lg" align="flex-start">
          <Title order={1} size={"h2"}>
            <Translation
              i18nKey={i18nNs + "message"}
              values={{ project: projectId }}
              components={{ 1: <Mark color="red" /> }}
            />
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
const PackedSpritesAndFolders = () => {
  const { t } = useTranslation();

  const iconSize = 20;
  const packedSpritesLabel = t("packed_sprites_list_sect_name");
  const foldersLabel = t("folders_list_sect_name");
  const [value, setValue] = usePersistedState({
    key: "sprites_and_folders_tab",
    defaultValue: "bins",
  });
  const panelStyles: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    flex: 1,
  };
  const packerStatus = usePackerStatus();
  const renderPackedIcon = () => {
    let IconComponent: typeof PackedSpritesIcon;
    switch (packerStatus) {
      case "failed":
      case "partially_packed":
        IconComponent = PackedSpritesFailIcon;
        break;
      case "packed":
        IconComponent = PackedSpritesOkIcon;
        break;
      case "idle":
        IconComponent = PackedSpritesIcon;
        break;
      default:
        IconComponent = PackedSpritesIcon;
    }
    return <IconComponent size={iconSize} />;
  };
  let packedColor: MantineColor | undefined;
  switch (packerStatus) {
    case "failed":
    case "partially_packed":
      packedColor = "red";
      break;
    default:
      packedColor = undefined;
  }
  return (
    <Tabs
      keepMounted={false}
      value={value}
      variant="pills"
      onChange={(value) => {
        if (value) setValue(value);
      }}
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
      }}
    >
      <Tabs.List>
        <Tabs.Tab
          aria-label={packedSpritesLabel}
          leftSection={renderPackedIcon()}
          color={packedColor}
          value="bins"
        >
          {packedSpritesLabel}
        </Tabs.Tab>
        <Tabs.Tab
          aria-label={foldersLabel}
          leftSection={<FoldersIcon size={iconSize} />}
          value="folders"
        >
          {foldersLabel}
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="folders" style={panelStyles}>
        <SharedErrorBoundary>
          <FoldersList />
        </SharedErrorBoundary>
      </Tabs.Panel>
      <Tabs.Panel value="bins" style={panelStyles}>
        <SharedErrorBoundary>
          <PackedSpritesList />
        </SharedErrorBoundary>
      </Tabs.Panel>
    </Tabs>
  );
};

const PackerAndOutputSettings = () => {
  const { t } = useTranslation();
  const [value, setValue] = usePersistedState<string[]>({
    key: "packer_and_output_settings_accordion",
    defaultValue: ["output", "packer"],
  });
  return (
    <Accordion multiple value={value} onChange={setValue}>
      <Accordion.Item value="packer">
        <Accordion.Control>{t("packer_opts.form_name")}</Accordion.Control>
        <Accordion.Panel>
          <SharedErrorBoundary>
            <PackerSettings />
          </SharedErrorBoundary>
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="output">
        <Accordion.Control>{t("output_opts.form_name")}</Accordion.Control>
        <Accordion.Panel>
          <SharedErrorBoundary>
            <OutputSettings />
          </SharedErrorBoundary>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};
const SharedErrorBoundary = (
  props: PropsWithChildren<{ isCentered?: boolean }>,
) => {
  const undo = useUndo();
  const redo = useRedo();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();
  const router = useRouter();
  return (
    <BaseErrorBoundary
      centerFallbackInViewport={props.isCentered}
      onReset={async () => {
        if (canUndo) {
          await undo();
        } else if (canRedo) {
          await redo();
        } else {
          await router.invalidate();
        }
      }}
    >
      {props.children}
    </BaseErrorBoundary>
  );
};

const RouteSideEffects = () => {
  const { t } = useTranslation();
  const projectName = useActiveProjectName();
  useDocumentTitle(projectName || "Final spritesheet");
  useListenShortcuts();
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
