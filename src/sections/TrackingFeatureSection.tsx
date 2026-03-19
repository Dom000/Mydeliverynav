import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { MapPin, ArrowRight } from "lucide-react";

interface TrackingFeatureSectionProps {
  className?: string;
}

const TrackingFeatureSection = ({
  className = "",
}: TrackingFeatureSectionProps) => {
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
          textRef.current,
          { x: "-16vw", opacity: 0.35 },
          { x: 0, opacity: 1, ease: "none" },
          0.08,
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
          textRef.current,
          { x: 0, opacity: 1 },
          { x: "-12vw", opacity: 0.2, ease: "power2.in" },
          0.7,
        )
        .fromTo(
          imageRef.current,
          { x: 0, opacity: 1 },
          { x: "12vw", opacity: 0.2, ease: "power2.in" },
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
      {/* Left Text Block */}
      <div ref={textRef} className="absolute left-[8vw] top-[26vh] w-[34vw]">
        <span className="eyebrow mb-4 block">Real-Time Tracking</span>
        <h2 className="font-['Sora'] font-bold text-[clamp(28px,3.2vw,52px)] leading-[1.05] text-foreground mb-6">
          Know where it is. Know when it lands.
        </h2>
        <div ref={underlineRef} className="red-underline w-[14vw] mb-8" />
        <p className="text-[clamp(14px,1.1vw,17px)] text-muted-foreground leading-relaxed mb-8">
          Map-based tracking, automated alerts, and a shared view for your team
          and your customers.
        </p>
        <a href="#demo" className="text-link">
          <MapPin className="w-4 h-4" />
          View a demo
          <ArrowRight className="w-4 h-4 ml-1" />
        </a>
      </div>

      {/* Right Image */}
      <div
        ref={imageRef}
        className="absolute left-[50vw] top-0 w-[50vw] h-full overflow-hidden"
      >
        <img
          src="/tracking_phone.jpg"
          alt="Real-Time Tracking"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#F6F6F2]/10" />
      </div>
    </section>
  );
};

export default TrackingFeatureSection;
