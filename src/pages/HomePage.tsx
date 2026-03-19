import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroSection from "../sections/HeroSection";
import WhySection from "../sections/WhySection";
import SmartRoutingSection from "../sections/SmartRoutingSection";
import SafeHandlingSection from "../sections/SafeHandlingSection";
import ManifestoSection from "../sections/ManifestoSection";
import ServicesSection from "../sections/ServicesSection";
import LastMileSection from "../sections/LastMileSection";
import TrackingFeatureSection from "../sections/TrackingFeatureSection";
import FreightSection from "../sections/FreightSection";
import ReturnsSection from "../sections/ReturnsSection";
import SupportSection from "../sections/SupportSection";
import TestimonialsSection from "../sections/TestimonialsSection";
import ContactSection from "../sections/ContactSection";

const HomePage = () => {
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Global snap for pinned sections
    const setupGlobalSnap = () => {
      const shouldUseSnap = window.matchMedia(
        "(min-width: 1536px) and (prefers-reduced-motion: no-preference)",
      ).matches;
      if (!shouldUseSnap) return;

      ScrollTrigger.getById("global-pinned-snap")?.kill();

      const pinned = ScrollTrigger.getAll()
        .filter((st) => st.vars.pin)
        .sort((a, b) => a.start - b.start);

      const maxScroll = ScrollTrigger.maxScroll(window);
      if (!maxScroll || pinned.length === 0) return;

      const pinnedRanges = pinned.map((st) => ({
        start: st.start / maxScroll,
        end: (st.end ?? st.start) / maxScroll,
        center:
          (st.start + ((st.end ?? st.start) - st.start) * 0.5) / maxScroll,
      }));

      ScrollTrigger.create({
        id: "global-pinned-snap",
        snap: {
          snapTo: (value: number) => {
            const inPinned = pinnedRanges.some(
              (r) => value >= r.start - 0.02 && value <= r.end + 0.02,
            );
            if (!inPinned) return value;

            const target = pinnedRanges.reduce(
              (closest, r) =>
                Math.abs(r.center - value) < Math.abs(closest - value)
                  ? r.center
                  : closest,
              pinnedRanges[0]?.center ?? 0,
            );
            return target;
          },
          duration: { min: 0.1, max: 0.22 },
          delay: 0.04,
          ease: "power2.out",
        },
      });
    };

    // Delay to allow all section ScrollTriggers to initialize
    const timer = setTimeout(setupGlobalSnap, 500);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getById("global-pinned-snap")?.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (!st.vars.pin) st.kill();
      });
    };
  }, []);

  return (
    <main ref={mainRef} className="relative">
      <HeroSection className="z-[10]" />
      <WhySection className="z-[20]" />
      <SmartRoutingSection className="z-[30]" />
      <SafeHandlingSection className="z-[40]" />
      <ManifestoSection className="z-[50]" />
      <ServicesSection className="z-[60]" />
      <LastMileSection className="z-[70]" />
      <TrackingFeatureSection className="z-[80]" />
      <FreightSection className="z-[90]" />
      <ReturnsSection className="z-[100]" />
      <SupportSection className="z-[110]" />
      <TestimonialsSection className="z-[120]" />
      <ContactSection className="z-[130]" />
    </main>
  );
};

export default HomePage;
