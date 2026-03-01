import { Role } from "@/backend";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useCallerProfile } from "@/hooks/useQueries";
import { useLocation } from "@/lib/router";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: Role;
}

export default function ProtectedRoute({
  children,
  allowedRole,
}: ProtectedRouteProps) {
  const [, setLocation] = useLocation();
  const { identity, isInitializing } = useInternetIdentity();
  const { data: profile, isLoading: profileLoading } = useCallerProfile();

  useEffect(() => {
    if (isInitializing || profileLoading) return;
    if (!identity) {
      setLocation("/login");
      return;
    }
    if (profile === null) {
      setLocation("/setup-profile");
      return;
    }
    if (allowedRole && profile && profile.role !== allowedRole) {
      // Redirect to correct dashboard
      switch (profile.role as Role) {
        case Role.host:
          setLocation("/dashboard/host");
          break;
        case Role.ngo:
          setLocation("/dashboard/ngo");
          break;
        case Role.volunteer:
          setLocation("/dashboard/volunteer");
          break;
        case Role.admin:
          setLocation("/dashboard/admin");
          break;
        default:
          setLocation("/");
      }
    }
  }, [
    identity,
    isInitializing,
    profile,
    profileLoading,
    allowedRole,
    setLocation,
  ]);

  if (isInitializing || profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!identity || profile === null) return null;
  if (allowedRole && profile && profile.role !== allowedRole) return null;

  return <>{children}</>;
}
