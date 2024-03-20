import "@styles/globals.css"
import { TemporaryPasswordWrapper } from "@components/TemporaryPasswordWrapper"
import { GlobalModal } from "@components/modals/GlobalModal"
import { SiteHeader } from "@components/nav/SiteHeader"
import { Toaster } from "@components/ui/Toaster"
import { MediaQueryProvider } from "@lib/context/MediaQueryContext"
import { ModalProvider } from "@lib/context/ModalContext"
import { ThemeProvider } from "@lib/context/ThemeProvider"
import { trpcClient } from "@lib/trpcClient"
import type { AppProps } from "next/app"
import React from "react"

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <TemporaryPasswordWrapper>
        <MediaQueryProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <ModalProvider>
                <Toaster />
                <SiteHeader />
                <GlobalModal />
                <Component {...pageProps} />
              </ModalProvider>
            </ThemeProvider>
        </MediaQueryProvider>
    </TemporaryPasswordWrapper>
  )
}

export default trpcClient.withTRPC(App)
