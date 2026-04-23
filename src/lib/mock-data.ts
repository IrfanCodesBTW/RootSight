// Mock data generator for demo mode
import {
  Incident,
  Event,
  Hypothesis,
  Impact,
  SimilarIncident,
  Action,
  RawEvent,
  Severity,
  PipelineState,
  PipelineStepStatus,
  IncidentStatus,
} from "@/types";

// Sample titles and descriptions
const SAMPLE_INCIDENTS = [
  {
    title: "Database Connection Pool Exhausted",
    description: "PostgreSQL connection pool saturated causing timeout errors",
    severity: Severity.P0,
  },
  {
    title: "CDN Cache Invalidation Spike",
    description: "Abnormal cache invalidation rate detected on CloudFront",
    severity: Severity.P1,
  },
  {
    title: "Authentication Service Latency",
    description: "OAuth token generation experiencing 5s+ delays",
    severity: Severity.P1,
  },
  {
    title: "Kafka Consumer Lag Growing",
    description: "payment-processor consumer lag exceeded 10k messages",
    severity: Severity.P2,
  },
  {
    title: "Redis Memory Usage Critical",
    description: "Cache cluster at 95% memory utilization",
    severity: Severity.P0,
  },
];

// Generate random date in the past N days
function randomPastDate(daysAgo: number): string {
  const now = new Date();
  const past = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000 * Math.random());
  return past.toISOString();
}

// Generate pipeline state based on completion level
function generatePipelineState(completionLevel: number): PipelineState {
  const steps: Array<keyof PipelineState> = [
    "ingestion",
    "timeline",
    "rca",
    "impact",
    "memory",
    "actions",
  ];
  
  const stepsToComplete = Math.floor(steps.length * completionLevel);
  
  const state: PipelineState = {
    ingestion: { status: PipelineStepStatus.PENDING },
    timeline: { status: PipelineStepStatus.PENDING },
    rca: { status: PipelineStepStatus.PENDING },
    impact: { status: PipelineStepStatus.PENDING },
    memory: { status: PipelineStepStatus.PENDING },
    actions: { status: PipelineStepStatus.PENDING },
  };
  
  steps.forEach((step, index) => {
    if (index < stepsToComplete) {
      state[step] = {
        status: PipelineStepStatus.COMPLETE,
        started_at: randomPastDate(1),
        completed_at: randomPastDate(1),
      };
    } else if (index === stepsToComplete) {
      state[step] = {
        status: PipelineStepStatus.RUNNING,
        started_at: randomPastDate(0.1),
        progress_percentage: Math.floor(Math.random() * 80) + 10,
      };
    }
  });
  
  return state;
}

// Generate mock raw events
function generateRawEvents(count: number = 20): RawEvent[] {
  const levels = ["ERROR", "WARN", "INFO", "DEBUG"];
  const sources = ["api-server", "worker", "database", "cache", "queue"];
  const messages = [
    "Connection timeout after 30s",
    "Failed to acquire connection from pool",
    "Query execution exceeded threshold",
    "Cache miss for key user:session:*",
    "Rate limit exceeded for endpoint /api/users",
    "Unexpected null pointer in handler",
    "Retry attempt 3/5 for downstream service",
    "Circuit breaker opened for payment-service",
  ];
  
  return Array.from({ length: count }, (_, i) => ({
    timestamp: randomPastDate(0.5),
    level: levels[Math.floor(Math.random() * levels.length)],
    message: messages[Math.floor(Math.random() * messages.length)],
    source: sources[Math.floor(Math.random() * sources.length)],
    metadata: { line: i + 1 },
  }));
}

// Generate mock timeline events
function generateTimeline(count: number = 8): Event[] {
  const descriptions = [
    "First error logged in api-server logs",
    "Database connection pool reached max capacity (100/100)",
    "Application attempted to create new connection, timed out",
    "Load balancer health check failed for 2/3 instances",
    "Auto-scaling triggered, launching 2 new instances",
    "New instances failed to start due to connection pool issue",
    "Circuit breaker opened for affected endpoint",
    "Traffic rerouted to backup datacenter",
  ];
  
  const eventTypes = ["error_spike", "latency_spike", "timeout", "deploy", "recovery", "db_failure", "cpu_spike", "failover"];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `event-${i}`,
    timestamp: randomPastDate(0.3),
    event_type: eventTypes[i % eventTypes.length],
    description: descriptions[i] || descriptions[0],
    confidence: 0.7 + Math.random() * 0.3,
    evidence: [`Log line ${i * 3 + 1}`, `Metric datapoint at T+${i}m`],
    source: ["api-server", "worker", "database", "cache"][i % 4],
  }));
}

// Generate mock RCA hypotheses
function generateHypotheses(): Hypothesis[] {
  return [
    {
      id: "hyp-1",
      rank: 1,
      title: "Connection Pool Misconfiguration",
      description:
        "Database connection pool max_connections=100 is too low for current traffic volume. Pool exhaustion occurred at 14:32 UTC.",
      confidence: 0.89,
      supporting_evidence: [
        "DB metrics show pool at 100% utilization",
        "Error logs: 'could not obtain connection from pool'",
        "Traffic increased 3x from previous hour",
      ],
      counter_evidence: [
        "Connection pool size unchanged for 6 months",
      ],
      estimated_likelihood: "very_high",
    },
    {
      id: "hyp-2",
      rank: 2,
      title: "Database Query Performance Degradation",
      description:
        "Slow queries holding connections open longer than expected, causing pool starvation.",
      confidence: 0.72,
      supporting_evidence: [
        "Query execution time p95 increased from 200ms to 2.1s",
        "Postgres slow query log shows unindexed joins",
      ],
      counter_evidence: [
        "Query patterns unchanged in past 24h",
        "No recent schema changes",
      ],
      estimated_likelihood: "high",
    },
    {
      id: "hyp-3",
      rank: 3,
      title: "Connection Leak in Application Code",
      description:
        "Recent deployment may have introduced connection leak where connections aren't properly closed.",
      confidence: 0.45,
      supporting_evidence: [
        "Deployment occurred 2 hours before incident",
      ],
      counter_evidence: [
        "Code review showed no connection handling changes",
        "Rollback didn't resolve issue",
      ],
      estimated_likelihood: "low",
    },
  ];
}

// Generate mock impact analysis
function generateImpact(severity: Severity): Impact {
  const impactMap: Record<Severity, Impact> = {
    [Severity.P0]: {
      severity_band: "critical",
      business_impact:
        "Complete service outage affecting 100% of user transactions. Estimated revenue loss: $12,000/hour.",
      user_impact:
        "All users unable to complete checkouts. Support tickets increased 400%.",
      affected_services: ["payment-api", "checkout-service", "order-processing"],
      estimated_users_affected: 45000,
      estimated_revenue_loss: "$12,000/hr",
      confidence: 0.95,
    },
    [Severity.P1]: {
      severity_band: "high",
      business_impact:
        "Degraded performance causing 30% increase in checkout abandonment.",
      user_impact:
        "Users experiencing 5-10s delays on critical paths. 15% of sessions affected.",
      affected_services: ["api-gateway", "auth-service"],
      estimated_users_affected: 12000,
      estimated_revenue_loss: "$3,500/hr",
      confidence: 0.88,
    },
    [Severity.P2]: {
      severity_band: "medium",
      business_impact:
        "Non-critical feature degradation. Analytics pipeline delayed.",
      user_impact:
        "Minor UX issues. Background sync delayed by 2 hours.",
      affected_services: ["analytics-worker", "reporting-service"],
      estimated_users_affected: 2000,
      confidence: 0.82,
    },
    [Severity.P3]: {
      severity_band: "low",
      business_impact:
        "Minimal impact. Internal tooling affected.",
      user_impact:
        "No direct user impact. Developer experience degraded.",
      affected_services: ["admin-dashboard"],
      confidence: 0.75,
    },
    [Severity.P4]: {
      severity_band: "low",
      business_impact: "Informational alert, no business impact.",
      user_impact: "No user impact.",
      affected_services: ["monitoring-dashboard"],
      confidence: 0.99,
    },
  };
  
  return {
    ...impactMap[severity],
    confidence: impactMap[severity].confidence || (0.78 + Math.random() * 0.15),
  };
}

// Generate mock similar incidents
function generateSimilarIncidents(): SimilarIncident[] {
  return [
    {
      id: "inc-2024-03-15",
      title: "Database Connection Pool Exhaustion - API Gateway",
      similarity_score: 0.92,
      occurred_at: "2024-03-15T10:23:00Z",
      resolution_summary:
        "Increased max_connections from 100 to 250. Incident resolved in 18 minutes.",
      similarity_explanation:
        "Both incidents show identical connection pool saturation pattern with same error signatures.",
      root_cause: "Insufficient connection pool size for traffic load",
    },
    {
      id: "inc-2024-01-22",
      title: "Connection Timeout Storm - Database Cluster",
      similarity_score: 0.76,
      occurred_at: "2024-01-22T03:45:00Z",
      resolution_summary:
        "Identified connection leak in worker service. Deployed hotfix to properly close connections.",
      similarity_explanation:
        "Similar timeout patterns and error messages, though root cause was different (leak vs. pool size).",
      root_cause: "Connection leak in background job processor",
    },
  ];
}

// Generate mock actions
function generateActions(): Action[] {
  return [
    {
      id: "action-1",
      action_type: "slack_message",
      title: "Incident Brief - #incidents",
      content: `🚨 *P0 INCIDENT: Database Connection Pool Exhausted*`,
      approval_status: "pending",
      execution_status: "not_sent",
      created_at: new Date().toISOString(),
    },
    {
      id: "action-2",
      action_type: "jira_ticket",
      title: "INC-2847: Database Connection Pool Exhausted",
      content: `## Incident Summary\nDatabase connection pool reached capacity.`,
      approval_status: "pending",
      execution_status: "not_sent",
      created_at: new Date().toISOString(),
    },
  ];
}

// Main function: Generate complete mock incident
export function generateMockIncident(
  id?: string,
  completionLevel: number = 1.0
): Incident {
  const sample =
    SAMPLE_INCIDENTS[Math.floor(Math.random() * SAMPLE_INCIDENTS.length)];
  const incidentId = id || `inc-${Date.now()}`;
  const createdAt = randomPastDate(7);
  
  const incident: Incident = {
    id: incidentId,
    title: sample.title,
    description: sample.description,
    severity: sample.severity,
    status: completionLevel >= 1.0 ? IncidentStatus.RESOLVED : IncidentStatus.INVESTIGATING,
    created_at: createdAt,
    updated_at: new Date().toISOString(),
    source: "datadog",
    external_id: `dd-${Math.random().toString(36).substr(2, 9)}`,
    pipeline_state: generatePipelineState(completionLevel),
    tags: ["auto-detected", sample.severity],
  };
  
  if (completionLevel > 0.16) incident.raw_events = generateRawEvents();
  if (completionLevel > 0.33) incident.timeline = generateTimeline();
  if (completionLevel > 0.5) incident.hypotheses = generateHypotheses();
  if (completionLevel > 0.66) incident.impact = generateImpact(sample.severity);
  if (completionLevel > 0.83) incident.similar_incidents = generateSimilarIncidents();
  if (completionLevel >= 1.0) {
    incident.actions = generateActions();
    incident.resolved_at = randomPastDate(0.5);
  }
  
  return incident;
}

// Generate multiple incidents for list view
export function generateMockIncidents(count: number = 10): Incident[] {
  return Array.from({ length: count }, (_, i) => {
    const completionLevel = i === 0 ? 0.5 : i === 1 ? 0.8 : 1.0;
    return generateMockIncident(`inc-demo-${i}`, completionLevel);
  }).sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}
