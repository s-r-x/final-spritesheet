import { useLocalStorage } from "@mantine/hooks";
export function usePersistedState<T = string>({
  defaultValue,
  key,
}: {
  defaultValue: T;
  key: string;
}) {
  return useLocalStorage<T>({
    key,
    defaultValue,
    getInitialValueInEffect: false,
  });
}
