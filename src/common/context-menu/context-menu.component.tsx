import { useComputedColorScheme } from "@mantine/core";
import { useCloseContextMenu, useContextMenuState } from "./use-context-menu";
import { ControlledMenu, MenuItem, SubMenu } from "@szhsin/react-menu";
import { useFocusReturn } from "@mantine/hooks";
import type { tContextMenuItem } from "./types";

const ContextMenu = () => {
  const state = useContextMenuState();
  const close = useCloseContextMenu();
  const theme = useComputedColorScheme();
  const returnFocus = useFocusReturn({
    opened: state.isOpen,
    shouldReturnFocus: true,
  });
  const renderItem = (item: tContextMenuItem) => {
    if (item.children) {
      return (
        <SubMenu key={item.id} label={item.title} onClick={item.onClick}>
          {item.children.map(renderItem)}
        </SubMenu>
      );
    } else {
      return (
        <MenuItem key={item.id} onClick={item.onClick}>
          {item.title}
        </MenuItem>
      );
    }
  };
  return (
    <ControlledMenu
      data-testid="context-menu"
      anchorPoint={state.anchorPoint}
      theming={theme === "dark" ? "dark" : undefined}
      state={state.isOpen ? "open" : "closed"}
      onClose={() => {
        returnFocus();
        close();
      }}
    >
      {state.items.map(renderItem)}
    </ControlledMenu>
  );
};

export default ContextMenu;
