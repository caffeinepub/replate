import { Role } from "@/backend";
import type { UserProfile } from "@/backend";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useSaveProfile } from "@/hooks/useQueries";
import { useLocation } from "@/lib/router";
import type { Principal } from "@icp-sdk/core/principal";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const roles = [
  {
    value: Role.host,
    label: "🎉 Event Host",
    desc: "I host events and have surplus food to donate",
  },
  {
    value: Role.ngo,
    label: "🏠 NGO / Orphanage",
    desc: "Our organization needs food for those in need",
  },
  {
    value: Role.volunteer,
    label: "🚴 Volunteer",
    desc: "I want to pick up and deliver food",
  },
];

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
      return "/";
  }
}

export default function SetupProfile() {
  const [, setLocation] = useLocation();
  const { identity } = useInternetIdentity();
  const saveProfile = useSaveProfile();

  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation2] = useState("");
  const [organization, setOrganization] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity) {
      toast.error("Not authenticated");
      return;
    }
    if (!selectedRole) {
      toast.error("Please select your role");
      return;
    }
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!phone.trim()) {
      toast.error("Phone is required");
      return;
    }
    if (!location.trim()) {
      toast.error("Location is required");
      return;
    }

    const principal = identity.getPrincipal() as Principal;
    const profile: UserProfile = {
      id: principal,
      name: name.trim(),
      phone: phone.trim(),
      location: location.trim(),
      role: selectedRole,
      organization: organization.trim() || undefined,
      isApproved: selectedRole !== Role.ngo,
      joinedAt: BigInt(Date.now()) * 1_000_000n,
    };

    try {
      await saveProfile.mutateAsync(profile);
      toast.success("Profile created! Welcome to RePlate 🌿");
      setLocation(getDashboardRoute(selectedRole));
    } catch {
      toast.error("Failed to save profile. Please try again.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Set Up Your Profile
          </h1>
          <p className="text-muted-foreground">
            Tell us about yourself so we can personalize your RePlate
            experience.
          </p>
        </div>

        <div className="bg-card rounded-3xl border border-border p-8 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div>
              <Label className="mb-3 block">I am joining as *</Label>
              <div className="space-y-2">
                {roles.map((r) => (
                  <button
                    type="button"
                    key={r.value}
                    onClick={() => setSelectedRole(r.value)}
                    className={`w-full p-4 rounded-xl border text-left transition-all flex items-start gap-3 ${
                      selectedRole === r.value
                        ? "border-primary bg-primary/10"
                        : "border-border bg-muted/20 hover:border-primary/40"
                    }`}
                  >
                    <span className="text-xl mt-0.5">
                      {r.label.split(" ")[0]}
                    </span>
                    <div>
                      <p
                        className={`text-sm font-semibold ${selectedRole === r.value ? "text-primary" : "text-foreground"}`}
                      >
                        {r.label.split(" ").slice(1).join(" ")}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {r.desc}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="Your full name"
                className="rounded-xl"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                placeholder="+91 98765 43210"
                className="rounded-xl"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="loc">Your City / Area *</Label>
              <Input
                id="loc"
                placeholder="e.g. Andheri West, Mumbai"
                className="rounded-xl"
                value={location}
                onChange={(e) => setLocation2(e.target.value)}
                required
              />
            </div>

            {/* Organization (for NGO) */}
            {selectedRole === Role.ngo && (
              <div className="space-y-2">
                <Label htmlFor="org">Organization Name *</Label>
                <Input
                  id="org"
                  placeholder="e.g. St. Joseph's Orphanage"
                  className="rounded-xl"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  NGO accounts require admin approval before you can claim food
                  listings.
                </p>
              </div>
            )}

            <Button
              type="submit"
              disabled={saveProfile.isPending || !selectedRole}
              className="w-full rounded-2xl h-11 bg-primary hover:bg-primary/90"
            >
              {saveProfile.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting up...
                </>
              ) : (
                "Complete Profile →"
              )}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
