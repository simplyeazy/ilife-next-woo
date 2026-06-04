"use client";

import { useState } from "react";
import Image from "next/image";
import { PlayCircle } from "lucide-react";

import type { ProductImage } from "@/lib/woocommerce.d";
import { cn, wcImagesUnoptimized } from "@/lib/utils"; // CUSTOM: wcImagesUnoptimized bypasses SSRF in dev

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
  /** Optional video URL: YouTube, Vimeo, or direct .mp4/.webm/.ogg */
  videoUrl?: string;
}

// VIDEO_INDEX is a sentinel value meaning "the video thumbnail is selected"
const VIDEO_INDEX = -1;

type ParsedVideo =
  | { type: "youtube" | "vimeo"; embedUrl: string }
  | { type: "direct"; src: string };

function parseVideoUrl(url: string): ParsedVideo | null {
  // Reject non-http(s) schemes
  if (!/^https?:\/\//i.test(url)) return null;

  // YouTube
  const yt = url.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/
  );
  if (yt) {
    return {
      type: "youtube",
      embedUrl: `https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1&rel=0`,
    };
  }

  // Vimeo
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) {
    return {
      type: "vimeo",
      embedUrl: `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1`,
    };
  }

  // Direct video file
  if (/\.(mp4|webm|ogg)(\?[^#]*)?$/i.test(url)) {
    return { type: "direct", src: url };
  }

  return null;
}

export function ProductGallery({ images, productName, videoUrl }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const parsedVideo = videoUrl ? parseVideoUrl(videoUrl) : null;
  const isVideoSelected = selectedIndex === VIDEO_INDEX;
  const hasMedia = (images && images.length > 0) || parsedVideo;

  if (!hasMedia) {
    return (
      <div className="aspect-square bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
        Tidak ada gambar tersedia
      </div>
    );
  }

  const showThumbnails = (images && images.length > 1) || (images && images.length >= 1 && parsedVideo);

  return (
    <div className="flex flex-col gap-4">
      {/* Main display */}
      <div
        className={cn(
          "relative overflow-hidden rounded-lg border bg-muted",
          isVideoSelected ? "aspect-video" : "aspect-square"
        )}
      >
        {isVideoSelected && parsedVideo ? (
          parsedVideo.type === "direct" ? (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <video
              src={parsedVideo.src}
              controls
              autoPlay
              className="w-full h-full object-contain"
            />
          ) : (
            <iframe
              src={parsedVideo.embedUrl}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
              title={`${productName} video`}
            />
          )
        ) : images && images.length > 0 ? (
          <Image
            src={images[selectedIndex]?.src ?? images[0].src}
            alt={images[selectedIndex]?.alt || productName}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            unoptimized={wcImagesUnoptimized}
          />
        ) : null}
      </div>

      {/* Thumbnails */}
      {showThumbnails && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images?.map((image, index) => (
            <button
              key={`${image.id}-${index}`}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                "relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all",
                selectedIndex === index
                  ? "border-primary"
                  : "border-transparent hover:border-muted-foreground/50"
              )}
            >
              <Image
                src={image.src}
                alt={image.alt || `${productName} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
                unoptimized={wcImagesUnoptimized}
              />
            </button>
          ))}

          {/* Video thumbnail */}
          {parsedVideo && (
            <button
              onClick={() => setSelectedIndex(VIDEO_INDEX)}
              className={cn(
                "relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all bg-black flex items-center justify-center",
                isVideoSelected
                  ? "border-primary"
                  : "border-transparent hover:border-muted-foreground/50"
              )}
              aria-label="Putar video produk"
            >
              <PlayCircle className="text-white w-8 h-8" />
            </button>
          )}
        </div>
      )}

      {/* Single image + video: show video thumbnail even without multi-image thumbnails */}
      {!showThumbnails && parsedVideo && images && images.length === 0 && (
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedIndex(VIDEO_INDEX)}
            className={cn(
              "relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all bg-black flex items-center justify-center",
              isVideoSelected
                ? "border-primary"
                : "border-transparent hover:border-muted-foreground/50"
            )}
            aria-label="Putar video produk"
          >
            <PlayCircle className="text-white w-8 h-8" />
          </button>
        </div>
      )}
    </div>
  );
}
