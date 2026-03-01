import {
  Variant_expired_completed_claimed_available,
  type Variant_kg_pieces_litres,
  type Variant_veg_nonVeg,
} from "@/backend";
import type { FoodListing } from "@/backend";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import {
  useCancelListing,
  useCreateListing,
  useMyListings,
} from "@/hooks/useQueries";
import type { Principal } from "@icp-sdk/core/principal";
import { Clock, Loader2, MapPin, Plus, Trash2, Utensils } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const formatExpiry = (ts: bigint) => {
  const d = new Date(Number(ts / 1_000_000n));
  const now = new Date();
  const diff = d.getTime() - now.getTime();
  if (diff < 0) return "Expired";
  const hrs = Math.floor(diff / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  if (hrs > 0) return `${hrs}h ${mins}m left`;
  return `${mins}m left`;
};

export default function HostDashboard() {
  const { identity } = useInternetIdentity();
  const { data: listings, isLoading } = useMyListings();
  const createListing = useCreateListing();
  const cancelListing = useCancelListing();
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    foodName: "",
    quantity: "",
    unit: "" as Variant_kg_pieces_litres | "",
    vegNonVeg: "" as Variant_veg_nonVeg | "",
    cookedAt: "",
    expiresAt: "",
    pickupLocation: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity) {
      toast.error("Not authenticated");
      return;
    }
    if (!form.unit || !form.vegNonVeg) {
      toast.error("Please fill all required fields");
      return;
    }

    const principal = identity.getPrincipal() as Principal;
    const listing: FoodListing = {
      id: BigInt(Date.now()),
      hostId: principal,
      foodName: form.foodName,
      quantity: BigInt(Math.round(Number.parseFloat(form.quantity) || 0)),
      unit: form.unit as Variant_kg_pieces_litres,
      vegNonVeg: form.vegNonVeg as Variant_veg_nonVeg,
      cookedAt: form.cookedAt
        ? BigInt(new Date(form.cookedAt).getTime()) * 1_000_000n
        : BigInt(Date.now()) * 1_000_000n,
      expiresAt: form.expiresAt
        ? BigInt(new Date(form.expiresAt).getTime()) * 1_000_000n
        : BigInt(Date.now() + 4 * 3600000) * 1_000_000n,
      pickupLocation: form.pickupLocation,
      notes: form.notes,
      status: Variant_expired_completed_claimed_available.available,
      createdAt: BigInt(Date.now()) * 1_000_000n,
      ngoId: undefined,
    };

    try {
      await createListing.mutateAsync(listing);
      toast.success("Food listing posted successfully! 🌿");
      setForm({
        foodName: "",
        quantity: "",
        unit: "",
        vegNonVeg: "",
        cookedAt: "",
        expiresAt: "",
        pickupLocation: "",
        notes: "",
      });
      setShowForm(false);
    } catch {
      toast.error("Failed to post listing. Please try again.");
    }
  };

  const handleCancel = async (id: bigint) => {
    try {
      await cancelListing.mutateAsync(id);
      toast.success("Listing cancelled.");
    } catch {
      toast.error("Failed to cancel listing.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Host Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your food listings and track donations
          </p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="rounded-2xl bg-primary hover:bg-primary/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Post Food
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Total Listed",
            value: listings?.length ?? 0,
            icon: Utensils,
            color: "text-primary",
          },
          {
            label: "Available",
            value:
              listings?.filter((l) => l.status === "available").length ?? 0,
            icon: Utensils,
            color: "text-green-600",
          },
          {
            label: "Claimed",
            value: listings?.filter((l) => l.status === "claimed").length ?? 0,
            icon: Clock,
            color: "text-orange-500",
          },
          {
            label: "Completed",
            value:
              listings?.filter((l) => l.status === "completed").length ?? 0,
            icon: MapPin,
            color: "text-blue-500",
          },
        ].map((s) => (
          <Card key={s.label} className="rounded-2xl shadow-card border-border">
            <CardContent className="pt-5">
              <s.icon className={`h-5 w-5 ${s.color} mb-2`} />
              <p className="font-display text-2xl font-bold text-foreground">
                {s.value}
              </p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Post Food Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-3xl border border-border p-8 shadow-card mb-8"
        >
          <h2 className="font-display text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Utensils className="h-5 w-5 text-primary" />
            Post Leftover Food
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 gap-5"
          >
            <div className="space-y-2">
              <Label>Food Name *</Label>
              <Input
                placeholder="e.g. Chicken Biryani"
                className="rounded-xl"
                value={form.foodName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, foodName: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Quantity *</Label>
              <Input
                type="number"
                min="0.1"
                step="0.1"
                placeholder="e.g. 10"
                className="rounded-xl"
                value={form.quantity}
                onChange={(e) =>
                  setForm((p) => ({ ...p, quantity: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Unit *</Label>
              <Select
                value={form.unit}
                onValueChange={(v) =>
                  setForm((p) => ({
                    ...p,
                    unit: v as Variant_kg_pieces_litres,
                  }))
                }
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">Kilograms (kg)</SelectItem>
                  <SelectItem value="litres">Litres</SelectItem>
                  <SelectItem value="pieces">Pieces</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Veg / Non-Veg *</Label>
              <Select
                value={form.vegNonVeg}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, vegNonVeg: v as Variant_veg_nonVeg }))
                }
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="veg">🥦 Vegetarian</SelectItem>
                  <SelectItem value="nonVeg">🍗 Non-Vegetarian</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Cooked At</Label>
              <Input
                type="datetime-local"
                className="rounded-xl"
                value={form.cookedAt}
                onChange={(e) =>
                  setForm((p) => ({ ...p, cookedAt: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Expires At *</Label>
              <Input
                type="datetime-local"
                className="rounded-xl"
                value={form.expiresAt}
                onChange={(e) =>
                  setForm((p) => ({ ...p, expiresAt: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Pickup Location *</Label>
              <Input
                placeholder="e.g. 123 MG Road, Andheri West, Mumbai"
                className="rounded-xl"
                value={form.pickupLocation}
                onChange={(e) =>
                  setForm((p) => ({ ...p, pickupLocation: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Notes (optional)</Label>
              <Textarea
                placeholder="Any special instructions, allergens, handling notes..."
                className="rounded-xl resize-none"
                rows={3}
                value={form.notes}
                onChange={(e) =>
                  setForm((p) => ({ ...p, notes: e.target.value }))
                }
              />
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <Button
                type="submit"
                disabled={createListing.isPending}
                className="rounded-2xl bg-primary hover:bg-primary/90"
              >
                {createListing.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Posting...
                  </>
                ) : (
                  "Post Food Listing"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-2xl"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Listings Table */}
      <Card className="rounded-3xl shadow-card border-border overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="font-display text-xl">
            My Food Listings
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : !listings || listings.length === 0 ? (
            <div className="text-center py-16">
              <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <Utensils className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-medium">
                No listings yet
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Post your first food listing above
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Food</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {listings.map((listing) => (
                  <TableRow
                    key={listing.id.toString()}
                    className="hover:bg-muted/30"
                  >
                    <TableCell className="font-medium">
                      {listing.foodName}
                    </TableCell>
                    <TableCell>
                      {listing.quantity.toString()} {listing.unit}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          listing.vegNonVeg === "veg"
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {listing.vegNonVeg === "veg" ? "🥦 Veg" : "🍗 Non-Veg"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={listing.status} />
                    </TableCell>
                    <TableCell className="max-w-[160px] truncate text-sm text-muted-foreground">
                      {listing.pickupLocation}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatExpiry(listing.expiresAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      {listing.status === "available" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleCancel(listing.id)}
                          disabled={cancelListing.isPending}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
