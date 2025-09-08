import { createElement } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@/i18n/i18n";
import { initPersistenceLayer } from "./persistence/init-persistence-layer";
import App from "./App";

const createApp = async () => {
  const { queries } = await initPersistenceLayer();
  createRoot(document.getElementById("root")!).render(
    createElement(
      App,
      {
        dbQueries: queries,
      },
      null,
    ),
  );
};

createApp();
