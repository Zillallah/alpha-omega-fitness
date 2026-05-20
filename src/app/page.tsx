import Hero from "@/components/sections/Hero";
import Manifesto from "@/components/sections/Manifesto";
import Coaches from "@/components/sections/Coaches";
import Programs from "@/components/sections/Programs";
import Schedule from "@/components/sections/Schedule";

export default function Home() {
  return (
    <main>
      <Hero />
      <Manifesto />
      <Coaches />
      <Programs />
      <Schedule />
      {/* Batch 4: Stories + Trial CTA + Pricing */}
      {/* Batch 5: FAQ + Footer */}
    </main>
  );
}
