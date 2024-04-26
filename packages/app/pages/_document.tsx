import { fontSans } from "@lib/fonts";
import { cn } from "@lib/utils";
import { useScrollPosition } from "hooks/useScrollPosition";
import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" className="dark">
      <Head />
      <body
        className={cn(
          "min-h-screen overflow-x-hidden font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
