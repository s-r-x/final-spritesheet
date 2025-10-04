import { createElement } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@/i18n/i18n";
import { initPersistenceLayer } from "./persistence/init-persistence-layer";
import App from "./App";
import { Logger } from "./logger/logger";

const createApp = async () => {
  const logger = new Logger();
  const { queries, mutations, importExport } = await initPersistenceLayer({
    logger,
  });
  window.addEventListener("error", function (e) {
    logger.error(e);
  });
  createRoot(document.getElementById("root")!).render(
    createElement(
      App,
      {
        dbQueries: queries,
        dbMutations: mutations,
        dbImportExport: importExport,
        logger,
      },
      null,
    ),
  );
};

createApp();
