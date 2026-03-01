import {
  Variant_cancelled_fulfilled_open,
  type Variant_kg_pieces_litres,
  type Variant_low_high_critical_medium,
} from "@/backend";
import type { FoodRequest } from "@/backend";
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
import { Textarea } from "@/components/ui/textarea";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import {
  useAvailableListings,
  useCancelFoodRequest,
  useClaimListing,
  useCreateFoodRequest,
  useMyRequests,
} from "@/hooks/useQueries";
import type { Principal } from "@icp-sdk/core/principal";
import { CheckCircle, Clock, Heart, Loader2, MapPin, Plus } from "lucide-react";
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

export default function NgoDashboard() {
  const { identity } = useInternetIdentity();
  const { data: myRequests, isLoading: requestsLoading } = useMyRequests();
  const { data: availableListings, isLoading: listingsLoading } =
    useAvailableListings(20n, 0n);
  const createRequest = useCreateFoodRequest();
  const cancelRequest = useCancelFoodRequest();
  const claimListing = useClaimListing();
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"listings" | "requests">(
    "listings",
  );

  const [form, setForm] = useState({
    foodType: "",
    quantityNeeded: "",
    unit: "" as Variant_kg_pieces_litres | "",
    urgency: "" as Variant_low_high_critical_medium | "",
    numberOfPeople: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity) {
      toast.error("Not authenticated");
      return;
    }
    if (!form.unit || !form.urgency) {
      toast.error("Please fill all required fields");
      return;
    }

    const principal = identity.getPrincipal() as Principal;
    const request: FoodRequest = {
      id: BigInt(Date.now()),
      ngoId: principal,
      foodType: form.foodType,
      quantityNeeded: BigInt(
        Math.round(Number.parseFloat(form.quantityNeeded) || 0),
      ),
      unit: form.unit as Variant_kg_pieces_litres,
      urgency: form.urgency as Variant_low_high_critical_medium,
      numberOfPeople: BigInt(
        Math.round(Number.parseFloat(form.numberOfPeople) || 0),
      ),
      notes: form.notes,
      status: Variant_cancelled_fulfilled_open.open,
      createdAt: BigInt(Date.now()) * 1_000_000n,
    };

    try {
      await createRequest.mutateAsync(request);
      toast.success("Food request posted!");
      setForm({
        foodType: "",
        quantityNeeded: "",
        unit: "",
        urgency: "",
        numberOfPeople: "",
        notes: "",
      });
      setShowForm(false);
    } catch {
      toast.error("Failed to post request.");
    }
  };

  const handleClaim = async (listingId: bigint) => {
    try {
      await claimListing.mutateAsync(listingId);
      toast.success("Listing claimed! A volunteer will be assigned soon.");
    } catch {
      toast.error("Failed to claim listing.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            NGO Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Browse available food and manage your requests
          </p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="rounded-2xl bg-primary hover:bg-primary/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Request Food
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Available Food",
            value: availableListings?.length ?? 0,
            icon: Heart,
            color: "text-primary",
          },
          {
            label: "My Requests",
            value: myRequests?.length ?? 0,
            icon: Clock,
            color: "text-secondary",
          },
          {
            label: "Open Requests",
            value: myRequests?.filter((r) => r.status === "open").length ?? 0,
            icon: Plus,
            color: "text-primary",
          },
          {
            label: "Fulfilled",
            value:
              myRequests?.filter((r) => r.status === "fulfilled").length ?? 0,
            icon: CheckCircle,
            color: "text-green-600",
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

      {/* Post Request Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-3xl border border-border p-8 shadow-card mb-8"
        >
          <h2 className="font-display text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Post Food Request
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 gap-5"
          >
            <div className="space-y-2">
              <Label>Food Type *</Label>
              <Input
                placeholder="e.g. Cooked rice, dal, any vegetarian"
                className="rounded-xl"
                value={form.foodType}
                onChange={(e) =>
                  setForm((p) => ({ ...p, foodType: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Quantity Needed *</Label>
              <Input
                type="number"
                min="0.1"
                step="0.1"
                placeholder="e.g. 20"
                className="rounded-xl"
                value={form.quantityNeeded}
                onChange={(e) =>
                  setForm((p) => ({ ...p, quantityNeeded: e.target.value }))
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
              <Label>Urgency *</Label>
              <Select
                value={form.urgency}
                onValueChange={(v) =>
                  setForm((p) => ({
                    ...p,
                    urgency: v as Variant_low_high_critical_medium,
                  }))
                }
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">
                    🔴 Critical (Need now)
                  </SelectItem>
                  <SelectItem value="high">🟠 High (Within 2 hours)</SelectItem>
                  <SelectItem value="medium">🟡 Medium (Today)</SelectItem>
                  <SelectItem value="low">🟢 Low (This week)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Number of People to Feed *</Label>
              <Input
                type="number"
                min="1"
                placeholder="e.g. 80"
                className="rounded-xl"
                value={form.numberOfPeople}
                onChange={(e) =>
                  setForm((p) => ({ ...p, numberOfPeople: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Notes (optional)</Label>
              <Textarea
                placeholder="Special dietary requirements, preferences..."
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
                disabled={createRequest.isPending}
                className="rounded-2xl bg-primary hover:bg-primary/90"
              >
                {createRequest.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Posting...
                  </>
                ) : (
                  "Post Food Request"
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

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { id: "listings" as const, label: "Available Food" },
          { id: "requests" as const, label: "My Requests" },
        ].map((tab) => (
          <button
            type="button"
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Available Food Listings */}
      {activeTab === "listings" && (
        <div>
          {listingsLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : !availableListings || availableListings.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-3xl border border-border">
              <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-medium">
                No food available right now
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Check back soon — listings update in real-time
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableListings.map((listing) => (
                <motion.div
                  key={listing.id.toString()}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card rounded-2xl border border-border p-6 shadow-card hover:shadow-card-hover transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-display font-bold text-foreground">
                      {listing.foodName}
                    </h3>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        listing.vegNonVeg === "veg"
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {listing.vegNonVeg === "veg" ? "🥦 Veg" : "🍗 Non-Veg"}
                    </span>
                  </div>
                  <p className="font-display text-2xl font-bold text-primary mb-1">
                    {listing.quantity.toString()} {listing.unit}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">{listing.pickupLocation}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
                    <Clock className="h-3 w-3" />
                    <span>{formatExpiry(listing.expiresAt)}</span>
                  </div>
                  {listing.notes && (
                    <p className="text-xs text-muted-foreground mb-4 italic">
                      "{listing.notes}"
                    </p>
                  )}
                  <Button
                    className="w-full rounded-xl bg-primary hover:bg-primary/90 h-9"
                    onClick={() => handleClaim(listing.id)}
                    disabled={claimListing.isPending}
                  >
                    {claimListing.isPending ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      "Claim This Food"
                    )}
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* My Requests */}
      {activeTab === "requests" && (
        <div>
          {requestsLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : !myRequests || myRequests.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-3xl border border-border">
              <p className="text-muted-foreground font-medium">
                No requests yet
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Post a food request to get started
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myRequests.map((req) => (
                <div
                  key={req.id.toString()}
                  className="bg-card rounded-2xl border border-border p-5 shadow-card"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {req.foodType}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {req.quantityNeeded.toString()} {req.unit} for{" "}
                        {req.numberOfPeople.toString()} people
                      </p>
                    </div>
                    <StatusBadge status={req.urgency} />
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <StatusBadge status={req.status} />
                    {req.status === "open" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-xl text-destructive hover:bg-destructive/10 h-8 text-xs"
                        onClick={() => cancelRequest.mutate(req.id)}
                        disabled={cancelRequest.isPending}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
