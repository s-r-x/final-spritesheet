import { Group } from "@mantine/core";
import type { JSX } from "react";

type tProps = {
  appBarSlot?: JSX.Element;
};
const Header = (props: tProps) => {
  return <Group gap="md">{props.appBarSlot}</Group>;
};

export default Header;
