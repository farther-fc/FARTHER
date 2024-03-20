"use client"

import { ROUTES } from "@lib/config"
import { NEXT_PUBLIC_PRIVY_APP_ID } from "@lib/env"
import { PrivyProvider as WrappedProvider } from "@privy-io/react-auth"
import { useRouter } from "next/navigation"

export function PrivyProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  return (
    <WrappedProvider
      appId={NEXT_PUBLIC_PRIVY_APP_ID}
      onSuccess={() => router.push(ROUTES.dashboard.path)}
    >
      {children}
    </WrappedProvider>
  )
}
