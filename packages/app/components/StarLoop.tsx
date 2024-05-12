import { useMediaQuery } from "@lib/context/MediaQueryContext";
import Image from "next/image";
import React from "react";

export function StarLoop() {
  const { isTabletLandscape, isLaptop } = useMediaQuery();
  const [isLoaded, setIsLoaded] = React.useState(false);

  return (
    <>
      <div
        className={`absolute left-1/2 top-0 z-[-1] ${isLaptop ? "min-h-[1200px]" : isTabletLandscape ? "min-h-[1000px]" : "min-h-[900px]"} w-screen max-w-[1500px] -translate-x-1/2`}
      >
        <Image
          src="/images/landing-page-placeholder.png"
          layout="fill"
          objectFit="cover"
          alt="Farther Arch logo"
        />
        <video
          className={`absolute size-full object-cover ${isLoaded ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}
          autoPlay
          muted
          loop
          playsInline
          onPlay={() => setIsLoaded(true)}
        >
          <source src={"/videos/star-loop-final.mp4"} type="video/mp4" />
        </video>
        {/* overlay */}
        <div className={`landing-page-star-fade absolute inset-0`} />
      </div>
      {/* spacer */}
      <div className="min-h-[calc(100vh-64px)]" />
    </>
  );
}
