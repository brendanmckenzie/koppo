import React from "react";
import ReactDOM from "react-dom/server";
import cache from "memory-cache";
import { KoppoConfig } from "../koppo";
import { cachedRoutes } from "./cachedRoutes";
import { Html } from "../Html";

export const cachedResponse = async (
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
