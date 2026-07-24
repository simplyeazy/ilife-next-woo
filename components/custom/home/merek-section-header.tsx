"use client";

import { motion } from "framer-motion";

export function MerekSectionHeader() {
  return (
    <motion.div
      className="text-center mb-10"
      initial={{ opacity: 0, y: -10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-3xl font-normal text-gray-800 dark:text-gray-200 mb-4">
        Merek & Peralatan Produksi
      </h2>
      <p className="text-muted-foreground">
        Dukungan teknologi terbaik dari merek Videotron global serta jajaran mesin produksi signage{" "}
        berteknologi tinggi yang kami gunakan untuk menjamin kualitas setiap proyek.
      </p>
    </motion.div>
  );
}