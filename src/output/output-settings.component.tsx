import { useTranslation } from "@/i18n/use-translation";
import { NumberInput, Select, Stack, TextInput } from "@mantine/core";
import {
  OUTPUT_MAX_DATA_FILE_NAME_LENGTH,
  OUTPUT_MAX_TEXTURE_FILE_NAME_LENGTH,
  SUPPORTED_FRAMEWORKS,
  SUPPORTED_OUTPUT_IMAGE_FORMATS,
} from "#config";
import * as z from "zod";
import { useForm } from "@mantine/form";
import { useActiveProjectId } from "@/projects/use-active-project-id";
import { useUpdateOutputSettings } from "./use-update-output-settings";
import { useDebouncedCallback } from "@mantine/hooks";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useGetOutputSettings } from "./use-output-settings";
import { useEffect } from "react";
import CloseableMessage from "#components/ClosableMessage";

const i18nNs = "output_opts.";

const schema = z.object({
  framework: z.string(),
  textureFormat: z.string(),
  dataFileName: z.string().trim().min(1).max(OUTPUT_MAX_DATA_FILE_NAME_LENGTH),
  textureFileName: z
    .string()
    .trim()
    .min(1)
    .max(OUTPUT_MAX_TEXTURE_FILE_NAME_LENGTH),
  pngCompression: z.coerce.number<string>(),
  imageQuality: z.number().min(1).max(100),
});
type tForm = z.input<typeof schema>;
const OutputSettings = ({ initialValues }: { initialValues: tForm }) => {
  const getOutputSettings = useGetOutputSettings();
  const onValuesChange = useDebouncedCallback((values: tForm) => {
    const result = schema.safeParse(values);
    if (result.success) {
      updateSettings(result.data);
    }
  }, 200);
  const form = useForm<tForm>({
    mode: "uncontrolled",
    initialValues,
    validate: zod4Resolver(schema),
    validateInputOnChange: true,
    onValuesChange,
  });
  const updateSettings = useUpdateOutputSettings();
  useEffect(() => {
    const settings = getOutputSettings();
    form.initialize({
      pngCompression: String(settings.pngCompression),
      imageQuality: settings.imageQuality,
      textureFormat: settings.textureFormat,
      framework: settings.framework,
      textureFileName: settings.textureFileName,
      dataFileName: settings.dataFileName,
    });
  }, []);
  const isPng = form.values.textureFormat === "png";
  const framework = form.values.framework;
  const renderFrameworkInfo = () => {
    switch (framework) {
      case "godot":
        return (
          <CloseableMessage
            content={t(i18nNs + "godot_import_tip")}
            id="godot_import_tip"
          />
        );
      default:
        return null;
    }
  };
  const { t } = useTranslation();
  return (
    <form>
      <Stack gap="xs">
        <Select
          allowDeselect={false}
          label={t(i18nNs + "framework")}
          data={SUPPORTED_FRAMEWORKS}
          {...form.getInputProps("framework")}
        />
        {renderFrameworkInfo()}
        <Select
          allowDeselect={false}
          label={t(i18nNs + "texture_format")}
          data={SUPPORTED_OUTPUT_IMAGE_FORMATS}
          {...form.getInputProps("textureFormat")}
        />
        {isPng ? (
          <Select
            label={t(i18nNs + "png_compression")}
            data={[
              {
                label: "0 - No compression",
                value: "0",
              },
              {
                label: "1 - Lossy",
                value: "1",
              },
              {
                label: "2",
                value: "2",
              },
              {
                label: "3",
                value: "3",
              },
              {
                label: "4",
                value: "4",
              },
              {
                label: "5",
                value: "5",
              },
              {
                label: "6",
                value: "6",
              },
              {
                label: "7",
                value: "7",
              },
              {
                label: "8 - 2 colors",
                value: "8",
              },
            ]}
            {...form.getInputProps("pngCompression")}
          />
        ) : (
          <NumberInput
            allowNegative={false}
            allowLeadingZeros={false}
            clampBehavior="strict"
            label={t(i18nNs + "image_quality")}
            min={1}
            max={100}
            {...form.getInputProps("imageQuality")}
          />
        )}
        <TextInput
          label={t(i18nNs + "data_file")}
          {...form.getInputProps("dataFileName")}
        />
        <TextInput
          label={t(i18nNs + "texture_file")}
          {...form.getInputProps("textureFileName")}
        />
      </Stack>
    </form>
  );
};
const OutputSettingsRoot = () => {
  const projectId = useActiveProjectId();
  const getOutputSettings = useGetOutputSettings();
  if (!projectId) return null;
  const settings = getOutputSettings();
  return (
    <OutputSettings
      key={projectId}
      initialValues={{
        pngCompression: String(settings.pngCompression),
        imageQuality: settings.imageQuality,
        textureFormat: settings.textureFormat,
        framework: settings.framework,
        textureFileName: settings.textureFileName,
        dataFileName: settings.dataFileName,
      }}
    />
  );
};

export default OutputSettingsRoot;
