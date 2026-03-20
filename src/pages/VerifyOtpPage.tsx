import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function VerifyOtpPage() {
  const navigate = useNavigate();
  const { email = "" } = useParams();

  const decodedEmail = useMemo(() => decodeURIComponent(email), [email]);
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleValidateOtp = (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    const pendingEmail = localStorage.getItem("pendingOtpEmail");
    const pendingOtp = localStorage.getItem("pendingOtpCode");

    if (!decodedEmail || pendingEmail !== decodedEmail) {
      setError("OTP session expired. Please request a new OTP.");
      return;
    }

    if (otp.trim() !== pendingOtp) {
      setError("Invalid OTP. Please try again.");
      return;
    }

    setIsSubmitting(true);

    window.setTimeout(() => {
      localStorage.removeItem("pendingOtpCode");
      localStorage.setItem("userToken", "demo-user-token");
      localStorage.setItem("userEmail", decodedEmail);
      navigate("/user/packages");
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6">
      <Card className="w-full max-w-md bg-slate-900 border-slate-700">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl sm:text-2xl text-white">
            Validate OTP
          </CardTitle>
          <p className="text-sm text-slate-400 break-all">
            Enter the OTP sent to{" "}
            <span className="text-slate-200">{decodedEmail}</span>
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleValidateOtp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp" className="text-slate-300">
                OTP Code
              </Label>
              <Input
                id="otp"
                type="text"
                maxLength={6}
                value={otp}
                onChange={(event) =>
                  setOtp(event.target.value.replace(/\D/g, ""))
                }
                placeholder="Enter 6-digit OTP"
                className="bg-slate-800 border-slate-700 text-white tracking-widest"
              />
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              {isSubmitting ? "Validating..." : "Validate OTP"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
