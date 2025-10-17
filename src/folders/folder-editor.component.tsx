import {
  Button,
  Group,
  Modal,
  TextInput,
  Checkbox,
  Stack,
} from "@mantine/core";
import { useTranslation } from "@/i18n/use-translation";
import { useForm } from "@mantine/form";
import * as z from "zod";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useEditableFolder, useCloseFolderEditor } from "./use-folder-editor";
import { useMutation } from "#hooks/use-mutation";
import { useUpdateFolders } from "./use-update-folders";
import type { tFolder } from "./types";
import { useAddFolder } from "./use-add-folder";
import { useActiveProjectId } from "@/projects/use-active-project-id";
import { generateUniqueName } from "#utils/generate-unique-name";
import { Dices as RandomNameIcon } from "lucide-react";

const i18nNs = "folder_editor.";
const FolderEditorModal = () => {
  const { t } = useTranslation();
  const editableFolder = useEditableFolder();
  const close = useCloseFolderEditor();
  const renderEditor = () => {
    if (!editableFolder) return null;
    return (
      <FolderEditor
        folder={editableFolder === "new" ? null : editableFolder}
        onClose={close}
      />
    );
  };
  return (
    <Modal
      opened={!!editableFolder}
      onClose={close}
      title={t(i18nNs + "editor_title")}
    >
      {renderEditor()}
    </Modal>
  );
};

const schema = z.object({
  name: z.string().trim().min(1),
  isAnimation: z.boolean(),
});

type tForm = z.infer<typeof schema>;
const FolderEditor = ({
  folder: folder,
  onClose,
}: {
  folder: Maybe<tFolder>;
  onClose: () => void;
}) => {
  const projectId = useActiveProjectId()!;
  const updateFolders = useUpdateFolders();
  const createFolder = useAddFolder();
  const submitMut = useMutation(
    (form: tForm) => {
      form = schema.parse(form);
      if (folder) {
        return updateFolders({
          [folder.id]: {
            folder,
            data: form,
          },
        });
      } else {
        return createFolder({
          ...form,
          projectId,
        });
      }
    },
    {
      onSuccess() {
        onClose();
      },
    },
  );
  const { t } = useTranslation();
  const form = useForm<tForm>({
    mode: "uncontrolled",
    initialValues: {
      name: folder?.name || "",
      isAnimation: folder?.isAnimation || false,
    },
    validate: zod4Resolver(schema),
  });

  return (
    <form onSubmit={form.onSubmit((form) => submitMut.mutate(form))}>
      <Stack gap="xs">
        <TextInput
          withAsterisk
          label={t(i18nNs + "name")}
          placeholder={t(i18nNs + "name_placeholder")}
          key={form.key("name")}
          {...form.getInputProps("name")}
        />
        {!folder && (
          <Button
            leftSection={<RandomNameIcon size={20} />}
            onClick={() => form.setFieldValue("name", generateUniqueName())}
            style={{ alignSelf: "flex-start" }}
            size="sm"
          >
            {t("generate_random_name")}
          </Button>
        )}
        <Checkbox
          label={t(i18nNs + "is_animation")}
          key={form.key("isAnimation")}
          {...form.getInputProps("isAnimation", { type: "checkbox" })}
        />
      </Stack>
      <Group justify="flex-end" mt="md">
        <Button type="submit" disabled={submitMut.isLoading}>
          {t("submit")}
        </Button>
      </Group>
    </form>
  );
};

export default FolderEditorModal;
