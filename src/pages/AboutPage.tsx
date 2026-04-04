import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import {
  ArrowLeft,
  Globe,
  Users,
  Truck,
  Award,
  Target,
  Heart,
  Zap,
  MapPin,
  Package,
  Clock,
  Shield,
} from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  { icon: Globe, value: "150+", label: "Countries Served" },
  { icon: Users, value: "50K+", label: "Business Customers" },
  { icon: Truck, value: "10M+", label: "Deliveries Monthly" },
  { icon: Award, value: "25+", label: "Years of Excellence" },
];

const values = [
  {
    icon: Target,
    title: "Reliability",
    description:
      "We deliver on our promises, every single time. Your trust is our most valuable asset.",
  },
  {
    icon: Zap,
    title: "Innovation",
    description:
      "We continuously invest in technology to make shipping faster, smarter, and more efficient.",
  },
  {
    icon: Heart,
    title: "Customer First",
    description:
      "Every decision we make starts with our customers needs and ends with their satisfaction.",
  },
];

const team = [
  {
    name: "Michael Chen",
    role: "Chief Executive Officer",
    image: "/Michael_Chen.png",
  },
  {
    name: "Sarah Williams",
    role: "Chief Operations Officer",
    image: "/Sarah_Williams.png",
  },
  {
    name: "David Park",
    role: "Head of Technology",
    image: "/David_Park.png",
  },
];

const milestones = [
  { year: "2000", event: "Mydeliverynav founded in New York" },
  { year: "2005", event: "Expanded to 10 major US cities" },
  { year: "2010", event: "Launched international shipping" },
  { year: "2015", event: "Introduced real-time tracking" },
  { year: "2020", event: "Reached 1 million daily deliveries" },
  { year: "2025", event: "AI-powered logistics platform launched" },
];

const AboutPage = () => {
  const statsRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);
  const milestonesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate page entrance
    gsap.fromTo(
      ".about-content",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
    );

    // Stats animation
    const statCards = statsRef.current?.querySelectorAll(".stat-card");
    if (statCards) {
      gsap.fromTo(
        statCards,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }

    // Values animation
    const valueCards = valuesRef.current?.querySelectorAll(".value-card");
    if (valueCards) {
      gsap.fromTo(
        valueCards,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.15,
          scrollTrigger: {
            trigger: valuesRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }

    // Team animation
    const teamCards = teamRef.current?.querySelectorAll(".team-card");
    if (teamCards) {
      gsap.fromTo(
        teamCards,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          scrollTrigger: {
            trigger: teamRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }

    // Milestones animation
    const milestoneItems =
      milestonesRef.current?.querySelectorAll(".milestone-item");
    if (milestoneItems) {
      gsap.fromTo(
        milestoneItems,
        { x: -20, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.1,
          scrollTrigger: {
            trigger: milestonesRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#F6F6F2] pt-20">
      <div className="about-content">
        {/* Hero */}
        <div className="relative bg-[#111111] text-[#F6F6F2] py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <img
              src="/why_warehouse.png"
              alt="Background"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative max-w-6xl mx-auto">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-[#F6F6F2]/60 hover:text-[#D53D3D] transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <h1 className="font-['Sora'] font-bold text-[clamp(36px,5vw,64px)] leading-[1.05] mb-6">
              About Mydeliverynav
            </h1>
            <p className="text-xl text-[#F6F6F2]/80 max-w-2xl">
              We're on a mission to make logistics simple, reliable, and
              accessible for businesses of all sizes around the world.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div ref={statsRef} className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="stat-card bg-white border border-foreground/8 p-6 text-center shadow-sm"
                >
                  <stat.icon className="w-8 h-8 text-[#D53D3D] mx-auto mb-4" />
                  <p className="font-['Sora'] font-bold text-3xl text-foreground mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Our Story */}
        <div className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="eyebrow mb-4 block">Our Story</span>
                <h2 className="font-['Sora'] font-bold text-[clamp(28px,3vw,44px)] leading-[1.05] mb-6">
                  Built on a Promise to Deliver
                </h2>
                <div className="red-underline w-24 mb-8" />
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Founded in 2000, Mydeliverynav began with a simple idea:
                    make shipping reliable and transparent. What started as a
                    small courier service in New York has grown into a global
                    logistics network spanning 150+ countries.
                  </p>
                  <p>
                    Today, we handle over 10 million deliveries monthly, serving
                    businesses from startups to Fortune 500 companies. But
                    despite our growth, we remain true to our founding
                    principles—putting customers first and delivering on every
                    promise.
                  </p>
                  <p>
                    Our investment in cutting-edge technology, from AI-powered
                    routing to real-time tracking, ensures that every package
                    reaches its destination on time, every time.
                  </p>
                </div>
              </div>
              <div className="relative">
                <img
                  src="/contact_office.jpg"
                  alt="Mydeliverynav Team"
                  className="w-full h-[400px] object-cover shadow-xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-[#D53D3D] text-white p-6">
                  <p className="font-['Sora'] font-bold text-3xl">25+</p>
                  <p className="text-sm">Years of Excellence</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values */}
        <div ref={valuesRef} className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <span className="eyebrow mb-4 block">Our Values</span>
              <h2 className="font-['Sora'] font-bold text-[clamp(28px,3vw,44px)] leading-[1.05]">
                What We Stand For
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="value-card bg-white border border-foreground/8 p-8 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-14 h-14 bg-[#D53D3D]/10 flex items-center justify-center mb-6">
                    <value.icon className="w-7 h-7 text-[#D53D3D]" />
                  </div>
                  <h3 className="font-['Sora'] font-semibold text-xl mb-3">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Services Overview */}
        <div className="py-16 px-4 bg-[#111111] text-[#F6F6F2]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <span className="eyebrow mb-4 block text-[#F6F6F2]/60">
                Our Services
              </span>
              <h2 className="font-['Sora'] font-bold text-[clamp(28px,3vw,44px)] leading-[1.05]">
                Comprehensive Logistics Solutions
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Package,
                  title: "Parcel Delivery",
                  desc: "Door-to-door delivery with live tracking",
                },
                {
                  icon: Truck,
                  title: "Freight & Cargo",
                  desc: "FTL, LTL, and cross-border shipping",
                },
                {
                  icon: MapPin,
                  title: "Warehousing",
                  desc: "Storage, pick-pack, and fulfillment",
                },
                {
                  icon: Clock,
                  title: "Express Shipping",
                  desc: "Same-day and next-day delivery options",
                },
              ].map((service) => (
                <div
                  key={service.title}
                  className="bg-[#F6F6F2]/5 border border-[#F6F6F2]/10 p-6 hover:bg-[#F6F6F2]/10 transition-colors"
                >
                  <service.icon className="w-8 h-8 text-[#D53D3D] mb-4" />
                  <h3 className="font-['Sora'] font-semibold mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-[#F6F6F2]/60">{service.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div ref={milestonesRef} className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="eyebrow mb-4 block">Our Journey</span>
              <h2 className="font-['Sora'] font-bold text-[clamp(28px,3vw,44px)] leading-[1.05]">
                Milestones
              </h2>
            </div>
            <div className="space-y-0">
              {milestones.map((milestone) => (
                <div
                  key={milestone.year}
                  className="milestone-item flex gap-8 py-6 border-b border-foreground/10 last:border-0"
                >
                  <div className="w-20 flex-shrink-0">
                    <span className="font-['Sora'] font-bold text-[#D53D3D]">
                      {milestone.year}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-foreground">{milestone.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team */}
        <div ref={teamRef} className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <span className="eyebrow mb-4 block">Leadership</span>
              <h2 className="font-['Sora'] font-bold text-[clamp(28px,3vw,44px)] leading-[1.05]">
                Meet Our Team
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member) => (
                <div key={member.name} className="team-card text-center">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-['Sora'] font-semibold text-lg">
                    {member.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Shield className="w-12 h-12 text-[#D53D3D] mx-auto mb-6" />
            <h2 className="font-['Sora'] font-bold text-[clamp(24px,2.5vw,36px)] leading-[1.05] mb-4">
              Ready to Ship Smarter?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Join thousands of businesses that trust Mydeliverynav for their
              logistics needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* <Link to="/register" className="btn-primary">
                Create Account
              </Link> */}
              <Link to="/tracking" className="btn-secondary">
                Track a Shipment
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
