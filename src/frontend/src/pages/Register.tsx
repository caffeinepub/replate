import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { Link, useLocation } from "@/lib/router";
import { ArrowRight, Leaf, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

export default function Register() {
  const [, setLocation] = useLocation();
  const { login, isLoggingIn, identity } = useInternetIdentity();
  const [role, setRole] = useState("");

  const handleLogin = () => {
    login();
  };

  // If already logged in, redirect to setup profile
  if (identity) {
    setLocation("/setup-profile");
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md mx-auto mb-4">
            <img
              src="/assets/generated/replate-logo-transparent.dim_200x200.png"
              alt="RePlate"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Join RePlate
          </h1>
          <p className="text-muted-foreground mt-1">Leftovers → Lifesavers</p>
        </div>

        <div className="bg-card rounded-3xl border border-border p-8 shadow-card">
          {/* Role selector (informational) */}
          <div className="mb-6">
            <Label className="mb-3 block text-sm">I want to join as a...</Label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "host", label: "🎉 Host", desc: "Donate food" },
                { value: "ngo", label: "🏠 NGO", desc: "Receive food" },
                {
                  value: "volunteer",
                  label: "🚴 Volunteer",
                  desc: "Deliver food",
                },
              ].map((r) => (
                <button
                  type="button"
                  key={r.value}
                  onClick={() => setRole(r.value)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    role === r.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-muted/30 text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  <div className="text-lg mb-0.5">{r.label.split(" ")[0]}</div>
                  <div className="text-xs font-semibold">
                    {r.label.split(" ")[1]}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {r.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Auth via Internet Identity */}
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Continue with
                </span>
              </div>
            </div>

            <Button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="w-full rounded-2xl h-11 bg-primary hover:bg-primary/90"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Leaf className="mr-2 h-4 w-4" />
                  Continue with Internet Identity
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Internet Identity provides secure, anonymous authentication. <br />
            No password needed.
          </p>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary hover:underline font-medium"
            >
              Sign In
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          By joining, you agree to our{" "}
          <Link
            href="/terms"
            className="hover:text-primary transition-colors underline"
          >
            Terms
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="hover:text-primary transition-colors underline"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </motion.div>
    </div>
  );
}
