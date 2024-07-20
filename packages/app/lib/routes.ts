enum RouteType {
  User = "user",
  Feature = "feature",
  Info = "info",
  Dev = "dev",
}

interface Route {
  title: string;
  path: string;
  type: RouteType;
  hidden: boolean;
  external?: boolean;
  seoTitle?: string;
  description?: string;
}

const createRoute = (
  title: string,
  path: string,
  type: RouteType,
  {
    hidden = false,
    external = false,
    seoTitle,
    description,
  }: {
    hidden?: boolean;
    external?: boolean;
    seoTitle?: string;
    description?: string;
  } = { hidden: false, external: false },
): Route => ({
  title,
  path,
  type,
  hidden,
  external,
  seoTitle,
  description,
});

export const routes = {
  user: {
    profile: createRoute("Profile", "/user/profile", RouteType.User),
  },
  tips: {
    main: createRoute("Tips", "/tips", RouteType.Feature),
    leaderboard: createRoute(
      "Leaderboard",
      "/tips/leaderboard",
      RouteType.Feature,
    ),
    history: createRoute("History", "/tips/history", RouteType.Feature),
  },
  liquidity: {
    main: createRoute("Liquidity", "/liquidity", RouteType.Feature),
  },
  airdrops: {
    main: createRoute("Powerdrops", "/airdrops", RouteType.Feature),
  },
  evangelize: {
    main: createRoute("Evangelize", "/evangelize", RouteType.Feature),
  },
  info: {
    tokenomics: createRoute("Tokenomics", "/tokenomics", RouteType.Info),
    resources: createRoute("Resources", "/resources", RouteType.Info),
    community: createRoute(
      "Community",
      "https://warpcast.com/~/channel/farther",
      RouteType.Info,
      { external: true },
    ),
  },
  dev: {
    apiDocs: createRoute("API Docs", "/docs/api", RouteType.Dev),
  },
} as const;

type RouteDefinition = { [key: string]: Route | RouteDefinition };

interface FlatRoute extends Route {
  key: string;
}

const flattenRoutes = (
  routes: RouteDefinition,
  parentKey = "",
): FlatRoute[] => {
  const flatRoutes: FlatRoute[] = [];

  Object.entries(routes).forEach(([key, value]) => {
    const currentKey = parentKey ? `${parentKey}.${key}` : key;

    if ("path" in value) {
      flatRoutes.push({ ...value, key: currentKey } as FlatRoute);
    } else {
      flatRoutes.push(...flattenRoutes(value as RouteDefinition, currentKey));
    }
  });

  return flatRoutes;
};

export const flatRoutes = flattenRoutes(routes);
