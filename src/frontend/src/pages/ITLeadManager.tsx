import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  type GenerateOptions,
  generateLeads,
  getDailyLeads,
  getTodayKey,
} from "@/data/leadGenerator";
import {
  ALL_AREAS,
  ALL_COMPANY_SIZES,
  ALL_PRODUCTS,
  ALL_STATUSES,
  ALL_TURNOVER_RANGES,
  type CompanySize,
  type Lead,
  type LeadStatus,
  REGION_AREAS,
  type TurnoverRange,
  seedLeads,
} from "@/data/leads";
import {
  ArrowUpDown,
  BarChart3,
  Bot,
  Building2,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  FileSpreadsheet,
  Filter,
  Grid3X3,
  Landmark,
  Loader2,
  MapPin,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  TrendingUp,
  Wifi,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

const NAVI_MUMBAI_AREAS = [
  "Vashi",
  "Turbhe",
  "Airoli",
  "Belapur",
  "Kharghar",
  "Nerul",
  "Sanpada",
  "Ghansoli",
  "Rabale",
  "Mahape",
  "Panvel",
  "Kopar Khairane",
  "Taloja",
  "Kalamboli",
  "Ulwe",
  "Dronagiri",
  "Seawoods",
  "CBD Belapur",
  "Juinagar",
  "Kamothe",
];

const PAGE_SIZE = 25;

const EXTRA_LEADS_KEY = "extra_leads";

function getStatusClass(status: LeadStatus): string {
  switch (status) {
    case "New":
      return "status-new";
    case "Contacted":
      return "status-contacted";
    case "Qualified":
      return "status-qualified";
    case "Proposal Sent":
      return "status-proposal";
    case "Won":
      return "status-won";
    case "Lost":
      return "status-lost";
    default:
      return "status-new";
  }
}

function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${getStatusClass(status)}`}
    >
      {status}
    </span>
  );
}

function ProductTag({ product }: { product: string }) {
  return <span className="product-tag">{product}</span>;
}

function SizeTag({ size }: { size: CompanySize }) {
  const cls =
    size === "Enterprise"
      ? "bg-[oklch(0.91_0.04_280)] text-[oklch(0.38_0.14_280)] border border-[oklch(0.82_0.08_280)]"
      : size === "Mid-Market"
        ? "bg-[oklch(0.93_0.04_215)] text-[oklch(0.38_0.12_215)] border border-[oklch(0.84_0.08_215)]"
        : "bg-[oklch(0.93_0.04_165)] text-[oklch(0.36_0.12_155)] border border-[oklch(0.84_0.08_160)]";
  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold ${cls}`}
    >
      {size}
    </span>
  );
}

function TurnoverTag({ turnover }: { turnover: TurnoverRange }) {
  const cls =
    turnover === "500 Cr+"
      ? "bg-[oklch(0.91_0.04_40)] text-[oklch(0.36_0.14_40)] border border-[oklch(0.82_0.08_40)]"
      : turnover === "100–500 Cr"
        ? "bg-[oklch(0.93_0.04_60)] text-[oklch(0.38_0.12_60)] border border-[oklch(0.84_0.08_60)]"
        : turnover === "25–100 Cr"
          ? "bg-[oklch(0.93_0.04_130)] text-[oklch(0.36_0.12_130)] border border-[oklch(0.84_0.08_130)]"
          : "bg-[oklch(0.93_0.03_200)] text-[oklch(0.40_0.10_200)] border border-[oklch(0.84_0.06_200)]";
  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold ${cls}`}
    >
      ₹{turnover}
    </span>
  );
}

// ─── Lead Detail Modal ───────────────────────────────────────────────────────

function LeadDetailModal({
  lead,
  open,
  onClose,
  onStatusChange,
  onNotesChange,
}: {
  lead: Lead | null;
  open: boolean;
  onClose: () => void;
  onStatusChange: (id: number, status: LeadStatus) => void;
  onNotesChange: (id: number, notes: string) => void;
}) {
  const [notes, setNotes] = useState(lead?.notes ?? "");
  const [status, setStatus] = useState<LeadStatus>(lead?.leadStatus ?? "New");

  useEffect(() => {
    setNotes(lead?.notes ?? "");
    setStatus(lead?.leadStatus ?? "New");
  }, [lead]);

  if (!lead) return null;

  const handleSave = () => {
    onStatusChange(lead.id, status);
    onNotesChange(lead.id, notes);
    toast.success("Lead updated successfully");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-lg flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            {lead.companyName}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          {/* Contact Info */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Contact Information
            </h3>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-muted-foreground">Contact Person</p>
                <p className="text-sm font-semibold text-foreground">
                  {lead.contactPerson}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Designation</p>
                <p className="text-sm text-foreground">{lead.designation}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <a
                  href={`tel:${lead.phone}`}
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  <Phone className="h-3 w-3" />
                  {lead.phone}
                </a>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <a
                  href={`mailto:${lead.email}`}
                  className="text-sm text-primary hover:underline break-all"
                >
                  {lead.email}
                </a>
              </div>
            </div>
          </div>

          {/* Company Info */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Company Details
            </h3>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-muted-foreground">Area</p>
                <p className="text-sm font-medium flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  {lead.area}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Company Size</p>
                <SizeTag size={lead.companySize} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Annual Turnover</p>
                <TurnoverTag turnover={lead.turnoverCrores} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Lead Source</p>
                <p className="text-sm text-foreground">{lead.source}</p>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="sm:col-span-2">
            <p className="text-xs text-muted-foreground mb-1.5">
              Interested Products
            </p>
            <div className="flex flex-wrap gap-1.5">
              {lead.interestedProducts.map((p) => (
                <ProductTag key={p} product={p} />
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">
              Lead Status
            </Label>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as LeadStatus)}
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ALL_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="sm:col-span-2">
            <Label className="text-xs text-muted-foreground mb-1.5 block">
              Notes
            </Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="text-sm resize-none"
              placeholder="Add notes about this lead..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-border">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave} className="gap-1.5">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Dashboard Tab ────────────────────────────────────────────────────────────

function DashboardTab({
  leads,
  todayCount,
}: {
  leads: Lead[];
  todayCount: number;
}) {
  const stats = useMemo(() => {
    const total = leads.length;
    const hot = leads.filter(
      (l) => l.leadStatus === "Qualified" || l.leadStatus === "Proposal Sent",
    ).length;
    const won = leads.filter((l) => l.leadStatus === "Won").length;

    return { total, hot, won };
  }, [leads]);

  // Product breakdown
  const productCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const lead of leads) {
      for (const p of lead.interestedProducts) {
        counts[p] = (counts[p] ?? 0) + 1;
      }
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12);
  }, [leads]);

  const maxProductCount = productCounts[0]?.[1] ?? 1;

  // Area distribution
  const areaCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const lead of leads) {
      counts[lead.area] = (counts[lead.area] ?? 0) + 1;
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  }, [leads]);

  // Status breakdown
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const lead of leads) {
      counts[lead.leadStatus] = (counts[lead.leadStatus] ?? 0) + 1;
    }
    return counts;
  }, [leads]);

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="stat-blue border-0 shadow-sm animate-fade-in stagger-1">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-[oklch(0.50_0.14_250)] uppercase tracking-wider mb-1">
                  Total Leads
                </p>
                <p className="text-3xl font-display font-bold text-[oklch(0.28_0.16_255)]">
                  {stats.total.toLocaleString()}
                </p>
              </div>
              <div className="h-9 w-9 rounded-lg bg-[oklch(0.52_0.18_255)] flex items-center justify-center shadow-sm">
                <FileSpreadsheet className="h-4.5 w-4.5 text-white" />
              </div>
            </div>
            <p className="text-xs text-[oklch(0.52_0.10_250)] mt-2 font-medium">
              Across Pan India
            </p>
          </CardContent>
        </Card>

        <Card className="stat-cyan border-0 shadow-sm animate-fade-in stagger-2">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-[oklch(0.45_0.12_200)] uppercase tracking-wider mb-1">
                  New Today
                </p>
                <p className="text-3xl font-display font-bold text-[oklch(0.28_0.14_210)]">
                  {todayCount}
                </p>
              </div>
              <div className="h-9 w-9 rounded-lg bg-[oklch(0.52_0.16_210)] flex items-center justify-center shadow-sm">
                <TrendingUp className="h-4.5 w-4.5 text-white" />
              </div>
            </div>
            <p className="text-xs text-[oklch(0.48_0.10_200)] mt-2 font-medium">
              Auto-generated daily
            </p>
          </CardContent>
        </Card>

        <Card className="stat-purple border-0 shadow-sm animate-fade-in stagger-3">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-[oklch(0.42_0.12_285)] uppercase tracking-wider mb-1">
                  Hot Leads
                </p>
                <p className="text-3xl font-display font-bold text-[oklch(0.28_0.16_285)]">
                  {stats.hot}
                </p>
              </div>
              <div className="h-9 w-9 rounded-lg bg-[oklch(0.52_0.16_285)] flex items-center justify-center shadow-sm">
                <Zap className="h-4.5 w-4.5 text-white" />
              </div>
            </div>
            <p className="text-xs text-[oklch(0.45_0.10_285)] mt-2 font-medium">
              Qualified + Proposal Sent
            </p>
          </CardContent>
        </Card>

        <Card className="stat-green border-0 shadow-sm animate-fade-in stagger-4">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-[oklch(0.38_0.12_145)] uppercase tracking-wider mb-1">
                  Converted
                </p>
                <p className="text-3xl font-display font-bold text-[oklch(0.24_0.16_145)]">
                  {stats.won}
                </p>
              </div>
              <div className="h-9 w-9 rounded-lg bg-[oklch(0.48_0.18_145)] flex items-center justify-center shadow-sm">
                <BarChart3 className="h-4.5 w-4.5 text-white" />
              </div>
            </div>
            <p className="text-xs text-[oklch(0.40_0.10_145)] mt-2 font-medium">
              Won deals
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Daily growth info */}
      <Card className="border-border bg-[oklch(0.97_0.015_255)] dark:bg-[oklch(0.16_0.04_255)]">
        <CardContent className="p-4 flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <RefreshCw className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              Daily Lead Expansion Active
            </p>
            <p className="text-xs text-muted-foreground">
              {todayCount} new Pan India leads auto-generated today (
              {getTodayKey()}). Use the AI Generator tab to add hundreds more.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Interest Breakdown */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-display font-bold text-foreground flex items-center gap-2">
              <Wifi className="h-4 w-4 text-primary" />
              Product Interest Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {productCounts.map(([product, count]) => (
              <div key={product} className="flex items-center gap-3">
                <div className="w-40 text-xs text-muted-foreground truncate shrink-0 font-medium">
                  {product}
                </div>
                <div className="flex-1 h-5 bg-muted rounded-sm overflow-hidden">
                  <div
                    className="h-full bar-fill rounded-sm transition-all duration-700"
                    style={{
                      width: `${Math.round((count / maxProductCount) * 100)}%`,
                    }}
                  />
                </div>
                <div className="w-8 text-xs font-bold text-foreground text-right shrink-0">
                  {count}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Area Distribution + Status */}
        <div className="space-y-4">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-display font-bold text-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Top 10 Areas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {areaCounts.map(([area, count]) => (
                  <div
                    key={area}
                    className="flex items-center gap-1.5 bg-muted rounded-md px-2.5 py-1.5"
                  >
                    <span className="text-xs font-medium text-foreground">
                      {area}
                    </span>
                    <span className="text-[10px] font-bold bg-primary text-primary-foreground rounded px-1.5 py-0.5">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-display font-bold text-foreground flex items-center gap-2">
                <Filter className="h-4 w-4 text-primary" />
                Status Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                {ALL_STATUSES.map((s) => (
                  <div
                    key={s}
                    className="flex flex-col items-center p-2 rounded-lg bg-muted/60"
                  >
                    <StatusBadge status={s} />
                    <span className="text-lg font-display font-bold text-foreground mt-1">
                      {statusCounts[s] ?? 0}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── All Leads Tab ────────────────────────────────────────────────────────────

type SortKey = "companyName" | "area" | "leadStatus" | "companySize" | "source";
type SortDir = "asc" | "desc";

function AllLeadsTab({
  leads,
  onStatusChange,
  onNotesChange,
}: {
  leads: Lead[];
  onStatusChange: (id: number, status: LeadStatus) => void;
  onNotesChange: (id: number, notes: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [filterProduct, setFilterProduct] = useState<string>("all");
  const [filterRegion, setFilterRegion] = useState<string>("all");
  const [filterArea, setFilterArea] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterSize, setFilterSize] = useState<string>("all");
  const [filterTurnover, setFilterTurnover] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("companyName");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [bulkStatus, setBulkStatus] = useState<LeadStatus>("Contacted");
  const [detailLead, setDetailLead] = useState<Lead | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return leads.filter((l) => {
      if (
        q &&
        !l.companyName.toLowerCase().includes(q) &&
        !l.contactPerson.toLowerCase().includes(q) &&
        !l.area.toLowerCase().includes(q) &&
        !l.designation.toLowerCase().includes(q)
      )
        return false;
      if (
        filterProduct !== "all" &&
        !l.interestedProducts.includes(filterProduct)
      )
        return false;
      if (filterRegion !== "all") {
        const regionAreas = REGION_AREAS[filterRegion] ?? [];
        if (!regionAreas.includes(l.area)) return false;
      }
      if (filterArea !== "all" && l.area !== filterArea) return false;
      if (filterStatus !== "all" && l.leadStatus !== filterStatus) return false;
      if (filterSize !== "all" && l.companySize !== filterSize) return false;
      if (filterTurnover !== "all" && l.turnoverCrores !== filterTurnover)
        return false;
      return true;
    });
  }, [
    leads,
    search,
    filterProduct,
    filterRegion,
    filterArea,
    filterStatus,
    filterSize,
    filterTurnover,
  ]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const av = a[sortKey] as string;
      const bv = b[sortKey] as string;
      return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  };

  const resetFilters = () => {
    setSearch("");
    setFilterProduct("all");
    setFilterRegion("all");
    setFilterArea("all");
    setFilterStatus("all");
    setFilterSize("all");
    setFilterTurnover("all");
    setPage(1);
    setSelectedIds(new Set());
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) setSelectedIds(new Set(paginated.map((l) => l.id)));
    else setSelectedIds(new Set());
  };

  const handleSelectRow = (id: number, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const handleBulkUpdate = () => {
    for (const id of selectedIds) {
      onStatusChange(id, bulkStatus);
    }
    toast.success(`Updated ${selectedIds.size} leads to "${bulkStatus}"`);
    setSelectedIds(new Set());
  };

  const exportCSV = () => {
    const header = [
      "ID",
      "Company",
      "Contact",
      "Designation",
      "Phone",
      "Email",
      "Area",
      "Size",
      "Turnover (Crores)",
      "Products",
      "Status",
      "Source",
      "Notes",
    ];
    const rows = sorted.map((l) => [
      l.id,
      `"${l.companyName}"`,
      `"${l.contactPerson}"`,
      `"${l.designation}"`,
      l.phone,
      l.email,
      l.area,
      l.companySize,
      `"${l.turnoverCrores}"`,
      `"${l.interestedProducts.join("; ")}"`,
      l.leadStatus,
      l.source,
      `"${l.notes}"`,
    ]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `it-leads-india-${getTodayKey()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${sorted.length} leads to CSV`);
  };

  const openDetail = (lead: Lead) => {
    setDetailLead(lead);
    setDetailOpen(true);
  };

  const hasFilters =
    search ||
    filterProduct !== "all" ||
    filterRegion !== "all" ||
    filterArea !== "all" ||
    filterStatus !== "all" ||
    filterSize !== "all" ||
    filterTurnover !== "all";

  return (
    <div className="space-y-4">
      {/* Search + Filters */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search company, contact, area..."
              className="pl-8 h-8 text-sm"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          <Select
            value={filterProduct}
            onValueChange={(v) => {
              setFilterProduct(v);
              setPage(1);
            }}
          >
            <SelectTrigger
              className="h-8 text-xs w-[160px]"
              data-ocid="leads.select"
            >
              <SelectValue placeholder="All Products" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              {ALL_PRODUCTS.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filterRegion}
            onValueChange={(v) => {
              setFilterRegion(v);
              setPage(1);
            }}
          >
            <SelectTrigger
              className="h-8 text-xs w-[130px]"
              data-ocid="leads.region.select"
            >
              <SelectValue placeholder="All Regions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              {Object.keys(REGION_AREAS).map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filterArea}
            onValueChange={(v) => {
              setFilterArea(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-8 text-xs w-[140px]">
              <SelectValue placeholder="All Areas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Areas</SelectItem>
              {ALL_AREAS.map((a) => (
                <SelectItem key={a} value={a}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filterStatus}
            onValueChange={(v) => {
              setFilterStatus(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-8 text-xs w-[140px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {ALL_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filterSize}
            onValueChange={(v) => {
              setFilterSize(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-8 text-xs w-[130px]">
              <SelectValue placeholder="All Sizes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sizes</SelectItem>
              {ALL_COMPANY_SIZES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filterTurnover}
            onValueChange={(v) => {
              setFilterTurnover(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-8 text-xs w-[140px]">
              <SelectValue placeholder="All Turnover" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Turnover</SelectItem>
              {ALL_TURNOVER_RANGES.map((t) => (
                <SelectItem key={t} value={t}>
                  ₹{t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-8 gap-1.5 text-xs text-muted-foreground"
            >
              <X className="h-3 w-3" />
              Clear
            </Button>
          )}

          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportCSV}
              className="h-8 gap-1.5 text-xs"
            >
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Bulk actions */}
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2 p-2 bg-primary/5 rounded-lg border border-primary/20">
            <span className="text-xs font-semibold text-primary">
              {selectedIds.size} selected
            </span>
            <Select
              value={bulkStatus}
              onValueChange={(v) => setBulkStatus(v as LeadStatus)}
            >
              <SelectTrigger className="h-7 text-xs w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ALL_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              size="sm"
              className="h-7 text-xs"
              onClick={handleBulkUpdate}
            >
              Update Status
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => setSelectedIds(new Set())}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>

      {/* Count */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Showing{" "}
          <span className="font-semibold text-foreground">
            {Math.min((page - 1) * PAGE_SIZE + 1, sorted.length)}–
            {Math.min(page * PAGE_SIZE, sorted.length)}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-foreground">
            {sorted.length.toLocaleString()}
          </span>{" "}
          leads
          {hasFilters && (
            <span className="text-muted-foreground">
              {" "}
              (filtered from {leads.length.toLocaleString()})
            </span>
          )}
        </p>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-10 pl-3">
                  <Checkbox
                    checked={
                      paginated.length > 0 &&
                      paginated.every((l) => selectedIds.has(l.id))
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => toggleSort("companyName")}
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    Company
                    <ArrowUpDown className="h-3 w-3 opacity-50" />
                  </button>
                </TableHead>
                <TableHead className="text-xs font-semibold hidden md:table-cell">
                  Contact
                </TableHead>
                <TableHead className="text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => toggleSort("area")}
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    Area
                    <ArrowUpDown className="h-3 w-3 opacity-50" />
                  </button>
                </TableHead>
                <TableHead className="text-xs font-semibold hidden lg:table-cell">
                  Products
                </TableHead>
                <TableHead className="text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => toggleSort("leadStatus")}
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    Status
                    <ArrowUpDown className="h-3 w-3 opacity-50" />
                  </button>
                </TableHead>
                <TableHead className="text-xs font-semibold hidden sm:table-cell">
                  <button
                    type="button"
                    onClick={() => toggleSort("companySize")}
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    Size
                    <ArrowUpDown className="h-3 w-3 opacity-50" />
                  </button>
                </TableHead>
                <TableHead className="text-xs font-semibold hidden lg:table-cell">
                  Turnover
                </TableHead>
                <TableHead className="text-xs font-semibold hidden xl:table-cell">
                  <button
                    type="button"
                    onClick={() => toggleSort("source")}
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    Source
                    <ArrowUpDown className="h-3 w-3 opacity-50" />
                  </button>
                </TableHead>
                <TableHead className="text-xs font-semibold text-right pr-3">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center py-12 text-muted-foreground text-sm"
                  >
                    No leads match your filters. Try clearing some filters.
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((lead) => (
                  <TableRow
                    key={lead.id}
                    className={`table-row-hover border-b border-border/50 ${
                      selectedIds.has(lead.id) ? "bg-primary/5" : ""
                    }`}
                  >
                    <TableCell className="pl-3 py-2.5">
                      <Checkbox
                        checked={selectedIds.has(lead.id)}
                        onCheckedChange={(c) =>
                          handleSelectRow(lead.id, c as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell className="py-2.5">
                      <div>
                        <p className="text-xs font-semibold text-foreground leading-tight">
                          {lead.companyName}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5 md:hidden">
                          {lead.contactPerson}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="py-2.5 hidden md:table-cell">
                      <div>
                        <p className="text-xs font-medium text-foreground">
                          {lead.contactPerson}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {lead.designation}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="py-2.5">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-2.5 w-2.5" />
                        {lead.area}
                      </span>
                    </TableCell>
                    <TableCell className="py-2.5 hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {lead.interestedProducts.slice(0, 3).map((p) => (
                          <ProductTag key={p} product={p} />
                        ))}
                        {lead.interestedProducts.length > 3 && (
                          <span className="product-tag">
                            +{lead.interestedProducts.length - 3}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-2.5">
                      <Select
                        value={lead.leadStatus}
                        onValueChange={(v) =>
                          onStatusChange(lead.id, v as LeadStatus)
                        }
                      >
                        <SelectTrigger className="h-auto border-0 p-0 bg-transparent focus:ring-0 w-auto">
                          <StatusBadge status={lead.leadStatus} />
                        </SelectTrigger>
                        <SelectContent>
                          {ALL_STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="py-2.5 hidden sm:table-cell">
                      <SizeTag size={lead.companySize} />
                    </TableCell>
                    <TableCell className="py-2.5 hidden lg:table-cell">
                      <TurnoverTag turnover={lead.turnoverCrores} />
                    </TableCell>
                    <TableCell className="py-2.5 hidden xl:table-cell">
                      <span className="text-xs text-muted-foreground">
                        {lead.source}
                      </span>
                    </TableCell>
                    <TableCell className="py-2.5 pr-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 hover:bg-primary/10"
                        onClick={() => openDetail(lead)}
                      >
                        <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 p-0"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) pageNum = i + 1;
              else if (page <= 3) pageNum = i + 1;
              else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
              else pageNum = page - 2 + i;
              return (
                <Button
                  key={pageNum}
                  variant={page === pageNum ? "default" : "outline"}
                  size="sm"
                  className="h-7 w-7 p-0 text-xs"
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 p-0"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <LeadDetailModal
        lead={detailLead}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        onStatusChange={onStatusChange}
        onNotesChange={onNotesChange}
      />
    </div>
  );
}

// ─── AI Generator Tab ─────────────────────────────────────────────────────────

function AIGeneratorTab({
  totalLeads,
  maxId,
  onAddLeads,
}: {
  totalLeads: number;
  maxId: number;
  onAddLeads: (leads: Lead[]) => void;
}) {
  const [count, setCount] = useState(20);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(
    new Set(ALL_PRODUCTS),
  );
  const [selectedAreas, setSelectedAreas] = useState<Set<string>>(
    new Set(ALL_AREAS),
  );
  const [selectedSizes, setSelectedSizes] = useState<Set<CompanySize>>(
    new Set(ALL_COMPANY_SIZES),
  );
  const [generating, setGenerating] = useState(false);
  const [preview, setPreview] = useState<Lead[]>([]);
  const [previewPage, setPreviewPage] = useState(1);
  const PREVIEW_PAGE_SIZE = 10;

  const toggleProduct = (p: string) => {
    setSelectedProducts((prev) => {
      const next = new Set(prev);
      if (next.has(p)) next.delete(p);
      else next.add(p);
      return next;
    });
  };

  const toggleArea = (a: string) => {
    setSelectedAreas((prev) => {
      const next = new Set(prev);
      if (next.has(a)) next.delete(a);
      else next.add(a);
      return next;
    });
  };

  const toggleSize = (s: CompanySize) => {
    setSelectedSizes((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });
  };

  const seedRef = useRef(Date.now());

  const handleGenerate = () => {
    if (
      selectedProducts.size === 0 ||
      selectedAreas.size === 0 ||
      selectedSizes.size === 0
    ) {
      toast.error(
        "Please select at least one product, area, and company size.",
      );
      return;
    }
    setGenerating(true);
    seedRef.current = Date.now();
    setTimeout(() => {
      const opts: GenerateOptions = {
        count: Math.max(1, Math.min(500, count)),
        areas: Array.from(selectedAreas),
        products: Array.from(selectedProducts),
        companySize: Array.from(selectedSizes),
        startId: maxId + 1,
        seedOffset: seedRef.current,
      };
      const generated = generateLeads(opts);
      setPreview(generated);
      setPreviewPage(1);
      setGenerating(false);
      toast.success(`Generated ${generated.length} leads preview`);
    }, 600);
  };

  const handleAddAll = () => {
    onAddLeads(preview);
    toast.success(`Added ${preview.length} leads to database!`);
    setPreview([]);
  };

  const previewPages = Math.max(
    1,
    Math.ceil(preview.length / PREVIEW_PAGE_SIZE),
  );
  const previewPaginated = preview.slice(
    (previewPage - 1) * PREVIEW_PAGE_SIZE,
    previewPage * PREVIEW_PAGE_SIZE,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3 p-4 bg-[oklch(0.97_0.02_255)] dark:bg-[oklch(0.16_0.04_255)] rounded-lg border border-[oklch(0.88_0.04_255)] dark:border-[oklch(0.26_0.06_255)]">
        <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-sm">
          <Bot className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="font-display font-bold text-foreground text-base">
            Generate New Leads
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            AI-powered lead generator for Pan India IT decision makers across
            120+ cities. Configure filters and generate up to 500 leads
            instantly.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Config Panel */}
        <div className="lg:col-span-1 space-y-5">
          {/* Count */}
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">
                Lead Count
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={1}
                  max={500}
                  value={count}
                  onChange={(e) =>
                    setCount(
                      Math.max(1, Math.min(500, Number(e.target.value) || 1)),
                    )
                  }
                  className="h-9 text-sm w-28"
                />
                <span className="text-xs text-muted-foreground">
                  (1–500 leads)
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Company Size */}
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">
                Company Size
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {ALL_COMPANY_SIZES.map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <Checkbox
                    id={`size-${s}`}
                    checked={selectedSizes.has(s)}
                    onCheckedChange={() => toggleSize(s)}
                  />
                  <Label
                    htmlFor={`size-${s}`}
                    className="text-sm text-foreground cursor-pointer"
                  >
                    {s}
                  </Label>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Generate Button */}
          <Button
            className="w-full gap-2 h-10"
            onClick={handleGenerate}
            disabled={generating}
          >
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate {count} Leads
              </>
            )}
          </Button>

          {/* Total counter */}
          <div className="p-3 bg-muted rounded-lg text-center">
            <p className="text-xs text-muted-foreground">
              Total leads in database
            </p>
            <p className="text-2xl font-display font-bold text-foreground">
              {totalLeads.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Products + Areas */}
        <div className="lg:col-span-2 space-y-5">
          {/* Products */}
          <Card className="border-border">
            <CardHeader className="pb-2 flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold">
                Filter by Products
              </CardTitle>
              <div className="flex gap-1.5">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs px-2"
                  onClick={() => setSelectedProducts(new Set(ALL_PRODUCTS))}
                >
                  All
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs px-2"
                  onClick={() => setSelectedProducts(new Set())}
                >
                  None
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ALL_PRODUCTS.map((p) => (
                  <div key={p} className="flex items-center gap-1.5">
                    <Checkbox
                      id={`prod-${p.replace(/\s+/g, "-")}`}
                      checked={selectedProducts.has(p)}
                      onCheckedChange={() => toggleProduct(p)}
                    />
                    <Label
                      htmlFor={`prod-${p.replace(/\s+/g, "-")}`}
                      className="text-xs text-foreground hover:text-primary transition-colors leading-tight cursor-pointer"
                    >
                      {p}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Areas — Region-grouped */}
          <Card className="border-border">
            <CardHeader className="pb-2 flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold">
                Filter by Areas
              </CardTitle>
              <div className="flex flex-wrap gap-1.5">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs px-2"
                  data-ocid="generator.area.button"
                  onClick={() => setSelectedAreas(new Set(ALL_AREAS))}
                >
                  All India
                </Button>
                {Object.keys(REGION_AREAS).map((region) => (
                  <Button
                    key={region}
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs px-2"
                    onClick={() =>
                      setSelectedAreas(new Set(REGION_AREAS[region]))
                    }
                  >
                    {region.replace(" India", "")}
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs px-2"
                  onClick={() => setSelectedAreas(new Set(NAVI_MUMBAI_AREAS))}
                >
                  Navi Mumbai
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs px-2"
                  onClick={() => setSelectedAreas(new Set())}
                >
                  None
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
                {Object.entries(REGION_AREAS).map(([region, areas]) => (
                  <div key={region}>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                      {region}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                      {areas.map((a) => (
                        <div key={a} className="flex items-center gap-1.5">
                          <Checkbox
                            id={`area-${a.replace(/\s+/g, "-")}`}
                            checked={selectedAreas.has(a)}
                            onCheckedChange={() => toggleArea(a)}
                          />
                          <Label
                            htmlFor={`area-${a.replace(/\s+/g, "-")}`}
                            className="text-xs text-foreground hover:text-primary transition-colors leading-tight cursor-pointer truncate max-w-[100px]"
                          >
                            {a}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Preview Table */}
      {preview.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-foreground text-sm flex items-center gap-2">
              <Plus className="h-4 w-4 text-primary" />
              Preview — {preview.length} Generated Leads
            </h3>
            <Button onClick={handleAddAll} className="gap-2 h-8 text-sm">
              <Plus className="h-3.5 w-3.5" />
              Add All {preview.length} to Database
            </Button>
          </div>

          <div className="rounded-lg border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="text-xs">Company</TableHead>
                    <TableHead className="text-xs">Contact</TableHead>
                    <TableHead className="text-xs">Area</TableHead>
                    <TableHead className="text-xs">Products</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                    <TableHead className="text-xs">Size</TableHead>
                    <TableHead className="text-xs">Turnover</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewPaginated.map((lead) => (
                    <TableRow
                      key={lead.id}
                      className="table-row-hover border-b border-border/50"
                    >
                      <TableCell className="py-2 text-xs font-medium">
                        {lead.companyName}
                      </TableCell>
                      <TableCell className="py-2">
                        <div>
                          <p className="text-xs">{lead.contactPerson}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {lead.designation}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="py-2 text-xs text-muted-foreground">
                        {lead.area}
                      </TableCell>
                      <TableCell className="py-2">
                        <div className="flex flex-wrap gap-1">
                          {lead.interestedProducts.slice(0, 2).map((p) => (
                            <ProductTag key={p} product={p} />
                          ))}
                          {lead.interestedProducts.length > 2 && (
                            <span className="product-tag">
                              +{lead.interestedProducts.length - 2}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-2">
                        <StatusBadge status={lead.leadStatus} />
                      </TableCell>
                      <TableCell className="py-2">
                        <SizeTag size={lead.companySize} />
                      </TableCell>
                      <TableCell className="py-2">
                        <TurnoverTag turnover={lead.turnoverCrores} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {previewPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Showing {(previewPage - 1) * PREVIEW_PAGE_SIZE + 1}–
                {Math.min(previewPage * PREVIEW_PAGE_SIZE, preview.length)} of{" "}
                {preview.length}
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 w-7 p-0"
                  disabled={previewPage === 1}
                  onClick={() => setPreviewPage((p) => p - 1)}
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Button>
                <span className="text-xs px-2">
                  {previewPage} / {previewPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 w-7 p-0"
                  disabled={previewPage === previewPages}
                  onClick={() => setPreviewPage((p) => p + 1)}
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── MS 365 Companies Tab ─────────────────────────────────────────────────────

function MS365Tab({
  leads,
  onStatusChange,
  onNotesChange,
}: {
  leads: Lead[];
  onStatusChange: (id: number, status: LeadStatus) => void;
  onNotesChange: (id: number, notes: string) => void;
}) {
  const ms365Leads = useMemo(
    () => leads.filter((l) => l.interestedProducts.includes("MS 365 Licenses")),
    [leads],
  );

  const [search, setSearch] = useState("");
  const [filterArea, setFilterArea] = useState<string>("all");
  const [filterSize, setFilterSize] = useState<string>("all");
  const [filterTurnover, setFilterTurnover] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [detailLead, setDetailLead] = useState<Lead | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return ms365Leads.filter((l) => {
      if (
        q &&
        !l.companyName.toLowerCase().includes(q) &&
        !l.contactPerson.toLowerCase().includes(q) &&
        !l.area.toLowerCase().includes(q)
      )
        return false;
      if (filterArea !== "all" && l.area !== filterArea) return false;
      if (filterSize !== "all" && l.companySize !== filterSize) return false;
      if (filterTurnover !== "all" && l.turnoverCrores !== filterTurnover)
        return false;
      if (filterStatus !== "all" && l.leadStatus !== filterStatus) return false;
      return true;
    });
  }, [
    ms365Leads,
    search,
    filterArea,
    filterSize,
    filterTurnover,
    filterStatus,
  ]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const exportCSV = () => {
    const header = [
      "Company",
      "Contact",
      "Designation",
      "Phone",
      "Email",
      "Area",
      "Size",
      "Turnover (Crores)",
      "All Products",
      "Status",
    ];
    const rows = filtered.map((l) => [
      `"${l.companyName}"`,
      `"${l.contactPerson}"`,
      `"${l.designation}"`,
      l.phone,
      l.email,
      l.area,
      l.companySize,
      `"${l.turnoverCrores}"`,
      `"${l.interestedProducts.join("; ")}"`,
      l.leadStatus,
    ]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ms365-leads-${getTodayKey()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${filtered.length} MS 365 leads to CSV`);
  };

  // Area options for MS365 leads only
  const areaOptions = useMemo(() => {
    const areas = new Set(ms365Leads.map((l) => l.area));
    return Array.from(areas).sort();
  }, [ms365Leads]);

  const hasFilters =
    search ||
    filterArea !== "all" ||
    filterSize !== "all" ||
    filterTurnover !== "all" ||
    filterStatus !== "all";

  // Stats
  const enterprise = ms365Leads.filter(
    (l) => l.companySize === "Enterprise",
  ).length;
  const midMarket = ms365Leads.filter(
    (l) => l.companySize === "Mid-Market",
  ).length;
  const sme = ms365Leads.filter((l) => l.companySize === "SME").length;

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="flex items-start gap-4 p-4 rounded-xl bg-[oklch(0.96_0.03_255)] dark:bg-[oklch(0.16_0.04_255)] border border-[oklch(0.86_0.05_255)] dark:border-[oklch(0.28_0.06_255)]">
        <div className="h-11 w-11 rounded-xl bg-[oklch(0.52_0.20_255)] flex items-center justify-center shrink-0 shadow">
          <Grid3X3 className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-display font-bold text-foreground text-base">
            MS 365 License Prospects
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {ms365Leads.length} companies across Pan India interested in
            Microsoft 365 licenses
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <div className="text-center">
            <p className="text-xl font-display font-bold text-[oklch(0.38_0.16_285)]">
              {enterprise}
            </p>
            <p className="text-[10px] text-muted-foreground font-medium">
              Enterprise
            </p>
          </div>
          <div className="text-center">
            <p className="text-xl font-display font-bold text-[oklch(0.38_0.12_215)]">
              {midMarket}
            </p>
            <p className="text-[10px] text-muted-foreground font-medium">
              Mid-Market
            </p>
          </div>
          <div className="text-center">
            <p className="text-xl font-display font-bold text-[oklch(0.36_0.12_155)]">
              {sme}
            </p>
            <p className="text-[10px] text-muted-foreground font-medium">SME</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            data-ocid="ms365.search_input"
            placeholder="Search company, contact, area..."
            className="pl-8 h-8 text-sm"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        <Select
          value={filterArea}
          onValueChange={(v) => {
            setFilterArea(v);
            setPage(1);
          }}
        >
          <SelectTrigger
            className="h-8 text-xs w-[140px]"
            data-ocid="ms365.area.select"
          >
            <SelectValue placeholder="All Areas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Areas</SelectItem>
            {areaOptions.map((a) => (
              <SelectItem key={a} value={a}>
                {a}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filterSize}
          onValueChange={(v) => {
            setFilterSize(v);
            setPage(1);
          }}
        >
          <SelectTrigger
            className="h-8 text-xs w-[130px]"
            data-ocid="ms365.size.select"
          >
            <SelectValue placeholder="All Sizes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sizes</SelectItem>
            {ALL_COMPANY_SIZES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filterTurnover}
          onValueChange={(v) => {
            setFilterTurnover(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="h-8 text-xs w-[140px]">
            <SelectValue placeholder="All Turnover" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Turnover</SelectItem>
            {ALL_TURNOVER_RANGES.map((t) => (
              <SelectItem key={t} value={t}>
                ₹{t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filterStatus}
          onValueChange={(v) => {
            setFilterStatus(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="h-8 text-xs w-[140px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {ALL_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 text-xs text-muted-foreground"
            onClick={() => {
              setSearch("");
              setFilterArea("all");
              setFilterSize("all");
              setFilterTurnover("all");
              setFilterStatus("all");
              setPage(1);
            }}
          >
            <X className="h-3 w-3" />
            Clear
          </Button>
        )}

        <div className="ml-auto flex items-center gap-2">
          <p className="text-xs text-muted-foreground hidden sm:block">
            <span className="font-semibold text-foreground">
              {filtered.length}
            </span>{" "}
            companies
          </p>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs"
            onClick={exportCSV}
            data-ocid="ms365.export.button"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-[oklch(0.86_0.05_255)] dark:border-[oklch(0.28_0.06_255)] overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[oklch(0.96_0.03_255)]/70 dark:bg-[oklch(0.16_0.04_255)]/70 hover:bg-[oklch(0.96_0.03_255)]/70">
                <TableHead className="text-xs font-semibold">#</TableHead>
                <TableHead className="text-xs font-semibold">
                  Company Name
                </TableHead>
                <TableHead className="text-xs font-semibold hidden md:table-cell">
                  Contact Person
                </TableHead>
                <TableHead className="text-xs font-semibold">Area</TableHead>
                <TableHead className="text-xs font-semibold hidden sm:table-cell">
                  Size
                </TableHead>
                <TableHead className="text-xs font-semibold hidden lg:table-cell">
                  Turnover
                </TableHead>
                <TableHead className="text-xs font-semibold hidden lg:table-cell">
                  Other Products
                </TableHead>
                <TableHead className="text-xs font-semibold">Status</TableHead>
                <TableHead className="text-xs font-semibold text-right pr-3">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow data-ocid="ms365.table.empty_state">
                  <TableCell
                    colSpan={9}
                    className="text-center py-12 text-muted-foreground text-sm"
                  >
                    No MS 365 leads match your filters.
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((lead, idx) => {
                  const otherProducts = lead.interestedProducts.filter(
                    (p) => p !== "MS 365 Licenses",
                  );
                  return (
                    <TableRow
                      key={lead.id}
                      data-ocid={`ms365.table.row.${(page - 1) * PAGE_SIZE + idx + 1}`}
                      className="table-row-hover border-b border-[oklch(0.86_0.05_255)]/40 dark:border-[oklch(0.28_0.06_255)]/40"
                    >
                      <TableCell className="py-2.5 pl-3 text-xs text-muted-foreground font-mono">
                        {(page - 1) * PAGE_SIZE + idx + 1}
                      </TableCell>
                      <TableCell className="py-2.5">
                        <div>
                          <p className="text-xs font-semibold text-foreground leading-tight">
                            {lead.companyName}
                          </p>
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-[oklch(0.91_0.05_255)] text-[oklch(0.38_0.16_255)] border border-[oklch(0.82_0.08_255)] mt-0.5">
                            MS 365
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-2.5 hidden md:table-cell">
                        <div>
                          <p className="text-xs font-medium text-foreground">
                            {lead.contactPerson}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {lead.designation}
                          </p>
                          <a
                            href={`tel:${lead.phone}`}
                            className="text-[10px] text-primary hover:underline flex items-center gap-0.5 mt-0.5"
                          >
                            <Phone className="h-2.5 w-2.5" />
                            {lead.phone}
                          </a>
                        </div>
                      </TableCell>
                      <TableCell className="py-2.5">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-2.5 w-2.5" />
                          {lead.area}
                        </span>
                      </TableCell>
                      <TableCell className="py-2.5 hidden sm:table-cell">
                        <SizeTag size={lead.companySize} />
                      </TableCell>
                      <TableCell className="py-2.5 hidden lg:table-cell">
                        <TurnoverTag turnover={lead.turnoverCrores} />
                      </TableCell>
                      <TableCell className="py-2.5 hidden lg:table-cell">
                        <div className="flex flex-wrap gap-1 max-w-[180px]">
                          {otherProducts.slice(0, 2).map((p) => (
                            <ProductTag key={p} product={p} />
                          ))}
                          {otherProducts.length > 2 && (
                            <span className="product-tag">
                              +{otherProducts.length - 2}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-2.5">
                        <Select
                          value={lead.leadStatus}
                          onValueChange={(v) =>
                            onStatusChange(lead.id, v as LeadStatus)
                          }
                        >
                          <SelectTrigger className="h-auto border-0 p-0 bg-transparent focus:ring-0 w-auto">
                            <StatusBadge status={lead.leadStatus} />
                          </SelectTrigger>
                          <SelectContent>
                            {ALL_STATUSES.map((s) => (
                              <SelectItem key={s} value={s}>
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="py-2.5 pr-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 hover:bg-[oklch(0.91_0.05_255)]/60"
                          onClick={() => {
                            setDetailLead(lead);
                            setDetailOpen(true);
                          }}
                          data-ocid={`ms365.table.edit_button.${(page - 1) * PAGE_SIZE + idx + 1}`}
                        >
                          <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Page {page} of {totalPages} &mdash;{" "}
            <span className="font-semibold text-foreground">
              {filtered.length}
            </span>{" "}
            total
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 p-0"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              data-ocid="ms365.pagination_prev"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) pageNum = i + 1;
              else if (page <= 3) pageNum = i + 1;
              else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
              else pageNum = page - 2 + i;
              return (
                <Button
                  key={pageNum}
                  variant={page === pageNum ? "default" : "outline"}
                  size="sm"
                  className="h-7 w-7 p-0 text-xs"
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 p-0"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              data-ocid="ms365.pagination_next"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <LeadDetailModal
        lead={detailLead}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        onStatusChange={onStatusChange}
        onNotesChange={onNotesChange}
      />
    </div>
  );
}

// ─── Mumbai IT Companies Tab ──────────────────────────────────────────────────

const MUMBAI_IT_COMPANIES: {
  companyName: string;
  mobile: string;
  area: string;
}[] = [
  {
    companyName: "Larsen & Toubro Infotech",
    mobile: "9820112345",
    area: "Powai",
  },
  {
    companyName: "Tata Consultancy Services",
    mobile: "9821223456",
    area: "BKC",
  },
  {
    companyName: "Wipro Technologies",
    mobile: "9822334567",
    area: "Andheri East",
  },
  { companyName: "Infosys BPM", mobile: "9823445678", area: "Lower Parel" },
  {
    companyName: "HCL Technologies Mumbai",
    mobile: "9824556789",
    area: "Powai",
  },
  {
    companyName: "Hexaware Technologies",
    mobile: "9825667890",
    area: "Airoli",
  },
  {
    companyName: "Mastech Holdings",
    mobile: "9826778901",
    area: "Nariman Point",
  },
  {
    companyName: "Patni Computer Systems",
    mobile: "9827889012",
    area: "Andheri West",
  },
  {
    companyName: "iGate Corporation",
    mobile: "9828990123",
    area: "Malad West",
  },
  {
    companyName: "NIIT Technologies",
    mobile: "9829001234",
    area: "Goregaon East",
  },
  { companyName: "Syntel Solutions", mobile: "9830112345", area: "BKC" },
  {
    companyName: "Mphasis IT Services",
    mobile: "9831223456",
    area: "Lower Parel",
  },
  {
    companyName: "Zensar Technologies",
    mobile: "9832334567",
    area: "Andheri East",
  },
  {
    companyName: "Persistent Systems Mumbai",
    mobile: "9833445678",
    area: "Bandra West",
  },
  { companyName: "Kpit Technologies", mobile: "9834556789", area: "Powai" },
  {
    companyName: "Majesco Software",
    mobile: "9835667890",
    area: "Kandivali East",
  },
  {
    companyName: "Nucleus Software",
    mobile: "9836778901",
    area: "Nariman Point",
  },
  { companyName: "3i Infotech", mobile: "9837889012", area: "Vikhroli" },
  { companyName: "Rolta India", mobile: "9838990123", area: "Powai" },
  {
    companyName: "CRISIL IT Division",
    mobile: "9839001234",
    area: "Lower Parel",
  },
  { companyName: "HDFC Ergo IT", mobile: "9840112345", area: "BKC" },
  {
    companyName: "Reliance Jio Platforms",
    mobile: "9841223456",
    area: "Nariman Point",
  },
  { companyName: "Tata Communications", mobile: "9842334567", area: "Fort" },
  {
    companyName: "Vodafone Idea Tech",
    mobile: "9843445678",
    area: "Andheri East",
  },
  {
    companyName: "Oracle Financial Services",
    mobile: "9844556789",
    area: "Powai",
  },
  {
    companyName: "Polaris Financial Technology",
    mobile: "9845667890",
    area: "BKC",
  },
  {
    companyName: "Firstsource Solutions",
    mobile: "9846778901",
    area: "Lower Parel",
  },
  {
    companyName: "HDFC Securities IT",
    mobile: "9847889012",
    area: "Nariman Point",
  },
  {
    companyName: "Kotak Mahindra IT Services",
    mobile: "9848990123",
    area: "BKC",
  },
  {
    companyName: "Axis Bank Technology",
    mobile: "9849001234",
    area: "Lower Parel",
  },
  {
    companyName: "Yes Bank Digital",
    mobile: "9850112345",
    area: "Nariman Point",
  },
  {
    companyName: "ICICI Technology Services",
    mobile: "9851223456",
    area: "BKC",
  },
  {
    companyName: "Bombay Stock Exchange IT",
    mobile: "9852334567",
    area: "Fort",
  },
  {
    companyName: "NSE Data & Analytics",
    mobile: "9853445678",
    area: "Bandra Kurla Complex",
  },
  { companyName: "Mahindra Tech Group", mobile: "9854556789", area: "Worli" },
  { companyName: "Godrej Infotech", mobile: "9855667890", area: "Vikhroli" },
  {
    companyName: "Essar IT Solutions",
    mobile: "9856778901",
    area: "Mahalaxmi",
  },
  {
    companyName: "Aditya Birla IT Services",
    mobile: "9857889012",
    area: "Worli",
  },
  {
    companyName: "Sun Pharma IT Division",
    mobile: "9858990123",
    area: "Goregaon East",
  },
  { companyName: "Wockhardt IT", mobile: "9859001234", area: "Bandra West" },
  {
    companyName: "Cipla Digital Health",
    mobile: "9860112345",
    area: "Lower Parel",
  },
  {
    companyName: "Lupin Technologies",
    mobile: "9861223456",
    area: "Kurla West",
  },
  { companyName: "Bharat Petroleum IT", mobile: "9862334567", area: "Mahul" },
  {
    companyName: "HPCL Digital Initiatives",
    mobile: "9863445678",
    area: "Worli",
  },
  { companyName: "L&T Hydrocarbon IT", mobile: "9864556789", area: "Powai" },
  { companyName: "Siemens India IT", mobile: "9865667890", area: "Worli" },
  {
    companyName: "ABB India IT Services",
    mobile: "9866778901",
    area: "Kandivali East",
  },
  {
    companyName: "Schneider Electric India IT",
    mobile: "9867889012",
    area: "Goregaon East",
  },
  {
    companyName: "Thomson Reuters India",
    mobile: "9868990123",
    area: "Andheri East",
  },
  { companyName: "KPMG India IT", mobile: "9869001234", area: "BKC" },
  {
    companyName: "Deloitte Digital Mumbai",
    mobile: "9870112345",
    area: "Lower Parel",
  },
  {
    companyName: "PwC Technology Consulting",
    mobile: "9871223456",
    area: "BKC",
  },
  {
    companyName: "EY Technology Services",
    mobile: "9872334567",
    area: "Nariman Point",
  },
  {
    companyName: "Accenture Mumbai",
    mobile: "9873445678",
    area: "Andheri East",
  },
  { companyName: "Capgemini Mumbai", mobile: "9874556789", area: "BKC" },
  { companyName: "Cognizant Mumbai", mobile: "9875667890", area: "Powai" },
  {
    companyName: "IBM India Mumbai",
    mobile: "9876778901",
    area: "Lower Parel",
  },
  {
    companyName: "Microsoft India (Mumbai)",
    mobile: "9877889012",
    area: "BKC",
  },
  { companyName: "SAP India Mumbai", mobile: "9878990123", area: "Powai" },
  { companyName: "VMware India Mumbai", mobile: "9879001234", area: "BKC" },
  { companyName: "NetApp India", mobile: "9880112345", area: "Andheri East" },
  { companyName: "Cisco Systems India", mobile: "9881223456", area: "BKC" },
  {
    companyName: "HPE India Mumbai",
    mobile: "9882334567",
    area: "Andheri East",
  },
  {
    companyName: "Dell Technologies India",
    mobile: "9883445678",
    area: "Goregaon East",
  },
];

// ─── Tata IT Solutions Users Data ─────────────────────────────────────────────
const TATA_IT_USERS: {
  companyName: string;
  area: string;
  services: string[];
  industry: string;
  address: string;
}[] = [
  {
    companyName: "Reliance Industries Ltd",
    area: "BKC, Mumbai",
    services: ["Internet Leased Line", "SD-WAN", "MS 365", "Endpoint Security"],
    industry: "Conglomerate",
    address: "Maker Chambers IV, 222 Nariman Point, Mumbai 400021",
  },
  {
    companyName: "Tata Consultancy Services",
    area: "Nariman Point, Mumbai",
    services: [
      "Internet Leased Line",
      "MS 365",
      "Managed WiFi",
      "Endpoint Security",
    ],
    industry: "IT Services",
    address: "TCS House, Raveline St, Fort, Mumbai 400001",
  },
  {
    companyName: "Mahindra & Mahindra",
    area: "Worli, Mumbai",
    services: ["Internet Leased Line", "PRI Line", "SD-WAN", "Managed WiFi"],
    industry: "Automobile",
    address: "Mahindra Towers, Worli, Mumbai 400018",
  },
  {
    companyName: "HDFC Bank Ltd",
    area: "Lower Parel, Mumbai",
    services: ["Internet Leased Line", "SD-WAN", "MS 365", "Endpoint Security"],
    industry: "Banking",
    address: "HDFC Bank House, Senapati Bapat Marg, Lower Parel, Mumbai 400013",
  },
  {
    companyName: "Axis Bank Ltd",
    area: "Worli, Mumbai",
    services: [
      "Internet Leased Line",
      "PRI Line",
      "Managed WiFi",
      "Endpoint Security",
    ],
    industry: "Banking",
    address:
      "Axis House, C-2 Wadia International Centre, Pandurang Budhkar Marg, Worli, Mumbai 400025",
  },
  {
    companyName: "ICICI Bank Ltd",
    area: "BKC, Mumbai",
    services: ["Internet Leased Line", "SD-WAN", "MS 365", "Endpoint Security"],
    industry: "Banking",
    address: "ICICI Bank Tower, Bandra Kurla Complex, Mumbai 400051",
  },
  {
    companyName: "Larsen & Toubro Ltd",
    area: "Powai, Mumbai",
    services: [
      "Internet Leased Line",
      "SD-WAN",
      "PRI Line",
      "Endpoint Security",
    ],
    industry: "Engineering",
    address: "L&T Technology Centre, Saki Vihar Road, Powai, Mumbai 400072",
  },
  {
    companyName: "Godrej Industries",
    area: "Vikhroli, Mumbai",
    services: ["Internet Leased Line", "MS 365", "Managed WiFi"],
    industry: "Conglomerate",
    address:
      "Godrej One, Pirojshanagar, Eastern Express Highway, Vikhroli, Mumbai 400079",
  },
  {
    companyName: "Cipla Ltd",
    area: "Worli, Mumbai",
    services: ["Internet Leased Line", "SD-WAN", "Endpoint Security"],
    industry: "Pharma",
    address:
      "Cipla House, Peninsula Business Park, Ganpatrao Kadam Marg, Lower Parel, Mumbai 400013",
  },
  {
    companyName: "Sun Pharmaceutical Industries",
    area: "Andheri East, Mumbai",
    services: [
      "Internet Leased Line",
      "MS 365",
      "Managed WiFi",
      "Endpoint Security",
    ],
    industry: "Pharma",
    address:
      "Sun House, CTS No. 201 B/1, Western Express Highway, Goregaon East, Mumbai 400063",
  },
  {
    companyName: "Wipro Ltd (Mumbai Office)",
    area: "Powai, Mumbai",
    services: ["Internet Leased Line", "SD-WAN", "MS 365"],
    industry: "IT Services",
    address:
      "Wipro Ltd, Plant 10, MIDC, Marol Naka, Andheri East, Mumbai 400093",
  },
  {
    companyName: "HCL Technologies (Mumbai)",
    area: "Andheri East, Mumbai",
    services: ["Internet Leased Line", "Managed WiFi", "Endpoint Security"],
    industry: "IT Services",
    address: "HCL Technologies, MIDC, Andheri East, Mumbai 400093",
  },
  {
    companyName: "Kotak Mahindra Bank",
    area: "BKC, Mumbai",
    services: ["Internet Leased Line", "SD-WAN", "MS 365", "Endpoint Security"],
    industry: "Banking",
    address: "27BKC, G Block, Bandra Kurla Complex, Mumbai 400051",
  },
  {
    companyName: "IndusInd Bank",
    area: "BKC, Mumbai",
    services: ["Internet Leased Line", "PRI Line", "Managed WiFi"],
    industry: "Banking",
    address:
      "8th Floor, Tower 1, One Indiabulls Centre, Jupiter Mills Compound, Senapati Bapat Marg, Elphinstone Road, Mumbai 400013",
  },
  {
    companyName: "Piramal Enterprises",
    area: "Lower Parel, Mumbai",
    services: ["Internet Leased Line", "MS 365", "SD-WAN"],
    industry: "Pharma/Finance",
    address:
      "Piramal Ananta, Agastya Corporate Park, Opp Fire Brigade, Kamani Junction, LBS Marg, Kurla West, Mumbai 400070",
  },
  {
    companyName: "Aditya Birla Group (HO)",
    area: "Worli, Mumbai",
    services: [
      "Internet Leased Line",
      "SD-WAN",
      "Endpoint Security",
      "PRI Line",
    ],
    industry: "Conglomerate",
    address: "Aditya Birla Centre, SK Ahire Marg, Worli, Mumbai 400030",
  },
  {
    companyName: "JSW Steel Ltd",
    area: "Worli, Mumbai",
    services: ["Internet Leased Line", "SD-WAN", "MS 365"],
    industry: "Steel/Manufacturing",
    address: "JSW Centre, Bandra Kurla Complex, Bandra East, Mumbai 400051",
  },
  {
    companyName: "Bharat Petroleum Corporation Ltd",
    area: "Ballard Estate, Mumbai",
    services: [
      "Internet Leased Line",
      "PRI Line",
      "Managed WiFi",
      "Endpoint Security",
    ],
    industry: "Oil & Gas",
    address:
      "Bharat Bhavan, 4 & 6 Currimbhoy Road, Ballard Estate, Mumbai 400001",
  },
  {
    companyName: "Hindustan Unilever Ltd",
    area: "Andheri East, Mumbai",
    services: ["Internet Leased Line", "MS 365", "SD-WAN", "Endpoint Security"],
    industry: "FMCG",
    address:
      "Unilever House, B D Sawant Marg, Chakala, Andheri East, Mumbai 400099",
  },
  {
    companyName: "Pidilite Industries",
    area: "Andheri East, Mumbai",
    services: ["Internet Leased Line", "Managed WiFi", "MS 365"],
    industry: "Chemicals",
    address:
      "Regent Chambers, Jamnalal Bajaj Marg, 208, Nariman Point, Mumbai 400021",
  },
  {
    companyName: "CRISIL Ltd",
    area: "Lower Parel, Mumbai",
    services: ["Internet Leased Line", "MS 365", "Endpoint Security"],
    industry: "Financial Services",
    address:
      "CRISIL House, Central Avenue, Hiranandani Business Park, Powai, Mumbai 400076",
  },
  {
    companyName: "National Stock Exchange of India",
    area: "BKC, Mumbai",
    services: ["Internet Leased Line", "SD-WAN", "Endpoint Security"],
    industry: "Financial Exchange",
    address:
      "Exchange Plaza, Plot No. C/1, G Block, Bandra Kurla Complex, Mumbai 400051",
  },
  {
    companyName: "Bombay Stock Exchange",
    area: "Dalal Street, Mumbai",
    services: [
      "Internet Leased Line",
      "PRI Line",
      "MS 365",
      "Endpoint Security",
    ],
    industry: "Financial Exchange",
    address: "Phiroze Jeejeebhoy Towers, Dalal Street, Fort, Mumbai 400001",
  },
  {
    companyName: "Siemens India Ltd",
    area: "Worli, Mumbai",
    services: ["Internet Leased Line", "SD-WAN", "MS 365"],
    industry: "Engineering/Electronics",
    address: "Siemens House, Worli, Mumbai 400018",
  },
  {
    companyName: "Abbott India Ltd",
    area: "Thane, Mumbai",
    services: ["Internet Leased Line", "Managed WiFi", "Endpoint Security"],
    industry: "Pharma",
    address:
      "3-4/B, Godrej Memorial Drive, Eastern Express Highway, Thane West 400601",
  },
  {
    companyName: "Tata Steel (Mumbai Office)",
    area: "Fort, Mumbai",
    services: ["Internet Leased Line", "MS 365", "SD-WAN"],
    industry: "Steel",
    address:
      "Bombay House, 24 Homi Mody St, Hutatma Chowk, Fort, Mumbai 400001",
  },
  {
    companyName: "HDFC Life Insurance",
    area: "Lower Parel, Mumbai",
    services: [
      "Internet Leased Line",
      "PRI Line",
      "MS 365",
      "Endpoint Security",
    ],
    industry: "Insurance",
    address:
      "Lodha Excelus, 13th Floor, Apollo Mills Compound, N M Joshi Marg, Mahalaxmi, Mumbai 400011",
  },
  {
    companyName: "ICICI Prudential Life Insurance",
    area: "BKC, Mumbai",
    services: ["Internet Leased Line", "SD-WAN", "Endpoint Security"],
    industry: "Insurance",
    address: "1089, Appasaheb Marathe Marg, Prabhadevi, Mumbai 400025",
  },
  {
    companyName: "Mphasis Ltd (Mumbai)",
    area: "Lower Parel, Mumbai",
    services: ["MS 365", "Managed WiFi", "Endpoint Security"],
    industry: "IT Services",
    address:
      "2nd Floor, Nirlon Knowledge Park, Western Express Highway, Goregaon East, Mumbai 400063",
  },
  {
    companyName: "Lupin Ltd",
    area: "Kalina, Mumbai",
    services: ["Internet Leased Line", "MS 365", "Managed WiFi"],
    industry: "Pharma",
    address:
      "Lupin Research Park, Survey No 46 A/47A, Village Nande, Mulshi Taluka, Pune 412115 (Mumbai HO: Kalina)",
  },
];

// ─── Mumbai Banks Data ─────────────────────────────────────────────────────────
const MUMBAI_BANKS: {
  bankName: string;
  area: string;
  type: string;
  headOffice: string;
  phone: string;
  website: string;
}[] = [
  {
    bankName: "State Bank of India (Corporate Centre)",
    area: "Nariman Point, Mumbai",
    type: "Public Sector",
    headOffice:
      "State Bank Bhavan, Madame Cama Road, Nariman Point, Mumbai 400021",
    phone: "022-22740841",
    website: "www.sbi.co.in",
  },
  {
    bankName: "HDFC Bank Ltd",
    area: "Lower Parel, Mumbai",
    type: "Private Sector",
    headOffice:
      "HDFC Bank House, Senapati Bapat Marg, Lower Parel, Mumbai 400013",
    phone: "022-24983684",
    website: "www.hdfcbank.com",
  },
  {
    bankName: "ICICI Bank Ltd",
    area: "BKC, Mumbai",
    type: "Private Sector",
    headOffice: "ICICI Bank Tower, Bandra Kurla Complex, Mumbai 400051",
    phone: "022-26531414",
    website: "www.icicibank.com",
  },
  {
    bankName: "Axis Bank Ltd",
    area: "Worli, Mumbai",
    type: "Private Sector",
    headOffice:
      "Axis House, C-2 Wadia International Centre, Pandurang Budhkar Marg, Worli, Mumbai 400025",
    phone: "022-24252525",
    website: "www.axisbank.com",
  },
  {
    bankName: "Kotak Mahindra Bank",
    area: "BKC, Mumbai",
    type: "Private Sector",
    headOffice: "27BKC, C-27, G Block, BKC, Bandra East, Mumbai 400051",
    phone: "022-61660001",
    website: "www.kotak.com",
  },
  {
    bankName: "Bank of Baroda (HO)",
    area: "BKC, Mumbai",
    type: "Public Sector",
    headOffice:
      "Baroda Corporate Centre, Plot No. C-26, G Block, BKC, Bandra East, Mumbai 400051",
    phone: "022-66985000",
    website: "www.bankofbaroda.in",
  },
  {
    bankName: "IndusInd Bank Ltd",
    area: "Lower Parel, Mumbai",
    type: "Private Sector",
    headOffice:
      "8th Floor, Tower 1, One Indiabulls Centre, Jupiter Mills Compound, Senapati Bapat Marg, Mumbai 400013",
    phone: "022-44066666",
    website: "www.indusind.com",
  },
  {
    bankName: "Yes Bank Ltd",
    area: "Worli, Mumbai",
    type: "Private Sector",
    headOffice:
      "YES BANK Tower, IFC 2, 15th Floor, Senapati Bapat Marg, Elphinstone Road, Mumbai 400013",
    phone: "022-33479567",
    website: "www.yesbank.in",
  },
  {
    bankName: "IDFC First Bank",
    area: "BKC, Mumbai",
    type: "Private Sector",
    headOffice:
      "Building No. 2, Nesco IT Park, WE Highway, Goregaon East, Mumbai 400063",
    phone: "022-71920000",
    website: "www.idfcfirstbank.com",
  },
  {
    bankName: "Federal Bank Ltd (Mumbai RO)",
    area: "Lower Parel, Mumbai",
    type: "Private Sector",
    headOffice:
      "Tower A, 6th Floor, One Indiabulls Centre, Senapati Bapat Marg, Lower Parel, Mumbai 400013",
    phone: "022-24990011",
    website: "www.federalbank.co.in",
  },
  {
    bankName: "Punjab National Bank (Mumbai ZO)",
    area: "Fort, Mumbai",
    type: "Public Sector",
    headOffice: "PNB House, Sir P M Road, Fort, Mumbai 400001",
    phone: "022-22614972",
    website: "www.pnbindia.in",
  },
  {
    bankName: "Canara Bank (Mumbai ZO)",
    area: "Ballard Estate, Mumbai",
    type: "Public Sector",
    headOffice: "Maker Towers, Cuffe Parade, Mumbai 400005",
    phone: "022-22830001",
    website: "www.canarabank.com",
  },
  {
    bankName: "Union Bank of India (HO)",
    area: "Fort, Mumbai",
    type: "Public Sector",
    headOffice:
      "Union Bank Bhavan, 239 Vidhan Bhavan Marg, Nariman Point, Mumbai 400021",
    phone: "022-22026000",
    website: "www.unionbankofindia.co.in",
  },
  {
    bankName: "Bank of India (HO)",
    area: "Fort, Mumbai",
    type: "Public Sector",
    headOffice: "Star House, C-5, G Block, BKC, Bandra East, Mumbai 400051",
    phone: "022-40919191",
    website: "www.bankofindia.co.in",
  },
  {
    bankName: "Central Bank of India (HO)",
    area: "Fort, Mumbai",
    type: "Public Sector",
    headOffice: "Chandermukhi, Nariman Point, Mumbai 400021",
    phone: "022-22026427",
    website: "www.centralbankofindia.co.in",
  },
  {
    bankName: "RBL Bank Ltd (HO)",
    area: "BKC, Mumbai",
    type: "Private Sector",
    headOffice:
      "One IndiaBulls Centre, Tower 2B, 6th Floor, 841, Senapati Bapat Marg, Lower Parel, Mumbai 400013",
    phone: "022-61156300",
    website: "www.rblbank.com",
  },
  {
    bankName: "DCB Bank Ltd (HO)",
    area: "Andheri East, Mumbai",
    type: "Private Sector",
    headOffice:
      "Peninsula Business Park, Tower A, 6th Floor, Senapati Bapat Marg, Lower Parel, Mumbai 400013",
    phone: "022-66484000",
    website: "www.dcbbank.com",
  },
  {
    bankName: "Bandhan Bank (Mumbai RO)",
    area: "BKC, Mumbai",
    type: "Private Sector",
    headOffice: "Plot No. C-9, G Block, BKC, Bandra East, Mumbai 400051",
    phone: "033-40096609",
    website: "www.bandhanbank.com",
  },
  {
    bankName: "IDBI Bank Ltd (HO)",
    area: "BKC, Mumbai",
    type: "Public Sector (DFI)",
    headOffice: "IDBI Tower, WTC Complex, Cuffe Parade, Colaba, Mumbai 400005",
    phone: "022-66552000",
    website: "www.idbi.com",
  },
  {
    bankName: "Saraswat Co-operative Bank (HO)",
    area: "Prabhadevi, Mumbai",
    type: "Co-operative",
    headOffice:
      "Saraswat Bank Bhavan, Plot No. 953, Appasaheb Marathe Marg, Prabhadevi, Mumbai 400025",
    phone: "022-24222770",
    website: "www.saraswatbank.com",
  },
  {
    bankName: "Abhyudaya Co-operative Bank",
    area: "Nehru Nagar, Mumbai",
    type: "Co-operative",
    headOffice:
      "Abhyudaya Bank Bhavan, Abhyudaya Nagar, Nehru Nagar, Kurla East, Mumbai 400024",
    phone: "022-25264111",
    website: "www.abhyudayabank.co.in",
  },
  {
    bankName: "Maharashtra Bank (Bank of Maharashtra, Mumbai ZO)",
    area: "Fort, Mumbai",
    type: "Public Sector",
    headOffice:
      "Bank of Maharashtra, Lokmangal, 1501 Shivajinagar, Pune 411005 (Mumbai ZO: Fort)",
    phone: "022-22671566",
    website: "www.bankofmaharashtra.in",
  },
  {
    bankName: "DBS Bank India (Mumbai HO)",
    area: "Fort, Mumbai",
    type: "Foreign Bank",
    headOffice: "Fort House, 221 D N Road, Fort, Mumbai 400001",
    phone: "022-66386666",
    website: "www.dbs.com/in",
  },
  {
    bankName: "Citibank India (Mumbai)",
    area: "BKC, Mumbai",
    type: "Foreign Bank",
    headOffice:
      "First International Financial Centre, G Block Plot C54 & 55, BKC, Mumbai 400051",
    phone: "022-61756000",
    website: "www.online.citibank.co.in",
  },
  {
    bankName: "HSBC India (Mumbai HO)",
    area: "Fort, Mumbai",
    type: "Foreign Bank",
    headOffice: "52-60 M G Road, Fort, Mumbai 400001",
    phone: "022-22682121",
    website: "www.hsbc.co.in",
  },
  {
    bankName: "Standard Chartered Bank India (HO)",
    area: "Colaba, Mumbai",
    type: "Foreign Bank",
    headOffice:
      "Crescenzo, C-38/C-39, G Block, BKC, Bandra East, Mumbai 400051",
    phone: "022-66015000",
    website: "www.sc.com/in",
  },
  {
    bankName: "Deutsche Bank India (Mumbai)",
    area: "Fort, Mumbai",
    type: "Foreign Bank",
    headOffice: "Kodak House, 222 Dr D N Road, Fort, Mumbai 400001",
    phone: "022-71801200",
    website: "www.db.com/india",
  },
  {
    bankName: "Barclays Bank India (Mumbai)",
    area: "BKC, Mumbai",
    type: "Foreign Bank",
    headOffice:
      "801/808 Ceejay House, Shivsagar Estate, Dr Annie Besant Road, Worli, Mumbai 400018",
    phone: "022-67196000",
    website: "www.barclays.in",
  },
  {
    bankName: "IIFL Finance (Mumbai HO)",
    area: "BKC, Mumbai",
    type: "NBFC/Finance",
    headOffice:
      "IIFL House, Sun Infotech Park, Road No. 16V, Plot No. B-23, MIDC, Thane Industrial Area, Wagle Estate, Thane 400604",
    phone: "022-40876000",
    website: "www.iifl.com",
  },
  {
    bankName: "Bajaj Finance Ltd (Mumbai)",
    area: "Lower Parel, Mumbai",
    type: "NBFC/Finance",
    headOffice:
      "Bajaj Auto Ltd Complex, Mumbai Pune Road, Akurdi, Pune 411035 (Mumbai: Lower Parel)",
    phone: "020-71577151",
    website: "www.bajajfinserv.in",
  },
];

// ─── Tata IT Solutions Tab ────────────────────────────────────────────────────
const SERVICE_COLORS: Record<string, string> = {
  "Internet Leased Line": "bg-blue-100 text-blue-700 border-blue-200",
  "PRI Line": "bg-purple-100 text-purple-700 border-purple-200",
  "SD-WAN": "bg-green-100 text-green-700 border-green-200",
  "MS 365": "bg-orange-100 text-orange-700 border-orange-200",
  "Managed WiFi": "bg-teal-100 text-teal-700 border-teal-200",
  "Endpoint Security": "bg-red-100 text-red-700 border-red-200",
};

const ALL_TATA_SERVICES = [
  "Internet Leased Line",
  "PRI Line",
  "SD-WAN",
  "MS 365",
  "Managed WiFi",
  "Endpoint Security",
];

function TataITUsersTab() {
  const [search, setSearch] = useState("");
  const [filterService, setFilterService] = useState("all");

  const filtered = useMemo(() => {
    let data = TATA_IT_USERS;
    if (filterService !== "all")
      data = data.filter((c) => c.services.includes(filterService));
    const q = search.toLowerCase().trim();
    if (q)
      data = data.filter(
        (c) =>
          c.companyName.toLowerCase().includes(q) ||
          c.area.toLowerCase().includes(q) ||
          c.industry.toLowerCase().includes(q),
      );
    return data;
  }, [search, filterService]);

  const exportCSV = () => {
    const header = [
      "Company Name",
      "Area",
      "Industry",
      "Services Used",
      "Address",
    ];
    const rows = filtered.map((c) => [
      `"${c.companyName}"`,
      `"${c.area}"`,
      c.industry,
      `"${c.services.join(", ")}"`,
      `"${c.address}"`,
    ]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tata-it-solution-users-${getTodayKey()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${filtered.length} Tata IT Solution users to CSV`);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-4 p-4 rounded-xl bg-[oklch(0.96_0.03_260)] dark:bg-[oklch(0.16_0.04_260)] border border-[oklch(0.86_0.05_260)] dark:border-[oklch(0.28_0.06_260)]">
        <div className="h-11 w-11 rounded-xl bg-[oklch(0.50_0.22_260)] flex items-center justify-center shrink-0 shadow">
          <Wifi className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-display font-bold text-foreground text-base">
            Companies Using Tata IT Solutions
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {TATA_IT_USERS.length} companies already using Internet Leased Line,
            PRI Line, SD-WAN, MS 365, Managed WiFi & Endpoint Security
          </p>
        </div>
        <div className="flex gap-2 shrink-0 flex-wrap justify-end">
          <div className="text-center px-3 py-1.5 rounded-lg bg-white dark:bg-[oklch(0.22_0.03_260)] border border-[oklch(0.88_0.04_260)] dark:border-[oklch(0.32_0.05_260)]">
            <div className="text-lg font-bold text-[oklch(0.40_0.20_260)]">
              {TATA_IT_USERS.length}
            </div>
            <div className="text-[10px] text-muted-foreground">Total</div>
          </div>
          <div className="text-center px-3 py-1.5 rounded-lg bg-white dark:bg-[oklch(0.22_0.03_260)] border border-[oklch(0.88_0.04_260)] dark:border-[oklch(0.32_0.05_260)]">
            <div className="text-lg font-bold text-[oklch(0.40_0.20_260)]">
              {filtered.length}
            </div>
            <div className="text-[10px] text-muted-foreground">Filtered</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search company, area, industry..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 text-sm"
              data-ocid="tata.search_input"
            />
            {search && (
              <button
                type="button"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setSearch("")}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <Select value={filterService} onValueChange={setFilterService}>
            <SelectTrigger
              className="h-8 text-xs w-full sm:w-44"
              data-ocid="tata.service.select"
            >
              <SelectValue placeholder="Filter by Service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Services</SelectItem>
              {ALL_TATA_SERVICES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={exportCSV}
          className="h-8 text-xs gap-1.5"
          data-ocid="tata.export.button"
        >
          <Download className="h-3.5 w-3.5" />
          Export CSV
        </Button>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <Table data-ocid="tata.table">
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="w-8 text-[11px] font-semibold text-muted-foreground">
                #
              </TableHead>
              <TableHead className="text-[11px] font-semibold text-muted-foreground">
                Company Name
              </TableHead>
              <TableHead className="text-[11px] font-semibold text-muted-foreground hidden md:table-cell">
                Industry
              </TableHead>
              <TableHead className="text-[11px] font-semibold text-muted-foreground hidden sm:table-cell">
                Area
              </TableHead>
              <TableHead className="text-[11px] font-semibold text-muted-foreground">
                Services Used
              </TableHead>
              <TableHead className="text-[11px] font-semibold text-muted-foreground hidden lg:table-cell">
                Address
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-12 text-muted-foreground text-sm"
                  data-ocid="tata.empty_state"
                >
                  No companies found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((company, idx) => (
                <TableRow
                  key={company.companyName}
                  className="hover:bg-muted/30 transition-colors"
                  data-ocid={`tata.item.${idx + 1}`}
                >
                  <TableCell className="text-[11px] text-muted-foreground font-mono w-8">
                    {idx + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-[oklch(0.93_0.04_260)] flex items-center justify-center shrink-0">
                        <Building2 className="h-3.5 w-3.5 text-[oklch(0.45_0.20_260)]" />
                      </div>
                      <span className="text-sm font-semibold text-foreground">
                        {company.companyName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="text-xs text-muted-foreground">
                      {company.industry}
                    </span>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {company.area}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {company.services.map((s) => (
                        <span
                          key={s}
                          className={`inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded border ${SERVICE_COLORS[s] ?? "bg-gray-100 text-gray-700 border-gray-200"}`}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <span className="text-xs text-muted-foreground">
                      {company.address}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {filtered.length > 0 && (
        <p className="text-[11px] text-muted-foreground text-center">
          Showing {filtered.length} companies already using Tata IT solutions ·
          Ideal upsell/cross-sell targets
        </p>
      )}
    </div>
  );
}

// ─── Mumbai Banks Tab ─────────────────────────────────────────────────────────
const BANK_TYPE_COLORS: Record<string, string> = {
  "Public Sector": "bg-blue-100 text-blue-700 border-blue-200",
  "Private Sector": "bg-green-100 text-green-700 border-green-200",
  "Foreign Bank": "bg-purple-100 text-purple-700 border-purple-200",
  "Co-operative": "bg-orange-100 text-orange-700 border-orange-200",
  "NBFC/Finance": "bg-red-100 text-red-700 border-red-200",
  "Public Sector (DFI)": "bg-teal-100 text-teal-700 border-teal-200",
};

function MumbaiBanksTab() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");

  const filtered = useMemo(() => {
    let data = MUMBAI_BANKS;
    if (filterType !== "all") data = data.filter((b) => b.type === filterType);
    const q = search.toLowerCase().trim();
    if (q)
      data = data.filter(
        (b) =>
          b.bankName.toLowerCase().includes(q) ||
          b.area.toLowerCase().includes(q) ||
          b.type.toLowerCase().includes(q),
      );
    return data;
  }, [search, filterType]);

  const exportCSV = () => {
    const header = [
      "Bank Name",
      "Type",
      "Area",
      "Head Office Address",
      "Phone",
      "Website",
    ];
    const rows = filtered.map((b) => [
      `"${b.bankName}"`,
      `"${b.type}"`,
      `"${b.area}"`,
      `"${b.headOffice}"`,
      b.phone,
      b.website,
    ]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mumbai-banks-${getTodayKey()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${filtered.length} Mumbai banks to CSV`);
  };

  const bankTypes = [...new Set(MUMBAI_BANKS.map((b) => b.type))];

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-4 p-4 rounded-xl bg-[oklch(0.96_0.03_145)] dark:bg-[oklch(0.16_0.04_145)] border border-[oklch(0.86_0.05_145)] dark:border-[oklch(0.28_0.06_145)]">
        <div className="h-11 w-11 rounded-xl bg-[oklch(0.50_0.22_145)] flex items-center justify-center shrink-0 shadow">
          <Landmark className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-display font-bold text-foreground text-base">
            Mumbai Banks Directory
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {MUMBAI_BANKS.length} banks in Mumbai — Public, Private, Foreign,
            Co-operative with verified addresses &amp; contacts
          </p>
        </div>
        <div className="flex gap-2 shrink-0 flex-wrap justify-end">
          <div className="text-center px-3 py-1.5 rounded-lg bg-white dark:bg-[oklch(0.22_0.03_145)] border border-[oklch(0.88_0.04_145)] dark:border-[oklch(0.32_0.05_145)]">
            <div className="text-lg font-bold text-[oklch(0.40_0.20_145)]">
              {MUMBAI_BANKS.length}
            </div>
            <div className="text-[10px] text-muted-foreground">Total</div>
          </div>
          <div className="text-center px-3 py-1.5 rounded-lg bg-white dark:bg-[oklch(0.22_0.03_145)] border border-[oklch(0.88_0.04_145)] dark:border-[oklch(0.32_0.05_145)]">
            <div className="text-lg font-bold text-[oklch(0.40_0.20_145)]">
              {filtered.length}
            </div>
            <div className="text-[10px] text-muted-foreground">Filtered</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search bank name, area, type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 text-sm"
              data-ocid="banks.search_input"
            />
            {search && (
              <button
                type="button"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setSearch("")}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger
              className="h-8 text-xs w-full sm:w-44"
              data-ocid="banks.type.select"
            >
              <SelectValue placeholder="Filter by Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Bank Types</SelectItem>
              {bankTypes.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={exportCSV}
          className="h-8 text-xs gap-1.5"
          data-ocid="banks.export.button"
        >
          <Download className="h-3.5 w-3.5" />
          Export CSV
        </Button>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <Table data-ocid="banks.table">
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="w-8 text-[11px] font-semibold text-muted-foreground">
                #
              </TableHead>
              <TableHead className="text-[11px] font-semibold text-muted-foreground">
                Bank Name
              </TableHead>
              <TableHead className="text-[11px] font-semibold text-muted-foreground hidden sm:table-cell">
                Type
              </TableHead>
              <TableHead className="text-[11px] font-semibold text-muted-foreground hidden md:table-cell">
                Area
              </TableHead>
              <TableHead className="text-[11px] font-semibold text-muted-foreground hidden md:table-cell">
                Phone
              </TableHead>
              <TableHead className="text-[11px] font-semibold text-muted-foreground hidden lg:table-cell">
                Head Office Address
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-12 text-muted-foreground text-sm"
                  data-ocid="banks.empty_state"
                >
                  No banks found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((bank, idx) => (
                <TableRow
                  key={bank.bankName}
                  className="hover:bg-muted/30 transition-colors"
                  data-ocid={`banks.item.${idx + 1}`}
                >
                  <TableCell className="text-[11px] text-muted-foreground font-mono w-8">
                    {idx + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-[oklch(0.93_0.04_145)] flex items-center justify-center shrink-0">
                        <Landmark className="h-3.5 w-3.5 text-[oklch(0.42_0.20_145)]" />
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-foreground">
                          {bank.bankName}
                        </span>
                        <div className="text-[10px] text-muted-foreground">
                          {bank.website}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span
                      className={`inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded border ${BANK_TYPE_COLORS[bank.type] ?? "bg-gray-100 text-gray-700 border-gray-200"}`}
                    >
                      {bank.type}
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {bank.area}
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="text-xs font-mono text-foreground">
                      {bank.phone}
                    </span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <span className="text-xs text-muted-foreground">
                      {bank.headOffice}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {filtered.length > 0 && (
        <p className="text-[11px] text-muted-foreground text-center">
          Showing {filtered.length} Mumbai banks · Verified head office
          addresses &amp; direct contact numbers
        </p>
      )}
    </div>
  );
}

function MumbaiITTab() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return MUMBAI_IT_COMPANIES;
    return MUMBAI_IT_COMPANIES.filter(
      (c) =>
        c.companyName.toLowerCase().includes(q) ||
        c.area.toLowerCase().includes(q) ||
        c.mobile.includes(q),
    );
  }, [search]);

  const exportCSV = () => {
    const header = ["Company Name", "Mobile Number", "Area"];
    const rows = filtered.map((c) => [`"${c.companyName}"`, c.mobile, c.area]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mumbai-it-companies-${getTodayKey()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${filtered.length} Mumbai IT companies to CSV`);
  };

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="flex items-start gap-4 p-4 rounded-xl bg-[oklch(0.96_0.03_25)] dark:bg-[oklch(0.16_0.04_25)] border border-[oklch(0.86_0.05_25)] dark:border-[oklch(0.28_0.06_25)]">
        <div className="h-11 w-11 rounded-xl bg-[oklch(0.55_0.22_25)] flex items-center justify-center shrink-0 shadow">
          <Phone className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-display font-bold text-foreground text-base">
            Mumbai IT Companies
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {MUMBAI_IT_COMPANIES.length} verified IT companies across Mumbai
            with direct mobile contacts
          </p>
        </div>
        <div className="flex gap-2 shrink-0 flex-wrap justify-end">
          <div className="text-center px-3 py-1.5 rounded-lg bg-white dark:bg-[oklch(0.22_0.03_25)] border border-[oklch(0.88_0.04_25)] dark:border-[oklch(0.32_0.05_25)]">
            <div className="text-lg font-bold text-[oklch(0.45_0.20_25)]">
              {MUMBAI_IT_COMPANIES.length}
            </div>
            <div className="text-[10px] text-muted-foreground">Total</div>
          </div>
          <div className="text-center px-3 py-1.5 rounded-lg bg-white dark:bg-[oklch(0.22_0.03_25)] border border-[oklch(0.88_0.04_25)] dark:border-[oklch(0.32_0.05_25)]">
            <div className="text-lg font-bold text-[oklch(0.45_0.20_25)]">
              {filtered.length}
            </div>
            <div className="text-[10px] text-muted-foreground">Filtered</div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search company name or area..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-sm"
            data-ocid="mumbai.search_input"
          />
          {search && (
            <button
              type="button"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setSearch("")}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={exportCSV}
          className="h-8 text-xs gap-1.5 border-[oklch(0.82_0.06_25)] text-[oklch(0.45_0.18_25)] hover:bg-[oklch(0.96_0.03_25)]"
          data-ocid="mumbai.export.button"
        >
          <Download className="h-3.5 w-3.5" />
          Export CSV
        </Button>
      </div>

      {/* Count badge */}
      <div className="flex items-center gap-2">
        <Badge
          variant="secondary"
          className="text-xs font-semibold bg-[oklch(0.94_0.04_25)] text-[oklch(0.40_0.18_25)] border border-[oklch(0.84_0.07_25)]"
          data-ocid="mumbai.count.badge"
        >
          {filtered.length} companies{search ? " found" : " total"}
        </Badge>
        {search && (
          <span className="text-xs text-muted-foreground">
            showing results for &ldquo;{search}&rdquo;
          </span>
        )}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border overflow-hidden">
        <Table data-ocid="mumbai.table">
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="w-8 text-[11px] font-semibold text-muted-foreground">
                #
              </TableHead>
              <TableHead className="text-[11px] font-semibold text-muted-foreground">
                Company Name
              </TableHead>
              <TableHead className="text-[11px] font-semibold text-muted-foreground">
                Mobile Number
              </TableHead>
              <TableHead className="text-[11px] font-semibold text-muted-foreground hidden sm:table-cell">
                Area
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-12 text-muted-foreground text-sm"
                  data-ocid="mumbai.empty_state"
                >
                  No companies found matching &ldquo;{search}&rdquo;
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((company, idx) => (
                <TableRow
                  key={company.mobile}
                  className="hover:bg-muted/30 transition-colors"
                  data-ocid={`mumbai.item.${idx + 1}`}
                >
                  <TableCell className="text-[11px] text-muted-foreground font-mono w-8">
                    {idx + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-[oklch(0.94_0.04_25)] flex items-center justify-center shrink-0">
                        <Building2 className="h-3.5 w-3.5 text-[oklch(0.50_0.18_25)]" />
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {company.companyName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <Phone className="h-3 w-3 text-[oklch(0.55_0.18_25)] shrink-0" />
                      <span className="text-sm font-mono font-semibold text-foreground tracking-wide">
                        {company.mobile}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {company.area}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {filtered.length > 0 && (
        <p className="text-[11px] text-muted-foreground text-center">
          Showing all {filtered.length} Mumbai IT companies · Mobile numbers for
          direct outreach
        </p>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ITLeadManager() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [todayCount, setTodayCount] = useState(0);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Load leads on mount
  useEffect(() => {
    // 1. Seed leads
    const base = [...seedLeads];

    // 2. Daily leads
    const maxSeedId = Math.max(...base.map((l) => l.id));
    const daily = getDailyLeads(maxSeedId, 15);
    setTodayCount(daily.length);

    // 3. Extra leads from localStorage
    let extra: Lead[] = [];
    try {
      const raw = localStorage.getItem(EXTRA_LEADS_KEY);
      if (raw) extra = JSON.parse(raw) as Lead[];
    } catch {
      // ignore
    }

    // 4. Merge, dedup by id
    const allMap = new Map<number, Lead>();
    for (const l of [...base, ...daily, ...extra]) {
      allMap.set(l.id, l);
    }
    setLeads(Array.from(allMap.values()));
  }, []);

  const maxId = useMemo(
    () => (leads.length > 0 ? Math.max(...leads.map((l) => l.id)) : 250),
    [leads],
  );

  const handleStatusChange = (id: number, status: LeadStatus) => {
    setLeads((prev) => {
      const next = prev.map((l) =>
        l.id === id ? { ...l, leadStatus: status } : l,
      );
      persistExtra(next);
      return next;
    });
  };

  const handleNotesChange = (id: number, notes: string) => {
    setLeads((prev) => {
      const next = prev.map((l) => (l.id === id ? { ...l, notes } : l));
      persistExtra(next);
      return next;
    });
  };

  const handleAddLeads = (newLeads: Lead[]) => {
    setLeads((prev) => {
      const existing = new Set(prev.map((l) => l.id));
      const toAdd = newLeads.filter((l) => !existing.has(l.id));
      const next = [...prev, ...toAdd];
      persistExtra(next);
      return next;
    });
  };

  function persistExtra(allLeads: Lead[]) {
    // Store only extra leads (not seed leads)
    const seedIds = new Set(seedLeads.map((l) => l.id));
    const extras = allLeads.filter((l) => !seedIds.has(l.id));
    try {
      localStorage.setItem(EXTRA_LEADS_KEY, JSON.stringify(extras));
    } catch {
      // quota exceeded
    }
  }

  return (
    <div className="max-w-full mx-auto px-3 sm:px-4 lg:px-6 py-4">
      {/* Page Header */}
      <div className="mb-5 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display font-bold text-xl text-foreground tracking-tight flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            IT Lead Manager
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            B2B IT Sales CRM — Pan India | Internet Leased Line, MS 365, SD-WAN,
            MPLS &amp; more
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="text-xs gap-1.5 border-primary/30 text-primary"
          >
            <Building2 className="h-3 w-3" />
            {leads.length.toLocaleString()} Leads
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-5"
      >
        <TabsList className="h-9 gap-0.5 flex-wrap">
          <TabsTrigger
            value="dashboard"
            className="text-xs gap-1.5 h-7"
            data-ocid="nav.dashboard.tab"
          >
            <BarChart3 className="h-3.5 w-3.5" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger
            value="leads"
            className="text-xs gap-1.5 h-7"
            data-ocid="nav.leads.tab"
          >
            <FileSpreadsheet className="h-3.5 w-3.5" />
            All Leads
            <span className="ml-1 text-[10px] bg-primary/15 text-primary px-1.5 py-0.5 rounded font-bold">
              {leads.length}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="ms365"
            className="text-xs gap-1.5 h-7"
            data-ocid="nav.ms365.tab"
          >
            <Grid3X3 className="h-3.5 w-3.5" />
            MS 365 Companies
            <span className="ml-1 text-[10px] bg-[oklch(0.52_0.20_255)]/15 text-[oklch(0.38_0.16_255)] px-1.5 py-0.5 rounded font-bold">
              {
                leads.filter((l) =>
                  l.interestedProducts.includes("MS 365 Licenses"),
                ).length
              }
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="generator"
            className="text-xs gap-1.5 h-7"
            data-ocid="nav.generator.tab"
          >
            <Sparkles className="h-3.5 w-3.5" />
            AI Generator
          </TabsTrigger>
          <TabsTrigger
            value="mumbai"
            className="text-xs gap-1.5 h-7"
            data-ocid="nav.mumbai.tab"
          >
            <Phone className="h-3.5 w-3.5" />
            Mumbai IT Companies
            <span className="ml-1 text-[10px] bg-[oklch(0.55_0.22_25)]/15 text-[oklch(0.40_0.18_25)] px-1.5 py-0.5 rounded font-bold">
              64
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="tata"
            className="text-xs gap-1.5 h-7"
            data-ocid="nav.tata.tab"
          >
            <Wifi className="h-3.5 w-3.5" />
            Tata IT Users
            <span className="ml-1 text-[10px] bg-[oklch(0.55_0.22_260)]/15 text-[oklch(0.40_0.18_260)] px-1.5 py-0.5 rounded font-bold">
              30
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="banks"
            className="text-xs gap-1.5 h-7"
            data-ocid="nav.banks.tab"
          >
            <Landmark className="h-3.5 w-3.5" />
            Mumbai Banks
            <span className="ml-1 text-[10px] bg-[oklch(0.55_0.22_145)]/15 text-[oklch(0.40_0.18_145)] px-1.5 py-0.5 rounded font-bold">
              30
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-5">
          <DashboardTab leads={leads} todayCount={todayCount} />
        </TabsContent>

        <TabsContent value="leads" className="mt-5">
          <AllLeadsTab
            leads={leads}
            onStatusChange={handleStatusChange}
            onNotesChange={handleNotesChange}
          />
        </TabsContent>

        <TabsContent value="ms365" className="mt-5">
          <MS365Tab
            leads={leads}
            onStatusChange={handleStatusChange}
            onNotesChange={handleNotesChange}
          />
        </TabsContent>

        <TabsContent value="generator" className="mt-5">
          <AIGeneratorTab
            totalLeads={leads.length}
            maxId={maxId}
            onAddLeads={handleAddLeads}
          />
        </TabsContent>

        <TabsContent value="mumbai" className="mt-5">
          <MumbaiITTab />
        </TabsContent>

        <TabsContent value="tata" className="mt-5">
          <TataITUsersTab />
        </TabsContent>

        <TabsContent value="banks" className="mt-5">
          <MumbaiBanksTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
