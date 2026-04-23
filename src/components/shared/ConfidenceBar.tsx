import { cn } from "@/lib/utils";

export default function ConfidenceBar({ confidence, className }: { confidence: number; className?: string }) {
  const pct = Math.round(confidence * 100);
  const color = pct >= 80 ? "bg-emerald-500" : pct >= 50 ? "bg-amber-500" : "bg-red-500";
  const textColor = pct >= 80 ? "text-emerald-400" : pct >= 50 ? "text-amber-400" : "text-red-400";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex-1 h-1 bg-white/[0.05] rounded-full overflow-hidden">
        <div 
          className={cn("h-full transition-all duration-1000", color)} 
          style={{ width: `${pct}%` }} 
        />
      </div>
      <span className={cn("text-[10px] font-mono font-bold min-w-[24px] text-right", textColor)}>
        {pct}%
      </span>
    </div>
  );
}
