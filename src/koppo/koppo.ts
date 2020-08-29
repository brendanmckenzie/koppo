import * as Express from "express";
import cache from "memory-cache";
import { koppoHandler } from "./handler";
import { cachedResponse } from "./caching/cachedResponse";

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

  app.delete("/.koppo/cache", async (_req, res) => {
    const autoCache = cache
      .keys()
      .filter((ent) => ent.startsWith && ent.startsWith("koppo:request"))
      .map((key) => ({
        path: key.substr("koppo:request".length + 1),
        count: cache.get(key) as number,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, config.autoCacheCount);

    cache.clear();

    for (var item of autoCache) {
      await cachedResponse(config, item.path);
    }

    res.status(204).end();
  });
};
