// API client for RootSight backend
import {
  Incident,
  TriggerPipelineRequest,
  TriggerPipelineResponse,
  ListIncidentsResponse,
  GetIncidentResponse,
  GetIncidentStatusResponse,
  DraftRecoveryScriptResponse,
} from "@/types";
import { generateMockIncident, generateMockIncidents } from "@/lib/mock-data";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

class RootSightAPI {
  private baseURL: string;
  private demoMode: boolean;

  constructor() {
    this.baseURL = API_BASE || API_URL;
    this.demoMode = false;
  }

  enableDemoMode() { this.demoMode = true; }
  disableDemoMode() { this.demoMode = false; }
  isDemoMode(): boolean { return this.demoMode; }

  /**
   * Unwrap the backend's {success, data, error} envelope.
   * Returns `data` on success, throws on error.
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      const json = await response.json();

      if (json && typeof json === "object" && "success" in json) {
        if (!json.success || json.error) {
          throw new Error(json.error || `Request failed: ${response.status}`);
        }
        return json.data as T;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return json as T;
    } catch (error) {
      if (!this.demoMode && error instanceof TypeError && (error.message.includes("fetch") || error.message.includes("network"))) {
        console.warn("Backend unreachable, enabling demo mode", error);
        this.demoMode = true;
      }
      throw error;
    }
  }

  // Trigger new incident pipeline
  async triggerPipeline(request: TriggerPipelineRequest): Promise<TriggerPipelineResponse> {
    if (this.demoMode) {
      return { incident_id: `demo-${Date.now()}`, status: "RUNNING" };
    }
    return this.request<TriggerPipelineResponse>("/trigger", {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  // List all incidents
  async listIncidents(page: number = 1, limit: number = 20): Promise<ListIncidentsResponse> {
    if (this.demoMode) {
      const items = generateMockIncidents(limit);
      return { items, total: items.length, page, limit };
    }
    try {
      return await this.request<ListIncidentsResponse>(`/incidents?page=${page}&limit=${limit}`);
    } catch (e) {
      console.warn("listIncidents failed, using demo data", e);
      this.demoMode = true;
      const items = generateMockIncidents(limit);
      return { items, total: items.length, page, limit };
    }
  }

  // Get specific incident (returns full state)
  async getIncident(incidentId: string): Promise<Incident> {
    if (this.demoMode) {
      return generateMockIncident(incidentId);
    }
    try {
      return await this.request<Incident>(`/incident/${incidentId}`);
    } catch (e) {
      console.warn("getIncident failed, using demo data", e);
      return generateMockIncident(incidentId);
    }
  }

  // Get incident status (wrapper for polling if needed)
  async getIncidentStatus(incidentId: string): Promise<Incident> {
    return this.getIncident(incidentId);
  }

  // Draft recovery script
  async draftRecoveryScript(incidentId: string): Promise<DraftRecoveryScriptResponse> {
    if (this.demoMode) {
      return {
        incident_id: incidentId,
        script: `#!/bin/bash\n# Mock recovery script\necho "Restarting services..."`,
      };
    }
    return this.request<DraftRecoveryScriptResponse>(`/incident/${incidentId}/draft-script`, { method: "POST" });
  }

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    try {
      return await this.request<{ status: string }>("/health");
    } catch {
      return { status: "unreachable" };
    }
  }
}

export const api = new RootSightAPI();

export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const health = await api.healthCheck();
    return health.status === "healthy";
  } catch {
    return false;
  }
};
