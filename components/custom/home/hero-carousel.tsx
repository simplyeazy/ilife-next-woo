import { getSlides } from "@/lib/custom/slides";
import type { SlideData } from "@/lib/custom/slides";
import { HeroCarouselClient } from "./hero-carousel-client";

const CDN = "https://d33wubrfki0l68.cloudfront.net";

const FALLBACK_SLIDES: SlideData[] = [
  {
    id: 1,
    title: "Indoor Fixed LED Display",
    subtitle: "Tampilan jernih, warna vivid, cocok untuk ruang indoor Anda",
    imageUrl: `${CDN}/a1915043cbb7ec93ec9dec242ef3c2a17f72043a/d5da9/static/74ea5e8a60109fadc4895bcc75759676/c11dd/carousel-1.jpg`,
    ctaText: "Lihat Produk Indoor",
    ctaUrl: "/shop",
  },
  {
    id: 2,
    title: "Outdoor LED Videotron",
    subtitle: "Tahan cuaca, cerah, dan bertenaga tinggi untuk kebutuhan outdoor",
    imageUrl: `${CDN}/f0c7d0548987212635905d45d3bc7a93cf4d27fd/aabc1/static/1d69e5c94079cb24163111d80ae0fe25/c11dd/carousel-2.jpg`,
    ctaText: "Lihat Produk Outdoor",
    ctaUrl: "/shop",
  },
  {
    id: 3,
    title: "Solusi Periklanan & Pertunjukan",
    subtitle: "Lebih dari 4 tahun pengalaman melayani klien di seluruh nusantara",
    imageUrl: `${CDN}/8c9df2f6736f6ac1419fb9883a704a06c635af33/b39a5/static/d11fd008e8ee1399984880a6b403c1fa/c11dd/carousel-3.jpg`,
    ctaText: "Tentang Kami",
    ctaUrl: "/tentang-kami",
  },
];

export async function HeroCarousel() {
  const slides = await getSlides();
  return <HeroCarouselClient slides={slides.length ? slides : FALLBACK_SLIDES} />;
}