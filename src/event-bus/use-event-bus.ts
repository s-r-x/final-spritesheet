import { EventBus } from "./event-bus";

export const useEventBus = () => {
  return EventBus.instance;
};
