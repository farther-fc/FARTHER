require("dotenv").config();
import { SEO, SeoData } from "@components/SEO";
import { GlobalModal } from "@components/modals/GlobalModal";
import { Footer } from "@components/nav/Footer";
import { SiteHeader } from "@components/nav/SiteHeader";
import { Toaster } from "@components/ui/Toaster";
import { LiquidityProvider } from "@lib/context/LiquidityContext";
import { MediaQueryProvider } from "@lib/context/MediaQueryContext";
import { ModalProvider } from "@lib/context/ModalContext";
import { ThemeProvider } from "@lib/context/ThemeProvider";
import { TokenInfoProvider } from "@lib/context/TokenContext";
import { UserProvider } from "@lib/context/UserContext";
import { trpcClient } from "@lib/trpcClient";
import { wagmiConfig } from "@lib/walletConfig";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import "@styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { WagmiProvider } from "wagmi";

// Setup queryClient
const queryClient = new QueryClient();

const App = ({ Component, pageProps }: AppProps<{ seo: SeoData }>) => {
  const router = useRouter();

  return (
    <>
      <SEO
        asPath={router.asPath}
        title={pageProps.seo ? pageProps.seo.title : ""}
        description={pageProps.seo ? pageProps.seo.description : ""}
      />
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <TokenInfoProvider>
              <UserProvider>
                <LiquidityProvider>
                  <MediaQueryProvider>
                    <ThemeProvider
                      attribute="class"
                      defaultTheme="system"
                      enableSystem
                    >
                      <ModalProvider>
                        <Toaster />
                        <SiteHeader />
                        <GlobalModal />
                        <Component {...pageProps} />
                        <Footer />
                      </ModalProvider>
                    </ThemeProvider>
                  </MediaQueryProvider>
                </LiquidityProvider>
              </UserProvider>
            </TokenInfoProvider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </>
  );
};

export default trpcClient.withTRPC(App);
