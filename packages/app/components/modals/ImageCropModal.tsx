import { Button } from "@components/ui/Button"
import { Slider } from "@components/ui/Slider"
import Spinner from "@components/ui/Spinner"
import { useMediaQuery } from "@lib/context/MediaQueryContext"
import { useModal } from "@lib/context/ModalContext"
import { getCroppedImage } from "@lib/helpers"
import { cn } from "@lib/utils"
import { useLogError } from "hooks/useLogError"
import React from "react"
import Cropper from "react-easy-crop"
import type { Area } from "react-easy-crop/types"

export const ImageCropModal = React.forwardRef<
  HTMLDivElement,
  {
    modalTitle?: string
    blobURL: string | null
    setBlob: (b: Blob | null) => void
    handleCloseAction?: () => void
    saveImageMutation?: (file: File) => Promise<void>
    closeOnUpload?: boolean
  }
>(function ImageCropModal(
  {
    modalTitle,
    blobURL,
    setBlob,
    handleCloseAction,
    saveImageMutation,
    closeOnUpload = false,
  },
  ref
) {
  // const { toast } = useToast()
  const { isTablet } = useMediaQuery()
  const [loading, setLoading] = React.useState(false)
  const { closeModal } = useModal()
  const [crop, setCrop] = React.useState({ x: 0, y: 0 })
  const [zoom, setZoom] = React.useState(1.2)
  const [croppedAreaPixels, setCroppedAreaPixels] = React.useState<Area>()
  const logError = useLogError()

  const onCropComplete = (_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }

  const handleSave = async () => {
    if (!croppedAreaPixels || !blobURL) {
      return
    }

    const croppedImage = await getCroppedImage({
      imageSrc: blobURL,
      crop: croppedAreaPixels,
    })
    setBlob(croppedImage)

    if (saveImageMutation && croppedImage) {
      const newImage = new File([croppedImage], "newImage.png", {
        type: "image/png",
      })

      if (closeOnUpload) {
        saveImageMutation(newImage)
      } else {
        setLoading(true)
        await saveImageMutation(newImage).catch((err) => {
          logError({ error: err?.message })
        })
      }
    }

    closeModal()
    handleCloseAction?.()
  }

  return loading ? (
    <div
      className={cn(cropperContainerStyles, "flex items-center justify-center")}
      ref={ref}
    >
      <Spinner />
    </div>
  ) : (
    <>
      <p>
        {isTablet
          ? "Drag the handle to resize the image."
          : "Drag your finger to resize the image."}
      </p>
      <div className={cropperContainerStyles} ref={ref}>
        <Cropper
          image={blobURL || ""}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
          objectFit={"contain"}
        />
      </div>
      <div className="mt-4 md:mt-6">
        <Slider
          aria-label="slider-zoom-image"
          value={[zoom]}
          max={5}
          min={1}
          step={0.1}
          onValueChange={(value) => setZoom(value[0])}
        />
      </div>
      <Button
        onClick={handleSave}
        className="mt-8"
        // TODO: Button loading state
        // loading={loading}
      >
        Save
      </Button>
    </>
  )
})

const cropperContainerStyles = "relative mt-4 h-[310px] md:mt-6 md:h-[460px]"
