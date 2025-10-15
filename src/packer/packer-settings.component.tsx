import { Select, NumberInput, Switch, Stack } from "@mantine/core";
import { useTranslation } from "@/i18n/use-translation";
import { useForm } from "@mantine/form";
import * as z from "zod";
import { zod4Resolver } from "mantine-form-zod-resolver";
import {
  PACKER_MAX_EDGE_SPACING,
  PACKER_MAX_SPRITE_PADDING,
  PACKER_SUPPORTED_SHEET_SIZES,
} from "#config";
import { useActiveProjectId } from "@/projects/use-active-project-id";
import { useDebouncedCallback } from "@mantine/hooks";
import { useUpdatePackerSettings } from "./use-update-packer-settings";
import {
  useGetPackerSettings,
  useIsRotationSupported,
  usePackerSettingsFormVersion,
} from "./use-packer-settings";
import { useMutation } from "#hooks/use-mutation";
import { memo } from "react";

const ATOMS_UPDATE_DELAY_MS = 200;
const schema = z.object({
  sheetMaxSize: z.coerce.number<string>(),
  spritePadding: z.coerce.number().min(0).max(PACKER_MAX_SPRITE_PADDING),
  edgeSpacing: z.coerce.number().min(0).max(PACKER_MAX_EDGE_SPACING),
  pot: z.boolean(),
  allowRotation: z.boolean(),
});
type tForm = z.input<typeof schema>;

const PackerSettings = ({ initialValues }: { initialValues: tForm }) => {
  const isRotationSupported = useIsRotationSupported();
  const updateSettings = useUpdatePackerSettings();
  const updateSettingsMut = useMutation(updateSettings);
  const onValuesChange = useDebouncedCallback((values: tForm) => {
    const result = schema.safeParse(values);
    if (result.success) {
      updateSettingsMut.mutate(result.data);
    }
  }, ATOMS_UPDATE_DELAY_MS);
  const form = useForm<tForm>({
    initialValues,
    onValuesChange,
    validateInputOnChange: true,
    validate: zod4Resolver(schema),
  });
  const { t } = useTranslation();
  return (
    <form>
      <Stack gap="sm">
        <Select
          label={t("packer_opts.max_size")}
          searchable={false}
          data={PACKER_SUPPORTED_SHEET_SIZES.map(String)}
          key={form.key("sheetMaxSize")}
          {...form.getInputProps("sheetMaxSize")}
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
          {...form.getInputProps("spritePadding")}
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
          {...form.getInputProps("edgeSpacing")}
        />
        <Switch
          label={t("packer_opts.pot")}
          key={form.key("pot")}
          {...form.getInputProps("pot", { type: "checkbox" })}
        />
        <Switch
          disabled={!isRotationSupported}
          label={t("packer_opts.allow_rot")}
          key={form.key("allowRotation")}
          {...form.getInputProps("allowRotation", { type: "checkbox" })}
        />
      </Stack>
    </form>
  );
};
const PackerSettingsRoot = () => {
  const projectId = useActiveProjectId();
  const getPackerSettings = useGetPackerSettings();
  const formVersion = usePackerSettingsFormVersion();
  if (!projectId) return null;
  const settings = getPackerSettings();
  return (
    <PackerSettings
      key={projectId + formVersion}
      initialValues={{
        sheetMaxSize: String(settings.sheetMaxSize),
        spritePadding: settings.spritePadding,
        edgeSpacing: settings.edgeSpacing,
        pot: settings.pot,
        allowRotation: settings.allowRotation,
      }}
    />
  );
};

export default memo(PackerSettingsRoot);
