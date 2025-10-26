import { Button, Group, Modal, TextInput, Stack } from "@mantine/core";
import { useTranslation } from "@/i18n/use-translation";
import { useForm } from "@mantine/form";
import * as z from "zod";
import { zod4Resolver } from "mantine-form-zod-resolver";
import {
  useEditableCustomBin,
  useCloseCustomBinEditor,
} from "./use-custom-bin-editor";
import { useMutation } from "#hooks/use-mutation";
import { useUpdateCustomBins } from "./use-update-custom-bins";
import type { tCustomBin } from "./types";
import { useActiveProjectId } from "@/projects/use-active-project-id";
import { generateUniqueName } from "#utils/generate-unique-name";
import { Dices as RandomNameIcon } from "lucide-react";
import ErrorBoundary from "#components/error-boundary";
import { useAddCustomBin } from "./use-add-custom-bin";

const i18nNs = "custom_bin_editor.";
const CustomBinEditorModal = () => {
  const { t } = useTranslation();
  const editableBin = useEditableCustomBin();
  const close = useCloseCustomBinEditor();
  const renderEditor = () => {
    if (!editableBin) return null;
    return (
      <CustomBinEditor
        bin={editableBin === "new" ? null : editableBin}
        onClose={close}
      />
    );
  };
  return (
    <Modal
      opened={!!editableBin}
      onClose={close}
      title={t(
        i18nNs + (editableBin === "new" ? "editor_title_new" : "editor_title"),
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
const CustomBinEditor = ({
  bin,
  onClose,
}: {
  bin: Maybe<tCustomBin>;
  onClose: () => void;
}) => {
  const projectId = useActiveProjectId()!;
  const updateBins = useUpdateCustomBins();
  const createBin = useAddCustomBin();
  const submitMut = useMutation(
    (form: tForm) => {
      form = schema.parse(form);
      if (bin) {
        return updateBins({
          [bin.id]: {
            bin,
            data: form,
          },
        });
      } else {
        return createBin({
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
      name: bin?.name || "",
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
        {!bin && (
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
          {t("submit")}
        </Button>
      </Group>
    </form>
  );
};

export default CustomBinEditorModal;
