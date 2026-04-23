/**
 * Backward-compatible re-exports from the canonical types in @/types/index.
 * Components that previously imported from @/types/incident should continue to work.
 */
export type {
  Severity,
  IncidentStatus,
  PipelineStepStatus,
  PipelineStepState,
  PipelineState,
  RawEvent,
  Event,
  Hypothesis,
  Impact,
  SimilarIncident,
  Action,
  Incident,
  TriggerPipelineRequest,
  TriggerPipelineResponse,
  ListIncidentsResponse,
  GetIncidentResponse,
  GetIncidentStatusResponse,
  DraftRecoveryScriptResponse,
} from "./index";

export { PIPELINE_STEPS } from "./index";

// Backward-compatible aliases for components using the old type names
import type { Incident as _Incident, Event as _Event, Impact as _Impact } from "./index";

/** @deprecated Use `Incident` instead */
export type IncidentDetail = _Incident;

/** @deprecated Use `Event` instead */
export type TimelineEvent = _Event;

// Re-export enums for components using enum-style types
export const EventType = {
  DEPLOY: "deploy",
  ERROR_SPIKE: "error_spike",
  LATENCY_SPIKE: "latency_spike",
  CPU_SPIKE: "cpu_spike",
  MEMORY_SPIKE: "memory_spike",
  DB_FAILURE: "db_failure",
  TIMEOUT: "timeout",
  FAILOVER: "failover",
  RECOVERY: "recovery",
  ROLLBACK: "rollback",
  DEPENDENCY_FAILURE: "dependency_failure",
  CONFIG_CHANGE: "config_change",
  UNKNOWN: "unknown",
} as const;

export const ActionType = {
  SLACK_DRAFT: "slack_draft",
  JIRA_DRAFT: "jira_draft",
  RUNBOOK: "runbook",
  ESCALATION: "escalation",
} as const;

export const ApprovalStatus = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;
