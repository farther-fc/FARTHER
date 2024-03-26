import { createContainer } from "@lib/context/unstated";
import { debounce } from "underscore";
import React from "react";
import { useMedia } from "use-media";

export const mediaQueries = {
  mobile: "(min-width: 340px)",
  isMobile: "(max-width: 430px)",
  isTabletSm: "(min-width: 768px)",
  isTablet: "(min-width: 1024px)",
  isTabletLandscape: "(min-width: 1160px)",
  isLaptop: "(min-width: 1440px)",
  isDesktop: "(min-width: 1920px)",
  isDesktopLg: "(pointer: coarse)",
  darkMode: "(prefers-color-scheme: dark)",
  prefersReducedMotion: "(prefers-reduced-motion: reduce)",
};

const MediaQueryContext = createContainer(function useMediaQuery() {
  const [hasAppMounted, setHasAppMounted] = React.useState(false);
  const isMobile = useMedia(mediaQueries.mobile);
  const isTabletSm = useMedia(mediaQueries.isTabletSm);
  const isTablet = useMedia(mediaQueries.isTablet);
  const isTabletLandscape = useMedia(mediaQueries.isTabletLandscape);
  const isLaptop = useMedia(mediaQueries.isLaptop);
  const isDesktop = useMedia(mediaQueries.isDesktop);
  const isDesktopLg = useMedia(mediaQueries.isDesktopLg);
  const [windowSize, setWindowSize] = React.useState(getSize);

  function getSize() {
    const dimensions = {
      width: 0,
      height: 0,
    };

    if (typeof window === "undefined") return dimensions;

    dimensions.width = window.innerWidth;
    dimensions.height = window.innerHeight;

    return dimensions;
  }

  React.useEffect(() => {
    setHasAppMounted(true);

    const handleResizeDebounced = debounce(function handleResize() {
      setWindowSize(getSize());
    }, 250);

    window.addEventListener("resize", handleResizeDebounced);
    return () => window.removeEventListener("resize", handleResizeDebounced);
  }, []);

  return {
    isMobile,
    isTabletSm,
    isTablet,
    isTabletLandscape,
    isLaptop,
    isDesktop,
    isDesktopLg,
    hasAppMounted,
    windowSize,
  };
});

export const useMediaQuery = MediaQueryContext.useContainer;

export const MediaQueryProvider = MediaQueryContext.Provider;
