"use client";

import { useState } from "react";
import { X, Zap, AlertTriangle, Database, Terminal } from "lucide-react";
import { api } from "@/lib/api";
import { Severity } from "@/types";

interface TriggerModalProps {
  onClose: () => void;
  onSuccess: (incidentId: string) => void;
}

export function TriggerModal({ onClose, onSuccess }: TriggerModalProps) {
  const [title, setTitle] = useState("");
  const [severity, setSeverity] = useState<Severity>(Severity.P1);
  const [source, setSource] = useState("manual");
  const [payload, setPayload] = useState(JSON.stringify({
    service: "api-server",
    alert_name: "High Error Rate",
    threshold: 5.0,
    current_value: 18.2
  }, null, 2));
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title) return;
    setLoading(true);
    try {
      const res = await api.triggerPipeline({
        title,
        severity,
        source,
        payload: payload
      });
      onSuccess(res.incident_id);
    } catch (e) {
      console.error("Trigger pipeline error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-[#161622] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <Zap className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Trigger Pipeline</h2>
              <p className="text-xs text-gray-400">Launch AI incident intelligence engine</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-widest text-gray-500 font-semibold">Incident Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Database Connection Pool Exhausted"
              className="w-full bg-[#1e1e2e] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-widest text-gray-500 font-semibold">Severity</label>
              <select 
                value={severity}
                onChange={(e) => setSeverity(e.target.value as Severity)}
                className="w-full bg-[#1e1e2e] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors appearance-none cursor-pointer"
              >
                <option value={Severity.P0}>P0 — Critical</option>
                <option value={Severity.P1}>P1 — High</option>
                <option value={Severity.P2}>P2 — Medium</option>
                <option value={Severity.P3}>P3 — Low</option>
                <option value={Severity.P4}>P4 — Info</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-widest text-gray-500 font-semibold">Source</label>
              <select 
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full bg-[#1e1e2e] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors appearance-none cursor-pointer"
              >
                <option value="datadog">Datadog</option>
                <option value="pagerduty">PagerDuty</option>
                <option value="manual">Manual</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-widest text-gray-500 mb-1 flex items-center gap-2">
              <Terminal className="w-3 h-3" /> Raw Payload (JSON)
            </label>
            <textarea 
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              className="w-full bg-[#08080d] border border-white/10 rounded-xl px-4 py-3 text-[12px] font-mono text-gray-400 focus:outline-none focus:border-blue-500/50 transition-colors min-h-[120px] resize-none"
            />
          </div>
        </div>

        <div className="p-6 bg-[#1a1a28] border-t border-white/5 flex items-center justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl border border-white/10 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={loading || !title}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Zap className="w-4 h-4 fill-current" />}
            Launch Pipeline
          </button>
        </div>
      </div>
    </div>
  );
}
