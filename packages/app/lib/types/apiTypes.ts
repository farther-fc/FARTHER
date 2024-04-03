// @filename: client.ts
import type { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "pages/api/trpc/[trpc]";

// type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;

export type GetUserOuput = RouterOutput["getUser"];
