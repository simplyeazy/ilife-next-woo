// CUSTOM: replaced manufacturer brands with client logos to match original ilife.co.id
// Stats (pelanggan puas / tahun pengalaman) merged in here instead of a
// separate TrustStatsSection — same bg-gray-50 band, so it reads as one
// continuous credibility argument: claim -> number -> proof (logos).
// Static markup (no framer-motion) since this stays a server component
// for the getClients() fetch.

import { getClients } from "@/lib/custom/clients";
import { BrandsScrollClient } from "./brands-scroll-client";
import { Smile, Star } from "lucide-react";

const stats = [
  {
    icon: Smile,
    value: "1000+",
    label: "Pelanggan Puas",
  },
  {
    icon: Star,
    value: "10+",
    label: "Tahun Pengalaman",
  },
];

export async function ClientsSection() {
  const clients = await getClients();
  if (clients.length === 0) return null;

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-6">
        {/* Centered heading with separator */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-normal text-gray-800 dark:text-gray-100 mb-4">
            Klien kami
          </h2>
          <hr className="w-12 border-t-2 border-gray-400 dark:border-gray-500 mx-auto" />
        </div>

        {/* Credibility stats */}
        <div className="grid grid-cols-2 gap-6 max-w-xs mx-auto mb-12">
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex flex-col items-center text-center">
              <Icon className="w-5 h-5 text-gray-400 dark:text-gray-500 mb-2" />
              <div className="text-3xl font-semibold text-gray-800 dark:text-gray-100 tabular-nums">
                {value}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {label}
              </div>
            </div>
          ))}
        </div>

        <BrandsScrollClient clients={clients} autoScroll={clients.length > 6} />
      </div>
    </section>
  );
}