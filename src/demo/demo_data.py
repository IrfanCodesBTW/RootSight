from datetime import datetime

DEMO_INCIDENT = {
    "id": "demo-incident-1",
    "status": "completed",
    "timeline": {
        "events": [
            {
                "event_id": "evt-1",
                "timestamp": str(datetime.utcnow()),
                "description": "Database latency spike detected",
                "confidence": 0.92,
                "evidence_source": "Datadog",
            },
            {
                "event_id": "evt-2",
                "timestamp": str(datetime.utcnow()),
                "description": "API error rate increased to 35%",
                "confidence": 0.88,
                "evidence_source": "PagerDuty",
            }
        ]
    },
    "rca": {
        "hypotheses": [
            {
                "hypothesis_id": "hyp-1",
                "rank": 1,
                "statement": "Primary database connection pool exhausted",
                "confidence_score": 87,
                "recommended_check": "Check Postgres pg_stat_activity",
                "supporting_evidence": ["Connection timeout logs", "Spike in concurrent queries"],
                "contradicting_evidence": []
            }
        ]
    },
    "impact": {
        "severity_band": "high",
        "affected_users": 12000,
        "estimated_requests_affected": 45000,
        "business_impact_summary": "Users unable to complete transactions",
        "probable_user_impact": "High failure rate on checkout",
        "affected_services": ["api-gateway", "checkout-service", "database"]
    },
    "memory": {
        "matches": [
            {
                "incident_id": "demo-incident-1",
                "similar_to_id": "incident-2025-12",
                "similarity_score": 0.81,
                "why_similar": "Previous DB overload due to traffic spike",
                "previous_fix": "Increased connection pool size and scaled read replicas"
            }
        ]
    },
    "actions": {
        "actions": [
            {
                "action_id": "act-1",
                "action_type": "manual_review",
                "title": "Restart DB connection pool",
                "approval_status": "pending",
                "payload_preview": "Restarting connections for primary DB..."
            },
            {
                "action_id": "act-2",
                "action_type": "jira_ticket",
                "title": "Scale database replicas",
                "approval_status": "approved",
                "payload_preview": "Creating Jira ticket to scale replicas..."
            }
        ]
    },
    "incident": {
        "title": "Demo: DB Connection Exhaustion",
        "description": "A demo incident showing database connection exhaustion.",
        "severity": "P1",
        "source": "datadog"
    },
    "pipeline_steps": {
        "ingestion": {"status": "complete", "result": "done"},
        "timeline": {"status": "complete", "result": "done"},
        "rca": {"status": "complete", "result": "done"},
        "impact": {"status": "complete", "result": "done"},
        "memory": {"status": "complete", "result": "done"},
        "actions": {"status": "complete", "result": "done"}
    },
    "started_at": str(datetime.utcnow()),
    "completed_at": str(datetime.utcnow()),
}
