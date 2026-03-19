import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Search, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface HeroSectionProps {
  className?: string;
}

const HeroSection = ({ className = "" }: HeroSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const redBarRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const trackingCardRef = useRef<HTMLDivElement>(null);
  const [trackingNumber, setTrackingNumber] = useState("");

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const isMobile = window.matchMedia("(max-width: 1023px)").matches;
    if (isMobile) return;

    const ctx = gsap.context(() => {
      const resetHeroState = () => {
        const headlineWords =
          headlineRef.current?.querySelectorAll(".word") || [];

        gsap.set(
          [
            imageRef.current,
            redBarRef.current,
            headlineRef.current,
            subheadlineRef.current,
            trackingCardRef.current,
          ],
          {
            opacity: 1,
            x: 0,
            y: 0,
            scaleY: 1,
            clearProps: "filter",
          },
        );

        gsap.set(headlineWords, {
          opacity: 1,
          x: 0,
          y: 0,
        });
      };

      // Auto-play entrance animation
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        imageRef.current,
        { x: "-12vw", opacity: 0 },
        { x: 0, opacity: 1, duration: 0.9 },
      )
        .fromTo(
          redBarRef.current,
          { scaleY: 0 },
          { scaleY: 1, duration: 0.6, ease: "power2.out" },
          0.2,
        )
        .fromTo(
          headlineRef.current?.querySelectorAll(".word") || [],
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.05 },
          0.3,
        )
        .fromTo(
          subheadlineRef.current,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          0.5,
        )
        .fromTo(
          trackingCardRef.current,
          { x: "10vw", opacity: 0 },
          { x: 0, opacity: 1, duration: 0.7 },
          0.4,
        );

      // Scroll-driven exit animation
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
          onEnter: resetHeroState,
          onEnterBack: resetHeroState,
          onLeaveBack: () => {
            resetHeroState();
          },
        },
      });

      // SETTLE (0% - 70%): Hold position
      // EXIT (70% - 100%)
      scrollTl
        .fromTo(
          headlineRef.current,
          { x: 0, opacity: 1 },
          { x: "18vw", opacity: 0.2, ease: "power2.in" },
          0.7,
        )
        .fromTo(
          subheadlineRef.current,
          { x: 0, opacity: 1 },
          { x: "14vw", opacity: 0.2, ease: "power2.in" },
          0.72,
        )
        .fromTo(
          trackingCardRef.current,
          { y: 0, opacity: 1 },
          { y: "18vh", opacity: 0.2, ease: "power2.in" },
          0.7,
        )
        .fromTo(
          imageRef.current,
          { x: 0, opacity: 1 },
          { x: "-10vw", opacity: 0.3, ease: "power2.in" },
          0.7,
        )
        .fromTo(
          redBarRef.current,
          { scaleY: 1, opacity: 1 },
          {
            scaleY: 0,
            opacity: 0,
            transformOrigin: "bottom",
            ease: "power2.in",
          },
          0.75,
        );
    }, section);

    return () => ctx.revert();
  }, []);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      window.location.href = `/tracking?number=${encodeURIComponent(trackingNumber)}`;
    }
  };

  return (
    <section
      ref={sectionRef}
      className={`section-pinned !p-0 bg-[#F6F6F2] ${className}`}
    >
      {/* Left Image Panel */}
      <div
        ref={imageRef}
        className="absolute left-0 top-0 w-[52vw] h-full overflow-hidden"
      >
        <img
          src="/hero_courier.jpg"
          alt="Mydeliverynav Courier"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#F6F6F2]/20" />
      </div>

      {/* Red Vertical Bar */}
      <div
        ref={redBarRef}
        className="hidden lg:block absolute left-[48vw] top-0 w-[1.2vw] h-full bg-[#D53D3D] origin-top"
      />

      {/* Right Content Area */}
      <div className="absolute left-[52vw] top-0 w-[48vw] h-full flex flex-col justify-center px-[6vw]">
        {/* Headline */}
        <div ref={headlineRef} className="mb-6">
          <h1 className="font-['Sora'] font-bold text-[clamp(32px,4vw,64px)] leading-[1.05] text-foreground">
            {"Global delivery, designed around you."
              .split(" ")
              .map((word, i) => (
                <span key={i} className="word inline-block mr-[0.3em]">
                  {word}
                </span>
              ))}
          </h1>
        </div>

        {/* Subheadline */}
        <p
          ref={subheadlineRef}
          className="text-[clamp(14px,1.2vw,18px)] text-muted-foreground leading-relaxed max-w-full lg:max-w-[32vw] mb-10"
        >
          Mydeliverynav moves parcels, pallets, and promises—on time, with full
          visibility.
        </p>

        {/* Tracking Card */}
        <div
          ref={trackingCardRef}
          className="bg-white border border-foreground/8 p-6 lg:p-8 shadow-[0_18px_40px_rgba(0,0,0,0.10)] max-w-full lg:max-w-[34vw]"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 bg-[#D53D3D] rounded-full" />
            <span className="eyebrow">Track a Shipment</span>
          </div>
          <div className="h-[2px] bg-foreground/10 mb-6" />
          <form onSubmit={handleTrack}>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Tracking number"
                  className="w-full px-4 py-3 bg-[#F6F6F2] border-0 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#D53D3D]/30"
                />
              </div>
              <button type="submit" className="btn-primary px-8">
                <Search className="w-4 h-4 mr-2" />
                Track
              </button>
            </div>
          </form>
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <HelpCircle className="w-4 h-4" />
            <span>Need help?</span>
            <Link to="/tracking" className="text-[#D53D3D] hover:underline">
              Contact support
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
