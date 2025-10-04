export type tLogLayer = "db" | "framework" | "app" | "router";
export type tLogLevel = "debug" | "info" | "warn";
export type tLoggerPayload = {
  layer: tLogLayer;
  label: string;
  data?: any;
};

export type tLogger = {
  info: (data: tLoggerPayload) => void;
  warn: (data: tLoggerPayload) => void;
  debug: (data: tLoggerPayload) => void;
  error: (...args: any) => void;
};
