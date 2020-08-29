import cache from "memory-cache";
import { KoppoConfig, Route } from "../koppo";

export const cachedRoutes = async (config: KoppoConfig): Promise<Route[]> => {
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
