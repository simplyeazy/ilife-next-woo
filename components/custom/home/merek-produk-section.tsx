import { getWCBrands } from "@/lib/custom/merek";
import { MerekScrollClient } from "./merek-scroll-client";
import { Section, Container } from "@/components/craft";

export async function MerekProdukSection() {
  const brands = await getWCBrands();
  if (brands.length === 0) return null;

  return (
    <Section>
      <Container>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-normal text-gray-800 mb-4">Merek & Peralatan Produksi</h2>
          <p className="text-muted-foreground">
            Dukungan teknologi terbaik dari merek Videotron global serta jajaran mesin produksi signage 
            berteknologi tinggi yang kami gunakan untuk menjamin kualitas setiap proyek.
          </p>
        </div>
        <MerekScrollClient brands={brands} autoScroll={false} />
      </Container>
    </Section>
  );
}
