"use client";

// CUSTOM: trust/credibility strip, split out of FeaturesSection.
// These are social-proof claims, not product features, so they get
// their own visual treatment: quantifiable ones as big-number stats,
// qualitative ones as small trust badges. Place this near testimonials
// or just above the footer — not inside the product Fitur grid.

import { Container, Section } from "@/components/craft";
import { motion, Variants } from "framer-motion";
import { Earth, Headset, History } from "lucide-react";

type Badge = {
  icon: typeof Headset;
  label: string;
  description: string;
};

// Qualitative claims — no honest number attached, shown as trust badges instead.
const badges: Badge[] = [
  {
    icon: Headset,
    label: "Purnajual Responsif",
    description: "Dukungan teknis tersedia setelah instalasi selesai",
  },
  {
    icon: History,
    label: "Reputasi Terpercaya",
    description: "Dipercaya instansi pemerintah hingga bisnis swasta",
  },
  {
    icon: Earth,
    label: "Melayani Seluruh Indonesia",
    description: "Pengerjaan dan pengiriman ke berbagai kota di Indonesia",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden: { y: 15, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 120, damping: 14 },
  },
};

export function TrustStatsSection() {
  return (
    <Section className="py-16 bg-gray-50 dark:bg-gray-900">
      <Container>
        {/* Qualitative trust badges */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="text-3xl font-normal text-gray-800 dark:text-gray-200 mb-4">
            Komitmen kami
          </h2>
          <hr className="w-12 border-t-2 border-gray-400 dark:border-gray-500 mx-auto mb-4" />

          {badges.map(({ icon: Icon, label, description }) => (
            <motion.div
              key={label}
              variants={itemVariants}
              className="flex items-start gap-3 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-4"
            >
              <div className="shrink-0 rounded-md p-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                <Icon className="w-5 h-5" />
              </div>
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
      </Container>
    </Section>
  );
}