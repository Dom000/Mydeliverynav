import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import {
  Mail,
  Phone,
  Clock,
  Send,
  Package,
  Linkedin,
  Twitter,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface ContactSectionProps {
  className?: string;
}

const ContactSection = ({ className = "" }: ContactSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Form animation
      gsap.fromTo(
        formRef.current,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          scrollTrigger: {
            trigger: formRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      );

      // Image animation
      gsap.fromTo(
        imageRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          delay: 0.1,
          scrollTrigger: {
            trigger: imageRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      );

      // Footer rule animation
      const footerRule = footerRef.current?.querySelector(
        ".footer-rule",
      ) as HTMLElement | null;
      if (footerRule) {
        gsap.fromTo(
          footerRule,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.8,
            scrollTrigger: {
              trigger: footerRef.current,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(
      "Thank you for your inquiry! We will get back to you within one business day.",
    );
    setFormData({ name: "", email: "", company: "", message: "" });
  };

  return (
    <section ref={sectionRef} className={`relative bg-[#F6F6F2] ${className}`}>
      {/* Contact Content */}
      <div className="py-[10vh] px-[8vw]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Form */}
          <div ref={formRef}>
            <h2 className="font-['Sora'] font-bold text-[clamp(32px,3.6vw,56px)] leading-[1.05] text-foreground mb-4">
              Let's ship smarter.
            </h2>
            <p className="text-[clamp(14px,1.1vw,17px)] text-muted-foreground leading-relaxed mb-8">
              Tell us what you're moving. We'll reply with a plan and a quote
              within one business day.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white border border-foreground/10 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#D53D3D]/30"
                  required
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white border border-foreground/10 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#D53D3D]/30"
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Company"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white border border-foreground/10 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#D53D3D]/30"
                />
              </div>
              <div>
                <textarea
                  placeholder="What are you shipping?"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-3 bg-white border border-foreground/10 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#D53D3D]/30 resize-none"
                  required
                />
              </div>
              <button type="submit" className="btn-primary w-full">
                <Send className="w-4 h-4 mr-2" />
                Request a quote
              </button>
            </form>

            {/* Contact Details */}
            <div className="mt-10 space-y-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 text-[#D53D3D]" />
                <span>support@Mydeliverynav.logistics</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 text-[#D53D3D]" />
                <span>+1 (800) 555-0147</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Clock className="w-4 h-4 text-[#D53D3D]" />
                <span>Mon–Fri 08:00–20:00 ET</span>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div ref={imageRef} className="hidden lg:block">
            <div className="h-full min-h-[500px] overflow-hidden">
              <img
                src="/contact_office.jpg"
                alt="Mydeliverynav Team"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer ref={footerRef} className="bg-[#111111] text-[#F6F6F2]">
        <div className="footer-rule h-[1px] bg-[#F6F6F2]/10 origin-left" />
        <div className="py-12 px-[8vw]">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="md:col-span-1">
              <Link to="/" className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#D53D3D] flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <span className="font-['Sora'] font-bold text-xl">
                  Mydeliverynav
                </span>
              </Link>
              <p className="text-sm text-[#F6F6F2]/60 leading-relaxed">
                Global delivery, designed around you. Moving parcels, pallets,
                and promises—on time, with full visibility.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-['Sora'] font-semibold text-sm uppercase tracking-wider mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/tracking"
                    className="text-sm text-[#F6F6F2]/60 hover:text-[#D53D3D] transition-colors"
                  >
                    Tracking
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="text-sm text-[#F6F6F2]/60 hover:text-[#D53D3D] transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="text-sm text-[#F6F6F2]/60 hover:text-[#D53D3D] transition-colors"
                  >
                    Register
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-['Sora'] font-semibold text-sm uppercase tracking-wider mb-4">
                Services
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-sm text-[#F6F6F2]/60 hover:text-[#D53D3D] transition-colors"
                  >
                    Parcel Delivery
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-[#F6F6F2]/60 hover:text-[#D53D3D] transition-colors"
                  >
                    Freight & Cargo
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-[#F6F6F2]/60 hover:text-[#D53D3D] transition-colors"
                  >
                    Warehousing
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal & Social */}
            <div>
              <h4 className="font-['Sora'] font-semibold text-sm uppercase tracking-wider mb-4">
                Connect
              </h4>
              <div className="flex gap-4 mb-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-[#F6F6F2]/10 flex items-center justify-center hover:bg-[#D53D3D] transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-[#F6F6F2]/10 flex items-center justify-center hover:bg-[#D53D3D] transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-sm text-[#F6F6F2]/60 hover:text-[#D53D3D] transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-[#F6F6F2]/60 hover:text-[#D53D3D] transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-12 pt-8 border-t border-[#F6F6F2]/10 text-center">
            <p className="text-sm text-[#F6F6F2]/40">
              © {new Date().getFullYear()} Mydeliverynav Logistics. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </section>
  );
};

export default ContactSection;
