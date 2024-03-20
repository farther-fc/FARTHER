import { ImageFileUpload } from "@components/image/ImageFileUpload"
import { uploadFileAndReturnKey } from "@lib/s3"
import { trpcClient } from "@lib/trpcClient"
import { MediaType } from "@farther/db"
import { useLogError } from "hooks/useLogError"
import React from "react"

function ProfileImageModal({
  setPending,
}: {
  setPending: (pending: boolean) => void
}) {
  const utils = trpcClient.useUtils()
  const getParams = trpcClient.getSignedUploadParams.useMutation()
  const setProfileImage = trpcClient.setProfileImage.useMutation()
  const logError = useLogError()
  const isPending = getParams.isPending || setProfileImage.isPending

  React.useEffect(() => {
    setPending(isPending)
  }, [setPending, isPending])

  const saveImage = async (imageFile: File) => {
    try {
      const uploadKey = await uploadFileAndReturnKey({
        file: imageFile,
        mediaType: MediaType.USER_AVATAR,
        mutation: getParams,
      })

      await setProfileImage.mutateAsync({
        uploadKey,
      })

      await utils.getAuthenticatedUser.invalidate()
    } catch (error) {
      logError({
        error:
          "There was a problem uploading your cover photo. Please try again.",
      })
    }
  }

  const setFileError = (error: any) => {
    if (error?.code === "file-invalid-type") {
      logError({
        error,
      })
    }
  }

  return (
    <>
      <ImageFileUpload
        modalTitle="Profile image"
        setFileError={setFileError}
        saveImageMutation={saveImage}
      />
    </>
  )
}

export default ProfileImageModal
