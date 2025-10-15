import { Button, Group, Modal, TextInput } from "@mantine/core";
import { useTranslation } from "@/i18n/use-translation";
import { tProject } from "./types";
import { useForm } from "@mantine/form";
import * as z from "zod";
import { zod4Resolver } from "mantine-form-zod-resolver";
import {
  useEditableProject,
  useCloseProjectEditor,
} from "./use-project-editor";
import { useUpdateProject } from "./use-update-project";
import { useMutation } from "#hooks/use-mutation";

const i18nNs = "project_editor.";
const ProjectEditorModal = () => {
  const { t } = useTranslation();
  const editableProject = useEditableProject();
  const close = useCloseProjectEditor();
  const renderEditor = () => {
    if (!editableProject) return null;
    return <ProjectEditor project={editableProject} onClose={close} />;
  };
  return (
    <Modal
      closeButtonProps={{
        "aria-label": t("close"),
      }}
      opened={!!editableProject}
      onClose={close}
      title={t(i18nNs + "editor_title")}
    >
      {renderEditor()}
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
  project: tProject;
  onClose: () => void;
}) => {
  const updateProject = useUpdateProject();
  const updateProjectMut = useMutation(
    (form: tForm) => updateProject(project.id, form),
    {
      onSuccess: onClose,
    },
  );
  const { t } = useTranslation();
  const form = useForm<tForm>({
    mode: "uncontrolled",
    initialValues: {
      name: project.name,
    },
    validate: zod4Resolver(schema),
  });

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        updateProjectMut.mutate(values);
      })}
    >
      <TextInput
        withAsterisk
        label={t(i18nNs + "name")}
        placeholder={t(i18nNs + "name_placeholder")}
        key={form.key("name")}
        {...form.getInputProps("name")}
      />
      <Group justify="flex-end" mt="md">
        <Button type="submit" disabled={updateProjectMut.isLoading}>
          Submit
        </Button>
      </Group>
    </form>
  );
};

export default ProjectEditorModal;
