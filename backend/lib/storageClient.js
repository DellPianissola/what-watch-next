import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const client = new S3Client({
  endpoint: process.env.MINIO_ENDPOINT,
  region: 'us-east-1',
  credentials: {
    accessKeyId:     process.env.MINIO_ACCESS_KEY,
    secretAccessKey: process.env.MINIO_SECRET_KEY,
  },
  forcePathStyle: true, // obrigatório para MinIO
})

const BUCKET = process.env.MINIO_BUCKET ?? 'whatchu'

export const uploadFile = async (key, buffer, contentType) => {
  await client.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key:    key,
    Body:   buffer,
    ContentType: contentType,
    ACL: 'public-read',
  }))
  return `${process.env.MINIO_PUBLIC_URL}/${BUCKET}/${key}`
}
