import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

// ---------------------------------------------------------------------------
// R2 client (S3-compatible)
// ---------------------------------------------------------------------------

const R2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

const BUCKET = process.env.R2_BUCKET_NAME || 'craftmypage-uploads'
const PUBLIC_URL = process.env.R2_PUBLIC_URL || 'https://uploads.craftmypage.com'

// ---------------------------------------------------------------------------
// Upload
// ---------------------------------------------------------------------------

/**
 * Upload an image buffer to R2 and return the public URL.
 *
 * Files are stored under `{siteId}/{timestamp}-{filename}` to keep
 * per-site images grouped and avoid collisions.
 */
export async function uploadImage(
  file: Buffer,
  filename: string,
  contentType: string,
): Promise<string> {
  await R2.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: filename,
      Body: file,
      ContentType: contentType,
    }),
  )

  return `${PUBLIC_URL}/${filename}`
}

// ---------------------------------------------------------------------------
// Delete
// ---------------------------------------------------------------------------

/**
 * Delete an image from R2 by its key (the path portion after the public URL).
 */
export async function deleteImage(filename: string): Promise<void> {
  await R2.send(
    new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: filename,
    }),
  )
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Build a unique, collision-free key for an upload.
 *
 * Format: `{siteId}/{timestamp}-{sanitised-original-name}`
 */
export function buildImageKey(siteId: string, originalName: string): string {
  const sanitised = originalName
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]/g, '-')
    .replace(/-+/g, '-')

  return `${siteId}/${Date.now()}-${sanitised}`
}

/**
 * Extract the R2 key from a full public URL so it can be passed to deleteImage.
 */
export function keyFromUrl(url: string): string {
  return url.replace(`${PUBLIC_URL}/`, '')
}
