import * as Express from "express";
import { koppoHandler } from "./handler";
import { cacheClear } from "./caching/cacheClear";

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
  autoCacheCount?: number;
};

export const useKoppo = (app: Express.Application, config: KoppoConfig) => {
  app.use(koppoHandler(config));

  app.delete("/.koppo/cache", cacheClear(config));
};
