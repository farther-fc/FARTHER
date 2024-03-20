import { uploadFile } from "@lib/helpers"
import { trpcClient } from "@lib/trpcClient"
import { MediaType } from "@farther/db"

export function getS3SafeKeyName(name: string) {
  return name.replace(/[^0-9a-zA-Z!\-_\.\*\`]/gi, "_")
}

export async function uploadFileAndReturnKey({
  file,
  mediaType,
  mutation,
}: {
  file: File
  mediaType: MediaType
  mutation: ReturnType<typeof trpcClient.getSignedUploadParams.useMutation>
}): Promise<string> {
  // TODO: TRPC mutation goes here
  const params = await mutation.mutateAsync({
    fileName: getS3SafeKeyName(file.name),
    mediaType,
  })

  if (!params) {
    throw new Error("Missing signed upload params")
  }

  const s3Res = await uploadFile({
    file,
    url: params.url,
    fields: params.fields,
  })
  if (s3Res.status != 201) {
    // eslint-disable-next-line no-console
    console.error(s3Res)
    throw new Error("S3 media upload failed")
  }

  return params.uploadKey
}

// // 10MB Chunk for Multipart Upload
// const CHUNK_SIZE = 10_000_000
// const THROTTLE_INTERVAL = 200

// const SignPartReturn = z.object({
//   url: z.string(),
// })

// const ProcessedParts = z.array(
//   z.object({
//     ETag: z.string(),
//     PartNumber: z.number(),
//   })
// )

// export async function uploadMultipartFile({
//   file,
//   mediaType,
//   client,
//   setProgress,
// }: {
//   file: File;
//   mediaType: MediaType;
//   client: ApolloClient<any>;
//   setProgress: (bytes: number) => void;
// }) {
//   const fileSize = file.size;
//   const numChunks = Math.ceil(fileSize / CHUNK_SIZE);

//   const createUploadData = await client.mutate({
//     mutation: CreateMultipartUploadDocument,
//     variables: {
//       input: { fileName: getS3SafeKeyName(file.name), mediaType, totalPartsCount: numChunks },
//     },
//   });

//   if (
//     createUploadData.data?.createMultipartUpload.__typename !==
//     'MutationCreateMultipartUploadSuccess'
//   ) {
//     throw new Error(
//       createUploadData.data?.createMultipartUpload.message ?? 'Error creating upload',
//     );
//   }

//   const urls = createUploadData.data?.createMultipartUpload?.data?.signedUrls.map(url => url.url);
//   const uploadId = createUploadData.data?.createMultipartUpload?.data?.uploadId;
//   const uploadKey = createUploadData.data?.createMultipartUpload?.data?.uploadKey;

//   const uppy = new Uppy();

//   uppy.use(AwsS3Multipart, {
//     createMultipartUpload: () => Promise.resolve({ uploadId, key: uploadKey }),
//     getChunkSize: () => CHUNK_SIZE,
//     // @ts-expect-error: The return value of signPart is not typed correctly
//     signPart: (_, partData) => {
//       const partUrl = SignPartReturn.safeParse({ url: urls[partData.partNumber - 1] ?? '' });
//       if (!partUrl.success) throw new Error('Invalid part URL');
//       return partUrl.data;
//     },
//     completeMultipartUpload: async (_, { uploadId, key, parts }) => {
//       const filteredParts = ProcessedParts.safeParse(
//         parts.filter(part => !!part.ETag && !!part.PartNumber),
//       );
//       if (!filteredParts.success) throw new Error('Invalid parts');
//       const processedParts = filteredParts.data
//         .sort((partA, partB) => partA.PartNumber - partB.PartNumber)
//         .map(part => ({
//           etag: part.ETag,
//           partNumber: part.PartNumber,
//         }));

//       const completeUploadData = await client.mutate({
//         mutation: CompleteMultipartUploadDocument,
//         variables: {
//           input: {
//             uploadId,
//             uploadKey: key,
//             parts: processedParts,
//           },
//         },
//       });
//       if (
//         completeUploadData.data?.completeMultipartUpload.__typename !==
//         'MutationCompleteMultipartUploadSuccess'
//       ) {
//         throw new Error(
//           completeUploadData.data?.completeMultipartUpload.message ?? 'Error completing upload',
//         );
//       }
//       return {};
//     },
//   });

//   uppy.on(
//     'upload-progress',
//     throttle((_, progress) => {
//       setProgress(progress.bytesUploaded);
//     }, THROTTLE_INTERVAL),
//   );

//   uppy.addFile({ name: file.name, type: file.type, data: file });
//   await uppy.upload();
//   uppy.close();
//   return uploadKey;
// }

// export function getS3SafeKeyName(name: string) {
//   return name.replace(/[^0-9a-zA-Z!\-_\.\*\`]/gi, '_');
// }
