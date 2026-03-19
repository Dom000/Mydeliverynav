import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Quote, ArrowRight } from "lucide-react";

interface TestimonialsSectionProps {
  className?: string;
}

const TestimonialsSection = ({ className = "" }: TestimonialsSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const collageRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
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

      const photos = collageRef.current?.querySelectorAll(".photo") || [];
      const redBlocks =
        collageRef.current?.querySelectorAll(".red-block") || [];

      // ENTRANCE (0% - 30%)
      scrollTl
        .fromTo(
          collageRef.current,
          { y: "8vh", opacity: 0.35 },
          { y: 0, opacity: 1, ease: "none" },
          0,
        )
        .fromTo(
          photos,
          { scale: 1.03, opacity: 0.45 },
          { scale: 1, opacity: 1, ease: "none" },
          0.08,
        )
        .fromTo(
          redBlocks,
          { x: "-3vw", opacity: 0.45 },
          { x: 0, opacity: 1, ease: "none" },
          0.1,
        )
        .fromTo(
          quoteRef.current,
          { x: "8vw", opacity: 0.4 },
          { x: 0, opacity: 1, ease: "none" },
          0.12,
        )
        .fromTo(
          underlineRef.current,
          { scaleX: 0 },
          { scaleX: 1, ease: "none" },
          0.18,
        );

      // SETTLE (30% - 70%): Hold position

      // EXIT (70% - 100%)
      scrollTl
        .fromTo(
          collageRef.current,
          { x: 0, opacity: 1 },
          { x: "-10vw", opacity: 0.2, ease: "power2.in" },
          0.7,
        )
        .fromTo(
          quoteRef.current,
          { x: 0, opacity: 1 },
          { x: "10vw", opacity: 0.2, ease: "power2.in" },
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
        <div className="photo absolute left-0 top-0 w-[62%] h-[46%] overflow-hidden">
          <img
            src="/testimonials_driver.jpg"
            alt="Delivery Driver"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Top-right Red Block */}
        <div className="red-block absolute left-[66%] top-0 w-[34%] h-[46%] bg-[#D53D3D] flex items-center justify-center p-4">
          <Quote className="w-10 h-10 text-white/80" />
        </div>

        {/* Bottom-left Red Block */}
        <div className="red-block absolute left-0 top-[54%] w-[44%] h-[46%] bg-[#111111] flex items-center justify-center p-4">
          <span className="font-['IBM_Plex_Mono'] text-[#F6F6F2] text-xs uppercase tracking-wider text-center">
            Trusted by 10,000+ Businesses
          </span>
        </div>

        {/* Bottom-right Photo (Van) */}
        <div className="photo absolute left-[48%] top-[54%] w-[52%] h-[46%] overflow-hidden">
          <img
            src="/testimonials_van.jpg"
            alt="Delivery Van"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Right Quote Block */}
      <div ref={quoteRef} className="absolute left-[58vw] top-[26vh] w-[34vw]">
        <span className="eyebrow mb-4 block">Testimonials</span>
        <blockquote className="font-['Sora'] font-bold text-[clamp(24px,2.8vw,44px)] leading-[1.15] text-foreground mb-8">
          "Mydeliverynav turned our biggest shipping headache into our most
          reliable process."
        </blockquote>
        <div ref={underlineRef} className="red-underline w-[14vw] mb-6" />
        <p className="text-sm text-muted-foreground mb-8">
          — Operations Lead, Home & Living Brand
        </p>
        <a href="#stories" className="text-link">
          <Quote className="w-4 h-4" />
          Read customer stories
          <ArrowRight className="w-4 h-4 ml-1" />
        </a>
      </div>
    </section>
  );
};

export default TestimonialsSection;
