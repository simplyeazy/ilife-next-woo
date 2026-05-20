// CUSTOM: replaced manufacturer brands with client logos to match original ilife.co.id

import { getClients } from "@/lib/custom/clients";
import { BrandsScrollClient } from "./brands-scroll-client";

export async function ClientsSection() {
  const clients = await getClients();
  if (clients.length === 0) return null;

  return (
    <section className="py-10 bg-gray-50">
      <div className="max-w-5xl mx-auto px-6">
        <BrandsScrollClient clients={clients} autoScroll={clients.length > 6} />
      </div>
    </section>
  );
}
