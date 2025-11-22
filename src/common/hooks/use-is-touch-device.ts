import { useDeviceInfo } from "../device-info/use-defice-info";

export const useIsTouchDevice = () => {
  return useDeviceInfo().isTouch;
};
