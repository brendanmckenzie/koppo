import express from "express";
import winston from "winston";
import { useKoppo } from "./src/koppo";
import { Test } from "./src/Test";
import { logger } from "./src/logger";

const app = express();
app.use(logger);
app.disable("x-powered-by");

useKoppo(app, {
  components: {
    Test: { component: Test, resolveData: () => Promise.resolve({}) },
  },
  listRoutes: async () => [{ path: "/test", context: {}, component: "Test" }],
});

const port = process.env.PORT || 4000;
const server = app.listen(port);

server.on("listening", () => {
  winston.log("info", "listening on port %d", port);
});
