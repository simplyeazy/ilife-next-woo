import Image from "next/image";
import { cn } from "@/lib/utils";

interface ILifeLogoProps {
  className?: string;
  /** If provided, renders the WordPress-managed logo image instead of the SVG fallback. */
  src?: string;
  alt?: string;
}

export function ILifeLogo({ className, src, alt }: ILifeLogoProps) {
  if (src) {
    return (
      <div className={cn("flex items-center select-none", className)}>
        <Image
          src={src}
          alt={alt ?? "Logo"}
          height={40}
          width={160}
          className="h-10 w-auto object-contain"
          priority
        />
      </div>
    );
  }

  return (
    <div className={cn("flex items-center select-none", className)}>
      <svg
        viewBox="0 0 216 100"
        className="h-10 w-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="iLife Logo"
      >
        <defs>
          {/* Gradient for the 3D crescent shadow effect on the large outer circle */}
          <linearGradient id="ilife-sphere-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e4da1" />
            <stop offset="60%" stopColor="#1a4294" />
            <stop offset="100%" stopColor="#0b1b4f" />
          </linearGradient>

          {/* Mask to cut out the vertical white rectangle (stem of the "i") from the main sphere */}
          <mask id="ilife-stem-mask">
            {/* Everything white stays visible */}
            <rect width="216" height="100" fill="#ffffff" />
            {/* The vertical rectangle cut-out (rendered in black to hide this area) */}
            <rect x="36" y="24" width="16" height="52" fill="#000000" />
          </mask>
        </defs>

        {/* --- ICON PART --- */}
        <g id="ilife-icon">
          {/* Small top dot of the "i" */}
          <circle cx="44" cy="11" r="7.5" fill="#1e4da1" />

          {/* Main "i" circle body with the stem mask applied */}
          <circle
            cx="44"
            cy="54"
            r="38"
            fill="url(#ilife-sphere-gradient)"
            mask="url(#ilife-stem-mask)"
          />
        </g>

        {/* --- TYPOGRAPHY PART ("life") --- */}
        {/* Rendered using precise geometric paths to ensure consistent cross-browser rendering */}
        <g id="ilife-text" fill="#1e4da1">
          {/* "l" */}
          <path d="M103.5 24.5 h 7 v 51.5 h -7 z" />

          {/* "i" */}
          <circle cx="123" cy="28.5" r="3.5" />
          <path d="M119.5 37.5 h 7 v 38.5 h -7 z" />

          {/* "f" */}
          <path d="M141.5 37.5 h -4.5 v -5 c 0 -3.5 2 -5 5.5 -5 a 12 12 0 0 1 3.5 0.5 v -5.5 a 16 16 0 0 0 -4.5 -0.5 c -7.5 0 -11.5 4 -11.5 10.5 v 5 h -4 v 5.5 h 4 v 33 h 7 v -33 h 4.5 z" />

          {/* "e" */}
          <path d="M174.5 54.5 c 0 -12 -8.5 -17.5 -16.5 -17.5 c -9.5 0 -17.5 7.5 -17.5 19.5 c 0 11.5 8 19.5 18.5 19.5 c 6.5 0 12.5 -3 15.5 -7.5 l -5.5 -3.5 c -2.5 3 -5.5 5 -10 5 c -6 0 -10.5 -4.5 -11.5 -10.5 h 31.5 c 0 -1.5 0 -3.5 0 -5 z m -27 2.5 c 1 -5.5 4.5 -9.5 10.5 -9.5 c 5.5 0 9.5 3.5 9.5 9.5 z" />
        </g>
      </svg>
    </div>
  );
}
