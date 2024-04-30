require("dotenv").config();
import DisableScroll from "@components/ComingSoon";
import { SEO, SeoData } from "@components/SEO";
import { StarLoop } from "@components/StarLoop";
import { GlobalModal } from "@components/modals/GlobalModal";
import { Footer } from "@components/nav/Footer";
import { SiteHeader } from "@components/nav/SiteHeader";
import { Toaster } from "@components/ui/Toaster";
import { isProduction } from "@farther/common";
import { LiquidityProvider } from "@lib/context/LiquidityContext";
import { MediaQueryProvider } from "@lib/context/MediaQueryContext";
import { ModalProvider } from "@lib/context/ModalContext";
import { ThemeProvider } from "@lib/context/ThemeProvider";
import { UserProvider } from "@lib/context/UserContext";
import { trpcClient } from "@lib/trpcClient";
import { wagmiConfig } from "@lib/walletConfig";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import "@styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import React from "react";
import { WagmiProvider } from "wagmi";

// Setup queryClient
const queryClient = new QueryClient();

const App = ({ Component, pageProps }: AppProps<{ seo: SeoData }>) => {
  const [pw, setPw] = React.useState<string>("");
  const router = useRouter();

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setPw(localStorage.getItem("pw") || "");
    }
  }, [setPw]);

  return (
    <>
      <SEO
        asPath={router.asPath}
        title={pageProps.seo.title}
        description={pageProps.seo.description}
      />
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <UserProvider>
              <LiquidityProvider>
                <MediaQueryProvider>
                  <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                  >
                    {isProduction && pw !== "letmein" ? (
                      <DisableScroll>
                        <StarLoop />
                      </DisableScroll>
                    ) : (
                      <ModalProvider>
                        <Toaster />
                        <SiteHeader />
                        <GlobalModal />
                        <Component {...pageProps} />
                        <Footer />
                      </ModalProvider>
                    )}
                  </ThemeProvider>
                </MediaQueryProvider>
              </LiquidityProvider>
            </UserProvider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </>
  );
};

export default trpcClient.withTRPC(App);
