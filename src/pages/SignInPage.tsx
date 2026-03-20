import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SignInPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleRequestOtp = (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    setIsSubmitting(true);

    window.setTimeout(() => {
      localStorage.setItem("pendingOtpEmail", email.trim().toLowerCase());
      localStorage.setItem("pendingOtpCode", "123456");
      navigate(
        `/signin/verify/${encodeURIComponent(email.trim().toLowerCase())}`,
      );
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6">
      <Card className="w-full max-w-md bg-slate-900 border-slate-700">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl sm:text-2xl text-white">
            Sign In
          </CardTitle>
          <p className="text-sm text-slate-400">
            Enter your email and request OTP to continue.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              {isSubmitting ? "Requesting OTP..." : "Request OTP"}
            </Button>

            <p className="text-xs text-slate-500">
              Demo OTP is{" "}
              <span className="font-semibold text-slate-300">123456</span>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
