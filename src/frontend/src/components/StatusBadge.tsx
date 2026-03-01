import { cn } from "@/lib/utils";

type StatusBadgeProps = {
  status: string;
  className?: string;
};

const statusMap: Record<string, string> = {
  // Food listing statuses
  available: "badge-available",
  claimed: "badge-claimed",
  completed: "badge-completed",
  expired: "badge-expired",
  // Request statuses
  open: "badge-open",
  fulfilled: "badge-fulfilled",
  cancelled: "badge-cancelled",
  // Delivery statuses
  accepted: "badge-accepted",
  pickedUp: "badge-picked_up",
  onTheWay: "badge-on_the_way",
  delivered: "badge-delivered",
  // Urgency
  critical: "badge-critical",
  high: "badge-high",
  medium: "badge-medium",
  low: "badge-low",
};

const statusLabels: Record<string, string> = {
  available: "Available",
  claimed: "Claimed",
  completed: "Completed",
  expired: "Expired",
  open: "Open",
  fulfilled: "Fulfilled",
  cancelled: "Cancelled",
  accepted: "Accepted",
  pickedUp: "Picked Up",
  onTheWay: "On the Way",
  delivered: "Delivered",
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const badgeClass = statusMap[status] ?? "badge-expired";
  const label = statusLabels[status] ?? status;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold",
        badgeClass,
        className,
      )}
    >
      {label}
    </span>
  );
}
