import { Client } from 'minio'

const client = new Client({
  endPoint:  process.env.MINIO_ENDPOINT_HOST ?? 'minio',
  port:      parseInt(process.env.MINIO_PORT ?? '9000'),
  useSSL:    process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
})

const BUCKET = process.env.MINIO_BUCKET ?? 'whatchu'

export const uploadFile = async (key, buffer, contentType) => {
  await client.putObject(BUCKET, key, buffer, buffer.length, { 'Content-Type': contentType })
  return `${process.env.MINIO_PUBLIC_URL}/${BUCKET}/${key}`
}
