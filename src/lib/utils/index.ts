import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, isAfter, isBefore, addDays } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "N/A";
  return format(new Date(date), "dd MMM yyyy");
}

export function formatRelativeDate(date: Date | string | null | undefined): string {
  if (!date) return "N/A";
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function isDeadlineSoon(deadline: Date | string | null | undefined): boolean {
  if (!deadline) return false;
  const d = new Date(deadline);
  const threeDaysFromNow = addDays(new Date(), 3);
  return isBefore(d, threeDaysFromNow) && isAfter(d, new Date());
}

export function isDeadlinePassed(deadline: Date | string | null | undefined): boolean {
  if (!deadline) return false;
  return isBefore(new Date(deadline), new Date());
}

export function formatSalary(min?: number | null, max?: number | null, currency?: string): string {
  if (!min && !max) return "Not disclosed";
  const curr = currency === "INR" ? "₹" : currency || "₹";
  const formatNum = (n: number) => {
    if (n >= 100000) return `${(n / 100000).toFixed(1)} LPA`;
    return `${(n / 1000).toFixed(0)}K`;
  };
  if (min && max) return `${curr}${formatNum(min)} - ${curr}${formatNum(max)}`;
  if (min) return `${curr}${formatNum(min)}+`;
  if (max) return `Up to ${curr}${formatNum(max)}`;
  return "Not disclosed";
}

export function formatStipend(min?: number | null, max?: number | null, currency?: string): string {
  if (!min && !max) return "Not disclosed";
  const curr = currency === "INR" ? "₹" : currency || "₹";
  const formatNum = (n: number) => `${n.toLocaleString("en-IN")}`;
  if (min && max) return `${curr}${formatNum(min)} - ${curr}${formatNum(max)}/month`;
  if (min) return `${curr}${formatNum(min)}/month+`;
  if (max) return `Up to ${curr}${formatNum(max)}/month`;
  return "Not disclosed";
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    ACTIVE: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    CLOSING_SOON: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    UPCOMING: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    CLOSED: "bg-red-500/20 text-red-400 border-red-500/30",
    EXPIRED: "bg-slate-500/20 text-slate-400 border-slate-500/30",
    PAUSED: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  };
  return colors[status] || colors.ACTIVE;
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    ACTIVE: "Active",
    CLOSING_SOON: "Closing Soon",
    UPCOMING: "Upcoming",
    CLOSED: "Closed",
    EXPIRED: "Expired",
    PAUSED: "Paused",
  };
  return labels[status] || status;
}

export function validateSourceUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}
