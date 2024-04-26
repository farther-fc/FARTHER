import React from "react";

export const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = React.useState(0);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const updatePosition = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener("scroll", updatePosition);
    updatePosition();
    return () => window.removeEventListener("scroll", updatePosition);
  }, []);

  return scrollPosition;
};
