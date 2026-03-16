'use client'

import { useState, useRef, useCallback } from 'react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface UploadedImage {
  url: string
  filename: string
}

interface ImageUploadProps {
  siteId: string
  onUpload: (url: string) => void
  maxImages?: number
  existingImages?: UploadedImage[]
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ImageUpload({
  siteId,
  onUpload,
  maxImages = 20,
  existingImages = [],
}: ImageUploadProps) {
  const [images, setImages] = useState<UploadedImage[]>(existingImages)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // -----------------------------------------------------------------------
  // Upload handler
  // -----------------------------------------------------------------------

  const uploadFile = useCallback(
    async (file: File) => {
      if (images.length >= maxImages) {
        setError(`Maximum ${maxImages} images reached`)
        return
      }

      // Client-side validation
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
      if (!allowedTypes.includes(file.type)) {
        setError('Invalid file type. Allowed: jpg, png, webp, gif')
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        setError('File too large. Maximum size is 5 MB')
        return
      }

      setError(null)
      setIsUploading(true)
      setUploadProgress(0)

      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('siteId', siteId)

        // Use XMLHttpRequest for progress tracking
        const result = await new Promise<{ url: string; filename: string }>(
          (resolve, reject) => {
            const xhr = new XMLHttpRequest()

            xhr.upload.addEventListener('progress', (e) => {
              if (e.lengthComputable) {
                setUploadProgress(Math.round((e.loaded / e.total) * 100))
              }
            })

            xhr.addEventListener('load', () => {
              if (xhr.status >= 200 && xhr.status < 300) {
                resolve(JSON.parse(xhr.responseText))
              } else {
                const errBody = JSON.parse(xhr.responseText)
                reject(new Error(errBody.error || 'Upload failed'))
              }
            })

            xhr.addEventListener('error', () => reject(new Error('Upload failed')))

            xhr.open('POST', '/api/upload')
            xhr.send(formData)
          },
        )

        const newImage: UploadedImage = { url: result.url, filename: result.filename }
        setImages((prev) => [...prev, newImage])
        onUpload(result.url)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed')
      } finally {
        setIsUploading(false)
        setUploadProgress(0)
      }
    },
    [images.length, maxImages, onUpload, siteId],
  )

  // -----------------------------------------------------------------------
  // Delete handler
  // -----------------------------------------------------------------------

  const handleDelete = useCallback(
    async (image: UploadedImage) => {
      try {
        const res = await fetch('/api/upload', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: image.filename, siteId }),
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Delete failed')
        }

        setImages((prev) => prev.filter((img) => img.filename !== image.filename))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Delete failed')
      }
    },
    [siteId],
  )

  // -----------------------------------------------------------------------
  // Drag and drop handlers
  // -----------------------------------------------------------------------

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const files = Array.from(e.dataTransfer.files)
      if (files.length > 0) {
        uploadFile(files[0])
      }
    },
    [uploadFile],
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files && files.length > 0) {
        uploadFile(files[0])
      }
      // Reset the input so the same file can be selected again
      if (inputRef.current) {
        inputRef.current.value = ''
      }
    },
    [uploadFile],
  )

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        disabled={isUploading}
        className={`
          w-full rounded-lg border-2 border-dashed p-8
          text-center transition-colors cursor-pointer
          ${isDragging
            ? 'border-blue-500 bg-blue-500/10'
            : 'border-gray-600 hover:border-gray-400 bg-gray-800/50'
          }
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileSelect}
          className="hidden"
        />

        {isUploading ? (
          <div className="space-y-2">
            <p className="text-sm text-gray-400">Uploading...</p>
            <div className="mx-auto w-48 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500">{uploadProgress}%</p>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-300">
              Drag images here or click to browse
            </p>
            <p className="text-xs text-gray-500 mt-1">
              JPG, PNG, WebP or GIF. Max 5 MB.
            </p>
          </div>
        )}
      </button>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      {/* Image count */}
      <p className="text-xs text-gray-500">
        {images.length} of {maxImages} images
      </p>

      {/* Thumbnails */}
      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((image) => (
            <div
              key={image.filename}
              className="group relative aspect-square rounded-lg overflow-hidden bg-gray-800"
            >
              <img
                src={image.url}
                alt=""
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => handleDelete(image)}
                className="
                  absolute top-1 right-1 h-6 w-6 rounded-full
                  bg-black/70 text-white text-xs
                  opacity-0 group-hover:opacity-100 transition-opacity
                  flex items-center justify-center
                  hover:bg-red-600
                "
                title="Delete image"
              >
                X
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
