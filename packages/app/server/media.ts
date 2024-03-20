import { protectedProcedure } from "./trpc"
import { S3Client } from "@aws-sdk/client-s3"
import { createPresignedPost } from "@aws-sdk/s3-presigned-post"
import { apiSchemas } from "@lib/apiSchemas"
import { S3_BUCKET_NAME } from "@lib/constants"

const client = new S3Client({ region: "us-west-1" })

export const getSignedUploadParams = protectedProcedure
  .input(apiSchemas.getSignedUploadParams)
  .mutation(async (opts) => {
    const encodedFileName = encodeURIComponent(opts.input.fileName)
    const nonce = Math.floor(Math.random() * 10000000)
    const uploadKey = `user-uploads/${opts.ctx.session.user.id}/${opts.input.mediaType}/${nonce}-${encodedFileName}`

    const data = await createPresignedPost(client, {
      Bucket: S3_BUCKET_NAME,
      Key: uploadKey,
      Fields: {
        key: uploadKey,
        success_action_status: "201",
      },
      Expires: 240, // seconds
    })

    return {
      uploadKey,
      url: data.url,
      fields: data.fields,
    }
  })
