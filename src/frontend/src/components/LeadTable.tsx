import StatusBadge from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import type { CompanySize, Lead, LeadStatus } from "@/data/leads";
import {
  ALL_AREAS,
  ALL_COMPANY_SIZES,
  ALL_PRODUCTS,
  ALL_STATUSES,
} from "@/data/leads";
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";

const PAGE_SIZE = 10;

interface LeadTableProps {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onAdd: () => void;
}

export default function LeadTable({
  leads,
  onEdit,
  onDelete,
  onAdd,
}: LeadTableProps) {
  const [search, setSearch] = useState("");
  const [filterArea, setFilterArea] = useState<string>("all");
  const [filterProduct, setFilterProduct] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterSize, setFilterSize] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    return leads.filter((lead) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        lead.companyName.toLowerCase().includes(q) ||
        lead.contactPerson.toLowerCase().includes(q);
      const matchArea = filterArea === "all" || lead.area === filterArea;
      const matchProduct =
        filterProduct === "all" ||
        lead.interestedProducts.includes(filterProduct);
      const matchStatus =
        filterStatus === "all" || lead.leadStatus === filterStatus;
      const matchSize = filterSize === "all" || lead.companySize === filterSize;
      return (
        matchSearch && matchArea && matchProduct && matchStatus && matchSize
      );
    });
  }, [leads, search, filterArea, filterProduct, filterStatus, filterSize]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (safeCurrentPage - 1) * PAGE_SIZE,
    safeCurrentPage * PAGE_SIZE,
  );

  const clearFilters = () => {
    setSearch("");
    setFilterArea("all");
    setFilterProduct("all");
    setFilterStatus("all");
    setFilterSize("all");
    setPage(1);
  };

  const hasFilters =
    search ||
    filterArea !== "all" ||
    filterProduct !== "all" ||
    filterStatus !== "all" ||
    filterSize !== "all";

  return (
    <div className="space-y-4">
      {/* Filters + Add */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search company or contact..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Button onClick={onAdd} className="shrink-0 gap-2">
            <Plus className="w-4 h-4" />
            Add Lead
          </Button>
        </div>

        {/* Filter Row */}
        <div className="flex flex-wrap gap-2">
          <Select
            value={filterArea}
            onValueChange={(v) => {
              setFilterArea(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[140px] h-8 text-xs">
              <MapPin className="w-3 h-3 mr-1 text-muted-foreground" />
              <SelectValue placeholder="Area" />
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
            value={filterProduct}
            onValueChange={(v) => {
              setFilterProduct(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[180px] h-8 text-xs">
              <SelectValue placeholder="Product" />
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
            value={filterStatus}
            onValueChange={(v) => {
              setFilterStatus(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[150px] h-8 text-xs">
              <SelectValue placeholder="Status" />
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
            <SelectTrigger className="w-[150px] h-8 text-xs">
              <Building2 className="w-3 h-3 mr-1 text-muted-foreground" />
              <SelectValue placeholder="Company Size" />
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

          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-8 text-xs text-muted-foreground hover:text-foreground"
            >
              Clear filters
            </Button>
          )}
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-semibold text-foreground">
            {filtered.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-foreground">{leads.length}</span>{" "}
          leads
        </p>
        {totalPages > 1 && (
          <p className="text-xs text-muted-foreground">
            Page {safeCurrentPage} of {totalPages}
          </p>
        )}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border overflow-hidden bg-card shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="font-semibold text-foreground w-48">
                  Company
                </TableHead>
                <TableHead className="font-semibold text-foreground w-40">
                  Contact
                </TableHead>
                <TableHead className="font-semibold text-foreground w-24">
                  Area
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  Products
                </TableHead>
                <TableHead className="font-semibold text-foreground w-28">
                  Status
                </TableHead>
                <TableHead className="font-semibold text-foreground w-28">
                  Source
                </TableHead>
                <TableHead className="font-semibold text-foreground w-20 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-16 text-muted-foreground"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Search className="w-8 h-8 opacity-30" />
                      <p className="font-medium">No leads found</p>
                      <p className="text-xs">Try adjusting your filters</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((lead) => (
                  <>
                    <TableRow
                      key={lead.id}
                      className="crm-table-row"
                      onClick={() =>
                        setExpandedId(expandedId === lead.id ? null : lead.id)
                      }
                    >
                      <TableCell>
                        <div>
                          <p className="font-semibold text-sm text-foreground leading-tight">
                            {lead.companyName}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {lead.companySize}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {lead.contactPerson}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {lead.designation}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-foreground">
                          {lead.area}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {lead.interestedProducts
                            .slice(0, 2)
                            .map((product) => (
                              <Badge
                                key={product}
                                variant="secondary"
                                className="text-xs px-1.5 py-0 font-normal"
                              >
                                {product}
                              </Badge>
                            ))}
                          {lead.interestedProducts.length > 2 && (
                            <Badge
                              variant="outline"
                              className="text-xs px-1.5 py-0 font-normal"
                            >
                              +{lead.interestedProducts.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={lead.leadStatus as LeadStatus} />
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-muted-foreground">
                          {lead.source}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div
                          className="flex items-center justify-end gap-1"
                          onClick={(e) => e.stopPropagation()}
                          onKeyUp={(e) => e.stopPropagation()}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 hover:text-primary"
                            onClick={() => onEdit(lead)}
                            title="Edit lead"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 hover:text-destructive"
                            onClick={() => onDelete(lead)}
                            title="Delete lead"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>

                    {/* Expanded row */}
                    {expandedId === lead.id && (
                      <TableRow
                        key={`${lead.id}-expanded`}
                        className="bg-muted/20"
                      >
                        <TableCell colSpan={7} className="py-3 px-4">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Phone className="w-3.5 h-3.5 shrink-0" />
                              <a
                                href={`tel:${lead.phone}`}
                                className="hover:text-primary"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {lead.phone}
                              </a>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Mail className="w-3.5 h-3.5 shrink-0" />
                              <a
                                href={`mailto:${lead.email}`}
                                className="hover:text-primary truncate"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {lead.email}
                              </a>
                            </div>
                            {lead.notes && (
                              <div className="sm:col-span-1 text-muted-foreground italic">
                                "{lead.notes}"
                              </div>
                            )}
                            {lead.interestedProducts.length > 2 && (
                              <div className="sm:col-span-3 flex flex-wrap gap-1">
                                <span className="text-xs text-muted-foreground mr-1">
                                  All products:
                                </span>
                                {lead.interestedProducts.map((p) => (
                                  <Badge
                                    key={p}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {p}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safeCurrentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (p) =>
                  p === 1 ||
                  p === totalPages ||
                  Math.abs(p - safeCurrentPage) <= 1,
              )
              .reduce<
                { type: "page" | "ellipsis"; value: number; key: string }[]
              >((acc, p, idx, arr) => {
                if (
                  idx > 0 &&
                  typeof arr[idx - 1] === "number" &&
                  p - (arr[idx - 1] as number) > 1
                ) {
                  acc.push({
                    type: "ellipsis",
                    value: p,
                    key: `ellipsis-before-${p}`,
                  });
                }
                acc.push({ type: "page", value: p, key: `page-${p}` });
                return acc;
              }, [])
              .map((item) =>
                item.type === "ellipsis" ? (
                  <span
                    key={item.key}
                    className="px-2 text-muted-foreground text-sm"
                  >
                    …
                  </span>
                ) : (
                  <Button
                    key={item.key}
                    variant={
                      safeCurrentPage === item.value ? "default" : "outline"
                    }
                    size="sm"
                    className="w-8 h-8 p-0"
                    onClick={() => setPage(item.value)}
                  >
                    {item.value}
                  </Button>
                ),
              )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safeCurrentPage === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
