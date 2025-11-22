import { createContext } from "react";
import type { tDeviceInfo } from "./types";

export const DeviceInfoContext = createContext<tDeviceInfo>(null!);
