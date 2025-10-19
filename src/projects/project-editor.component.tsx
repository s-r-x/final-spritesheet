import { Button, Group, Modal, Stack, TextInput } from "@mantine/core";
import { useTranslation } from "@/i18n/use-translation";
import type { tProject } from "./types";
import { useForm } from "@mantine/form";
import * as z from "zod";
import { zod4Resolver } from "mantine-form-zod-resolver";
import {
  useEditableProject,
  useCloseProjectEditor,
} from "./use-project-editor";
import { useUpdateProject } from "./use-update-project";
import { useMutation } from "#hooks/use-mutation";
import { useCreateProject } from "./use-create-project";
import { useNavigate } from "@tanstack/react-router";
import { Dices as RandomNameIcon } from "lucide-react";
import { generateUniqueName } from "#utils/generate-unique-name";
import ErrorBoundary from "#components/error-boundary";

const i18nNs = "project_editor.";
const ProjectEditorModal = () => {
  const { t } = useTranslation();
  const editableProject = useEditableProject();
  const close = useCloseProjectEditor();
  const renderEditor = () => {
    if (!editableProject) return null;
    return (
      <ProjectEditor
        project={editableProject === "new" ? null : editableProject}
        onClose={close}
      />
    );
  };
  return (
    <Modal
      closeButtonProps={{
        "aria-label": t("close"),
      }}
      opened={!!editableProject}
      onClose={close}
      title={t(
        i18nNs +
          (editableProject === "new" ? "editor_title_new" : "editor_title"),
      )}
    >
      <ErrorBoundary onReset={close}>{renderEditor()}</ErrorBoundary>
    </Modal>
  );
};

const schema = z.object({
  name: z.string().trim().min(1),
});
type tForm = z.infer<typeof schema>;
const ProjectEditor = ({
  project,
  onClose,
}: {
  project: Maybe<tProject>;
  onClose: () => void;
}) => {
  const navigate = useNavigate();
  const updateProject = useUpdateProject();
  const createProject = useCreateProject();
  const submitMut = useMutation(
    async (form: tForm): Promise<{ id: string }> => {
      form = schema.parse(form);
      if (project) {
        await updateProject(project.id, form);
        return { id: project.id };
      } else {
        const { project: newProject } = await createProject(form);
        return { id: newProject.id };
      }
    },
    {
      showLoadingBar: !project,
      onSuccess({ id }) {
        if (project) {
          onClose();
        } else {
          navigate({
            to: "/projects/{-$projectId}",
            replace: true,
            params: {
              projectId: id,
            },
            search: {},
          });
        }
      },
    },
  );
  const { t } = useTranslation();
  const form = useForm<tForm>({
    mode: "uncontrolled",
    initialValues: {
      name: project?.name || "",
    },
    validate: zod4Resolver(schema),
  });

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        submitMut.mutate(values);
      })}
    >
      <Stack gap="xs">
        <TextInput
          withAsterisk
          label={t(i18nNs + "name")}
          placeholder={t(i18nNs + "name_placeholder")}
          key={form.key("name")}
          {...form.getInputProps("name")}
        />
        {!project && (
          <Button
            leftSection={<RandomNameIcon size={20} />}
            onClick={() => form.setFieldValue("name", generateUniqueName())}
            style={{ alignSelf: "flex-start" }}
            size="sm"
          >
            {t("generate_random_name")}
          </Button>
        )}
      </Stack>
      <Group justify="flex-end" mt="md">
        <Button type="submit" disabled={submitMut.isLoading}>
          Submit
        </Button>
      </Group>
    </form>
  );
};

export default ProjectEditorModal;
