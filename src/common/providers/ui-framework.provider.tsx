import { MantineProvider } from "@mantine/core";
import { ContextMenuProvider } from "mantine-contextmenu";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";

export default function UiFrameworkProvider(props: { children: any }) {
  return (
    <MantineProvider
      theme={{ primaryColor: "violet" }}
      defaultColorScheme="auto"
    >
      <Notifications />
      <ContextMenuProvider submenuDelay={100}>
        <ModalsProvider>{props.children}</ModalsProvider>
      </ContextMenuProvider>
    </MantineProvider>
  );
}
