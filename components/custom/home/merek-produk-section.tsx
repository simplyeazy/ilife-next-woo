import { getWCBrands } from "@/lib/custom/merek";
import { MerekScrollClient } from "./merek-scroll-client";
import { MerekSectionHeader } from "./merek-section-header";
import { Section, Container } from "@/components/craft";

export async function MerekProdukSection() {
  const brands = await getWCBrands();
  if (brands.length === 0) return null;

  return (
    <Section>
      <Container>
        <MerekSectionHeader />
        <MerekScrollClient brands={brands} autoScroll={false} />
      </Container>
    </Section>
  );
}