import { useState, useEffect } from "react";
import { gsap } from "gsap";
import {
  User,
  Mail,
  Phone,
  Building2,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  ArrowLeft,
  Package,
  Truck,
  Shield,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";

const benefits = [
  {
    icon: Package,
    title: "Ship Faster",
    description: "Access to express delivery options and priority handling.",
  },
  {
    icon: Truck,
    title: "Save on Shipping",
    description: "Exclusive business rates and volume discounts.",
  },
  {
    icon: Shield,
    title: "Full Visibility",
    description: "Real-time tracking and delivery notifications.",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Dedicated account manager and round-the-clock assistance.",
  },
];

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    gsap.fromTo(
      ".register-content",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
    );
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "You must agree to the terms";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#F6F6F2] pt-20 flex items-center justify-center">
        <div className="register-content text-center px-4 max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="font-['Sora'] font-bold text-3xl mb-4">
            Welcome to Mydeliverynav!
          </h1>
          <p className="text-muted-foreground mb-8">
            Your account has been created successfully. Check your email for
            verification instructions.
          </p>
          <div className="space-y-3">
            <Link to="/tracking" className="btn-primary w-full block">
              Track a Shipment
            </Link>
            <Link to="/" className="btn-secondary w-full block">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F6F2] pt-20">
      <div className="register-content">
        {/* Header */}
        <div className="bg-[#111111] text-[#F6F6F2] py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-[#F6F6F2]/60 hover:text-[#D53D3D] transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <h1 className="font-['Sora'] font-bold text-[clamp(28px,3.5vw,48px)] leading-[1.05]">
              Create Your Account
            </h1>
          </div>
        </div>

        {/* Form Section */}
        <div className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Form */}
              <div>
                <p className="text-muted-foreground mb-8">
                  Join thousands of businesses shipping smarter with
                  Mydeliverynav.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        First Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="John"
                          className={`w-full pl-12 pr-4 py-3 bg-white border ${
                            errors.firstName
                              ? "border-red-500"
                              : "border-foreground/10"
                          } text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#D53D3D]/30`}
                        />
                      </div>
                      {errors.firstName && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.firstName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Last Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Doe"
                          className={`w-full pl-12 pr-4 py-3 bg-white border ${
                            errors.lastName
                              ? "border-red-500"
                              : "border-foreground/10"
                          } text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#D53D3D]/30`}
                        />
                      </div>
                      {errors.lastName && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@company.com"
                        className={`w-full pl-12 pr-4 py-3 bg-white border ${
                          errors.email
                            ? "border-red-500"
                            : "border-foreground/10"
                        } text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#D53D3D]/30`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 (555) 000-0000"
                        className={`w-full pl-12 pr-4 py-3 bg-white border ${
                          errors.phone
                            ? "border-red-500"
                            : "border-foreground/10"
                        } text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#D53D3D]/30`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Company Name (Optional)
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Acme Inc."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-foreground/10 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#D53D3D]/30"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Min. 8 characters"
                        className={`w-full pl-12 pr-12 py-3 bg-white border ${
                          errors.password
                            ? "border-red-500"
                            : "border-foreground/10"
                        } text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#D53D3D]/30`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        className={`w-full pl-12 pr-12 py-3 bg-white border ${
                          errors.confirmPassword
                            ? "border-red-500"
                            : "border-foreground/10"
                        } text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#D53D3D]/30`}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="agreeTerms"
                        checked={formData.agreeTerms}
                        onChange={handleChange}
                        className="w-5 h-5 mt-0.5 border-foreground/20 rounded focus:ring-[#D53D3D]"
                      />
                      <span className="text-sm text-muted-foreground">
                        I agree to the{" "}
                        <a href="#" className="text-[#D53D3D] hover:underline">
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#" className="text-[#D53D3D] hover:underline">
                          Privacy Policy
                        </a>
                      </span>
                    </label>
                    {errors.agreeTerms && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.agreeTerms}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating Account...
                      </span>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </form>

                <p className="mt-6 text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <a
                    href="/signin"
                    className="text-[#D53D3D] hover:underline font-medium"
                  >
                    Sign in
                  </a>
                </p>
              </div>

              {/* Benefits */}
              <div className="hidden lg:block">
                <div className="bg-[#111111] text-[#F6F6F2] p-8 h-full">
                  <h2 className="font-['Sora'] font-bold text-2xl mb-8">
                    Why Join Mydeliverynav?
                  </h2>
                  <div className="space-y-6">
                    {benefits.map((benefit) => (
                      <div key={benefit.title} className="flex gap-4">
                        <div className="w-12 h-12 bg-[#D53D3D] flex items-center justify-center flex-shrink-0">
                          <benefit.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-['Sora'] font-semibold mb-1">
                            {benefit.title}
                          </h3>
                          <p className="text-sm text-[#F6F6F2]/70">
                            {benefit.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-12 pt-8 border-t border-[#F6F6F2]/10">
                    <blockquote className="text-lg italic text-[#F6F6F2]/80">
                      "Mydeliverynav has transformed how we handle logistics.
                      Highly recommended!"
                    </blockquote>
                    <p className="mt-4 text-sm text-[#F6F6F2]/60">
                      — Sarah Johnson, Operations Director
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
