import { ROOT_ENDPOINT } from "@lib/constants";
import Head from "next/head";
import colors from "tailwindcss/colors";

export type SeoData = {
  asPath: string;
  title: string;
  description: string;
};

const DEFAULT_OG_IMAGE = "/images/opengraph-img.png";

const APP_NAME = "FARTHER✨";

export function SEO(seo: SeoData) {
  const renderedTitle = seo.title ? `${seo.title} | FARTHER✨` : "FARTHER✨";
  const renderedDescription =
    seo?.description || "The tokenized community of Farcaster evangelists.";
  const currentUrl = `${ROOT_ENDPOINT}${seo.asPath}`;

  return (
    <Head>
      <title>{renderedTitle}</title>
      <meta name="og:site_name" content={APP_NAME} />
      <meta name="application-name" content={APP_NAME} />

      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={APP_NAME} />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="theme-color" content={colors.sky[700]} />

      <meta name="robots" content="index,follow" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta charSet="utf-8" />
      <meta name="description" content={renderedDescription} />

      <link rel="canonical" href={currentUrl} />
      <meta property="og:url" content={currentUrl} />

      <meta property="og:title" content={renderedTitle} />
      <meta property="og:description" content={renderedDescription} />

      <meta property="og:image" content={DEFAULT_OG_IMAGE} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@gigamesh" />
      <meta name="twitter:creator" content="@gigamesh" />
      <meta name="twitter:title" content={renderedTitle} />
      <meta name="twitter:description" content={renderedDescription} />
      <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />

      {/** Used by google */}
      <script
        key="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebContent",
            about: renderedDescription,
            image: DEFAULT_OG_IMAGE,
            name: "Gigamesh",
            creator: [
              {
                "@type": "Person",
                name: "Gigamesh",
              },
            ],
          }),
        }}
      ></script>

      {/*  https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/preconnect */}
      <link rel="preconnect" href={ROOT_ENDPOINT} />
    </Head>
  );
}
