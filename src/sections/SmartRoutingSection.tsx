import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Cpu, ArrowRight } from "lucide-react";

interface SmartRoutingSectionProps {
  className?: string;
}

const SmartRoutingSection = ({ className = "" }: SmartRoutingSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const collageRef = useRef<HTMLDivElement>(null);
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

      const photo1 = collageRef.current?.querySelector(
        ".photo-1",
      ) as HTMLElement | null;
      const photo2 = collageRef.current?.querySelector(
        ".photo-2",
      ) as HTMLElement | null;
      const redBlock1 = collageRef.current?.querySelector(
        ".red-block-1",
      ) as HTMLElement | null;
      const redBlock2 = collageRef.current?.querySelector(
        ".red-block-2",
      ) as HTMLElement | null;

      // ENTRANCE (0% - 30%)
      scrollTl.fromTo(
        collageRef.current,
        { y: "8vh", opacity: 0.35 },
        { y: 0, opacity: 1, ease: "none" },
        0,
      );
      if (photo1) {
        scrollTl.fromTo(
          photo1,
          { x: "-10vw", opacity: 0.45 },
          { x: 0, opacity: 1, ease: "none" },
          0.06,
        );
      }
      if (photo2) {
        scrollTl.fromTo(
          photo2,
          { x: "10vw", opacity: 0.45 },
          { x: 0, opacity: 1, ease: "none" },
          0.08,
        );
      }
      if (redBlock1 && redBlock2) {
        scrollTl.fromTo(
          [redBlock1, redBlock2],
          { scale: 0.96, opacity: 0.5 },
          { scale: 1, opacity: 1, ease: "none" },
          0.1,
        );
      }
      scrollTl.fromTo(
        textRef.current,
        { x: "10vw", opacity: 0.4 },
        { x: 0, opacity: 1, ease: "none" },
        0.12,
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
        collageRef.current,
        { x: 0, opacity: 1 },
        { x: "-14vw", opacity: 0.2, ease: "power2.in" },
        0.7,
      );
      scrollTl.fromTo(
        textRef.current,
        { x: 0, opacity: 1 },
        { x: "14vw", opacity: 0.2, ease: "power2.in" },
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
      {/* Left Collage */}
      <div
        ref={collageRef}
        className="absolute left-[6vw] top-[14vh] w-[46vw] h-[72vh]"
      >
        {/* Top-left Photo (Driver) */}
        <div className="photo-1 absolute left-0 top-0 w-[62%] h-[46%] overflow-hidden">
          <img
            src="/collage_driver.png"
            alt="Delivery Driver"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Top-right Red Block */}
        <div className="red-block-1 absolute left-[66%] top-0 w-[34%] h-[46%] bg-[#D53D3D] flex items-center justify-center p-4">
          <span className="font-['Sora'] font-bold text-white text-[clamp(14px,1.5vw,20px)] text-center">
            AI-Powered Routing
          </span>
        </div>

        {/* Bottom-left Red Block */}
        <div className="red-block-2 absolute left-0 top-[54%] w-[44%] h-[46%] bg-[#111111] flex items-center justify-center p-4">
          <span className="font-['IBM_Plex_Mono'] text-[#F6F6F2] text-xs uppercase tracking-wider text-center">
            Real-Time Optimization
          </span>
        </div>

        {/* Bottom-right Photo (Van) */}
        <div className="photo-2 absolute left-[48%] top-[54%] w-[52%] h-[46%] overflow-hidden">
          <img
            src="/collage_van.jpg"
            alt="Delivery Van"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Right Text Block */}
      <div ref={textRef} className="absolute left-[58vw] top-[26vh] w-[34vw]">
        <span className="eyebrow mb-4 block">Smart Routing</span>
        <h2 className="font-['Sora'] font-bold text-[clamp(28px,3.2vw,52px)] leading-[1.05] text-foreground mb-6">
          Optimized at every turn.
        </h2>
        <div ref={underlineRef} className="red-underline w-[14vw] mb-8" />
        <p className="text-[clamp(14px,1.1vw,17px)] text-muted-foreground leading-relaxed mb-8">
          AI-assisted dispatch, traffic-aware ETAs, and proactive
          notifications—so your customers aren't left guessing.
        </p>
        <a href="#how-it-works" className="text-link">
          <Cpu className="w-4 h-4" />
          Explore how it works
          <ArrowRight className="w-4 h-4 ml-1" />
        </a>
      </div>
    </section>
  );
};

export default SmartRoutingSection;
