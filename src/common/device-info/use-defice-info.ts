import { useContext } from "react";
import { DeviceInfoContext } from "./device-info.context";

export const useDeviceInfo = () => {
  return useContext(DeviceInfoContext);
};
