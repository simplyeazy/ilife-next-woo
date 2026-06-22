"use client";

// CUSTOM: using original ilife.co.id horizontal card layout
import { Container, Section } from "@/components/craft";
import { motion, Variants } from "framer-motion";
import {
  Activity,
  BadgeCheck,
  Banknote,
  CheckSquare,
  CloudSunRain,
  Component,
  Earth,
  Gauge,
  Gem,
  PaintbrushVertical,
  Palette,
  PlugZap,
  ScissorsLineDashed,
  SlidersHorizontal,
  Smile,
  Sprout,
  Tv2,
} from "lucide-react";

const features = [
  { icon: Component, label: "Suku Cadang Terjamin", color: "text-red-500 bg-red-50" },
  { icon: PlugZap, label: "Tahan Brownouts", color: "text-orange-500 bg-orange-50" },
  { icon: Gem, label: "Berkualitas", color: "text-amber-500 bg-amber-50" },
  { icon: Gauge, label: "Pengerjaan Cepat", color: "text-yellow-500 bg-yellow-50" },
  { icon: Sprout, label: "Ramah Lingkungan", color: "text-lime-500 bg-lime-50" },
  { icon: Banknote, label: "Harga Terjangkau", color: "text-green-500 bg-green-50" },
  { icon: Activity, label: "IC PWM Berkualitas", color: "text-emerald-500 bg-emerald-50" },
  { icon: CheckSquare, label: "Bebas Cacat Pixel", color: "text-teal-500 bg-teal-50" },
  { icon: CloudSunRain, label: "Tahan Cuaca", color: "text-cyan-500 bg-cyan-50" },
  { icon: BadgeCheck, label: "Produk Bergaransi", color: "text-sky-500 bg-sky-50" },
  { icon: Tv2, label: "Gambar Jernih", color: "text-blue-500 bg-blue-50" },
  { icon: SlidersHorizontal, label: "Dapat Dikustomisasi", color: "text-indigo-500 bg-indigo-50" },
  { icon: PaintbrushVertical, label: "Cetakan Premium", color: "text-violet-500 bg-violet-50" },
  { icon: Palette, label: "Warna Cetak Akurat", color: "text-purple-500 bg-purple-50" },
  { icon: ScissorsLineDashed, label: "Potongan Rapi", color: "text-fuchsia-500 bg-fuchsia-50" },
  { icon: Smile, label: "Lebih dari 1000 pelanggan puas", color: "text-pink-500 bg-pink-50" },
  { icon: Earth, label: "Melayani seluruh Indonesia", color: "text-rose-500 bg-rose-50" },
  { icon: Gauge, label: "Pengerjaan Cepat", color: "text-slate-500 bg-slate-50" },
  { icon: BadgeCheck, label: "Produk Bergaransi", color: "text-gray-500 bg-gray-50" },
  { icon: Gem, label: "Berkualitas", color: "text-zinc-500 bg-zinc-50" },
  { icon: Banknote, label: "Harga Terjangkau", color: "text-neutral-500 bg-neutral-50" },
  { icon: CloudSunRain, label: "Tahan Cuaca", color: "text-stone-500 bg-stone-50" },
  { icon: PlugZap, label: "Tahan Brownouts", color: "text-taupe-500 bg-taupe-50" },
  { icon: CheckSquare, label: "Bebas Cacat Pixel", color: "text-mauve-500 bg-mauve-50" },
  { icon: Tv2, label: "Gambar Jernih", color: "text-mist-500 bg-mist-50" },
  { icon: Activity, label: "IC PWM Berkualitas", color: "text-olive-500 bg-olive-50" }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const itemVariants: Variants = {
  hidden: { y: 15, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { type: "spring", stiffness: 120, damping: 14 } 
  },
  hover: {
    scale: 1.02,
    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.06)",
    transition: { type: "spring", stiffness: 300, damping: 20 }
  }
};

// Menambahkan anotasi tipe Variants untuk validasi objek translasi spring
const iconVariants: Variants = {
  hover: { 
    scale: 1.15, 
    rotate: 15, 
    transition: { type: "spring", stiffness: 300, damping: 10 } 
  }
};

export function FeaturesSection() {
  return (
    <Section>
      <Container>
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-3xl font-normal text-gray-800 mb-4">Fitur</h2>
          <hr className="w-12 border-t-2 border-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Kenapa anda perlu menggunakan produk kami?</p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {features.map(({ icon: Icon, label, color }, index) => (
            <motion.div
              key={`${label}-${index}`}
              variants={itemVariants}
              whileHover="hover"
              className="relative bg-white border border-gray-200 rounded-lg px-4 py-3 flex items-center gap-3 cursor-pointer select-none origin-center"
              style={{ backfaceVisibility: "hidden" }}
            >
              {/* Box Ikon menggunakan konfigurasi iconVariants berkualifikasi tipe */}
              <motion.div 
                variants={iconVariants}
                className={`${color} rounded-md p-2 shrink-0 flex items-center justify-center`}
              >
                <Icon className="w-5 h-5" />
              </motion.div>

              <span className="text-sm font-medium text-gray-700 leading-tight z-10">
                {label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </Section>
  );
}
