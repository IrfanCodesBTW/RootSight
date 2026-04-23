import { cn } from "@/lib/utils";
import { IncidentStatus, PipelineStepStatus } from "@/types";

export default function StatusBadge({ status, className, showIcon = true }: { status: IncidentStatus | PipelineStepStatus | string; className?: string; showIcon?: boolean }) {
  const styles: Record<string, string> = {
    investigating: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    resolved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    open: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    complete: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    running: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    pending: "bg-white/[0.04] text-gray-500 border-white/[0.06]",
    failed: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border", styles[status as string] || styles.pending, className)}>
      {showIcon && (status === "running" || status === "investigating") && (
        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      )}
      <span className="capitalize">{status}</span>
    </span>
  );
}
