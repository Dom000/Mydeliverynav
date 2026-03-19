import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Package, Truck, Warehouse, ArrowRight } from "lucide-react";

interface ServicesSectionProps {
  className?: string;
}

const services = [
  {
    icon: Package,
    title: "Parcel Delivery",
    description: "Door-to-door with live tracking and delivery windows.",
    image: "/services_parcel.jpg",
    cta: "Explore parcel",
  },
  {
    icon: Truck,
    title: "Freight & Cargo",
    description: "Pallets to containers—road, air, and ocean.",
    image: "/services_freight.jpg",
    cta: "Explore freight",
  },
  {
    icon: Warehouse,
    title: "Warehousing",
    description: "Storage, pick-pack, and inventory visibility.",
    image: "/services_warehouse.jpg",
    cta: "Explore warehousing",
  },
];

const ServicesSection = ({ className = "" }: ServicesSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        headerRef.current,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      );

      // Cards animation
      cardsRef.current.forEach((card, index) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { y: "10vh", opacity: 0, rotate: -1 },
          {
            y: 0,
            opacity: 1,
            rotate: 0,
            duration: 0.7,
            delay: index * 0.1,
            scrollTrigger: {
              trigger: card,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`relative bg-[#F6F6F2] py-[10vh] px-[8vw] ${className}`}
    >
      {/* Header */}
      <div
        ref={headerRef}
        className="mb-12 lg:mb-16 max-w-full lg:max-w-[40vw]"
      >
        <span className="eyebrow mb-4 block">Services</span>
        <h2 className="font-['Sora'] font-bold text-[clamp(32px,3.6vw,56px)] leading-[1.05] text-foreground">
          One partner. Every mile.
        </h2>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <div
            key={service.title}
            ref={(el) => {
              cardsRef.current[index] = el;
            }}
            className="group bg-white border border-foreground/8 overflow-hidden shadow-[0_18px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_18px_40px_rgba(0,0,0,0.12)] transition-shadow duration-300"
          >
            {/* Image */}
            <div className="relative h-[200px] overflow-hidden">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              <service.icon className="absolute bottom-4 left-4 w-8 h-8 text-white" />
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="font-['Sora'] font-semibold text-xl text-foreground mb-3">
                {service.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {service.description}
              </p>
              <a
                href="#"
                className="inline-flex items-center gap-2 text-sm font-medium text-[#D53D3D] hover:gap-3 transition-all"
              >
                {service.cta}
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServicesSection;
