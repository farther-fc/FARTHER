export const routeTypes = {
  User: "User",
  Feature: "Feature",
  Info: "Info",
  Dev: "Dev",
} as const;

type RouteType = keyof typeof routeTypes;

export type Route = {
  title: string;
  path: string;
  type: RouteType;
  hidden?: boolean;
  external?: boolean;
  seoTitle?: string;
  description?: string;
  subroutes?: Route[];
};

const createRoute = (
  title: string,
  path: string,
  type: RouteType,
  options: Partial<Omit<Route, "title" | "path" | "type">> = {},
  subroutes: Route[] = [],
): Route => ({
  title,
  path,
  type,
  hidden: false,
  external: false,
  ...options,
  subroutes,
});

export const routesTree: Route[] = [
  createRoute("User Profile", "/user/profile", routeTypes.User),
  createRoute("Tips", "/tips", routeTypes.Feature, {}, [
    createRoute("Leaderboard", "/tips/leaderboard", routeTypes.Feature),
    createRoute("History", "/tips/history", routeTypes.Feature),
  ]),
  createRoute("Liquidity", "/liquidity", routeTypes.Feature),
  createRoute("Powerdrops", "/airdrops", routeTypes.Feature, { hidden: true }),
  createRoute("Evangelize", "/evangelize", routeTypes.Feature, {
    hidden: true,
  }),
  createRoute("Tokenomics", "/tokenomics", routeTypes.Info),
  createRoute("Resources", "/resources", routeTypes.Info),
  createRoute(
    "Community",
    "https://warpcast.com/~/channel/farther",
    routeTypes.Info,
    { external: true },
  ),
  createRoute("API Docs", "/docs/api", routeTypes.Dev),
];

type RouteMap<T extends Route[]> = {
  [K in T[number]["title"] as K extends string
    ? K extends infer U
      ? U extends string
        ? U
        : never
      : never
    : never]: Route & {
    subroutes: RouteMap<
      NonNullable<Extract<T[number], { title: K }>["subroutes"]>
    >;
  };
};

// Convert routes array to nested object
const createRouteMap = <T extends Route[]>(routes: T): RouteMap<T> => {
  const map = {} as any;

  routes.forEach((route) => {
    if (route.external) {
      return;
    }

    const { path, subroutes = [], ...rest } = route;

    const key = path.split("/").pop() || path;

    map[key] = { ...rest, path, subroutes: createRouteMap(subroutes) };
  });

  return map;
};

// Create the nested routes object
export const routes = createRouteMap(routesTree);
