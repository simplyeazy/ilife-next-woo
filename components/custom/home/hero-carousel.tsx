import { getSlides } from "@/lib/custom/slides";
import type { SlideData } from "@/lib/custom/slides";
import { HeroCarouselClient } from "./hero-carousel-client";

const FALLBACK_SLIDES: SlideData[] = [
  { id: 1, title: "Indoor Fixed LED Display", subtitle: "Tampilan jernih, warna vivid, cocok untuk ruang indoor Anda", imageUrl: null, ctaText: "Lihat Produk Indoor", ctaUrl: "/shop" },
  { id: 2, title: "Outdoor LED Videotron", subtitle: "Tahan cuaca, cerah, dan bertenaga tinggi untuk kebutuhan outdoor", imageUrl: null, ctaText: "Lihat Produk Outdoor", ctaUrl: "/shop" },
  { id: 3, title: "Solusi Periklanan & Pertunjukan", subtitle: "Lebih dari 4 tahun pengalaman melayani klien di seluruh nusantara", imageUrl: null, ctaText: "Tentang Kami", ctaUrl: "/pages/tentang-kami" },
];

export async function HeroCarousel() {
  const slides = await getSlides();
  return <HeroCarouselClient slides={slides.length ? slides : FALLBACK_SLIDES} />;
}