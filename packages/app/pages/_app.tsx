import "@styles/globals.css"
import { TemporaryPasswordWrapper } from "@components/TemporaryPasswordWrapper"
import { GlobalModal } from "@components/modals/GlobalModal"
import { SiteHeader } from "@components/nav/SiteHeader"
import { Toaster } from "@components/ui/Toaster"
import { MediaQueryProvider } from "@lib/context/MediaQueryContext"
import { ModalProvider } from "@lib/context/ModalContext"
import { PrivyProvider } from "@lib/context/PrivyProvider"
import { ThemeProvider } from "@lib/context/ThemeProvider"
import { UserProvider } from "@lib/context/UserContext"
import { trpcClient } from "@lib/trpcClient"
import type { AppProps } from "next/app"
import React from "react"

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <TemporaryPasswordWrapper>
      <PrivyProvider>
        <MediaQueryProvider>
          <UserProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <ModalProvider>
                <Toaster />
                <SiteHeader />
                <GlobalModal />
                <Component {...pageProps} />
              </ModalProvider>
            </ThemeProvider>
          </UserProvider>
        </MediaQueryProvider>
      </PrivyProvider>
    </TemporaryPasswordWrapper>
  )
}

export default trpcClient.withTRPC(App)
