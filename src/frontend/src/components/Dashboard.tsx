import StatusBadge from "@/components/StatusBadge";
import type { Lead, LeadStatus } from "@/data/leads";
import { ALL_PRODUCTS } from "@/data/leads";
import {
  BarChart3,
  CheckCircle2,
  PhoneCall,
  Send,
  Sparkles,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";

interface DashboardProps {
  leads: Lead[];
}

const statusStats: {
  status: LeadStatus;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}[] = [
  {
    status: "New",
    icon: <Sparkles className="w-5 h-5" />,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    status: "Contacted",
    icon: <PhoneCall className="w-5 h-5" />,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
  {
    status: "Qualified",
    icon: <TrendingUp className="w-5 h-5" />,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    status: "Proposal Sent",
    icon: <Send className="w-5 h-5" />,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    status: "Won",
    icon: <CheckCircle2 className="w-5 h-5" />,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  {
    status: "Lost",
    icon: <XCircle className="w-5 h-5" />,
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
];

export default function Dashboard({ leads }: DashboardProps) {
  const totalLeads = leads.length;

  const countByStatus = (status: LeadStatus) =>
    leads.filter((l) => l.leadStatus === status).length;

  // Product interest breakdown
  const productCounts = ALL_PRODUCTS.map((product) => ({
    product,
    count: leads.filter((l) => l.interestedProducts.includes(product)).length,
  })).sort((a, b) => b.count - a.count);

  const maxCount = Math.max(...productCounts.map((p) => p.count));

  const productBarColors = [
    "bg-blue-500",
    "bg-indigo-500",
    "bg-violet-500",
    "bg-sky-500",
    "bg-cyan-500",
    "bg-emerald-500",
    "bg-amber-500",
    "bg-orange-500",
    "bg-rose-500",
  ];

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
        {/* Total card */}
        <div className="stat-card col-span-2 sm:col-span-1 lg:col-span-1 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Users className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-display font-bold text-foreground">
              {totalLeads}
            </p>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">
              Total Leads
            </p>
          </div>
        </div>

        {/* Status cards */}
        {statusStats.map(({ status, icon, color, bgColor }) => (
          <div key={status} className="stat-card">
            <div className={`p-2 rounded-lg ${bgColor} ${color} w-fit`}>
              {icon}
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-foreground">
                {countByStatus(status)}
              </p>
              <div className="mt-0.5">
                <StatusBadge status={status} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Product Interest Chart */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 rounded-lg bg-primary/10">
            <BarChart3 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-foreground text-lg">
              Product Interest Breakdown
            </h3>
            <p className="text-xs text-muted-foreground">
              Leads per IT product (multi-select)
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {productCounts.map(({ product, count }, idx) => (
            <div key={product} className="flex items-center gap-3">
              <div className="w-36 text-xs text-muted-foreground font-medium truncate shrink-0">
                {product}
              </div>
              <div className="flex-1 bg-muted rounded-full h-6 relative overflow-hidden">
                <div
                  className={`h-full rounded-full flex items-center px-2 transition-all duration-700 ${productBarColors[idx % productBarColors.length]}`}
                  style={{ width: `${(count / maxCount) * 100}%` }}
                >
                  {count >= 3 && (
                    <span className="text-white text-xs font-semibold">
                      {count}
                    </span>
                  )}
                </div>
                {count < 3 && (
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground ml-1">
                    {count}
                  </span>
                )}
              </div>
              <div className="w-8 text-right text-sm font-bold text-foreground shrink-0">
                {count}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
