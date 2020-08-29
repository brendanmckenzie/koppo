import * as Express from "express";
import cache from "memory-cache";
import { KoppoConfig } from "./koppo";
import { cachedResponse } from "./caching/cachedResponse";

export const koppoHandler = (
  config: KoppoConfig
): Express.RequestHandler => async (req, res, next) => {
  const response = await cachedResponse(config, req.path);

  if (response) {
    cache.put(
      `koppo:request:${req.path}`,
      (cache.get(`koppo:request:${req.path}`) ?? 0) + 1
    );

    res.contentType("html");
    res.header("X-Koppo-Cache", response.cacheStatus);
    res.write(response.html);
    res.status(200).end();
  } else {
    next();
  }
};
