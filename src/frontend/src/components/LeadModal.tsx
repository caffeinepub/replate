import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
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
import { Textarea } from "@/components/ui/textarea";
import type { CompanySize, Lead, LeadSource, LeadStatus } from "@/data/leads";
import {
  ALL_AREAS,
  ALL_COMPANY_SIZES,
  ALL_PRODUCTS,
  ALL_SOURCES,
  ALL_STATUSES,
} from "@/data/leads";
import { useEffect, useState } from "react";

type LeadFormData = Omit<Lead, "id">;

const EMPTY_FORM: LeadFormData = {
  companyName: "",
  contactPerson: "",
  designation: "",
  phone: "",
  email: "",
  area: "",
  companySize: "SME",
  interestedProducts: [],
  leadStatus: "New",
  source: "Cold Call",
  notes: "",
};

interface LeadModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: LeadFormData) => void;
  editLead?: Lead | null;
}

export default function LeadModal({
  open,
  onClose,
  onSave,
  editLead,
}: LeadModalProps) {
  const [form, setForm] = useState<LeadFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<
    Partial<Record<keyof LeadFormData, string>>
  >({});

  useEffect(() => {
    if (open) {
      if (editLead) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...rest } = editLead;
        setForm(rest);
      } else {
        setForm(EMPTY_FORM);
      }
      setErrors({});
    }
  }, [open, editLead]);

  const validate = () => {
    const newErrors: Partial<Record<keyof LeadFormData, string>> = {};
    if (!form.companyName.trim()) newErrors.companyName = "Required";
    if (!form.contactPerson.trim()) newErrors.contactPerson = "Required";
    if (!form.phone.trim()) newErrors.phone = "Required";
    if (!form.area) newErrors.area = "Required";
    if (form.interestedProducts.length === 0)
      newErrors.interestedProducts = "Select at least one product";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSave(form);
  };

  const toggleProduct = (product: string) => {
    setForm((prev) => ({
      ...prev,
      interestedProducts: prev.interestedProducts.includes(product)
        ? prev.interestedProducts.filter((p) => p !== product)
        : [...prev.interestedProducts, product],
    }));
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {editLead ? "Edit Lead" : "Add New Lead"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
          {/* Company Name */}
          <div className="space-y-1">
            <Label htmlFor="companyName">
              Company Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="companyName"
              value={form.companyName}
              onChange={(e) =>
                setForm((p) => ({ ...p, companyName: e.target.value }))
              }
              placeholder="e.g. Reliance Tech Park"
            />
            {errors.companyName && (
              <p className="text-xs text-destructive">{errors.companyName}</p>
            )}
          </div>

          {/* Contact Person */}
          <div className="space-y-1">
            <Label htmlFor="contactPerson">
              Contact Person <span className="text-destructive">*</span>
            </Label>
            <Input
              id="contactPerson"
              value={form.contactPerson}
              onChange={(e) =>
                setForm((p) => ({ ...p, contactPerson: e.target.value }))
              }
              placeholder="e.g. Rajesh Mehta"
            />
            {errors.contactPerson && (
              <p className="text-xs text-destructive">{errors.contactPerson}</p>
            )}
          </div>

          {/* Designation */}
          <div className="space-y-1">
            <Label htmlFor="designation">Designation</Label>
            <Input
              id="designation"
              value={form.designation}
              onChange={(e) =>
                setForm((p) => ({ ...p, designation: e.target.value }))
              }
              placeholder="e.g. IT Manager"
            />
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <Label htmlFor="phone">
              Phone <span className="text-destructive">*</span>
            </Label>
            <Input
              id="phone"
              value={form.phone}
              onChange={(e) =>
                setForm((p) => ({ ...p, phone: e.target.value }))
              }
              placeholder="e.g. 9820011234"
            />
            {errors.phone && (
              <p className="text-xs text-destructive">{errors.phone}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((p) => ({ ...p, email: e.target.value }))
              }
              placeholder="e.g. rajesh@company.com"
            />
          </div>

          {/* Area */}
          <div className="space-y-1">
            <Label>
              Area <span className="text-destructive">*</span>
            </Label>
            <Select
              value={form.area}
              onValueChange={(v) => setForm((p) => ({ ...p, area: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select area" />
              </SelectTrigger>
              <SelectContent>
                {ALL_AREAS.map((a) => (
                  <SelectItem key={a} value={a}>
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.area && (
              <p className="text-xs text-destructive">{errors.area}</p>
            )}
          </div>

          {/* Company Size */}
          <div className="space-y-1">
            <Label>Company Size</Label>
            <Select
              value={form.companySize}
              onValueChange={(v) =>
                setForm((p) => ({ ...p, companySize: v as CompanySize }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ALL_COMPANY_SIZES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Lead Status */}
          <div className="space-y-1">
            <Label>Lead Status</Label>
            <Select
              value={form.leadStatus}
              onValueChange={(v) =>
                setForm((p) => ({ ...p, leadStatus: v as LeadStatus }))
              }
            >
              <SelectTrigger>
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

          {/* Source */}
          <div className="space-y-1">
            <Label>Lead Source</Label>
            <Select
              value={form.source}
              onValueChange={(v) =>
                setForm((p) => ({ ...p, source: v as LeadSource }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ALL_SOURCES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Products - full width */}
          <div className="sm:col-span-2 space-y-2">
            <Label>
              Interested Products <span className="text-destructive">*</span>
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 border border-border rounded-lg bg-muted/30">
              {ALL_PRODUCTS.map((product) => {
                const checkId = `product-${product.replace(/\s+/g, "-").toLowerCase()}`;
                return (
                  <div
                    key={product}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <Checkbox
                      id={checkId}
                      checked={form.interestedProducts.includes(product)}
                      onCheckedChange={() => toggleProduct(product)}
                    />
                    <label
                      htmlFor={checkId}
                      className="text-sm text-foreground group-hover:text-primary transition-colors cursor-pointer"
                    >
                      {product}
                    </label>
                  </div>
                );
              })}
            </div>
            {errors.interestedProducts && (
              <p className="text-xs text-destructive">
                {errors.interestedProducts}
              </p>
            )}
          </div>

          {/* Notes - full width */}
          <div className="sm:col-span-2 space-y-1">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              rows={3}
              value={form.notes}
              onChange={(e) =>
                setForm((p) => ({ ...p, notes: e.target.value }))
              }
              placeholder="Add any additional notes..."
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {editLead ? "Save Changes" : "Add Lead"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
