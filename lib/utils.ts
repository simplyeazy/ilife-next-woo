import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// CUSTOM: In dev/Docker the Next.js image optimizer can't fetch docker-internal
// URLs (SSRF protection blocks private IPs). Use unoptimized in non-production.
export const wcImagesUnoptimized = process.env.NODE_ENV !== "production";
