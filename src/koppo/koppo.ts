import * as Express from "express";
import cache from "memory-cache";
import { koppoHandler } from "./handler";

export type Route = {
  path: string;
  component: string;
  context: any;
};

export type Component = {
  resolveData: (context: any) => Promise<any>;
  component: React.FunctionComponent;
};

export type KoppoConfig = {
  listRoutes: () => Promise<Route[]>;
  components: { [alias: string]: Component };
  bypassCache?: boolean;
};

export const useKoppo = (app: Express.Application, config: KoppoConfig) => {
  app.use(koppoHandler(config));

  app.delete("/.koppo/cache", (_req, res) => {
    cache.clear();
    res.status(204).end();
  });
};
