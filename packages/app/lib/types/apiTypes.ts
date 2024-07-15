// @filename: client.ts
import type { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "pages/api/v1/[trpc]";

// type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;

export type GetUserOuput = RouterOutput["getUser"];

export type Alloocation = NonNullable<GetUserOuput>["allocations"][number];

export type LeaderboardRow =
  RouterOutput["public"]["tips"]["leaderboard"][number];

export type Tips = RouterOutput["public"]["tips"]["byTipper"]["tips"];
