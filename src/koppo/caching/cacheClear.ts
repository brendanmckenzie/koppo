import * as Express from "express";
import cache from "memory-cache";
import { KoppoConfig } from "../koppo";
import { cachedResponse } from "./cachedResponse";

export const cacheClear = (
  config: KoppoConfig
): Express.RequestHandler => async (_req, res) => {
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
};
