import {
  Button,
  Group,
  Modal,
  TextInput,
  Stack,
  Fieldset,
  Checkbox,
} from "@mantine/core";
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
import {
  PACKER_DEFAULT_ALGORITHM,
  PACKER_DEFAULT_ALLOW_ROTATION,
  PACKER_DEFAULT_EDGE_SPACING,
  PACKER_DEFAULT_SHEET_SIZE,
  PACKER_DEFAULT_SPRITE_PADDING,
  PACKER_DEFAULT_SQUARE,
} from "#config";
import {
  edgeSpacingSchema,
  packerAlgorithmSchema,
  PackerAlgorithmSelect,
  PackerEdgeSpacingInput,
  PackerSheetMaxSizeSelect,
  PackerSpritePaddingInput,
  spritePaddingSchema,
} from "@/packer/packer-settings.component";
import { useOutputFramework } from "@/output/use-output-settings";
import { checkPackerRotationSupport } from "@/packer/check-rotation-support";

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
  useGlobalPackerOptions: z.boolean(),
  packerSheetMaxSize: z.coerce.number<string>().optional(),
  packerSpritePadding: spritePaddingSchema.optional(),
  packerEdgeSpacing: edgeSpacingSchema.optional(),
  packerPot: z.boolean().optional(),
  packerSquare: z.boolean().optional(),
  packerAllowRotation: z.boolean().optional(),
  packerAlgorithm: packerAlgorithmSchema.optional(),
});

type tForm = z.input<typeof schema>;
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
      const parsedForm = schema.parse(form);
      if (bin) {
        return updateBins({
          [bin.id]: {
            bin,
            data: parsedForm,
          },
        });
      } else {
        return createBin({
          ...parsedForm,
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
    mode: "controlled",
    initialValues: {
      name: bin?.name || "",
      useGlobalPackerOptions: bin ? bin.useGlobalPackerOptions : true,
      packerSheetMaxSize: String(
        bin?.packerSheetMaxSize || PACKER_DEFAULT_SHEET_SIZE,
      ),
      packerEdgeSpacing: bin?.packerEdgeSpacing || PACKER_DEFAULT_EDGE_SPACING,
      packerSpritePadding:
        bin?.packerSpritePadding || PACKER_DEFAULT_SPRITE_PADDING,
      packerPot: bin ? bin.packerPot : PACKER_DEFAULT_ALLOW_ROTATION,
      packerSquare: bin ? bin.packerSquare : PACKER_DEFAULT_SQUARE,
      packerAlgorithm: bin?.packerAlgorithm || PACKER_DEFAULT_ALGORITHM,
      packerAllowRotation: bin
        ? bin.packerAllowRotation
        : PACKER_DEFAULT_ALLOW_ROTATION,
    },
    validate: zod4Resolver(schema),
  });
  const shouldUseGlobalSettings = form.values.useGlobalPackerOptions;
  const outputFramework = useOutputFramework();
  const isRotationSupported = checkPackerRotationSupport({
    framework: outputFramework,
    algorithm: form.values.packerAlgorithm || PACKER_DEFAULT_ALGORITHM,
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
        <Fieldset legend={t(i18nNs + "packer_sect")}>
          <Stack gap="xs">
            <Checkbox
              label={t(i18nNs + "use_global_packer_settings")}
              key={form.key("useGlobalPackerOptions")}
              {...form.getInputProps("useGlobalPackerOptions", {
                type: "checkbox",
              })}
            />
            {!shouldUseGlobalSettings && (
              <>
                <PackerAlgorithmSelect
                  key={form.key("packerAlgorithm")}
                  {...form.getInputProps("packerAlgorithm")}
                />
                <PackerSheetMaxSizeSelect
                  key={form.key("packerSheetMaxSize")}
                  {...form.getInputProps("packerSheetMaxSize")}
                />
                <PackerSpritePaddingInput
                  key={form.key("packerSpritePadding")}
                  {...form.getInputProps("packerSpritePadding")}
                />
                <PackerEdgeSpacingInput
                  key={form.key("packerEdgeSpacing")}
                  {...form.getInputProps("packerEdgeSpacing")}
                />
                <Checkbox
                  label={t("packer_opts.pot")}
                  key={form.key("packerPot")}
                  {...form.getInputProps("packerPot", { type: "checkbox" })}
                />
                <Checkbox
                  label={t("packer_opts.square")}
                  key={form.key("packerSquare")}
                  {...form.getInputProps("packerSquare", { type: "checkbox" })}
                />
                <Checkbox
                  disabled={!isRotationSupported}
                  label={t("packer_opts.allow_rot")}
                  key={form.key("packerAllowRotation")}
                  {...form.getInputProps("packerAllowRotation", {
                    type: "checkbox",
                  })}
                />
              </>
            )}
          </Stack>
        </Fieldset>
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
