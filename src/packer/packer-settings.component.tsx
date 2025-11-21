import {
  NativeSelect,
  NumberInput,
  Checkbox,
  Stack,
  type NativeSelectProps,
  type NumberInputProps,
} from "@mantine/core";
import { useTranslation } from "@/i18n/use-translation";
import { useForm } from "@mantine/form";
import * as z from "zod";
import { zod4Resolver } from "mantine-form-zod-resolver";
import {
  PACKER_DEFAULT_EDGE_SPACING,
  PACKER_DEFAULT_SPRITE_PADDING,
  PACKER_MAX_EDGE_SPACING,
  PACKER_MAX_SPRITE_PADDING,
  PACKER_SUPPORTED_ALGORITHMS,
  PACKER_SUPPORTED_SHEET_SIZES,
  PACKER_SUPPORTED_MULTIPACK_MODES,
} from "#config";
import { useActiveProjectId } from "@/projects/use-active-project-id";
import { useUpdatePackerSettings } from "./use-update-packer-settings";
import {
  useGetPackerSettings,
  useIsRotationSupported,
  usePackerSettingsFormVersion,
} from "./use-packer-settings";
import { useMutation } from "#hooks/use-mutation";
import { forwardRef } from "react";
import type {
  tPackerAlgorithm,
  tPackerMultipackMode,
  tPackerSettings,
} from "./types";
import { isEqual } from "#utils/is-equal";

export const sheetMaxSizeSchema = z.coerce.number<string>();
export const spritePaddingSchema = z.coerce
  .number()
  .min(0)
  .max(PACKER_MAX_SPRITE_PADDING);
export const edgeSpacingSchema = z.coerce
  .number()
  .min(0)
  .max(PACKER_MAX_EDGE_SPACING);
export const packerAlgorithmSchema = z.enum(PACKER_SUPPORTED_ALGORITHMS);

const schema = z.object({
  sheetMaxSize: sheetMaxSizeSchema,
  spritePadding: spritePaddingSchema,
  edgeSpacing: edgeSpacingSchema,
  pot: z.boolean(),
  square: z.boolean(),
  allowRotation: z.boolean(),
  packerAlgorithm: packerAlgorithmSchema,
  multipack: z.enum(PACKER_SUPPORTED_MULTIPACK_MODES),
});
type tForm = z.input<typeof schema>;

type tProps = {
  getCurrentSettings: () => tPackerSettings;
};
const PackerSettings = ({ getCurrentSettings }: tProps) => {
  const { t } = useTranslation();

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
        <PackerAlgorithmSelect
          key={form.key("packerAlgorithm")}
          {...normalizeInputProps({
            props: form.getInputProps("packerAlgorithm"),
          })}
        />
        <PackerMultipackSelect
          key={form.key("multipack")}
          {...normalizeInputProps({
            props: form.getInputProps("multipack"),
          })}
        />
        <PackerSheetMaxSizeSelect
          key={form.key("sheetMaxSize")}
          {...normalizeInputProps({
            props: form.getInputProps("sheetMaxSize"),
          })}
        />
        <PackerSpritePaddingInput
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
        <PackerEdgeSpacingInput
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
          label={t("packer_opts.square")}
          key={form.key("square")}
          {...normalizeInputProps({
            props: form.getInputProps("square", { type: "checkbox" }),
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
  const getPackerSettings = useGetPackerSettings();
  const formVersion = usePackerSettingsFormVersion();
  if (!projectId) return null;
  return (
    <PackerSettings
      key={projectId + formVersion}
      getCurrentSettings={getPackerSettings}
    />
  );
};
export const PackerAlgorithmSelect = forwardRef<
  HTMLSelectElement,
  NativeSelectProps
>((props, ref) => {
  const algorithmOptions: { value: tPackerAlgorithm; label: string }[] = [
    {
      value: "maxRects",
      label: "Max rects",
    },
    {
      value: "grid",
      label: "Grid",
    },
    {
      value: "basic",
      label: "Basic",
    },
  ];
  const { t } = useTranslation();

  return (
    <NativeSelect
      ref={ref}
      label={t("packer_opts.packer_algorithm")}
      data={algorithmOptions}
      {...props}
    />
  );
});
const PackerMultipackSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(
  (props, ref) => {
    const { t } = useTranslation();
    const multipackOptions: { value: tPackerMultipackMode; label: string }[] =
      PACKER_SUPPORTED_MULTIPACK_MODES.map((mode) => ({
        value: mode,
        label: t(`packer_opts.multipack_opt_${mode}`),
      }));

    return (
      <NativeSelect
        label={t("packer_opts.multipack")}
        ref={ref}
        data={multipackOptions}
        {...props}
      />
    );
  },
);
export const PackerSheetMaxSizeSelect = forwardRef<
  HTMLSelectElement,
  NativeSelectProps
>((props, ref) => {
  const { t } = useTranslation();
  return (
    <NativeSelect
      label={t("packer_opts.max_size")}
      data={PACKER_SUPPORTED_SHEET_SIZES.map(String)}
      ref={ref}
      {...props}
    />
  );
});
export const PackerSpritePaddingInput = forwardRef<
  HTMLInputElement,
  NumberInputProps
>((props, ref) => {
  const { t } = useTranslation();
  return (
    <NumberInput
      ref={ref}
      allowDecimal={false}
      allowNegative={false}
      allowLeadingZeros={false}
      clampBehavior="strict"
      label={t("packer_opts.sprite_padding")}
      min={0}
      max={PACKER_MAX_SPRITE_PADDING}
      {...props}
    />
  );
});
export const PackerEdgeSpacingInput = forwardRef<
  HTMLInputElement,
  NumberInputProps
>((props, ref) => {
  const { t } = useTranslation();
  return (
    <NumberInput
      ref={ref}
      allowDecimal={false}
      allowNegative={false}
      allowLeadingZeros={false}
      clampBehavior="strict"
      label={t("packer_opts.edge_spacing")}
      min={0}
      max={PACKER_MAX_EDGE_SPACING}
      {...props}
    />
  );
});

export default PackerSettingsRoot;
