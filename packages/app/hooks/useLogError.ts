import { networkNames } from "@common/constants";
import { defaultChainId } from "@common/env";
import * as Sentry from "@sentry/nextjs";
import type { SeverityLevel } from "@sentry/nextjs";
import { useLatestRef } from "hooks/useLatestRef";
import { useStableCallback } from "hooks/useStableCallback";
import { useToast } from "hooks/useToast";
import React from "react";

type LogErrorProps = {
  error: any;
  capture?: boolean;
  extra?: Record<string, unknown>;
  toastDuration?: number;
  level?: SeverityLevel;
};

export const REQUEST_REJECTED_TOAST_MESSAGE = "Request rejected in wallet.";

export function useLogError({
  error,
  ...restOptions
}: Partial<LogErrorProps> = {}) {
  const { toast } = useToast();
  const errorOptions = useLatestRef(restOptions);

  const logError = useStableCallback(
    ({
      error,
      capture = true,
      extra,
      toastDuration = 5000,
      level,
    }: LogErrorProps) => {
      // eslint-disable-next-line no-console
      console.error(error);

      const errMessage =
        typeof error === "string"
          ? error
          : error?.message || "Something went wrong";

      // https://eips.ethereum.org/EIPS/eip-1193#provider-errors
      if (
        error?.code === 4001 ||
        !!errMessage.match(
          /(user|signing transaction was|signing was) (rejected|denied|cancel)/gi,
        )
      ) {
        toast({
          description: REQUEST_REJECTED_TOAST_MESSAGE,
          variant: "error",
          duration: toastDuration,
        });
        return;
      }

      if (error?.message?.includes("Unsupported chain id")) {
        toast({
          description: `Please connect your wallet to ${networkNames[defaultChainId]}`,
          variant: "error",
          duration: toastDuration,
        });
        return;
      }

      if (capture) {
        console.log("sending error to sentry");
        Sentry.captureException(
          error instanceof Error ? error : new Error(JSON.stringify(error)),
          {
            extra,
            level,
          },
        );
      }
    },
  );

  React.useEffect(() => {
    if (error) logError({ error, ...errorOptions.current });
  }, [error, errorOptions, logError]);

  return logError;
}
