require("dotenv").config();

import "@styles/globals.css";
import { GlobalModal } from "@components/modals/GlobalModal";
import { SiteHeader } from "@components/nav/SiteHeader";
import { Toaster } from "@components/ui/Toaster";
import { MediaQueryProvider } from "@lib/context/MediaQueryContext";
import { ModalProvider } from "@lib/context/ModalContext";
import { ThemeProvider } from "@lib/context/ThemeProvider";
import { trpcClient } from "@lib/trpcClient";
import type { AppProps } from "next/app";
import React from "react";
import Web3ModalProvider from "@lib/context/Web3ModalContext";
import { UserProvider } from "@lib/context/UserContext";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Web3ModalProvider>
      <UserProvider>
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
      </UserProvider>
    </Web3ModalProvider>
  );
};

export default trpcClient.withTRPC(App);
