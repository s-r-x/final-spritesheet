import { Button, Group, Modal, TextInput, NumberInput } from "@mantine/core";
import { useTranslation } from "@/i18n/use-translation";
import type { tSprite } from "./types";
import { useForm } from "@mantine/form";
import * as z from "zod";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useEditableSprite } from "./use-sprite-editor";
import { useCloseSpriteEditor } from "./use-sprite-editor";
import { useUpdateSprite } from "./use-update-sprite";
import { useMutation } from "#hooks/use-mutation";

const i18nNs = "sprite_editor.";
const SpriteEditorModal = () => {
  const { t } = useTranslation();
  const editableSprite = useEditableSprite();
  const close = useCloseSpriteEditor();
  const renderEditor = () => {
    if (!editableSprite) return null;
    return <SpriteEditor sprite={editableSprite} onClose={close} />;
  };
  return (
    <Modal
      opened={!!editableSprite}
      onClose={close}
      title={t(i18nNs + "editor_title")}
    >
      {renderEditor()}
    </Modal>
  );
};

const schema = z.object({
  name: z.string().trim().min(1),
  scale: z.coerce.number().min(0.0001).max(1),
});

type tForm = z.infer<typeof schema>;
const SpriteEditor = ({
  sprite,
  onClose,
}: {
  sprite: tSprite;
  onClose: () => void;
}) => {
  const updateSprite = useUpdateSprite();
  const updateSpriteMut = useMutation(
    (form: tForm) => updateSprite(sprite, form),
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
      name: sprite.name,
      scale: sprite.scale,
    },
    validate: zod4Resolver(schema),
  });

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        updateSpriteMut.mutate(values);
      })}
    >
      <TextInput
        withAsterisk
        label={t(i18nNs + "name")}
        placeholder={t(i18nNs + "name_placeholder")}
        key={form.key("name")}
        {...form.getInputProps("name")}
      />
      <NumberInput
        allowDecimal
        allowNegative={false}
        allowLeadingZeros={false}
        decimalScale={4}
        clampBehavior="strict"
        label={t(i18nNs + "scale")}
        key={form.key("scale")}
        {...form.getInputProps("scale")}
      />
      <Group justify="flex-end" mt="md">
        <Button type="submit" disabled={updateSpriteMut.isLoading}>
          {t("submit")}
        </Button>
      </Group>
    </form>
  );
};

export default SpriteEditorModal;
