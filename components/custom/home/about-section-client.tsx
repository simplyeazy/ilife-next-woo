"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { motion, Variants } from "framer-motion";
import type { AboutData } from "@/lib/custom/about";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 15, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 120, damping: 14 },
  },
};

export function AboutSectionClient({ data }: { data: AboutData }) {
  return (
    <section className="md:py-12 py-16">
      <div className="max-w-5xl mx-auto px-6">
        {/* Centered heading with separator */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-3xl font-normal text-gray-800 dark:text-gray-100 mb-4">
            {data.title}
          </h2>
          <hr className="w-12 border-t-2 border-gray-400 dark:border-gray-500 mx-auto" />
        </motion.div>

        {/* Two-column body */}
        <motion.div
          className="grid md:grid-cols-2 gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {/* Left: intro + checkmarks */}
          <motion.div variants={itemVariants}>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              {data.paragraph_1}
            </p>
            <ul className="space-y-4">
              {data.highlights.map((line, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3"
                >
                  <Check className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">{line}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right: company description + CTA */}
          <motion.div variants={itemVariants}>
            <p className="text-gray-700 dark:text-gray-300 mb-8">{data.paragraph_2}</p>
            <Link
              href={data.button_url}
              className="inline-block border border-[#1565C0] dark:border-blue-400 text-[#1565C0] dark:text-blue-400 hover:bg-[#1565C0] dark:hover:bg-blue-400 hover:text-white px-8 py-2.5 rounded-full text-sm font-medium transition-colors duration-200"
            >
              {data.button_text}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}