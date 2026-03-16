import { NextRequest, NextResponse } from 'next/server'
import { auth0 } from '@/lib/auth0'
import { findOrCreateUser } from '@/lib/users'
import { prisma } from '@/lib/prisma'
import { uploadImage, deleteImage, buildImageKey, keyFromUrl } from '@/lib/r2'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB
const MAX_IMAGES_PER_SITE = 20
const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
])

// ---------------------------------------------------------------------------
// POST /api/upload — upload an image to R2
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  try {
    // Auth
    const session = await auth0.getSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const user = await findOrCreateUser(session.user)

    // Parse multipart form data
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const siteId = formData.get('siteId') as string | null

    if (!file || !siteId) {
      return NextResponse.json(
        { error: 'Missing required fields: file and siteId' },
        { status: 400 },
      )
    }

    // Verify user owns this site
    const site = await prisma.site.findFirst({
      where: { id: siteId, userId: user.id },
    })

    if (!site) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 })
    }

    // Validate file type
    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: jpg, png, webp, gif' },
        { status: 400 },
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5 MB' },
        { status: 400 },
      )
    }

    // Check image count for this site
    const existingCount = await prisma.siteImage.count({
      where: { siteId },
    })

    if (existingCount >= MAX_IMAGES_PER_SITE) {
      return NextResponse.json(
        { error: `Maximum ${MAX_IMAGES_PER_SITE} images per site` },
        { status: 400 },
      )
    }

    // Upload to R2
    const buffer = Buffer.from(await file.arrayBuffer())
    const key = buildImageKey(siteId, file.name)
    const url = await uploadImage(buffer, key, file.type)

    // Record in database
    await prisma.siteImage.create({
      data: {
        siteId,
        filename: key,
        url,
        size: file.size,
        contentType: file.type,
      },
    })

    return NextResponse.json({ url, filename: key })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

// ---------------------------------------------------------------------------
// DELETE /api/upload — delete an image from R2
// ---------------------------------------------------------------------------

export async function DELETE(req: NextRequest) {
  try {
    // Auth
    const session = await auth0.getSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const user = await findOrCreateUser(session.user)

    const body = await req.json()
    const { filename, siteId } = body as { filename?: string; siteId?: string }

    if (!filename || !siteId) {
      return NextResponse.json(
        { error: 'Missing required fields: filename and siteId' },
        { status: 400 },
      )
    }

    // Verify user owns this site
    const site = await prisma.site.findFirst({
      where: { id: siteId, userId: user.id },
    })

    if (!site) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 })
    }

    // Verify image belongs to this site
    const image = await prisma.siteImage.findFirst({
      where: { filename, siteId },
    })

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    // Delete from R2
    await deleteImage(filename)

    // Remove from database
    await prisma.siteImage.delete({ where: { id: image.id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete image error:', error)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
