import React from "react";

// Adapted from https://codepen.io/wikyware-net/pen/VwPeOeE

type Star = {
  x: number;
  y: number;
  z: number;
  px: number;
  py: number;
};

// setup aliases
const M = Math;
const Rnd = M.random;
// const Sin = M.sin;
// const Floor = M.floor;

export function StarField() {
  const ref = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    if (typeof window === "undefined" || !ref.current) return;

    // get dimensions of window and resize the canvas to fit
    const width = window.innerWidth;
    const height = window.innerHeight;
    const centerX = width / 2;
    const centerY = height / 2;
    ref.current.width = width;
    ref.current.height = height;

    // get 2d graphics context and set global alpha
    const context = ref.current.getContext("2d");
    if (!context) return;

    context.globalAlpha = 0.3;

    const stars: Star[] = [];

    // constants and storage for objects that represent star positions
    const warpZ = 10;
    const units = 500;
    const Z = 0.05;
    // const colorFreq = 0.3;
    // let cycle = 0;

    // function to reset a star object
    function resetstar(star: Star) {
      star.x = (Rnd() * width - width * 0.5) * warpZ;
      star.y = (Rnd() * height - height * 0.5) * warpZ;
      star.z = warpZ;
      star.px = 0;
      star.py = 0;
    }

    // initial star setup
    for (var i = 0; i < units; i++) {
      const star = {
        x: 0,
        y: 0,
        z: 0,
        px: 0,
        py: 0,
      };
      resetstar(star);
      stars.push(star);
    }

    // star rendering anim function
    setInterval(function () {
      // clear background
      context.fillStyle = "#000";
      context.fillRect(0, 0, width, height);

      // position to head towards
      const cx = centerX - width / 2 + width / 2;
      const cy = centerY - height / 2 + height / 2;

      // update all stars
      for (var i = 0; i < units; i++) {
        const star = stars[i]; // the star
        const xx = star.x / star.z; // star position
        const yy = star.y / star.z;
        const e = (2 / star.z) * 3 + 1; // size i.e. z
        // rgb colour from a sine wave
        // r = Sin(colorFreq * i + cycle) * 64 + 190,
        // g = Sin(colorFreq * i + 2 + cycle) * 64 + 190,
        // b = Sin(colorFreq * i + 4 + cycle) * 64 + 190;

        if (star.px != 0) {
          context.strokeStyle = "rgb(255,255,255)";
          // "rgb(" + Floor(r) + "," + Floor(g) + "," + Floor(b) + ")";
          context.lineWidth = e;
          context.beginPath();
          context.moveTo(xx + cx, yy + cy);
          context.lineTo(star.px + cx, star.py + cy);
          context.stroke();
        }

        // update star position values with new settings
        star.px = xx;
        star.py = yy;
        star.z -= Z;

        // reset when star is out of the view field
        if (star.z < Z || star.px > width || star.py > height) {
          // reset star
          resetstar(star);
        }
      }

      // colour cycle sinewave rotation
      // cycle += 0.1;
    }, 25);
  }, []);

  return <canvas className="h-screen w-screen" ref={ref} />;
}
