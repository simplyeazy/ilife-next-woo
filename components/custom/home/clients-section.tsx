// CUSTOM: replaced manufacturer brands with client logos to match original ilife.co.id

import { getClients } from "@/lib/custom/clients";
import { BrandsScrollClient } from "./brands-scroll-client";

export async function ClientsSection() {
  const clients = await getClients();
  if (clients.length === 0) return null;

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-5xl mx-auto px-6">
        {/* Centered heading with separator */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-normal text-gray-800 mb-4">
            Klien kami 
          </h2>
          <hr className="w-12 border-t-2 border-gray-400 mx-auto" />
        </div>
        <BrandsScrollClient clients={clients} autoScroll={clients.length > 6} />
      </div>
    </section>
  );
}
