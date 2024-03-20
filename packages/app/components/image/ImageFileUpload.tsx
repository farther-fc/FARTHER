import blurImage from "@components/image/blurImage"
import { ImageCropModal } from "@components/modals/ImageCropModal"
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_UPLOAD_FILE_SIZE_BYTES,
} from "@lib/constants"
import { useMediaQuery } from "@lib/context/MediaQueryContext"
import { useModal } from "@lib/context/ModalContext"
import { hasCommonStrings, validateImageDimensions } from "@lib/helpers"
import { useToast } from "hooks/useToast"
import { noop } from "lodash-es"
import { Camera } from "lucide-react"
import { filetypemime } from "magic-bytes.js"
import Image from "next/image"
import React, { useCallback, useState } from "react"
import { Accept, FileError, FileRejection, useDropzone } from "react-dropzone"

export const ImageFileUpload = React.forwardRef<
  HTMLDivElement,
  {
    modalTitle: string
    subText?: string
    instructions?: string
    blobURL?: string | null
    setBlobUrl?: (url: string | null) => void
    setFileError: (error: FileError | null) => void
    setSelectedFile?: (file: File) => void
    requiredMinH?: number
    requiredMinW?: number
    saveImageMutation?: (file: File) => Promise<void>
    setOnUpload?: boolean
  }
>(function ImageUploadModal(
  {
    modalTitle,
    instructions,
    blobURL,
    setBlobUrl,
    setFileError,
    setSelectedFile = noop,
    requiredMinH,
    requiredMinW,
    saveImageMutation,
    setOnUpload = true,
  },
  ref
) {
  const { openModal } = useModal()
  const [fileName, setFileName] = useState<string | null>(null)
  const { toast } = useToast()
  const { isTabletLandscape, isTablet } = useMediaQuery()

  const onDropRejected = useCallback(
    (fileRejections: FileRejection[]) => {
      setFileName(null)
      if (setBlobUrl) {
        setBlobUrl(null)
      }
      fileRejections[0]?.errors[0] && setFileError(fileRejections[0].errors[0])
    },
    [setBlobUrl, setFileError]
  )

  const onDropAccepted = useCallback(
    async (acceptedFiles: File[]) => {
      const acceptedImageExtensions = ACCEPTED_IMAGE_TYPES?.replaceAll(
        /[.,\s]/g,
        ""
      )
        ?.split("image/")
        ?.filter((extension) => extension) // filter out empty strings

      const file = acceptedFiles[0]
      if (!file) return

      const buffer = await file.arrayBuffer()
      const uint8Array = new Uint8Array(buffer)
      const mimeTypes = await filetypemime(uint8Array)

      if (
        mimeTypes.length &&
        !hasCommonStrings(ACCEPTED_IMAGE_TYPES.split(", "), mimeTypes)
      ) {
        toast({
          title: "Error",
          description: `Images can only be ${acceptedImageExtensions?.map(
            (extension, i) =>
              `${
                acceptedImageExtensions.length > 1 &&
                i === acceptedImageExtensions.length - 1
                  ? " or "
                  : " "
              }.${extension}`
          )}. Please try again.`,
          variant: "error",
        })
        return
      }

      const isValid = await validateImageDimensions(
        file,
        requiredMinH,
        requiredMinW
      )
      if (!isValid) {
        toast({
          description:
            "Image dimensions must be at least " +
            requiredMinW +
            "x" +
            requiredMinH +
            "px",
          variant: "error",
        })
        return
      }
      setSelectedFile(file)
      setFileName(file.name)

      const newBlobUrl = URL.createObjectURL(file)
      if (setOnUpload && setBlobUrl) setBlobUrl(newBlobUrl)

      openModal({
        headerText: modalTitle,
        body: (
          <ImageCropModal
            modalTitle={modalTitle}
            setBlob={(b: Blob | null) => {
              if (!b) return

              if (setBlobUrl) {
                setBlobUrl(URL.createObjectURL(b))
              }

              setSelectedFile(new File([b], fileName || "default"))
            }}
            blobURL={newBlobUrl}
            saveImageMutation={saveImageMutation}
          />
        ),
      })

      setFileError(null)
    },
    [
      requiredMinH,
      requiredMinW,
      setSelectedFile,
      setBlobUrl,
      setFileError,
      toast,
      openModal,
      modalTitle,
      saveImageMutation,
      fileName,
      setOnUpload,
    ]
  )

  const { getRootProps, getInputProps, open } = useDropzone({
    multiple: false,
    onDropAccepted,
    onDropRejected,
    accept: ACCEPTED_IMAGE_TYPES.split(", ").reduce((acc: Accept, cur) => {
      acc[cur] = []
      return acc
    }, {}),
    maxFiles: 1,
    maxSize: MAX_UPLOAD_FILE_SIZE_BYTES,
  })

  return (
    <div
      {...getRootProps({
        className:
          "dropzone items-center bg-muted border rounded-md cursor-pointer flex justify-center relative mt-4 w-full h-[310px] md:mt-6 md:h-[460px]",
      })}
    >
      <input {...getInputProps()} />
      {!blobURL ? (
        <div className="flex cursor-pointer flex-col items-center text-center">
          {!!modalTitle && <Camera size={40} className="mb-6" />}
          <span>
            {!!instructions ? (
              instructions
            ) : (
              <>
                Drop your image here <br />
                or click to select a file
              </>
            )}
            {!!requiredMinW &&
              !!requiredMinH &&
              " (" + requiredMinW + "px x " + requiredMinH + "px, png or jpeg)"}
          </span>
        </div>
      ) : (
        <Image
          src={blobURL}
          alt={blobURL}
          placeholder="blur"
          blurDataURL={blurImage(800, 400)}
          width={798}
          height={isTabletLandscape ? 165 : isTablet ? 400 : 210}
          objectFit="cover"
          style={{
            borderRadius: "6px",
          }}
        />
      )}
    </div>
  )
})
