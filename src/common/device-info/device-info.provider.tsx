import type { FC } from "react";
import { useMediaQuery } from "@mantine/hooks";
import { DeviceInfoContext } from "./device-info.context";

const DeviceInfoProvider: FC<{ children: any }> = (props) => {
  const isTouch = useMediaQuery("(pointer: coarse)");
  return (
    <DeviceInfoContext
      value={{
        isTouch,
      }}
    >
      {props.children}
    </DeviceInfoContext>
  );
};

export default DeviceInfoProvider;
