import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { MapPin, ArrowRight } from "lucide-react";

interface WhySectionProps {
  className?: string;
}

const WhySection = ({ className = "" }: WhySectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const underlineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const isMobile = window.matchMedia("(max-width: 1023px)").matches;
    if (isMobile) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        defaults: { immediateRender: false },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=130%",
          pin: true,
          scrub: 0.35,
          anticipatePin: 1,
          fastScrollEnd: true,
        },
      });

      // ENTRANCE (0% - 30%)
      scrollTl
        .fromTo(
          imageRef.current,
          { x: "24vw", opacity: 0.35 },
          { x: 0, opacity: 1, ease: "none" },
          0,
        )
        .fromTo(
          textRef.current?.querySelector("h2") || null,
          { x: "-16vw", opacity: 0.35 },
          { x: 0, opacity: 1, ease: "none" },
          0.05,
        )
        .fromTo(
          textRef.current?.querySelector("p") || null,
          { y: "6vh", opacity: 0.45 },
          { y: 0, opacity: 1, ease: "none" },
          0.12,
        )
        .fromTo(
          underlineRef.current,
          { scaleX: 0 },
          { scaleX: 1, ease: "none" },
          0.18,
        );

      // SETTLE (30% - 70%): Elements hold position

      // EXIT (70% - 100%)
      scrollTl
        .fromTo(
          textRef.current,
          { x: 0, opacity: 1 },
          { x: "-18vw", opacity: 0.2, ease: "power2.in" },
          0.7,
        )
        .fromTo(
          imageRef.current,
          { x: 0, opacity: 1 },
          { x: "10vw", opacity: 0.3, ease: "power2.in" },
          0.7,
        )
        .fromTo(
          underlineRef.current,
          { scaleX: 1 },
          { scaleX: 0, transformOrigin: "right", ease: "power2.in" },
          0.8,
        );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`section-pinned bg-[#F6F6F2] ${className}`}
    >
      {/* Left Text Block */}
      <div ref={textRef} className="absolute left-[8vw] top-[22vh] w-[34vw]">
        <span className="eyebrow mb-4 block">Why Mydeliverynav</span>
        <h2 className="font-['Sora'] font-bold text-[clamp(28px,3.2vw,52px)] leading-[1.05] text-foreground mb-6">
          Speed that scales. Coverage you can count on.
        </h2>
        <div ref={underlineRef} className="red-underline w-[18vw] mb-8" />
        <p className="text-[clamp(14px,1.1vw,17px)] text-muted-foreground leading-relaxed mb-8">
          From same-city sprint to cross-border freight, we optimize routes in
          real time—so your deliveries arrive predictable and protected.
        </p>
        <a href="#coverage" className="text-link">
          <MapPin className="w-4 h-4" />
          See coverage map
          <ArrowRight className="w-4 h-4 ml-1" />
        </a>
      </div>

      {/* Right Image */}
      <div
        ref={imageRef}
        className="absolute left-[52vw] top-0 w-[48vw] h-full overflow-hidden"
      >
        <img
          src="/why_warehouse.png"
          alt="Mydeliverynav Warehouse"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#F6F6F2]/10" />
      </div>
    </section>
  );
};

export default WhySection;
