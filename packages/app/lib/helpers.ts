import { CLOUDFRONT_URI } from "@lib/constants"
import type { Area } from "react-easy-crop"

// Validates image is above minimum dimensions
export function validateImageDimensions(
  file: File,
  requiredMinH = 0,
  requiredMinW = 0
) {
  return new Promise((resolve: (respose: boolean) => void) => {
    const img = new Image()
    img.src = URL.createObjectURL(file)
    img.onload = () => {
      const { height, width } = img
      if (height < requiredMinH || width < requiredMinW) {
        resolve(false)
      }
      resolve(true)
    }
  })
}

export function validateImageAspectRatio(file: File, ratio: number) {
  return new Promise((resolve: (respose: boolean) => void) => {
    const img = new Image()
    img.src = URL.createObjectURL(file)
    img.onload = () => {
      const { height, width } = img
      if (width / height !== ratio) {
        resolve(false)
      }
      resolve(true)
    }
  })
}

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener("load", () => resolve(image))
    image.addEventListener("error", (error) => reject(error))
    image.setAttribute("crossOrigin", "Anonymous")
    image.src = url
  })

export const getCroppedImage = async ({
  imageSrc,
  crop,
}: {
  imageSrc: string
  crop: Area
}): Promise<Blob | null> => {
  const image = await createImage(imageSrc)
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")

  /* setting canvas width & height allows us to
    resize from the original image resolution */
  canvas.width = 1000
  canvas.height = (canvas.width * crop.height) / crop.width

  ctx?.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    canvas.width,
    canvas.height
  )

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob)
    }, "image/jpeg")
  })
}

export function hasCommonStrings(array1: string[], array2: string[]) {
  // Loop for array1
  for (let i = 0; i < array1.length; i++) {
    // Loop for array2
    for (let j = 0; j < array2.length; j++) {
      // Compare the element of each and
      // every element from both of the
      // arrays
      if (array1[i] === array2[j]) {
        // Return if common element found
        return true
      }
    }
  }

  // Return if no common element exist
  return false
}

export function arrayBufferToString(buffer: ArrayBuffer) {
  return String.fromCharCode.apply(null, [...new Uint16Array(buffer)])
}

export function uploadFile({
  file,
  url,
  fields,
}: {
  file: File
  url: string
  fields: any
}) {
  const formData = new FormData()

  Object.entries({ ...fields, file }).forEach(([key, value]) => {
    formData.append(key, value as string)
  })

  return fetch(url, {
    method: "POST",
    body: formData,
  })
}

export function getImageUrl(key: string) {
  return `https://${CLOUDFRONT_URI}/${key}`
}
