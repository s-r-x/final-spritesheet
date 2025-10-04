import {
  useMutation as useBaseMutation,
  type MutationFunction,
} from "@tanstack/react-query";
import { useLoadingBar } from "./use-loading-bar";
import { useNotification } from "./use-notification";
import { useTranslation } from "@/i18n/use-translation";
import { useConfirm, ConfirmError } from "./use-confirm";
import { useLogger } from "@/logger/use-logger";

//UseMutationResult<TData, TError, TVariables>

export function useMutation<
  TData = unknown,
  TVariables = void,
  TError = unknown,
>(
  mutationFn: MutationFunction<TData, TVariables>,
  {
    notifyOnError = true,
    ...args
  }: {
    successNotification?: string | (() => string);
    confirm?: boolean;
    confirmTitle?: string;
    confirmMessage?: string;
    confirmTextYes?: string;
    confirmTextNo?: string;
    showLoadingBar?: boolean;
    notifyOnError?: boolean;
    onSuccess?(data: TData, vars?: TVariables): any;
    onError?(error: TError): any;
  } = {},
) {
  const logger = useLogger();
  const loadingBar = useLoadingBar();
  const { showNotification } = useNotification();
  const { t } = useTranslation();
  const { confirm } = useConfirm();
  const mut = useBaseMutation<TData, TError, TVariables>({
    mutationFn: mutationFn,
    onSuccess(data, vars) {
      if (args.successNotification) {
        if (typeof args.successNotification === "function") {
          showNotification({ message: args.successNotification() });
        } else {
          showNotification({ message: args.successNotification });
        }
      }
      if (args.onSuccess) {
        args.onSuccess(data, vars);
      }
      if (args.showLoadingBar) {
        loadingBar.complete();
      }
    },
    async onMutate() {
      if (args.confirm) {
        await confirm({
          message: args.confirmMessage,
          title: args.confirmTitle,
          yesText: args.confirmTextYes,
          noText: args.confirmTextNo,
        });
      }
      if (args.showLoadingBar) {
        loadingBar.start();
      }
    },
    onError(e) {
      if (e instanceof ConfirmError) return;
      logger?.error(e);
      if (notifyOnError) {
        showNotification({
          isError: true,
          title: t("error"),
          message: t("generic_error_desc"),
        });
      }
      if (args.onError) args.onError(e);
      if (args.showLoadingBar) {
        loadingBar.complete();
      }
    },
  });
  return {
    isLoading: mut.isPending,
    mutate: mut.mutate,
  };
}
