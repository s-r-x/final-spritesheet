import { ContextMenuProvider } from "mantine-contextmenu";

import { MantineProvider } from "@mantine/core";

export default function UiFrameworkProvider(props: { children: any }) {
  return (
    <MantineProvider
      theme={{ primaryColor: "violet" }}
      defaultColorScheme="auto"
    >
      <ContextMenuProvider submenuDelay={100}>
        {props.children}
      </ContextMenuProvider>
    </MantineProvider>
  );
}
