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
  Headset,
  History,
  PaintbrushVertical,
  Palette,
  PlugZap,
  ScissorsLineDashed,
  SlidersHorizontal,
  Smile,
  Sprout,
  Star,
  Tv2,
} from "lucide-react";

const features = [
  { icon: Component, label: "Suku Cadang Terjamin", color: "text-red-500 bg-red-50 dark:bg-red-950/30" },
  { icon: PlugZap, label: "Tahan Tegangan Rendah", color: "text-orange-500 bg-orange-50 dark:bg-orange-950/30" },
  { icon: Gem, label: "Berkualitas", color: "text-amber-500 bg-amber-50 dark:bg-amber-950/30" },
  { icon: Gauge, label: "Pengerjaan Cepat", color: "text-yellow-500 bg-yellow-50 dark:bg-yellow-950/30" },
  { icon: Sprout, label: "Ramah Lingkungan", color: "text-lime-500 bg-lime-50 dark:bg-lime-950/30" },
  { icon: Banknote, label: "Harga Terjangkau", color: "text-green-500 bg-green-50 dark:bg-green-950/30" },
  { icon: Activity, label: "IC PWM Berkualitas", color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30" },
  { icon: CheckSquare, label: "Bebas Cacat Piksel", color: "text-teal-500 bg-teal-50 dark:bg-teal-950/30" },
  { icon: CloudSunRain, label: "Tahan Cuaca", color: "text-cyan-500 bg-cyan-50 dark:bg-cyan-950/30" },
  { icon: BadgeCheck, label: "Produk Bergaransi", color: "text-sky-500 bg-sky-50 dark:bg-sky-950/30" },
  { icon: Tv2, label: "Gambar Jernih", color: "text-blue-500 bg-blue-50 dark:bg-blue-950/30" },
  { icon: SlidersHorizontal, label: "Dapat Dikustomisasi", color: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/30" },
  { icon: PaintbrushVertical, label: "Printer Premium", color: "text-violet-500 bg-violet-50 dark:bg-violet-950/30" },
  { icon: Palette, label: "Warna Cetak Akurat", color: "text-purple-500 bg-purple-50 dark:bg-purple-950/30" },
  { icon: ScissorsLineDashed, label: "Potongan dan Finishing Rapi", color: "text-fuchsia-500 bg-fuchsia-50 dark:bg-fuchsia-950/30" },
  { icon: Smile, label: "Lebih dari 1000 pelanggan puas", color: "text-pink-500 bg-pink-50 dark:bg-pink-950/30" },
  { icon: Star, label: "Berpengalaman lebih dari 10 tahun", color: "text-rose-500 bg-rose-50 dark:bg-rose-950/30" },
  { icon: Headset, label: "Purnajual yang baik", color: "text-slate-500 bg-slate-50 dark:bg-slate-950/30" },
  { icon: History, label: "Sejarah dan Reputasi yang Baik", color: "text-gray-500 bg-gray-50 dark:bg-gray-950/30" },
  { icon: Earth, label: "Melayani seluruh Indonesia", color: "text-olive-500 bg-olive-50 dark:bg-olive-950/30" }
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

          <h2 className="text-3xl font-normal text-gray-800 dark:text-gray-200 mb-4">Fitur</h2>
          <hr className="w-12 border-t-2 border-gray-400 dark:border-gray-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Kenapa anda perlu menggunakan produk kami?</p>
        </motion.div>

        {/* Grid pembungkus kartu dengan Framer Motion */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
          variants={containerVariants}
          initial="hidden"          // Ensure this matches your variants definition
          whileInView="visible"     // Triggers the opacity switch
          viewport={{ once: true, amount: 0.1 }} // Triggers as soon as 10% of the grid enters the screen
        >
          {features.map(({ icon: Icon, label, color }, index) => (
            <motion.div
              key={`${label}-${index}`}
              variants={itemVariants}
              whileHover="hover"
              className="relative bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 flex items-center gap-3 cursor-pointer select-none origin-center"
              style={{ backfaceVisibility: "hidden" }}
            >
              {/* Box Ikon menggunakan konfigurasi iconVariants berkualifikasi tipe */}
              <motion.div
                variants={iconVariants}
                className={`${color} rounded-md p-2 shrink-0 flex items-center justify-center`}
              >
                <Icon className="w-5 h-5" />
              </motion.div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-tight z-10">
                {label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </Section>
  );
}

