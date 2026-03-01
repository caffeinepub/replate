import { Role } from "@/backend";
import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useCallerProfile } from "@/hooks/useQueries";
import { Link, useLocation } from "@/lib/router";
import { ArrowRight, Leaf, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";

function getDashboardRoute(role: Role): string {
  switch (role) {
    case Role.host:
      return "/dashboard/host";
    case Role.ngo:
      return "/dashboard/ngo";
    case Role.volunteer:
      return "/dashboard/volunteer";
    case Role.admin:
      return "/dashboard/admin";
    default:
      return "/setup-profile";
  }
}

export default function Login() {
  const [, setLocation] = useLocation();
  const { login, isLoggingIn, identity } = useInternetIdentity();
  const { data: profile } = useCallerProfile();

  useEffect(() => {
    if (identity && profile) {
      setLocation(getDashboardRoute(profile.role as Role));
    } else if (identity && profile === null) {
      setLocation("/setup-profile");
    }
  }, [identity, profile, setLocation]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md mx-auto mb-4">
            <img
              src="/assets/generated/replate-logo-transparent.dim_200x200.png"
              alt="RePlate"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Welcome Back
          </h1>
          <p className="text-muted-foreground mt-1">
            Sign in to your RePlate account
          </p>
        </div>

        <div className="bg-card rounded-3xl border border-border p-8 shadow-card">
          <div className="text-center mb-6">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Leaf className="h-8 w-8 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              RePlate uses Internet Identity for secure, passwordless
              authentication. Your identity is cryptographically secured.
            </p>
          </div>

          <Button
            onClick={login}
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
                Sign In with Internet Identity
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-primary hover:underline font-medium"
            >
              Create one free
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
