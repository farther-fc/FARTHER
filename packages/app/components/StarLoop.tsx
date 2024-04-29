import { useMediaQuery } from "@lib/context/MediaQueryContext";

export function StarLoop() {
  const { isLaptop } = useMediaQuery();

  return (
    <>
      <div
        className={`absolute left-1/2 top-0 z-[-1] ${isLaptop ? "min-h-[1200px]" : "min-h-[1000px]"} w-screen max-w-[1500px] -translate-x-1/2`}
      >
        <video
          className="absolute size-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={"/videos/landing-page-loop.mp4"} type="video/mp4" />
        </video>
        {/* overlay */}
        <div className={`landing-page-star-fade absolute inset-0`} />
      </div>
      {/* spacer */}
      <div className="min-h-[calc(100vh-64px)]" />
    </>
  );
}
