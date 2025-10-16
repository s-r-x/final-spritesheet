import { useComputedColorScheme } from "@mantine/core";
import { useCloseContextMenu, useContextMenuState } from "./use-context-menu";
import { ControlledMenu, MenuItem } from "@szhsin/react-menu";
import { useFocusReturn } from "@mantine/hooks";

const ContextMenu = () => {
  const state = useContextMenuState();
  const close = useCloseContextMenu();
  const theme = useComputedColorScheme();
  const returnFocus = useFocusReturn({
    opened: state.isOpen,
    shouldReturnFocus: true,
  });
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
      {state.items.map((item) => (
        <MenuItem key={item.id} onClick={item.onClick}>
          {item.title}
        </MenuItem>
      ))}
    </ControlledMenu>
  );
};

export default ContextMenu;
