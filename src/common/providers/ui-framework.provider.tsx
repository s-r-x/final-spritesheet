import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import ContextMenu from "../context-menu/context-menu.component";

export default function UiFrameworkProvider(props: { children: any }) {
  return (
    <MantineProvider
      theme={{ primaryColor: "violet" }}
      defaultColorScheme="auto"
    >
      <ContextMenu />
      <Notifications />
      <ModalsProvider>{props.children}</ModalsProvider>
    </MantineProvider>
  );
}
