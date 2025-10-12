import { BProgress } from "@bprogress/core";
BProgress.configure({
  showSpinner: false,
});
const progressApi = {
  start() {
    BProgress.start();
  },
  complete() {
    BProgress.done();
  },
};
export const useLoadingBar = () => {
  return progressApi;
};
