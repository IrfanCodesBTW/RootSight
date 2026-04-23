export enum Severity {
  P0 = "P0",
  P1 = "P1",
  P2 = "P2",
  P3 = "P3",
  P4 = "P4",
}

export enum IncidentStatus {
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  PARTIAL = "PARTIAL",
  INVESTIGATING = "INVESTIGATING",
  RESOLVED = "RESOLVED",
  OPEN = "OPEN",
}

export enum PipelineStepStatus {
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  COMPLETE = "COMPLETE",
  FAILED = "FAILED",
}

export interface PipelineStepState {
  status: PipelineStepStatus;
  started_at?: string;
  completed_at?: string;
  progress_percentage?: number;
  error?: string;
}

export interface PipelineState {
  ingestion: PipelineStepState;
  timeline: PipelineStepState;
  rca: PipelineStepState;
  impact: PipelineStepState;
  memory: PipelineStepState;
  actions: PipelineStepState;
}

export interface RawEvent {
  timestamp: string;
  level: string;
  message: string;
  source: string;
  metadata?: Record<string, any>;
}

export interface Event {
  id: string;
  timestamp: string;
  event_type: string;
  description: string;
  confidence: number;
  evidence: string[];
  source?: string;
}

export interface Hypothesis {
  id: string;
  rank: number;
  title: string;
  description: string;
  confidence: number;
  supporting_evidence: string[];
  counter_evidence: string[];
  estimated_likelihood: string;
}

export interface Impact {
  severity_band: "critical" | "high" | "medium" | "low";
  business_impact: string;
  user_impact: string;
  affected_services: string[];
  estimated_users_affected?: number;
  estimated_revenue_loss?: string;
  confidence: number;
}

export interface SimilarIncident {
  id: string;
  title: string;
  similarity_score: number;
  occurred_at: string;
  resolution_summary: string;
  similarity_explanation: string;
  root_cause: string;
}

export interface Action {
  id: string;
  action_type: "slack_message" | "jira_ticket" | "email" | "other";
  title: string;
  content: string;
  approval_status: "pending" | "approved" | "rejected";
  execution_status: "not_sent" | "sent" | "failed";
  created_at: string;
}

export interface Incident {
  id: string;
  incident_id?: string; // Support both id and incident_id
  title: string;
  description: string;
  severity: Severity;
  status: IncidentStatus;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  source: string;
  external_id?: string;
  pipeline_state?: PipelineState;
  tags: string[];
  raw_events?: RawEvent[];
  timeline?: Event[];
  hypotheses?: Hypothesis[];
  impact?: Impact;
  similar_incidents?: SimilarIncident[];
  actions?: Action[];
  recovery_script?: string;
}

export interface TriggerPipelineRequest {
  title: string;
  description?: string;
  severity?: Severity;
  source?: string;
  payload?: string;
}

export interface TriggerPipelineResponse {
  incident_id: string;
  status: string;
}

export interface ListIncidentsResponse {
  items: Incident[];
  total: number;
  page: number;
  limit: number;
}

export interface DraftRecoveryScriptResponse {
  incident_id: string;
  script: string;
}

export interface GetIncidentResponse {
  success: boolean;
  data: Incident;
  error?: string;
}

export interface GetIncidentStatusResponse {
  success: boolean;
  data: Incident; // The full state is now in the data envelope
  error?: string;
}

export const PIPELINE_STEPS = [
  { key: "ingestion" as keyof PipelineState, label: "Data Ingestion" },
  { key: "timeline" as keyof PipelineState, label: "Timeline Building" },
  { key: "rca" as keyof PipelineState, label: "Root Cause Analysis" },
  { key: "impact" as keyof PipelineState, label: "Impact Analysis" },
  { key: "memory" as keyof PipelineState, label: "Memory Retrieval" },
  { key: "actions" as keyof PipelineState, label: "Action Generation" },
];
