"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import type { SlideData } from "@/lib/custom/slides";

export function HeroCarouselClient({ slides }: { slides: SlideData[] }) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;
    const interval = setInterval(() => api.scrollNext(), 5000);
    return () => clearInterval(interval);
  }, [api]);

  React.useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  return (
    <div className="relative w-full" aria-roledescription="carousel">
      <Carousel setApi={setApi} opts={{ loop: true, align: "start" }} className="w-full">
        <CarouselContent className="-ml-0">
          {slides.map((slide, i) => (
            <CarouselItem key={slide.id} className="pl-0">
              <div className="relative w-full h-[70vh] min-h-[420px] flex items-center bg-gradient-to-br from-blue-950 to-slate-900">
                {slide.imageUrl && (
                  <Image
                    src={slide.imageUrl}
                    alt={slide.title}
                    fill
                    sizes="100vw"
                    quality={75}
                    priority={i === 0}
                    // Explicitly flag the first image for highest network priority
                    fetchPriority={i === 0 ? "high" : "auto"}
                    // Dropped opacity slightly to guarantee text contrast
                    className="object-cover opacity-30"
                  />
                )}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                  }}
                />
                <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
                  {/* Added drop-shadow to guarantee WCAG compliance against any background image */}
                  <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight max-w-2xl mb-6 drop-shadow-lg">
                    {slide.title}
                  </h1>
                  {/* Increased base opacity to 95 and added shadow */}
                  <p className="text-lg md:text-xl text-white/95 max-w-xl mb-8 drop-shadow-md">
                    {slide.subtitle}
                  </p>
                  <Link
                    href={slide.ctaUrl}
                    className="inline-block border border-[#1565C0] text-[#1565C0] hover:bg-[#1565C0] hover:text-white px-8 py-2.5 rounded-full text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-950"
                  >
                    {slide.ctaText}
                  </Link>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <button
          onClick={() => api?.scrollPrev()}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => api?.scrollNext()}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </Carousel>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => api?.scrollTo(i)}
            className="p-2 flex items-center justify-center focus:outline-none group"
            aria-label={`Go to slide ${i + 1}`}
          >
            <span
              className={`block h-2.5 rounded-full transition-all group-focus:ring-2 group-focus:ring-white group-focus:ring-offset-1 group-focus:ring-offset-transparent ${i === current ? "bg-white w-6" : "bg-white/50 w-2.5"
                }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}