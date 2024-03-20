import { useLatestRef } from "./useLatestRef"
import { useCallback } from "react"

export function useStableCallback<Cb extends (...args: any[]) => unknown>(
  cb: Cb
) {
  const latestCb = useLatestRef(cb)

  return useCallback<Cb>(
    // @ts-expect-error - we don't have strong types for useCallback
    (...args) => {
      return latestCb.current(...args)
    },
    [latestCb]
  )
}
