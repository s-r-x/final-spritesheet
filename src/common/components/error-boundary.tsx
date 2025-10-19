import { useTranslation } from "@/i18n/use-translation";
import type { PropsWithChildren } from "react";
import {
  ErrorBoundary as BaseErrorBoundary,
  type FallbackProps,
} from "react-error-boundary";
import { Button, Alert, Stack, type CSSProperties } from "@mantine/core";
import { isPromise } from "#utils/is-promise";

type tProps = PropsWithChildren<{
  onReset: () => any;
  fallbackStyle?: CSSProperties;
  fallbackClassName?: string;
  centerFallbackInViewport?: boolean;
}>;

const ErrorBoundary = (props: tProps) => {
  return (
    <BaseErrorBoundary
      fallbackRender={(fallbackProps) => {
        const onReset = () => {
          const result = props.onReset();
          if (isPromise(result)) {
            result.then(fallbackProps.resetErrorBoundary);
          } else {
            fallbackProps.resetErrorBoundary();
          }
        };
        return (
          <Fallback
            isCentered={props.centerFallbackInViewport}
            className={props.fallbackClassName}
            style={props.fallbackStyle}
            resetErrorBoundary={onReset}
            error={fallbackProps.error}
          />
        );
      }}
    >
      {props.children}
    </BaseErrorBoundary>
  );
};

const Fallback = (
  props: FallbackProps & {
    style?: CSSProperties;
    className?: string;
    isCentered?: boolean;
  },
) => {
  const { t } = useTranslation();
  return (
    <Stack
      gap="xs"
      p="xs"
      className={props.className}
      style={
        props.isCentered
          ? {
              position: "fixed",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }
          : props.style
      }
    >
      <Alert
        title={t("fatal_error_boundary_message")}
        color="red"
        variant="filled"
      >
        {props.error instanceof Error ? props.error.message : props.error}
      </Alert>
      <Button onClick={props.resetErrorBoundary}>
        {t("fatal_error_boundary_restore")}
      </Button>
    </Stack>
  );
};

export default ErrorBoundary;
