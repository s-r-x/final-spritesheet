import {
  createFileRoute,
  Link,
  notFound,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import Layout from "@/layout/layout.component";
import Canvas from "@/canvas/canvas.component";
import CanvasDropzone from "@/canvas/canvas-dropzone.component";
import PackerSettings from "@/packer/packer-settings.component";
import OutputSettings from "@/output/output-settings.component";
import SpritesList from "@/sprites/sprites-list.component";
import Toolbar from "@/widgets/toolbar.component";
import { CanvasRefsProvider } from "@/canvas/canvas-refs";
import SpriteEditor from "@/sprites/sprite-editor.component";
import {
  Accordion,
  List,
  Center,
  Title,
  Button,
  Stack,
  Mark,
} from "@mantine/core";
import { useHandleSpritesPasteEvent } from "@/sprites/use-handle-sprites-paste-event";
import { atomsStore } from "@/common/atoms/atoms-store";
import { setSpritesAtom } from "@/sprites/sprites.atom";
import { Loader } from "@mantine/core";
import {
  activeProjectIdAtom,
  projectsInitStateAtom,
  projectsListAtom,
} from "@/projects/projects.atom";
import ProjectEditor from "@/projects/project-editor.component";
import PackerAppBar from "@/widgets/app-bar.component";
import { persistedToSprite } from "@/sprites/sprites.mapper";
import { isEmpty } from "#utils/is-empty";
import { persistedToProject } from "@/projects/projects.mapper";
import { useProjectsList } from "@/projects/use-projects-list";
import { Plus as PlusIcon } from "lucide-react";
import { useCreateProject } from "@/projects/use-create-project";
import { useTranslation } from "@/i18n/use-translation";
import { useDocumentTitle } from "@mantine/hooks";
import { useActiveProjectName } from "@/projects/use-active-project-name";

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
    const projectId = ctx.params.projectId;
    let loadedProjects = atomsStore.get(projectsListAtom);
    const wasProjectsLoaded = atomsStore.get(projectsInitStateAtom);
    if (!wasProjectsLoaded) {
      const { projects } = await ctx.context.loadProjects();
      loadedProjects = projects.map(persistedToProject);
      atomsStore.set(projectsListAtom, loadedProjects);
      atomsStore.set(projectsInitStateAtom, true);
    }
    if (!projectId) {
      let projectIdToRedirect: Maybe<string> = null;
      if (isEmpty(loadedProjects)) {
        const { project: newProject } = ctx.context.createNewProject();
        projectIdToRedirect = newProject.id;
      } else {
        projectIdToRedirect = loadedProjects[0].id;
      }
      throw redirect({
        to: "/projects/{-$projectId}",
        params: {
          projectId: projectIdToRedirect,
        },
      });
    }
    const { sprites } = await ctx.context.loadSprites(projectId);
    const project = loadedProjects.find((p) => p.id === projectId);
    if (!project) {
      throw notFound();
    }
    atomsStore.set(activeProjectIdAtom, projectId);
    atomsStore.set(
      setSpritesAtom,
      await Promise.all(sprites.map(persistedToSprite)),
    );
  },
  notFoundComponent: ProjectNotFound,
});

function ProjectNotFound() {
  const { projectId } = Route.useParams();
  const projects = useProjectsList();
  const hasProjects = isEmpty(projects);
  const navigate = useNavigate();
  const createProject = useCreateProject();
  return (
    <Center mih={"100dvh"} miw={"100dvw"}>
      <Stack gap="lg" align="flex-start">
        <Title order={1} size={"h2"}>
          Project <Mark color="red">{projectId}</Mark> not found
        </Title>
        {!hasProjects && (
          <Stack gap="xs">
            <Title order={2} size="h4">
              Available projects:
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
          onClick={() => {
            const { project } = createProject();
            navigate({
              to: "/projects/{-$projectId}",
              params: {
                projectId: project.id,
              },
            });
          }}
        >
          New project
        </Button>
      </Stack>
    </Center>
  );
}

function Project() {
  useHandleSpritesPasteEvent();
  const { t } = useTranslation();
  const projectName = useActiveProjectName();
  useDocumentTitle(projectName || "Final spritesheet");
  return (
    <CanvasRefsProvider>
      <Layout
        rightPanelLabel={t("settings")}
        appBarSlot={<PackerAppBar />}
        leftPanelSlot={<SpritesList />}
        //headerSlot={<Header />}
        mainSlot={
          <>
            <Canvas />
            <CanvasDropzone />
          </>
        }
        rightPanelSlot={
          <>
            <Accordion multiple defaultValue={["output", "packer"]}>
              <Accordion.Item value="output">
                <Accordion.Control>
                  {t("output_opts.form_name")}
                </Accordion.Control>
                <Accordion.Panel>
                  <OutputSettings />
                </Accordion.Panel>
              </Accordion.Item>
              <Accordion.Item value="packer">
                <Accordion.Control>
                  {t("packer_opts.form_name")}
                </Accordion.Control>
                <Accordion.Panel>
                  <PackerSettings />
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </>
        }
        toolbarSlot={<Toolbar />}
      />
      <SpriteEditor />
      <ProjectEditor />
    </CanvasRefsProvider>
  );
}
