import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Link } from "react-router-dom";

interface ManifestoSectionProps {
  className?: string;
}

const ManifestoSection = ({ className = "" }: ManifestoSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const supportingRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

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

      const words = headlineRef.current?.querySelectorAll(".word") || [];

      // ENTRANCE (0% - 30%)
      scrollTl
        .fromTo(
          words,
          { y: "5vh", opacity: 0.4 },
          { y: 0, opacity: 1, stagger: 0.02, ease: "none" },
          0,
        )
        .fromTo(
          supportingRef.current,
          { y: "3vh", opacity: 0.45 },
          { y: 0, opacity: 1, ease: "none" },
          0.14,
        )
        .fromTo(
          ctaRef.current,
          { scale: 0.96, opacity: 0.5 },
          { scale: 1, opacity: 1, ease: "none" },
          0.18,
        );

      // SETTLE (30% - 70%): Hold position

      // EXIT (70% - 100%)
      scrollTl
        .fromTo(
          headlineRef.current,
          { scale: 1, opacity: 1 },
          { scale: 1.06, opacity: 0.2, ease: "power2.in" },
          0.7,
        )
        .fromTo(
          [supportingRef.current, ctaRef.current],
          { opacity: 1 },
          { opacity: 0.2, ease: "power2.in" },
          0.72,
        );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`section-pinned bg-[#111111] ${className}`}
    >
      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <h2
          ref={headlineRef}
          className="font-['Sora'] font-bold text-[clamp(36px,5vw,72px)] leading-[1.05] text-[#F6F6F2] mb-8 max-w-[78vw]"
        >
          {"We're built to move.".split(" ").map((word, i) => (
            <span key={i} className="word inline-block mr-[0.25em]">
              {word}
            </span>
          ))}
        </h2>
        <p
          ref={supportingRef}
          className="text-[clamp(14px,1.2vw,18px)] text-[#F6F6F2]/70 leading-relaxed max-w-[52vw] mb-10"
        >
          No hidden fees. No dead zones. Just reliable logistics—local to
          global.
        </p>
        <Link
          ref={ctaRef}
          to="/register"
          className="btn-primary text-base px-4 py-4"
        >
          Get a quote
        </Link>
      </div>
    </section>
  );
};

export default ManifestoSection;
