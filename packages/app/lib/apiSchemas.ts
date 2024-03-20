import { MediaType } from "@farther/db"
import { z } from "zod"

export const apiSchemas = {
  setProfileImageUrl: z.object({
    imageUrl: z.string().trim().url(),
  }),
  setProfileImage: z.object({
    uploadKey: z.string(),
  }),
  getSignedUploadParams: z.object({
    fileName: z.string(),
    mediaType: z.nativeEnum(MediaType),
  }),
}
