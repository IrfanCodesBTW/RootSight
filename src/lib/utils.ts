import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeTime(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

export function formatAbsoluteTime(isoDate: string): string {
  return new Date(isoDate).toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function getIncidentDuration(incident: { created_at: string; resolved_at?: string }): string {
  const start = new Date(incident.created_at);
  const end = incident.resolved_at ? new Date(incident.resolved_at) : new Date();
  const diffInSeconds = Math.floor((end.getTime() - start.getTime()) / 1000);
  
  const h = Math.floor(diffInSeconds / 3600);
  const m = Math.floor((diffInSeconds % 3600) / 60);
  const s = diffInSeconds % 60;
  
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export function confidenceColor(value: number): string {
  if (value < 0.4) return "text-red-400";
  if (value < 0.7) return "text-amber-400";
  return "text-emerald-400";
}

export function confidenceBgColor(value: number): string {
  if (value < 0.4) return "bg-red-500";
  if (value < 0.7) return "bg-amber-500";
  return "bg-emerald-500";
}
