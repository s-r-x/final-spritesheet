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
import {
  List,
  Center,
  Title,
  Button,
  Stack,
  Mark,
  Tabs,
  Accordion,
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
import { Plus as PlusIcon } from "lucide-react";
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
  Package as PackedSpritesIcon,
  Folder as FoldersIcon,
} from "lucide-react";
import { usePersistedState } from "#hooks/use-persisted-state";
import FoldersList from "@/folders/folders-list.component";
import PackedSpritesList from "@/packer/packed-sprites-list.component";
import PackerSettings from "@/packer/packer-settings.component";
import OutputSettings from "@/output/output-settings.component";
import type { CSSProperties } from "react";
import { useOpenProjectEditor } from "@/projects/use-project-editor";

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
    const { logger } = ctx.context;
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
      const { projects } = await ctx.context.loadProjects();
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
      label: "spritesAndFoldersLoadingStarted",
    });
    const [{ sprites }, { folders }] = await Promise.all([
      ctx.context.loadSprites(projectId),
      ctx.context.loadFolders(projectId),
    ]);
    logger?.debug({
      layer: "router",
      label: "spritesAndFoldersLoaded",
    });
    const normalizedSprites = await Promise.all(sprites.map(persistedToSprite));
    logger?.debug({
      layer: "router",
      label: "spritesNormalized",
    });
    atomsStore.set(activeProjectIdAtom, projectId);
    atomsStore.set(setSpritesAtom, normalizedSprites);
    atomsStore.set(foldersAtom, folders);
    atomsStore.set(resetHistoryStackAtom);
    atomsStore.set(clearPersistenceCommandsAtom);
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
    <CanvasRefsProvider>
      <RouteSideEffects />
      <Layout
        rightPanelLabel={t("settings")}
        appBarSlot={<PackerAppBar />}
        leftPanelSlot={<PackedSpritesAndFolders />}
        mainSlot={
          <>
            <Canvas />
            <CanvasDropzone />
          </>
        }
        rightPanelSlot={<PackerAndOutputSettings />}
        toolbarSlot={<Toolbar />}
      />
      <SpriteEditor />
      <ProjectEditor />
      <FolderEditor />
    </CanvasRefsProvider>
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
          leftSection={<PackedSpritesIcon size={iconSize} />}
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
        <FoldersList />
      </Tabs.Panel>
      <Tabs.Panel value="bins" style={panelStyles}>
        <PackedSpritesList />
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
          <PackerSettings />
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="output">
        <Accordion.Control>{t("output_opts.form_name")}</Accordion.Control>
        <Accordion.Panel>
          <OutputSettings />
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
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
