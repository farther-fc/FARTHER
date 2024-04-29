import React from "react";

function DisableScroll({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      // Disable scroll
      document.body.style.overflow = "hidden";
    }
  }, []);

  return <>{children}</>;
}

export default DisableScroll;
