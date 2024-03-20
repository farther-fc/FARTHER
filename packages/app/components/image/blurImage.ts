// https://github.com/gelicamarie/Wash/blob/73156eeff05b0defde575ba7499b542605ad111a/src/lib/blur-image.js
const shimmer = (w: number | string, h: number | string) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#DDDDDD" offset="0%" />
      <stop stop-color="#F9F9F9" offset="30%" />
      <stop stop-color="#DDDDDD" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#F9F9F9" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`

const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str)

export const blurImage = (w: number | string, h: number | string) =>
  `data:image/svg+xml;base64,${toBase64(shimmer(w, h))}`

export default blurImage
