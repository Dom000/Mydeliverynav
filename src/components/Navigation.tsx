import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Package } from "lucide-react";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/tracking", label: "Tracking" },
    { path: "/about", label: "About" },
    { path: "/register", label: "Register" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#F6F6F2]/90 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="w-full px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-[#D53D3D] flex items-center justify-center transition-transform group-hover:scale-105">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="font-['Sora'] font-bold text-xl tracking-tight">
                Mydeliverynav
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative font-medium text-sm transition-colors ${
                    isActive(link.path)
                      ? "text-[#D53D3D]"
                      : "text-foreground/80 hover:text-[#D53D3D]"
                  }`}
                >
                  {link.label}
                  {isActive(link.path) && (
                    <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#D53D3D]" />
                  )}
                </Link>
              ))}
              <Link to="/tracking" className="btn-primary ml-4">
                Track Package
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-foreground/5 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 bg-[#F6F6F2] transition-transform duration-300 md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`font-['Sora'] text-2xl font-semibold transition-colors ${
                isActive(link.path)
                  ? "text-[#D53D3D]"
                  : "text-foreground hover:text-[#D53D3D]"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/tracking"
            onClick={() => setIsMobileMenuOpen(false)}
            className="btn-primary mt-4"
          >
            Track Package
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navigation;
