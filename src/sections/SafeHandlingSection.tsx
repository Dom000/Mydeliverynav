import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Shield, ArrowRight } from "lucide-react";

interface SafeHandlingSectionProps {
  className?: string;
}

const SafeHandlingSection = ({ className = "" }: SafeHandlingSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageStackRef = useRef<HTMLDivElement>(null);
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

      const backImage = imageStackRef.current?.querySelector(
        ".back-image",
      ) as HTMLElement | null;
      const frontImage = imageStackRef.current?.querySelector(
        ".front-image",
      ) as HTMLElement | null;

      // ENTRANCE (0% - 30%)
      if (backImage) {
        scrollTl.fromTo(
          backImage,
          { x: "-18vw", opacity: 0.35 },
          { x: 0, opacity: 1, ease: "none" },
          0,
        );
      }
      if (frontImage) {
        scrollTl.fromTo(
          frontImage,
          { x: "-12vw", opacity: 0.45 },
          { x: 0, opacity: 1, ease: "none" },
          0.1,
        );
      }
      scrollTl.fromTo(
        textRef.current,
        { x: "14vw", opacity: 0.35 },
        { x: 0, opacity: 1, ease: "none" },
        0.08,
      );
      scrollTl.fromTo(
        underlineRef.current,
        { scaleX: 0 },
        { scaleX: 1, ease: "none" },
        0.18,
      );

      // SETTLE (30% - 70%): Hold position

      // EXIT (70% - 100%)
      scrollTl.fromTo(
        textRef.current,
        { y: 0, opacity: 1 },
        { y: "-12vh", opacity: 0.2, ease: "power2.in" },
        0.7,
      );
      scrollTl.fromTo(
        imageStackRef.current,
        { y: 0, opacity: 1 },
        { y: "12vh", opacity: 0.2, ease: "power2.in" },
        0.7,
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`section-pinned bg-[#F6F6F2] ${className}`}
    >
      {/* Left Image Stack */}
      <div
        ref={imageStackRef}
        className="absolute left-[6vw] top-[16vh] w-[44vw] h-[68vh]"
      >
        {/* Back Image (Warehouse) */}
        <div className="back-image absolute left-0 top-0 w-[86%] h-[72%] overflow-hidden shadow-xl">
          <img
            src="/safe_warehouse.jpg"
            alt="Warehouse Operations"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Front Image (Worker) */}
        <div className="front-image absolute left-[28%] top-[34%] w-[68%] h-[58%] overflow-hidden shadow-2xl border-4 border-[#F6F6F2]">
          <img
            src="/safe_worker.jpg"
            alt="Logistics Worker"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Right Text Block */}
      <div ref={textRef} className="absolute left-[56vw] top-[26vh] w-[36vw]">
        <span className="eyebrow mb-4 block">Safe Handling</span>
        <h2 className="font-['Sora'] font-bold text-[clamp(28px,3.2vw,52px)] leading-[1.05] text-foreground mb-6">
          Your goods, treated like ours.
        </h2>
        <div ref={underlineRef} className="red-underline w-[14vw] mb-8" />
        <p className="text-[clamp(14px,1.1vw,17px)] text-muted-foreground leading-relaxed mb-8">
          Trained teams, SOPs for fragile and high-value items, and insurance
          options that match your risk.
        </p>
        <a href="#safety" className="text-link">
          <Shield className="w-4 h-4" />
          Read our safety standards
          <ArrowRight className="w-4 h-4 ml-1" />
        </a>
      </div>
    </section>
  );
};

export default SafeHandlingSection;
