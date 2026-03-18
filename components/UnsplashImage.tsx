"use client";

import Image from "next/image";

interface UnsplashImageProps {
  src: string;
  alt: string;
  photographerName: string;
  photographerUrl: string;
  className?: string;
  aspectRatio?: string;
  sizes?: string;
  priority?: boolean;
}

export default function UnsplashImage({
  src,
  alt,
  photographerName,
  photographerUrl,
  className,
  aspectRatio,
  sizes = "100vw",
  priority = false,
}: UnsplashImageProps) {
  return (
    <div
      className={`group relative overflow-hidden ${className ?? ""}`}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      <Image
        src={src}
        alt={alt}
        fill
        unoptimized
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />

      <div
        className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent px-3 pb-2 pt-6
          opacity-100 transition-opacity duration-200
          md:opacity-0 md:group-hover:opacity-100"
      >
        <p className="text-xs text-white/70">
          Photo by{" "}
          <a
            href={photographerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white"
          >
            {photographerName}
          </a>{" "}
          on{" "}
          <a
            href="https://unsplash.com/?utm_source=craftmypage&utm_medium=referral"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white"
          >
            Unsplash
          </a>
        </p>
      </div>
    </div>
  );
}
