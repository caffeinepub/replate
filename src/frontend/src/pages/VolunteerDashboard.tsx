import { DeliveryStatus, ExternalBlob } from "@/backend";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useAcceptDelivery,
  useAvailableTasks,
  useMyDeliveries,
  useUpdateDeliveryStatus,
} from "@/hooks/useQueries";
import {
  Camera,
  CheckCircle,
  Clock,
  Loader2,
  MapPin,
  Package,
  Truck,
  Upload,
} from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";

const formatExpiry = (ts: bigint) => {
  const d = new Date(Number(ts / 1_000_000n));
  const now = new Date();
  const diff = d.getTime() - now.getTime();
  if (diff < 0) return "Expired";
  const hrs = Math.floor(diff / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  if (hrs > 0) return `${hrs}h ${mins}m`;
  return `${mins}m`;
};

const nextStatus: Record<DeliveryStatus, DeliveryStatus | null> = {
  [DeliveryStatus.accepted]: DeliveryStatus.pickedUp,
  [DeliveryStatus.pickedUp]: DeliveryStatus.onTheWay,
  [DeliveryStatus.onTheWay]: DeliveryStatus.delivered,
  [DeliveryStatus.delivered]: null,
};

const nextStatusLabel: Record<DeliveryStatus, string> = {
  [DeliveryStatus.accepted]: "Mark Picked Up",
  [DeliveryStatus.pickedUp]: "Mark On the Way",
  [DeliveryStatus.onTheWay]: "Mark Delivered",
  [DeliveryStatus.delivered]: "Completed",
};

function DeliveryCard({
  delivery,
}: { delivery: import("@/backend.d.ts").Delivery }) {
  const updateStatus = useUpdateDeliveryStatus();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const next = nextStatus[delivery.status];

  const handleUpdateStatus = async () => {
    if (!next) return;
    if (next === DeliveryStatus.delivered && fileRef.current) {
      fileRef.current.click();
      return;
    }
    try {
      await updateStatus.mutateAsync({
        deliveryId: delivery.id,
        status: next,
        proofImage: null,
      });
      toast.success(`Status updated to: ${next}`);
    } catch {
      toast.error("Failed to update status.");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes);
      await updateStatus.mutateAsync({
        deliveryId: delivery.id,
        status: DeliveryStatus.delivered,
        proofImage: blob,
      });
      toast.success("Delivery completed with proof uploaded! 🎉");
    } catch {
      toast.error("Failed to upload proof.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-5 shadow-card">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-semibold text-foreground text-sm">
            Delivery #{delivery.id.toString().slice(-6)}
          </p>
          <p className="text-xs text-muted-foreground">
            Listing #{delivery.listingId.toString().slice(-6)}
          </p>
        </div>
        <StatusBadge status={delivery.status} />
      </div>

      {delivery.status !== DeliveryStatus.delivered && (
        <div className="mt-3">
          <input
            type="file"
            ref={fileRef}
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
          <Button
            size="sm"
            className={`w-full rounded-xl h-8 text-xs ${
              next === DeliveryStatus.delivered
                ? "bg-secondary hover:bg-secondary/90"
                : "bg-primary hover:bg-primary/90"
            }`}
            onClick={handleUpdateStatus}
            disabled={updateStatus.isPending || uploading || !next}
          >
            {updateStatus.isPending || uploading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : next === DeliveryStatus.delivered ? (
              <>
                <Camera className="mr-1.5 h-3.5 w-3.5" />
                {nextStatusLabel[delivery.status]}
              </>
            ) : (
              nextStatusLabel[delivery.status]
            )}
          </Button>
        </div>
      )}

      {delivery.status === DeliveryStatus.delivered && (
        <div className="mt-3 flex items-center gap-2 text-xs text-primary font-medium">
          <CheckCircle className="h-4 w-4" />
          Delivery completed
        </div>
      )}
    </div>
  );
}

export default function VolunteerDashboard() {
  const { data: tasks, isLoading: tasksLoading } = useAvailableTasks();
  const { data: deliveries, isLoading: deliveriesLoading } = useMyDeliveries();
  const acceptDelivery = useAcceptDelivery();
  const [activeTab, setActiveTab] = useState<"tasks" | "deliveries">("tasks");

  const handleAccept = async (listingId: bigint) => {
    try {
      await acceptDelivery.mutateAsync(listingId);
      toast.success("Task accepted! Head to the pickup location.");
    } catch {
      toast.error("Failed to accept task.");
    }
  };

  const completedCount =
    deliveries?.filter((d) => d.status === DeliveryStatus.delivered).length ??
    0;
  const activeCount =
    deliveries?.filter((d) => d.status !== DeliveryStatus.delivered).length ??
    0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">
          Volunteer Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Pick up and deliver surplus food to NGOs
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Open Tasks",
            value: tasks?.length ?? 0,
            icon: Package,
            color: "text-primary",
          },
          {
            label: "Active Deliveries",
            value: activeCount,
            icon: Truck,
            color: "text-secondary",
          },
          {
            label: "Completed",
            value: completedCount,
            icon: CheckCircle,
            color: "text-green-600",
          },
          {
            label: "Total Deliveries",
            value: deliveries?.length ?? 0,
            icon: Truck,
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

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { id: "tasks" as const, label: `Open Tasks (${tasks?.length ?? 0})` },
          {
            id: "deliveries" as const,
            label: `My Deliveries (${deliveries?.length ?? 0})`,
          },
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

      {/* Open Tasks */}
      {activeTab === "tasks" && (
        <div>
          {tasksLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : !tasks || tasks.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-3xl border border-border">
              <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-medium">
                No open tasks right now
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Check back soon — new food listings appear regularly
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tasks.map((task) => (
                <motion.div
                  key={task.id.toString()}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card rounded-2xl border border-border p-6 shadow-card hover:shadow-card-hover transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-display font-bold text-foreground">
                      {task.foodName}
                    </h3>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        task.vegNonVeg === "veg"
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {task.vegNonVeg === "veg" ? "🥦 Veg" : "🍗"}
                    </span>
                  </div>
                  <p className="font-display text-2xl font-bold text-primary mb-3">
                    {task.quantity.toString()} {task.unit}
                  </p>
                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{task.pickupLocation}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{formatExpiry(task.expiresAt)} remaining</span>
                    </div>
                  </div>
                  {task.notes && (
                    <p className="text-xs text-muted-foreground mb-4 bg-muted/30 rounded-xl p-2">
                      {task.notes}
                    </p>
                  )}
                  <Button
                    className="w-full rounded-xl bg-primary hover:bg-primary/90 h-9"
                    onClick={() => handleAccept(task.id)}
                    disabled={acceptDelivery.isPending}
                  >
                    {acceptDelivery.isPending ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <>
                        <Truck className="mr-2 h-3.5 w-3.5" />
                        Accept Task
                      </>
                    )}
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* My Deliveries */}
      {activeTab === "deliveries" && (
        <div>
          {deliveriesLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : !deliveries || deliveries.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-3xl border border-border">
              <p className="text-muted-foreground font-medium">
                No deliveries yet
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Accept a task to get started
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {deliveries.map((delivery) => (
                <DeliveryCard
                  key={delivery.id.toString()}
                  delivery={delivery}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
