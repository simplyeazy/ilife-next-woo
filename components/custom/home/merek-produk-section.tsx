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
          <h2 className="text-3xl font-normal text-gray-800 mb-4">Merek Produk</h2>
          <p className="text-muted-foreground">
            Merek-merek Videotron beserta komponen pendukungnya yang kami pakai
            dan jual.
          </p>
        </div>
        <MerekScrollClient brands={brands} autoScroll={false} />
      </Container>
    </Section>
  );
}
