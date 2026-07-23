"use client";

// CUSTOM: reworked ilife.co.id feature section — grouped by category,
// each item now carries a one-line benefit instead of a bare label.
// NOTE: the 5 credibility items that used to live in this grid
// (pelanggan puas, pengalaman, purnajual, reputasi, cakupan nasional)
// have been REMOVED from here — they're social proof, not product
// features, and belong in a separate stats/trust strip component
// (e.g. <TrustStatsSection />) placed near testimonials or the footer.

import { Container, Section } from "@/components/craft";
import { motion, Variants } from "framer-motion";
import {
  Activity,
  Banknote,
  BadgeCheck,
  CheckSquare,
  CloudSunRain,
  Component,
  Gauge,
  Gem,
  PaintbrushVertical,
  Palette,
  PlugZap,
  ScissorsLineDashed,
  SlidersHorizontal,
  Sprout,
  Tv2,
} from "lucide-react";

type Feature = {
  icon: typeof Component;
  label: string;
  description: string;
  color: string;
};

type FeatureCategory = {
  title: string;
  items: Feature[];
};

const featureCategories: FeatureCategory[] = [
  {
    title: "Kualitas Produk",
    items: [
      {
        icon: Gem,
        label: "Berkualitas",
        description: "Material dan komponen pilihan untuk hasil tahan lama",
        color: "text-amber-500 bg-amber-50 dark:bg-amber-950/30",
      },
      {
        icon: Activity,
        label: "IC PWM Berkualitas",
        description: "Kecerahan stabil dan warna akurat dari segala sudut",
        color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30",
      },
      {
        icon: CheckSquare,
        label: "Bebas Cacat Piksel",
        description: "Setiap unit diperiksa menyeluruh sebelum dikirim",
        color: "text-teal-500 bg-teal-50 dark:bg-teal-950/30",
      },
      {
        icon: Tv2,
        label: "Gambar Jernih",
        description: "Resolusi tinggi, tajam di siang maupun malam hari",
        color: "text-blue-500 bg-blue-50 dark:bg-blue-950/30",
      },
      {
        icon: Palette,
        label: "Warna Cetak Akurat",
        description: "Reproduksi warna presisi untuk hasil cetak signage",
        color: "text-purple-500 bg-purple-50 dark:bg-purple-950/30",
      },
      {
        icon: PaintbrushVertical,
        label: "Printer Premium",
        description: "Mesin cetak kelas industri untuk hasil profesional",
        color: "text-violet-500 bg-violet-50 dark:bg-violet-950/30",
      },
    ],
  },
  {
    title: "Ketahanan & Layanan",
    items: [
      {
        icon: PlugZap,
        label: "Tahan Tegangan Rendah",
        description: "Tetap stabil meski tegangan listrik naik turun",
        color: "text-orange-500 bg-orange-50 dark:bg-orange-950/30",
      },
      {
        icon: CloudSunRain,
        label: "Tahan Cuaca",
        description: "Didesain untuk pemakaian outdoor sepanjang tahun",
        color: "text-cyan-500 bg-cyan-50 dark:bg-cyan-950/30",
      },
      {
        icon: Sprout,
        label: "Ramah Lingkungan",
        description: "Konsumsi daya rendah, hemat listrik jangka panjang",
        color: "text-lime-500 bg-lime-50 dark:bg-lime-950/30",
      },
      {
        icon: Component,
        label: "Suku Cadang Terjamin",
        description: "Ketersediaan komponen pengganti selalu terjaga",
        color: "text-red-500 bg-red-50 dark:bg-red-950/30",
      },
      {
        icon: Gauge,
        label: "Pengerjaan Cepat",
        description: "Proses produksi dan instalasi yang efisien",
        color: "text-yellow-500 bg-yellow-50 dark:bg-yellow-950/30",
      },
      {
        icon: BadgeCheck,
        label: "Produk Bergaransi",
        description: "Perlindungan garansi resmi untuk setiap pembelian",
        color: "text-sky-500 bg-sky-50 dark:bg-sky-950/30",
      },
      {
        icon: Banknote,
        label: "Harga Terjangkau",
        description: "Kualitas setara industri dengan harga kompetitif",
        color: "text-green-500 bg-green-50 dark:bg-green-950/30",
      },
    ],
  },
  {
    title: "Kustomisasi & Finishing",
    items: [
      {
        icon: SlidersHorizontal,
        label: "Dapat Dikustomisasi",
        description: "Ukuran, bentuk, dan desain sesuai kebutuhan anda",
        color: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/30",
      },
      {
        icon: ScissorsLineDashed,
        label: "Potongan dan Finishing Rapi",
        description: "Detail presisi di setiap sisi dan sambungan produk",
        color: "text-fuchsia-500 bg-fuchsia-50 dark:bg-fuchsia-950/30",
      },
    ],
  },
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
    transition: { type: "spring", stiffness: 120, damping: 14 },
  },
  hover: {
    scale: 1.02,
    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.06)",
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
};

const iconVariants: Variants = {
  hover: {
    scale: 1.15,
    rotate: 15,
    transition: { type: "spring", stiffness: 300, damping: 10 },
  },
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
          <h2 className="text-3xl font-normal text-gray-800 dark:text-gray-200 mb-4">
            Fitur
          </h2>
          <hr className="w-12 border-t-2 border-gray-400 dark:border-gray-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Kenapa anda perlu menggunakan produk kami?
          </p>
        </motion.div>

        <div className="space-y-12">
          {featureCategories.map((category) => (
            <div key={category.title}>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-5">
                {category.title}
              </h3>

              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
              >
                {category.items.map(({ icon: Icon, label, description, color }) => (
                  <motion.div
                    key={label}
                    variants={itemVariants}
                    whileHover="hover"
                    className="relative bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-4 flex items-start gap-3 cursor-default select-none"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <motion.div
                      variants={iconVariants}
                      className={`${color} rounded-md p-2 shrink-0 flex items-center justify-center`}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-tight">
                        {label}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-snug">
                        {description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}