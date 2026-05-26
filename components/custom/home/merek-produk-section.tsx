import { getWCBrands } from "@/lib/custom/merek";
import { MerekScrollClient } from "./merek-scroll-client";
import { Section, Container } from "@/components/craft";

export async function MerekProdukSection() {
  const brands = await getWCBrands();
  if (brands.length === 0) return null;

  return (
    <Section>
      <Container>
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Merek Produk</h2>
          <p className="text-muted-foreground">
            Merek-merek layar LED beserta komponen pendukungnya yang kami pakai
            dan jual.
          </p>
        </div>
        <MerekScrollClient brands={brands} autoScroll={false} />
      </Container>
    </Section>
  );
}
