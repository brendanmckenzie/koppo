import * as React from "react";
import * as Express from "express";
import cache from "memory-cache";
import ReactDOM from "react-dom/server";
import { Helmet } from "react-helmet";
import { KoppoConfig, Route } from "./koppo";
import { Html } from "./Html";

const cachedRoutes = async (config: KoppoConfig): Promise<Route[]> => {
  const key = "koppo:routes";
  const cached = config.bypassCache ? null : cache.get(key);
  if (cached) {
    return cached as Route[];
  } else {
    const routes = await config.listRoutes();

    cache.put(key, routes);

    return routes;
  }
};

const cachedResponse = async (
  config: KoppoConfig,
  path: string
): Promise<{ html: string; cacheStatus: string } | null> => {
  const key = `koppo:response:${path}`;
  const cached = config.bypassCache ? null : cache.get(key);
  if (cached) {
    return { html: cached, cacheStatus: "HIT" };
  } else {
    const routes = await cachedRoutes(config);

    const match = routes.find((ent) => ent.path === path);
    if (match) {
      const component = config.components[match.component];
      const data = await component.resolveData(match.context);

      const el = React.createElement(component.component, data);

      const body = ReactDOM.renderToString(el);

      const html = ReactDOM.renderToString(React.createElement(Html, { body }));

      cache.put(key, html);

      return { html, cacheStatus: "MISS" };
    }
    return null;
  }
};

export const koppoHandler = (
  config: KoppoConfig
): Express.RequestHandler => async (req, res, next) => {
  const response = await cachedResponse(config, req.path);

  if (response) {
    res.contentType("html");
    res.header("X-Koppo-Cache", response.cacheStatus);
    res.write(response.html);
    res.status(200).end();
  } else {
    next();
  }
};
