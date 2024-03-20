// https://github.com/chakra-ui/chakra-ui/blob/19e1532ec5a03b3b14a605f8a602d3a4e835db48/packages/hooks/src/use-latest-ref.ts
import { MutableRefObject, useRef } from "react"

/**
 * React hook to persist any value between renders,
 * but keeps it up-to-date if it changes.
 *
 * @param value the value or function to persist
 */
export function useLatestRef<T>(value: T) {
  const ref = useRef<T | null>(null)
  ref.current = value
  return ref as MutableRefObject<T>
}
