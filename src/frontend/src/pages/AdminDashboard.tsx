import { Role, Variant_expired_completed_claimed_available } from "@/backend";
import StatusBadge from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useAllDeliveries,
  useAllListings,
  useAllUsers,
  usePlatformStats,
  useToggleNgoApproval,
  useUpdateListingStatus,
} from "@/hooks/useQueries";
import type { Principal } from "@icp-sdk/core/principal";
import {
  CheckCircle,
  Loader2,
  Package,
  ShieldCheck,
  ShieldX,
  TrendingUp,
  Truck,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

// Mock chart data by month
const chartData = [
  { month: "Sep", deliveries: 42 },
  { month: "Oct", deliveries: 78 },
  { month: "Nov", deliveries: 95 },
  { month: "Dec", deliveries: 145 },
  { month: "Jan", deliveries: 189 },
  { month: "Feb", deliveries: 224 },
];

export default function AdminDashboard() {
  const { data: users, isLoading: usersLoading } = useAllUsers();
  const { data: listings, isLoading: listingsLoading } = useAllListings();
  const { data: deliveries, isLoading: deliveriesLoading } = useAllDeliveries();
  const { data: stats } = usePlatformStats();
  const toggleNgoApproval = useToggleNgoApproval();
  const updateListing = useUpdateListingStatus();
  const [activeTab, setActiveTab] = useState<
    "users" | "listings" | "deliveries"
  >("users");

  const handleToggleNgo = async (ngoId: Principal) => {
    try {
      await toggleNgoApproval.mutateAsync(ngoId);
      toast.success("NGO approval status updated.");
    } catch {
      toast.error("Failed to update approval.");
    }
  };

  const handleMarkExpired = async (listingId: bigint) => {
    try {
      await updateListing.mutateAsync({
        listingId,
        status: Variant_expired_completed_claimed_available.expired,
      });
      toast.success("Listing marked as expired.");
    } catch {
      toast.error("Failed to update listing.");
    }
  };

  const kpiCards = [
    {
      label: "Total Food Saved",
      value: `${stats?.totalFoodSaved.toString() ?? "12,400"} kg`,
      icon: Package,
      color: "text-primary",
      bg: "bg-primary/10",
      change: "+18% this month",
    },
    {
      label: "NGOs Served",
      value: stats?.totalNgosServed.toString() ?? "285",
      icon: Users,
      color: "text-secondary",
      bg: "bg-secondary/10",
      change: "+12 this month",
    },
    {
      label: "Deliveries Done",
      value: stats?.totalDeliveriesCompleted.toString() ?? "3,600",
      icon: Truck,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      change: "+224 this month",
    },
    {
      label: "Active Volunteers",
      value: stats?.totalVolunteersActive.toString() ?? "890",
      icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-green-500/10",
      change: "+47 this month",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">
          Admin Panel
        </h1>
        <p className="text-muted-foreground mt-1">
          Platform overview, user management & operations
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpiCards.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="rounded-2xl shadow-card border-border">
              <CardContent className="pt-5">
                <div
                  className={`h-9 w-9 rounded-xl ${kpi.bg} flex items-center justify-center mb-3`}
                >
                  <kpi.icon className={`h-4.5 w-4.5 ${kpi.color}`} />
                </div>
                <p className="font-display text-2xl font-bold text-foreground">
                  {kpi.value}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {kpi.label}
                </p>
                <p className="text-xs text-primary font-medium mt-1">
                  {kpi.change}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Deliveries Chart */}
      <Card className="rounded-3xl shadow-card border-border mb-8">
        <CardHeader>
          <CardTitle className="font-display text-lg">
            Monthly Deliveries
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              data={chartData}
              margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.88 0.012 100)"
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "oklch(0.52 0.02 80)" }}
              />
              <YAxis tick={{ fontSize: 12, fill: "oklch(0.52 0.02 80)" }} />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid oklch(0.88 0.012 100)",
                  fontSize: "12px",
                }}
              />
              <Bar
                dataKey="deliveries"
                fill="oklch(0.56 0.19 142)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { id: "users" as const, label: `Users (${users?.length ?? 0})` },
          {
            id: "listings" as const,
            label: `Food Listings (${listings?.length ?? 0})`,
          },
          {
            id: "deliveries" as const,
            label: `Deliveries (${deliveries?.length ?? 0})`,
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

      {/* Users Table */}
      {activeTab === "users" && (
        <Card className="rounded-3xl shadow-card border-border overflow-hidden">
          <CardContent className="p-0">
            {usersLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : !users || users.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No users yet</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Organization</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow
                      key={user.id.toString()}
                      className="hover:bg-muted/30"
                    >
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`capitalize text-xs ${
                            user.role === Role.admin
                              ? "border-primary text-primary"
                              : user.role === Role.ngo
                                ? "border-blue-500 text-blue-600"
                                : user.role === Role.volunteer
                                  ? "border-green-600 text-green-700"
                                  : "border-orange-500 text-orange-600"
                          }`}
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {user.organization ?? "—"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {user.phone}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {user.location}
                      </TableCell>
                      <TableCell>
                        {user.isApproved ? (
                          <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                            <CheckCircle className="h-3.5 w-3.5" /> Approved
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            Pending
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {user.role === Role.ngo && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`rounded-xl h-7 text-xs ${
                              user.isApproved
                                ? "text-destructive hover:bg-destructive/10"
                                : "text-primary hover:bg-primary/10"
                            }`}
                            onClick={() => handleToggleNgo(user.id)}
                            disabled={toggleNgoApproval.isPending}
                          >
                            {toggleNgoApproval.isPending ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : user.isApproved ? (
                              <>
                                <ShieldX className="h-3.5 w-3.5 mr-1" /> Revoke
                              </>
                            ) : (
                              <>
                                <ShieldCheck className="h-3.5 w-3.5 mr-1" />{" "}
                                Approve
                              </>
                            )}
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
      )}

      {/* Listings Table */}
      {activeTab === "listings" && (
        <Card className="rounded-3xl shadow-card border-border overflow-hidden">
          <CardContent className="p-0">
            {listingsLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : !listings || listings.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No listings yet</p>
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
                      <TableCell className="text-sm">
                        {listing.quantity.toString()} {listing.unit}
                      </TableCell>
                      <TableCell>
                        <span className="text-xs">
                          {listing.vegNonVeg === "veg"
                            ? "🥦 Veg"
                            : "🍗 Non-Veg"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={listing.status} />
                      </TableCell>
                      <TableCell className="max-w-[140px] truncate text-sm text-muted-foreground">
                        {listing.pickupLocation}
                      </TableCell>
                      <TableCell className="text-right">
                        {listing.status === "available" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-xl h-7 text-xs text-destructive hover:bg-destructive/10"
                            onClick={() => handleMarkExpired(listing.id)}
                            disabled={updateListing.isPending}
                          >
                            Expire
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
      )}

      {/* Deliveries Table */}
      {activeTab === "deliveries" && (
        <Card className="rounded-3xl shadow-card border-border overflow-hidden">
          <CardContent className="p-0">
            {deliveriesLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : !deliveries || deliveries.length === 0 ? (
              <div className="text-center py-12">
                <Truck className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No deliveries yet</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Delivery ID</TableHead>
                    <TableHead>Listing ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Volunteer</TableHead>
                    <TableHead>NGO</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deliveries.map((d) => (
                    <TableRow
                      key={d.id.toString()}
                      className="hover:bg-muted/30"
                    >
                      <TableCell className="font-mono text-xs">
                        #{d.id.toString().slice(-8)}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        #{d.listingId.toString().slice(-8)}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={d.status} />
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground max-w-[120px] truncate">
                        {d.volunteerId.toString().slice(0, 12)}...
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground max-w-[120px] truncate">
                        {d.ngoId.toString().slice(0, 12)}...
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
