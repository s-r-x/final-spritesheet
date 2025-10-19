import { NativeSelect, NumberInput, Checkbox, Stack } from "@mantine/core";
import { useTranslation } from "@/i18n/use-translation";
import { useForm } from "@mantine/form";
import * as z from "zod";
import { zod4Resolver } from "mantine-form-zod-resolver";
import {
  PACKER_DEFAULT_EDGE_SPACING,
  PACKER_DEFAULT_SPRITE_PADDING,
  PACKER_MAX_EDGE_SPACING,
  PACKER_MAX_SPRITE_PADDING,
  PACKER_SUPPORTED_SHEET_SIZES,
} from "#config";
import { useActiveProjectId } from "@/projects/use-active-project-id";
import { useUpdatePackerSettings } from "./use-update-packer-settings";
import {
  useGetPackerSettings,
  useIsRotationSupported,
  usePackerSettingsFormVersion,
} from "./use-packer-settings";
import { useMutation } from "#hooks/use-mutation";
import { memo } from "react";
import type { tPackerSettings } from "./types";
import { isEqual } from "#utils/is-equal";

const schema = z.object({
  sheetMaxSize: z.coerce.number<string>(),
  spritePadding: z.coerce.number().min(0).max(PACKER_MAX_SPRITE_PADDING),
  edgeSpacing: z.coerce.number().min(0).max(PACKER_MAX_EDGE_SPACING),
  pot: z.boolean(),
  allowRotation: z.boolean(),
});
type tForm = z.input<typeof schema>;

type tProps = {
  getCurrentSettings: () => Omit<tPackerSettings, "packerAlgorithm">;
};
const PackerSettings = ({ getCurrentSettings }: tProps) => {
  const isRotationSupported = useIsRotationSupported();
  const updateSettings = useUpdatePackerSettings();
  const updateSettingsMut = useMutation(updateSettings);
  const getInitialValues = (): tForm => {
    const settings = getCurrentSettings();
    return {
      ...settings,
      sheetMaxSize: String(settings.sheetMaxSize),
    };
  };
  const onValuesChange = () => {
    const values = form.getValues();
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
    validateInputOnChange: true,
    validateInputOnBlur: true,
    validate: zod4Resolver(schema),
  });
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
  const spritePaddingInputProps = normalizeInputProps({
    props: form.getInputProps("spritePadding"),
    isTextInput: true,
  });
  const edgeSpacingInputProps = normalizeInputProps({
    props: form.getInputProps("edgeSpacing"),
    isTextInput: true,
  });
  return (
    <form
      data-testid="packer-settings-form"
      onSubmit={form.onSubmit(onValuesChange)}
    >
      <Stack gap="sm">
        <NativeSelect
          label={t("packer_opts.max_size")}
          data={PACKER_SUPPORTED_SHEET_SIZES.map(String)}
          key={form.key("sheetMaxSize")}
          {...normalizeInputProps({
            props: form.getInputProps("sheetMaxSize"),
          })}
        />
        {/*
      <Select
        label="Packer algorithm"
        value={packerAlgorithm}
        onChange={(v) => {
          if (v) {
            setPackerAlgorithm(v as tPackerAlgorithm);
          }
        }}
        searchable={false}
        data={["grid", "maxRects"]}
      />
			*/}
        <NumberInput
          allowDecimal={false}
          allowNegative={false}
          allowLeadingZeros={false}
          clampBehavior="strict"
          label={t("packer_opts.sprite_padding")}
          min={0}
          max={PACKER_MAX_SPRITE_PADDING}
          key={form.key("spritePadding")}
          {...spritePaddingInputProps}
          onBlur={(e) => {
            if (!e.target.value) {
              form.setFieldValue(
                "spritePadding",
                PACKER_DEFAULT_SPRITE_PADDING,
              );
            }
            spritePaddingInputProps.onBlur?.(e);
          }}
        />
        <NumberInput
          allowDecimal={false}
          allowNegative={false}
          allowLeadingZeros={false}
          clampBehavior="strict"
          label={t("packer_opts.edge_spacing")}
          min={0}
          max={PACKER_MAX_EDGE_SPACING}
          key={form.key("edgeSpacing")}
          {...edgeSpacingInputProps}
          onBlur={(e) => {
            if (!e.target.value) {
              form.setFieldValue("edgeSpacing", PACKER_DEFAULT_EDGE_SPACING);
            }
            edgeSpacingInputProps.onBlur?.(e);
          }}
        />
        <Checkbox
          label={t("packer_opts.pot")}
          key={form.key("pot")}
          {...normalizeInputProps({
            props: form.getInputProps("pot", { type: "checkbox" }),
          })}
        />
        <Checkbox
          disabled={!isRotationSupported}
          label={t("packer_opts.allow_rot")}
          key={form.key("allowRotation")}
          {...normalizeInputProps({
            props: form.getInputProps("allowRotation", { type: "checkbox" }),
          })}
        />
      </Stack>
      <button type="submit" style={{ display: "none" }} aria-hidden="true" />
    </form>
  );
};
const PackerSettingsRoot = () => {
  const projectId = useActiveProjectId();
  const getPackerSettings_ = useGetPackerSettings();
  const getPackerSettings = () => {
    const { packerAlgorithm: _, ...settings } = getPackerSettings_();
    return settings;
  };
  const formVersion = usePackerSettingsFormVersion();
  if (!projectId) return null;
  return (
    <PackerSettings
      key={projectId + formVersion}
      getCurrentSettings={getPackerSettings}
    />
  );
};

export default memo(PackerSettingsRoot);
