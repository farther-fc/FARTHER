import { useRouter } from "next/router";
import React from "react";

export function StarLoop() {
  const router = useRouter();
  const currentPath = router.pathname;
  const isLandingPage = currentPath === "/";

  return (
    <div
      className={`${isLandingPage ? "absolute" : "fixed"} aspect-w-1 aspect-h-1 left-0 top-0 z-[-1] min-h-[1000px] w-screen`}
    >
      <video
        className="absolute size-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={"/videos/starloop-mp4.mp4"} type="video/mp4" />
      </video>
      {/* overlay */}
      <div
        className={`${isLandingPage ? "landing-page" : "default"}-star-fade absolute inset-0`}
      />
    </div>
  );
}
