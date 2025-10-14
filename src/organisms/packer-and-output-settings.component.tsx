import { Accordion } from "@mantine/core";
import PackerSettings from "@/packer/packer-settings.component";
import OutputSettings from "@/output/output-settings.component";
import { useTranslation } from "@/i18n/use-translation";
import { useLocalStorage } from "@mantine/hooks";

const PackerAndOutputSettings = () => {
  const { t } = useTranslation();
  const [value, setValue] = useLocalStorage<string[]>({
    key: "packer_and_output_settings_accordion",
    defaultValue: ["output", "packer"],
    getInitialValueInEffect: false,
  });
  return (
    <Accordion multiple value={value} onChange={setValue}>
      <Accordion.Item value="packer">
        <Accordion.Control>{t("packer_opts.form_name")}</Accordion.Control>
        <Accordion.Panel>
          <PackerSettings />
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="output">
        <Accordion.Control>{t("output_opts.form_name")}</Accordion.Control>
        <Accordion.Panel>
          <OutputSettings />
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};

export default PackerAndOutputSettings;
