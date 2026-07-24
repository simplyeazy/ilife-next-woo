import { getAboutData } from "@/lib/custom/about";
import { AboutSectionClient } from "./about-section-client";

export async function AboutSection() {
  const data = await getAboutData();
  if (!data) return null;

  return <AboutSectionClient data={data} />;
}