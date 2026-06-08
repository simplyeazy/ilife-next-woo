// CUSTOM: using original ilife.co.id horizontal card layout
import { Container, Section } from "@/components/craft";
import {
  Activity,
  BadgeCheck,
  Banknote,
  CheckSquare,
  CloudSunRain,
  Component,
  Gauge,
  Gem,
  PlugZap,
  SlidersHorizontal,
  Sprout,
  Tv2,
} from "lucide-react";

const features = [
  { icon: Gauge, label: "Pengerjaan Cepat", color: "text-yellow-500 bg-yellow-50" },
  { icon: BadgeCheck, label: "Produk Bergaransi", color: "text-blue-500 bg-blue-50" },
  { icon: Gem, label: "Berkualitas", color: "text-amber-500 bg-amber-50" },
  { icon: Banknote, label: "Harga Terjangkau", color: "text-green-500 bg-green-50" },
  { icon: CloudSunRain, label: "Tahan Cuaca", color: "text-sky-500 bg-sky-50" },
  { icon: PlugZap, label: "Tahan Brownouts", color: "text-orange-500 bg-orange-50" },
  { icon: CheckSquare, label: "Bebas Cacat Pixel", color: "text-teal-500 bg-teal-50" },
  { icon: Tv2, label: "Gambar Jernih", color: "text-indigo-500 bg-indigo-50" },
  { icon: Activity, label: "IC PWM Berkualitas", color: "text-blue-600 bg-blue-50" },
  { icon: Component, label: "Suku Cadang Terjamin", color: "text-red-500 bg-red-50" },
  { icon: SlidersHorizontal, label: "Dapat Dikustomisasi", color: "text-gray-500 bg-gray-100" },
  { icon: Sprout, label: "Ramah Lingkungan", color: "text-emerald-500 bg-emerald-50" },
];

export function FeaturesSection() {
  return (
    <Section>
      <Container>
        {/* Centered heading matching original */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-normal text-gray-800 mb-4">Fitur</h2>
          <hr className="w-12 border-t-2 border-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Kenapa anda perlu menggunakan produk kami?</p>
        </div>
        {/* 4-col horizontal cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {features.map(({ icon: Icon, label, color }) => (
            <div
              key={label}
              className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex items-center gap-3 hover:shadow-sm transition-shadow"
            >
              <div className={`${color} rounded-md p-2 shrink-0`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-gray-700 leading-tight">{label}</span>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
