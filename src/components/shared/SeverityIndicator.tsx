import { cn } from "@/lib/utils";
import { Severity } from "@/types";

const SEV_COLORS: Record<Severity, string> = {
  P0: "bg-red-500/10 text-red-400 border-red-500/30",
  P1: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  P2: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  P3: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  P4: "bg-slate-500/10 text-slate-400 border-slate-500/30",
};

export default function SeverityIndicator({ severity, className }: { severity: Severity; className?: string }) {
  return (
    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded border font-mono uppercase", SEV_COLORS[severity], className)}>
      {severity}
    </span>
  );
}
