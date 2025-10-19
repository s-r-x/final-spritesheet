import { useTranslation } from "@/i18n/use-translation";
import { NumberInput, NativeSelect, Stack, TextInput } from "@mantine/core";
import {
  OUTPUT_ENABLE_PNG_COMPRESSION,
  OUTPUT_MAX_DATA_FILE_NAME_LENGTH,
  OUTPUT_MAX_TEXTURE_FILE_NAME_LENGTH,
  SUPPORTED_FRAMEWORKS,
  SUPPORTED_OUTPUT_IMAGE_FORMATS,
} from "#config";
import * as z from "zod";
import { useForm } from "@mantine/form";
import { useActiveProjectId } from "@/projects/use-active-project-id";
import { useUpdateOutputSettings } from "./use-update-output-settings";
import { zod4Resolver } from "mantine-form-zod-resolver";
import {
  useGetOutputSettings,
  useOutputSettingsFormVersion,
} from "./use-output-settings";
import CloseableMessage from "#components/closeable-message.component";
import { useMutation } from "#hooks/use-mutation";
import { memo } from "react";
import type { tOutputSettings } from "./types";
import { isEqual } from "#utils/is-equal";

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
const OutputSettings = ({
  getCurrentSettings,
}: {
  getCurrentSettings: () => tOutputSettings;
}) => {
  const getInitialValues = (): tForm => {
    const settings = getCurrentSettings();
    return {
      ...settings,
      pngCompression: String(settings.pngCompression),
    };
  };
  const updateSettings = useUpdateOutputSettings();
  const updateSettingsMut = useMutation(updateSettings);
  const onValuesChange = () => {
    const values = form.getValues();
    console.log(values);
    const result = schema.safeParse(values);
    if (!result.success) return;
    const isChanged = !isEqual(getCurrentSettings(), result.data);
    if (isChanged) {
      updateSettingsMut.mutate(result.data);
    }
  };
  const form = useForm<tForm>({
    mode: "uncontrolled",
    initialValues: getInitialValues(),
    validate: zod4Resolver(schema),
    validateInputOnChange: true,
  });
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
  type tGetInputPropsReturnType = ReturnType<typeof form.getInputProps>;
  function normalizeInputProps<TOnChangeData = any>({
    props,
    isTextInput,
  }: {
    props: tGetInputPropsReturnType;
    isTextInput?: boolean;
  }): tGetInputPropsReturnType {
    return {
      ...props,
      onChange(e: TOnChangeData) {
        props.onChange?.(e);
        if (!isTextInput) {
          onValuesChange();
        }
      },
      onBlur(e: any) {
        props.onBlur?.(e);
        if (isTextInput) {
          onValuesChange();
        }
      },
    };
  }
  const renderPngCompressionInput = () => {
    if (!OUTPUT_ENABLE_PNG_COMPRESSION) return null;
    return (
      <NativeSelect
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
        {...normalizeInputProps({
          props: form.getInputProps("pngCompression"),
        })}
      />
    );
  };
  return (
    <form
      data-testid="output-settings-form"
      onSubmit={form.onSubmit(onValuesChange)}
    >
      <Stack gap="xs">
        <NativeSelect
          label={t(i18nNs + "framework")}
          data={SUPPORTED_FRAMEWORKS}
          key={form.key("framework")}
          {...normalizeInputProps({
            props: form.getInputProps("framework"),
          })}
        />
        {renderFrameworkInfo()}
        <NativeSelect
          label={t(i18nNs + "texture_format")}
          data={SUPPORTED_OUTPUT_IMAGE_FORMATS}
          key={form.key("textureFormat")}
          {...normalizeInputProps({
            props: form.getInputProps("textureFormat"),
          })}
        />
        {isPng ? (
          renderPngCompressionInput()
        ) : (
          <NumberInput
            allowNegative={false}
            allowLeadingZeros={false}
            clampBehavior="strict"
            label={t(i18nNs + "image_quality")}
            min={1}
            key={form.key("imageQuality")}
            max={100}
            {...normalizeInputProps({
              props: form.getInputProps("imageQuality"),
              isTextInput: true,
            })}
          />
        )}
        <TextInput
          label={t(i18nNs + "data_file")}
          key={form.key("dataFileName")}
          {...normalizeInputProps({
            props: form.getInputProps("dataFileName"),
            isTextInput: true,
          })}
        />
        <TextInput
          label={t(i18nNs + "texture_file")}
          key={form.key("textureFileName")}
          {...normalizeInputProps({
            props: form.getInputProps("textureFileName"),
            isTextInput: true,
          })}
        />
      </Stack>
      <button type="submit" style={{ display: "none" }} aria-hidden="true" />
    </form>
  );
};
const OutputSettingsRoot = () => {
  const projectId = useActiveProjectId();
  const formVersion = useOutputSettingsFormVersion();
  const getOutputSettings = useGetOutputSettings();
  if (!projectId) return null;
  return (
    <OutputSettings
      key={projectId + formVersion}
      getCurrentSettings={getOutputSettings}
    />
  );
};

export default memo(OutputSettingsRoot);
